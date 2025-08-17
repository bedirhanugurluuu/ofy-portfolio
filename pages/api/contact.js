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
  port: process.env.DATABASE_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Disable body parsing, we'll handle it manually
export const config = {
  api: {
    bodyParser: false,
  },
};

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
      const [rows] = await pool.execute('SELECT * FROM contact LIMIT 1');
      
      if (rows.length === 0) {
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
  } else if (req.method === 'PUT') {
    try {
      const form = formidable({
        uploadDir: './public/uploads',
        keepExtensions: true,
        maxFiles: 1,
        maxFileSize: 5 * 1024 * 1024, // 5MB
      });

      const [fields, files] = await new Promise((resolve, reject) => {
        form.parse(req, (err, fields, files) => {
          if (err) reject(err);
          else resolve([fields, files]);
        });
      });

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
      } = fields;

      // Check if record exists
      const [existingRows] = await pool.execute('SELECT id, image_path FROM contact LIMIT 1');
      
      let imagePath = null;
      if (files.image) {
        const file = files.image[0];
        const fileName = `contact-${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalFilename)}`;
        const newPath = path.join('./public/uploads', fileName);
        
        // Move file to uploads directory
        await fs.rename(file.filepath, newPath);
        imagePath = fileName;
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
        if (files.image && existingRows[0].image_path) {
          try {
            await fs.unlink(path.join('./public/uploads', existingRows[0].image_path));
          } catch (error) {
            console.error('Error deleting old image:', error);
          }
        }
        
        // Update existing record
        const updateFields = files.image 
          ? `title = ?, phone = ?, email = ?, instagram = ?, linkedin = ?,
             address_line1 = ?, address_line2 = ?,
             studio_hours_weekdays = ?, studio_hours_weekend = ?, image_path = ?`
          : `title = ?, phone = ?, email = ?, instagram = ?, linkedin = ?,
             address_line1 = ?, address_line2 = ?,
             studio_hours_weekdays = ?, studio_hours_weekend = ?`;
        
        const updateValues = files.image 
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
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
