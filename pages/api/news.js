const express = require("express");
const router = express.Router();
const pool = require("../db");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "news-" + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error("Only image files are allowed!"));
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

// Function to delete old image file
const deleteOldImage = (imagePath) => {
  if (imagePath) {
    const fullPath = path.join(__dirname, "../uploads", imagePath);
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
      console.log(`Deleted old image: ${imagePath}`);
    }
  }
};

// Get all news
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM news ORDER BY published_at DESC"
    );
    res.json(rows);
  } catch (error) {
    console.error("Error fetching news:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get featured news (for homepage)
router.get("/featured", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM news WHERE is_featured = true ORDER BY featured_order ASC, published_at DESC LIMIT 3"
    );
    res.json(rows);
  } catch (error) {
    console.error("Error fetching featured news:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get news by ID
router.get("/id/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query(
      "SELECT * FROM news WHERE id = ?",
      [id]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({ error: "News not found" });
    }
    
    res.json(rows[0]);
  } catch (error) {
    console.error("Error fetching news by ID:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get news by slug
router.get("/slug/:slug", async (req, res) => {
  try {
    const { slug } = req.params;
    const [rows] = await pool.query(
      "SELECT * FROM news WHERE slug = ?",
      [slug]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({ error: "News not found" });
    }
    
    res.json(rows[0]);
  } catch (error) {
    console.error("Error fetching news by slug:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Create new news
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const {
      title,
      category_text,
      photographer,
      subtitle,
      slug,
      content,
      aspect_ratio = "aspect-square",
      is_featured = false,
      featured_order = 0,
    } = req.body;

    const image_path = req.file ? req.file.filename : null;

    const [result] = await pool.query(
      `INSERT INTO news (title, category_text, photographer, subtitle, slug, content, image_path, aspect_ratio, is_featured, featured_order) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [title, category_text, photographer, subtitle, slug, content, image_path, aspect_ratio, is_featured, featured_order]
    );

    res.status(201).json({
      id: result.insertId,
      title,
      category_text,
      photographer,
      subtitle,
      slug,
      content,
      image_path,
      aspect_ratio,
      is_featured,
      featured_order,
    });
  } catch (error) {
    console.error("Error creating news:", error);
    if (error.code === "ER_DUP_ENTRY") {
      res.status(400).json({ error: "Slug already exists" });
    } else {
      res.status(500).json({ error: "Internal server error" });
    }
  }
});

// Update news
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      category_text,
      photographer,
      subtitle,
      slug,
      content,
      aspect_ratio,
      is_featured,
      featured_order,
    } = req.body;

    // Get current image path before updating
    let oldImagePath = null;
    if (req.file) {
      const [currentNews] = await pool.query("SELECT image_path FROM news WHERE id = ?", [id]);
      if (currentNews.length > 0) {
        oldImagePath = currentNews[0].image_path;
      }
    }

    let image_path = null;
    if (req.file) {
      image_path = req.file.filename;
    }

    let query = `UPDATE news SET 
      title = ?, category_text = ?, photographer = ?, subtitle = ?, slug = ?, content = ?, 
      aspect_ratio = ?, is_featured = ?, featured_order = ?`;
    let params = [title, category_text, photographer, subtitle, slug, content, aspect_ratio, is_featured, featured_order];

    if (image_path) {
      query += ", image_path = ?";
      params.push(image_path);
    }

    query += " WHERE id = ?";
    params.push(id);

    const [result] = await pool.query(query, params);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "News not found" });
    }

    // Delete old image file if new image was uploaded
    if (req.file && oldImagePath) {
      deleteOldImage(oldImagePath);
    }

    res.json({ message: "News updated successfully" });
  } catch (error) {
    console.error("Error updating news:", error);
    if (error.code === "ER_DUP_ENTRY") {
      res.status(400).json({ error: "Slug already exists" });
    } else {
      res.status(500).json({ error: "Internal server error" });
    }
  }
});

// Delete news
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    
    // Get image path before deleting
    const [currentNews] = await pool.query("SELECT image_path FROM news WHERE id = ?", [id]);
    let imagePath = null;
    if (currentNews.length > 0) {
      imagePath = currentNews[0].image_path;
    }

    const [result] = await pool.query("DELETE FROM news WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "News not found" });
    }

    // Delete image file if it exists
    if (imagePath) {
      deleteOldImage(imagePath);
    }

    res.json({ message: "News deleted successfully" });
  } catch (error) {
    console.error("Error deleting news:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
