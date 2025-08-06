const express = require("express");
const db = require("../db");
const multer = require("multer");
const path = require("path");

const router = express.Router();

const isAuthenticated = (req, res, next) => {
  if (req.session.user) return next();
  res.status(403).json({ error: "Yetkisiz erişim" });
};

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
    const [rows] = await db.query("SELECT COUNT(*) as count FROM intro_banners");
    if (rows[0].count >= 3) {
      return res.status(400).json({ error: "Maksimum 3 banner olabilir" });
    }

    const image = req.file ? "/uploads/" + req.file.filename : null;

    const { title_line1, title_line2, button_text, button_link, order_index } = req.body;

    const [result] = await db.query(
      "INSERT INTO intro_banners (image, title_line1, title_line2, button_text, button_link, order_index) VALUES (?, ?, ?, ?, ?, ?)",
      [image, title_line1 || null, title_line2 || null, button_text || null, button_link || null, order_index]
    );

    res.status(201).json({ id: result.insertId, message: "Banner eklendi." });
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

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { image, title_line1, title_line2, button_text, button_link, order_index } = req.body;

    const [result] = await db.query(
      `UPDATE intro_banners SET image = ?, title_line1 = ?, title_line2 = ?, button_text = ?, button_link = ?, order_index = ?
       WHERE id = ?`,
      [image, title_line1, title_line2, button_text, button_link, order_index, id]
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

const expressApp = require("../index");

router.delete("/:id", isAuthenticated, async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await db.query("DELETE FROM intro_banners WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Banner bulunamadı" });
    }

    res.json({ message: "Banner silindi" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Silme işlemi başarısız" });
  }
});

module.exports = router;
