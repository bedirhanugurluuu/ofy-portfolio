import mysql from 'mysql2/promise';

// Database connection
const pool = mysql.createPool({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  port: process.env.DATABASE_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});
const multer = require('multer');
const path = require('path');

// Multer configuration for image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'slider-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: function (req, file, cb) {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// GET all slider items
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
    const [rows] = await pool.execute('SELECT * FROM about_slider ORDER BY order_index ASC');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching slider:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST new slider item
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { title, subtitle, sub_subtitle, order_index } = req.body;
    const image_path = req.file ? req.file.filename : null;

    if (!image_path) {
      return res.status(400).json({ error: 'Image is required' });
    }

    const [result] = await pool.execute(
      'INSERT INTO about_slider (title, subtitle, sub_subtitle, image_path, order_index) VALUES (?, ?, ?, ?, ?)',
      [title, subtitle, sub_subtitle, image_path, order_index || 0]
    );
    
    res.status(201).json({ 
      id: result.insertId, 
      title, 
      subtitle, 
      sub_subtitle, 
      image_path,
      order_index: order_index || 0
    });
  } catch (error) {
    console.error('Error creating slider item:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT update slider item
router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const { id } = req.params;
    const { title, subtitle, sub_subtitle, order_index } = req.body;
    
    let image_path = null;
    if (req.file) {
      image_path = req.file.filename;
    }

    if (image_path) {
      await pool.execute(
        'UPDATE about_slider SET title = ?, subtitle = ?, sub_subtitle = ?, image_path = ?, order_index = ? WHERE id = ?',
        [title, subtitle, sub_subtitle, image_path, order_index, id]
      );
    } else {
      await pool.execute(
        'UPDATE about_slider SET title = ?, subtitle = ?, sub_subtitle = ?, order_index = ? WHERE id = ?',
        [title, subtitle, sub_subtitle, order_index, id]
      );
    }
    
    res.json({ id, title, subtitle, sub_subtitle, image_path, order_index });
  } catch (error) {
    console.error('Error updating slider item:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE slider item
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Get the image path before deleting
    const [rows] = await pool.execute('SELECT image_path FROM about_slider WHERE id = ?', [id]);
    if (rows.length > 0 && rows[0].image_path) {
      const fs = require('fs').promises;
      try {
        await fs.unlink(`uploads/${rows[0].image_path}`);
      } catch (err) {
        console.error('Error deleting image file:', err);
      }
    }
    
    await pool.execute('DELETE FROM about_slider WHERE id = ?', [id]);
    res.json({ message: 'Slider item deleted successfully' });
  } catch (error) {
    console.error('Error deleting slider item:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
