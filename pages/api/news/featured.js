import mysql from 'mysql2/promise';

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

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    try {
      console.log('News featured GET request started');
      console.log('Database config:', {
        host: process.env.DATABASE_HOST,
        user: process.env.DATABASE_USER,
        database: process.env.DATABASE_NAME,
        port: process.env.DATABASE_PORT
      });
      
      const [rows] = await pool.query("SELECT * FROM news WHERE is_featured = 1 ORDER BY featured_order ASC LIMIT 3");
      console.log('Query executed successfully, rows count:', rows.length);
      res.json(rows);
    } catch (err) {
      console.error('News featured GET error:', err);
      console.error('Error details:', {
        message: err.message,
        code: err.code,
        sqlState: err.sqlState,
        sqlMessage: err.sqlMessage
      });
      res.status(500).json({ error: "Sunucu hatası", details: err.message });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
