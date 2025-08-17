const express = require("express");
const router = express.Router();
const pool = require("../db");
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;

console.log("About Gallery router loaded");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'about-gallery-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// Gallery resimlerini getir
export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'GET') {
  try {
    const [rows] = await pool.query("SELECT * FROM about_gallery ORDER BY order_index ASC");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Sunucu hatası" });
  }
});

// Yeni resim ekle
router.post('/', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Resim dosyası gerekli" });
    }

    // Mevcut resim sayısını kontrol et
    const [countResult] = await pool.query("SELECT COUNT(*) as count FROM about_gallery");
    if (countResult[0].count >= 5) {
      // Yüklenen dosyayı sil
      await fs.unlink(req.file.path);
      return res.status(400).json({ error: "Maksimum 5 resim eklenebilir" });
    }

    const imagePath = "/uploads/" + req.file.filename;
    const [result] = await pool.query(
      "INSERT INTO about_gallery (image_path, order_index) VALUES (?, ?)",
      [imagePath, countResult[0].count]
    );

    res.json({ 
      message: "Resim başarıyla eklendi",
      id: result.insertId,
      image_path: imagePath
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Sunucu hatası" });
  }
});

// Resim sil
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Resim bilgisini al
    const [rows] = await pool.query("SELECT image_path FROM about_gallery WHERE id = ?", [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: "Resim bulunamadı" });
    }

    const imagePath = rows[0].image_path;
    const fullPath = path.join(__dirname, "..", imagePath);

    // Veritabanından sil
    await pool.query("DELETE FROM about_gallery WHERE id = ?", [id]);

    // Dosyayı sil
    try {
      await fs.unlink(fullPath);
    } catch (err) {
      if (err.code !== 'ENOENT') {
        console.error("Dosya silinemedi:", err);
      }
    }

    // Order index'leri yeniden düzenle
    await pool.query("SET @rank = 0");
    await pool.query("UPDATE about_gallery SET order_index = @rank:=@rank+1 ORDER BY order_index");

    res.json({ message: "Resim başarıyla silindi" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Sunucu hatası" });
  }
});

// Sıralama güncelle
router.put('/reorder', async (req, res) => {
  try {
    const { order } = req.body; // [id1, id2, id3, ...] formatında

    for (let i = 0; i < order.length; i++) {
      await pool.query("UPDATE about_gallery SET order_index = ? WHERE id = ?", [i, order[i]]);
    }

    res.json({ message: "Sıralama güncellendi" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Sunucu hatası" });
  }
});

  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
