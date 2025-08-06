const express = require("express");
const router = express.Router();
const pool = require("../db");
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;

console.log("Projects router loaded");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// Featured projeler
router.get("/featured", async (req, res) => {
  console.log("Featured projects sorgulanıyor...");
  try {
  const [rows] = await pool.query(
    "SELECT * FROM projects WHERE is_featured = 1 LIMIT 4"
  );
    console.log("Featured projects:", rows);
    if (rows.length === 0) {
      return res.json({ message: "Henüz öne çıkan proje yok" });
    }
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Sunucu hatası" });
  }
});

router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM projects ORDER BY id DESC");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Sunucu hatası" });
  }
});

// Tüm projeler
router.post('/', upload.fields([
  { name: 'thumbnail_image', maxCount: 1 },
  { name: 'banner_image', maxCount: 1 }
]), async (req, res) => {
  console.log("req.body:", req.body);
  console.log("req.files:", req.files);

  try {
    const { title, subtitle, slug, description, client_name, year, role, is_featured, featured_order } = req.body;

    if (!title || !slug) {
      return res.status(400).json({ error: "Başlık ve slug gerekli" });
    }

    const thumbnailPath = req.files['thumbnail_image']?.[0]?.path || null;
    const bannerPath = req.files['banner_image']?.[0]?.path || null;

    if (!thumbnailPath || !bannerPath) {
      return res.status(400).json({ error: 'Resim yüklenmedi' });
    }

    const isFeaturedBool = is_featured === '1' || is_featured === 'true' ? 1 : 0;
    const featuredOrderNum = featured_order ? Number(featured_order) : null;

    const [result] = await pool.query(
      `INSERT INTO projects (title, subtitle, slug, description, client_name, year, role, thumbnail_image, banner_image, is_featured, featured_order)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [title, subtitle, slug, description, client_name, year, role, thumbnailPath, bannerPath, isFeaturedBool, featuredOrderNum]
    );

    res.status(201).json({ projectId: result.insertId });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

// Slug veya ID ile proje + galeri getir
router.get('/:id', async (req, res) => {
  const idOrSlug = req.params.id;

  try {
    const [projectRows] = await pool.query(
      'SELECT * FROM projects WHERE slug = ? OR id = ?',
      [idOrSlug, idOrSlug]
    );

    if (projectRows.length === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const project = projectRows[0];

    // Galeri sorgusu
    const [galleryRows] = await pool.query(
      'SELECT image_path FROM project_gallery WHERE project_id = ? ORDER BY sort ASC',
      [project.id]
    );

    project.gallery_images = galleryRows.map(row => row.image_path);

    res.json(project);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { title, subtitle, description, client_name, year, role } = req.body;

  try {
    const [result] = await pool.query(
      `UPDATE projects
      SET title = ?, subtitle = ?, description = ?, client_name = ?, year = ?, role = ?
      WHERE id = ?`,
      [title, subtitle, description, client_name, year, role, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Proje bulunamadı." });
    }

    res.json({ message: "Proje güncellendi." });
  } catch (err) {
    console.error("Güncelleme hatası:", err);
    res.status(500).json({ message: "Sunucu hatası." });
  }
});


// Çoklu görsel yükleme - project gallery
router.post('/:id/gallery', upload.array('images', 10), async (req, res) => {
  const projectId = req.params.id;
  const files = req.files;

  if (!files || files.length === 0) {
    return res.status(400).json({ error: 'Görsel yüklenmedi' });
  }

  try {
    const insertValues = files.map((file, index) => [projectId, file.path, index]);

    await pool.query(
      'INSERT INTO project_gallery (project_id, image_path, sort) VALUES ?',
      [insertValues]
    );

    res.status(201).json({ message: 'Galeri görselleri yüklendi' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Galeri yükleme hatası' });
  }
});

// Projeyi silme
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    // 1. Proje ana kayıt ve ana resimleri al
    const [projectRows] = await pool.query(
      "SELECT thumbnail_image, banner_image FROM projects WHERE id = ?",
      [id]
    );

    if (projectRows.length === 0)
      return res.status(404).json({ error: "Proje bulunamadı" });

    const { thumbnail_image, banner_image } = projectRows[0];

    // 2. Projeye ait galeri resimlerini al
    const [galleryRows] = await pool.query(
      "SELECT image_path FROM project_gallery WHERE project_id = ?",
      [id]
    );

    // 3. Galeri resimlerinin dosyalarını sil
     for (const { image_path } of galleryRows) {
      const filePath = path.join(__dirname, "..", image_path);
      try {
        await fs.unlink(filePath);
      } catch (err) {
      }
    }

    // 4. Galeri kayıtlarını sil
    await pool.query("DELETE FROM project_gallery WHERE project_id = ?", [id]);

    // 5. Projeyi ve ana resimleri sil
    await pool.query("DELETE FROM projects WHERE id = ?", [id]);

    // 6. Ana resim dosyalarını sil
    for (const file of [thumbnail_image, banner_image].filter(Boolean)) {
      const filePath = path.join(__dirname, "..", file);
      try {
        await fs.unlink(filePath);
      } catch (err) {
      }
    }

    res.json({ success: true, message: "Proje ve galerisi başarıyla silindi" });
  } catch (err) {
    console.error("Silme hatası:", err);
    res.status(500).json({ error: "Sunucu hatası" });
  }
});

module.exports = router;
