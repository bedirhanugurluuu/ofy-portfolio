const express = require('express');
const router = express.Router();
const pool = require('../db');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;

// Multer configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'contact-' + uniqueSuffix + path.extname(file.originalname));
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

// GET - Contact content
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM contact LIMIT 1');
    
    if (rows.length === 0) {
      // Return default structure if no data exists
             return res.json({
         id: null,
         title: "Let's connect and bring your ideas to life",
         phone: "+45 123 456 789",
         email: "hello@lucastudio.com",
         instagram: "https://instagram.com/lucastudio",
         linkedin: "https://linkedin.com/company/lucastudio",
         address_line1: "12 Nyhavn Street",
         address_line2: "Copenhagen, Denmark, 1051",
         studio_hours_weekdays: "Monday to Friday: 9:00 AM – 6:00 PM",
         studio_hours_weekend: "Saturday & Sunday: Closed",
         image_path: null
       });
    }
    
    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching contact content:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT - Update Contact content
router.put('/', upload.single('image'), async (req, res) => {
  try {
    const {
      title,
      phone,
      email,
      instagram,
      linkedin,
      address_line1,
      address_line2,
      studio_hours_weekdays,
      studio_hours_weekend
    } = req.body;

    // Check if record exists
    const [existingRows] = await pool.execute('SELECT id, image_path FROM contact LIMIT 1');
    
    let imagePath = null;
    if (req.file) {
      imagePath = req.file.filename;
    }
    
    if (existingRows.length === 0) {
      // Insert new record
      await pool.execute(`
        INSERT INTO contact (
          title, phone, email, instagram, linkedin,
          address_line1, address_line2,
          studio_hours_weekdays, studio_hours_weekend, image_path
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [title, phone, email, instagram, linkedin, address_line1, address_line2, studio_hours_weekdays, studio_hours_weekend, imagePath]);
    } else {
      // Delete old image if new one is uploaded
      if (req.file && existingRows[0].image_path) {
        try {
          await fs.unlink(`uploads/${existingRows[0].image_path}`);
        } catch (error) {
          console.error('Error deleting old image:', error);
        }
      }
      
      // Update existing record
      const updateFields = req.file 
        ? `title = ?, phone = ?, email = ?, instagram = ?, linkedin = ?,
           address_line1 = ?, address_line2 = ?,
           studio_hours_weekdays = ?, studio_hours_weekend = ?, image_path = ?`
        : `title = ?, phone = ?, email = ?, instagram = ?, linkedin = ?,
           address_line1 = ?, address_line2 = ?,
           studio_hours_weekdays = ?, studio_hours_weekend = ?`;
      
      const updateValues = req.file 
        ? [title, phone, email, instagram, linkedin, address_line1, address_line2, studio_hours_weekdays, studio_hours_weekend, imagePath, existingRows[0].id]
        : [title, phone, email, instagram, linkedin, address_line1, address_line2, studio_hours_weekdays, studio_hours_weekend, existingRows[0].id];
      
      await pool.execute(`
        UPDATE contact SET ${updateFields} WHERE id = ?
      `, updateValues);
    }

    res.json({ message: 'Contact content updated successfully' });
  } catch (error) {
    console.error('Error updating contact content:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
