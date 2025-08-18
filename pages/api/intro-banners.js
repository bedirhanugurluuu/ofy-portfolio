import mysql from 'mysql2/promise';
import formidable from 'formidable';
import fs from 'fs/promises';
import path from 'path';

// Database connection
const pool = mysql.createPool({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  port: process.env.DATABASE_PORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    try {
      console.log('Intro banners GET request started');
      console.log('Database config:', {
        host: process.env.DATABASE_HOST,
        user: process.env.DATABASE_USER,
        database: process.env.DATABASE_NAME,
        port: process.env.DATABASE_PORT
      });
      
      const [rows] = await pool.query("SELECT * FROM intro_banners ORDER BY order_index ASC");
      console.log('Query executed successfully, rows count:', rows.length);
      res.json(rows);
    } catch (err) {
      console.error('Intro banners GET error:', err);
      console.error('Error details:', {
        message: err.message,
        code: err.code,
        sqlState: err.sqlState,
        sqlMessage: err.sqlMessage
      });
      res.status(500).json({ error: "Sunucu hatası", details: err.message });
    }
  } else if (req.method === 'POST') {
    try {
      const form = formidable({
        uploadDir: path.join(process.cwd(), 'public', 'uploads'),
        keepExtensions: true,
        filename: (name, ext, part) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
          return uniqueSuffix + '-' + part.originalFilename;
        }
      });

      const [fields, files] = await form.parse(req);
      
      const imageFile = files.image?.[0];
      const imagePath = imageFile ? "/uploads/" + path.basename(imageFile.filepath) : null;

      const [result] = await pool.query(
        "INSERT INTO intro_banners (title, subtitle, image_path, created_at) VALUES (?, ?, ?, NOW())",
        [fields.title?.[0] || '', fields.subtitle?.[0] || '', imagePath]
      );

      res.json({ success: true, id: result.insertId });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Sunucu hatası" });
    }
  } else if (req.method === 'PUT') {
    try {
      const form = formidable({
        uploadDir: path.join(process.cwd(), 'public', 'uploads'),
        keepExtensions: true,
        filename: (name, ext, part) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
          return uniqueSuffix + '-' + part.originalFilename;
        }
      });

      const [fields, files] = await form.parse(req);
      const { id } = req.query;
      
      const imageFile = files.image?.[0];
      const imagePath = imageFile ? "/uploads/" + path.basename(imageFile.filepath) : null;

      // Eski resmi sil
      if (imagePath) {
        const [currentBanner] = await pool.query("SELECT image_path FROM intro_banners WHERE id = ?", [id]);
        if (currentBanner.length > 0 && currentBanner[0].image_path) {
          const fullOldPath = path.join(process.cwd(), 'public', currentBanner[0].image_path);
          try {
            await fs.unlink(fullOldPath);
          } catch (err) {
            if (err.code !== 'ENOENT') {
              console.error("Eski resim silinemedi:", err);
            }
          }
        }
      }

      const updateQuery = imagePath 
        ? "UPDATE intro_banners SET title = ?, subtitle = ?, image_path = ? WHERE id = ?"
        : "UPDATE intro_banners SET title = ?, subtitle = ? WHERE id = ?";
      
      const updateParams = imagePath 
        ? [fields.title?.[0] || '', fields.subtitle?.[0] || '', imagePath, id]
        : [fields.title?.[0] || '', fields.subtitle?.[0] || '', id];

      await pool.query(updateQuery, updateParams);
      res.json({ success: true });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Sunucu hatası" });
    }
  } else if (req.method === 'DELETE') {
    try {
      const { id } = req.query;
      
      // Resmi sil
      const [currentBanner] = await pool.query("SELECT image_path FROM intro_banners WHERE id = ?", [id]);
      if (currentBanner.length > 0 && currentBanner[0].image_path) {
        const fullPath = path.join(process.cwd(), 'public', currentBanner[0].image_path);
        try {
          await fs.unlink(fullPath);
        } catch (err) {
          if (err.code !== 'ENOENT') {
            console.error("Resim silinemedi:", err);
          }
        }
      }
      
      await pool.query("DELETE FROM intro_banners WHERE id = ?", [id]);
      res.json({ success: true });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Sunucu hatası" });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
