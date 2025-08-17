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
      const [rows] = await pool.execute('SELECT * FROM what_we_do LIMIT 1');
      
      if (rows.length === 0) {
        return res.json({
          id: null,
          title: 'What We Do',
          subtitle: 'We create meaningful digital experiences that connect brands with their audiences.',
          service_1_title: 'Brand Strategy',
          service_1_items: 'Brand Audit\nResearch\nAudience\nCompetitive Analysis\nPositioning\nTone of Voice\nSocial Media',
          service_2_title: 'Digital Design',
          service_2_items: 'UI/UX Design\nWeb Design\nMobile Design\nBrand Identity\nVisual Design\nPrototyping\nUser Testing',
          service_3_title: 'Development',
          service_3_items: 'Frontend Development\nBackend Development\nMobile Apps\nE-commerce\nCMS Integration\nAPI Development\nPerformance Optimization'
        });
      }
      
      res.json(rows[0]);
    } catch (error) {
      console.error('Error fetching what we do content:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else if (req.method === 'PUT') {
    try {
      const {
        title,
        subtitle,
        service_1_title,
        service_1_items,
        service_2_title,
        service_2_items,
        service_3_title,
        service_3_items
      } = req.body;

      const [existingRows] = await pool.execute('SELECT id FROM what_we_do LIMIT 1');
      
      if (existingRows.length === 0) {
        await pool.execute(`
          INSERT INTO what_we_do (
            title, subtitle, service_1_title, service_1_items,
            service_2_title, service_2_items, service_3_title, service_3_items
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `, [title, subtitle, service_1_title, service_1_items, service_2_title, service_2_items, service_3_title, service_3_items]);
      } else {
        await pool.execute(`
          UPDATE what_we_do SET 
            title = ?, subtitle = ?, service_1_title = ?, service_1_items = ?,
            service_2_title = ?, service_2_items = ?, service_3_title = ?, service_3_items = ?
          WHERE id = ?
        `, [title, subtitle, service_1_title, service_1_items, service_2_title, service_2_items, service_3_title, service_3_items, existingRows[0].id]);
      }

      res.json({ message: 'What We Do content updated successfully' });
    } catch (error) {
      console.error('Error updating what we do content:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
