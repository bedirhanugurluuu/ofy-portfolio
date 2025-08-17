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
    const [rows] = await pool.query("SELECT * FROM projects ORDER BY id DESC");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Sunucu hatası" });
  }
});

// Tüm projeler
router.post('/', upload.fields([
  { name: 'thumbnail_media', maxCount: 1 },
  { name: 'banner_media', maxCount: 1 }
]), async (req, res) => {
  console.log("req.body:", req.body);
  console.log("req.files:", req.files);

  try {
    const { title, subtitle, slug, description, client_name, year, role, is_featured, featured_order, external_link } = req.body;

    if (!title || !slug) {
      return res.status(400).json({ error: "Başlık ve slug gerekli" });
    }

    const thumbnailPath = req.files['thumbnail_media']?.[0]?.path || null;
    const bannerPath = req.files['banner_media']?.[0]?.path || null;

    if (!thumbnailPath || !bannerPath) {
      return res.status(400).json({ error: 'Resim yüklenmedi' });
    }

    // Dosya yollarını /uploads/ ile başlayacak şekilde düzelt
    const thumbnailMediaPath = thumbnailPath.replace(/\\/g, '/').replace('uploads/', '/uploads/');
    const bannerMediaPath = bannerPath.replace(/\\/g, '/').replace('uploads/', '/uploads/');

    const isFeaturedBool = is_featured === '1' || is_featured === 'true' ? 1 : 0;
    const featuredOrderNum = featured_order ? Number(featured_order) : null;

    const [result] = await pool.query(
      `INSERT INTO projects (title, subtitle, slug, description, client_name, year, role, thumbnail_media, banner_media, is_featured, featured_order, external_link)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [title, subtitle, slug, description, client_name, year, role, thumbnailMediaPath, bannerMediaPath, isFeaturedBool, featuredOrderNum, external_link]
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

router.put("/:id", upload.fields([
  { name: 'thumbnail_media', maxCount: 1 },
  { name: 'banner_media', maxCount: 1 }
]), async (req, res) => {
  const { id } = req.params;
  const { title, subtitle, description, client_name, year, role, external_link, slug, featured_order } = req.body;

  try {
    // Önce mevcut projeyi al
    const [currentProject] = await pool.query("SELECT thumbnail_media, banner_media FROM projects WHERE id = ?", [id]);
    if (currentProject.length === 0) {
      return res.status(404).json({ message: "Proje bulunamadı." });
    }

    const oldThumbnail = currentProject[0].thumbnail_media;
    const oldBanner = currentProject[0].banner_media;

    // Yeni dosya yolları
    let newThumbnailPath = oldThumbnail;
    let newBannerPath = oldBanner;

    // Thumbnail güncelleme
    if (req.files['thumbnail_media']) {
      const thumbnailFile = req.files['thumbnail_media'][0];
      newThumbnailPath = thumbnailFile.path.replace(/\\/g, '/').replace('uploads/', '/uploads/');
      
      // Eski thumbnail'i sil
      if (oldThumbnail && oldThumbnail !== newThumbnailPath) {
        const fullOldPath = path.join(__dirname, "..", oldThumbnail);
        try {
          await fs.unlink(fullOldPath);
        } catch (err) {
          if (err.code !== 'ENOENT') {
            console.error("Eski thumbnail silinemedi:", err);
          }
        }
      }
    }

    // Banner güncelleme
    if (req.files['banner_media']) {
      const bannerFile = req.files['banner_media'][0];
      newBannerPath = bannerFile.path.replace(/\\/g, '/').replace('uploads/', '/uploads/');
      
      // Eski banner'ı sil
      if (oldBanner && oldBanner !== newBannerPath) {
        const fullOldPath = path.join(__dirname, "..", oldBanner);
        try {
          await fs.unlink(fullOldPath);
        } catch (err) {
          if (err.code !== 'ENOENT') {
            console.error("Eski banner silinemedi:", err);
          }
        }
      }
    }

    const [result] = await pool.query(
      `UPDATE projects
      SET title = ?, subtitle = ?, description = ?, client_name = ?, year = ?, role = ?, external_link = ?, thumbnail_media = ?, banner_media = ?, featured_order = ?
      WHERE id = ?`,
      [title, subtitle, description, client_name, year, role, external_link, newThumbnailPath, newBannerPath, featured_order || null, id]
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
    // Dosya yollarını /uploads/ ile başlayacak şekilde düzelt
    const insertValues = files.map((file, index) => {
      const imagePath = file.path.replace(/\\/g, '/').replace('uploads/', '/uploads/');
      return [projectId, imagePath, index];
    });

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

router.delete("/:id/gallery", async (req, res) => {
  const projectId = req.params.id;
  const rawImage = req.query.image;

  if (!rawImage) {
    return res.status(400).json({ error: "Image path required" });
  }

  const image = decodeURIComponent(rawImage).replace(/\//g, path.sep);

  try {
    const [result] = await pool.query(
      "DELETE FROM project_gallery WHERE project_id = ? AND image_path = ?",
      [projectId, image]
    );

    if (result.affectedRows === 0) {
      console.warn("Veritabanında kayıt bulunamadı:", projectId, image);
      return res.status(404).json({ error: "Veritabanında görsel bulunamadı" });
    }

    const filePath = path.join(__dirname, "..", image);

    try {
      await fs.unlink(filePath);
    } catch (e) {
      console.warn("Dosya bulunamadı veya silinemedi:", e.message);
    }

    res.json({ success: true, message: "Görsel başarıyla silindi" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Sunucu hatası" });
  }
});

// Projeyi silme
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    // 1. Proje ana kayıt ve ana resimleri al
    const [projectRows] = await pool.query(
      "SELECT thumbnail_media, banner_media FROM projects WHERE id = ?",
      [id]
    );

    if (projectRows.length === 0)
      return res.status(404).json({ error: "Proje bulunamadı" });

    const { thumbnail_media, banner_media } = projectRows[0];

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
    for (const file of [thumbnail_media, banner_media].filter(Boolean)) {
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

  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
