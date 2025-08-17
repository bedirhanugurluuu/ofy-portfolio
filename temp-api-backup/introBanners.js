const express = require("express");
const db = require("../db");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const router = express.Router();

function isAuthenticated(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ error: "Yetkisiz - token yok" });

  const token = authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: "Yetkisiz - token eksik" });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ error: "Token geçersiz" });
    req.user = decoded;
    next();
  });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    cb(null, "introbanner-" + Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM intro_banners ORDER BY order_index ASC");
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Intro banners alınamadı" });
  }
});

router.post("/", isAuthenticated, upload.single("image"), async (req, res) => {
  try {
    // Var olan order_index değerlerini al
    const [rows] = await db.query("SELECT order_index FROM intro_banners ORDER BY order_index ASC");

    if (rows.length >= 3) {
      return res.status(400).json({ error: "Maksimum 3 banner olabilir" });
    }

    // Mevcut order_indexleri set yap
    const existingOrders = new Set(rows.map(r => r.order_index));

    // 1,2,3 arasında boş olanı bul
    let order_index = null;
    for (let i = 1; i <= 3; i++) {
      if (!existingOrders.has(i)) {
        order_index = i;
        break;
      }
    }

    if (!order_index) {
      return res.status(400).json({ error: "Yeni order_index bulunamadı" });
    }

    const image = req.file ? "/uploads/" + req.file.filename : null;

    const { title_line1, title_line2, button_text, button_link } = req.body;

    const [result] = await db.query(
      "INSERT INTO intro_banners (image, title_line1, title_line2, button_text, button_link, order_index) VALUES (?, ?, ?, ?, ?, ?)",
      [image, title_line1 || null, title_line2 || null, button_text || null, button_link || null, order_index]
    );

    res.status(201).json({ id: result.insertId, message: "Banner eklendi.", order_index });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Banner eklenemedi." });
  }
});



router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query("SELECT * FROM intro_banners WHERE id = ?", [id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: "Banner bulunamadı" });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Banner getirilemedi" });
  }
});

router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const { id } = req.params;

    // Form verileri req.body'de
    const { title_line1, title_line2, button_text, button_link, order_index, imageUrl } = req.body;

    // Önce mevcut banner'ı al
    const [currentBanner] = await db.query("SELECT image FROM intro_banners WHERE id = ?", [id]);
    if (currentBanner.length === 0) {
      return res.status(404).json({ error: "Banner bulunamadı" });
    }

    const oldImagePath = currentBanner[0].image;
    let newImagePath = imageUrl || oldImagePath; // Varsayılan olarak eski URL

    // Yeni dosya yüklendiyse
    if (req.file) {
      newImagePath = "/uploads/" + req.file.filename;
      
      // Eski dosyayı sil (yeni dosya yüklendiyse)
      if (oldImagePath && oldImagePath !== newImagePath) {
        const fullOldPath = path.join(__dirname, "..", oldImagePath);
        fs.unlink(fullOldPath, (err) => {
          if (err && err.code !== 'ENOENT') {
            console.error("Eski dosya silinemedi:", err);
          }
        });
      }
    }

    const [result] = await db.query(
      `UPDATE intro_banners SET image = ?, title_line1 = ?, title_line2 = ?, button_text = ?, button_link = ?, order_index = ?
       WHERE id = ?`,
      [newImagePath, title_line1, title_line2, button_text, button_link, order_index, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Banner bulunamadı" });
    }

    res.json({ message: "Banner güncellendi" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Güncelleme başarısız" });
  }
});

router.delete("/:id", isAuthenticated, async (req, res) => {
  try {
    const { id } = req.params;

    // Önce banner bilgisini çek, dosya yolunu al
    const [rows] = await db.query("SELECT image FROM intro_banners WHERE id = ?", [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: "Banner bulunamadı" });
    }

    const imagePath = rows[0].image; // Örnek: "/uploads/introbanner-123456.jpg"

    // Dosya veritabanından önce silinir
    const [result] = await db.query("DELETE FROM intro_banners WHERE id = ?", [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Banner bulunamadı" });
    }

    // Dosya varsa, dosya sisteminden sil
    if (imagePath) {
      const fullPath = path.join(__dirname, "..", imagePath);
      fs.unlink(fullPath, (err) => {
        if (err) {
          console.error("Dosya silinemedi:", err);
          // Burada hatayı kullanıcıya yansıtmayabilirsin, log tutmak yeterli
        }
      });
    }

    res.json({ message: "Banner silindi" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Silme işlemi başarısız" });
  }
});

  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
