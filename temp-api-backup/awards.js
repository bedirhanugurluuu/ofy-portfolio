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

// GET all awards
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
    const [rows] = await pool.execute('SELECT * FROM awards ORDER BY date DESC');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching awards:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET single award by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.execute('SELECT * FROM awards WHERE id = ?', [id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Award not found' });
    }
    
    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching award:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST new award
  } else if (req.method === 'POST') {
  try {
    const { title, subtitle, halo, link, date } = req.body;
    const [result] = await pool.execute(
      'INSERT INTO awards (title, subtitle, halo, link, date) VALUES (?, ?, ?, ?, ?)',
      [title, subtitle, halo, link, date]
    );
    res.status(201).json({ id: result.insertId, title, subtitle, halo, link, date });
  } catch (error) {
    console.error('Error creating award:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT update award
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, subtitle, halo, link, date } = req.body;
    await pool.execute(
      'UPDATE awards SET title = ?, subtitle = ?, halo = ?, link = ?, date = ? WHERE id = ?',
      [title, subtitle, halo, link, date, id]
    );
    res.json({ id, title, subtitle, halo, link, date });
  } catch (error) {
    console.error('Error updating award:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE award
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.execute('DELETE FROM awards WHERE id = ?', [id]);
    res.json({ message: 'Award deleted successfully' });
  } catch (error) {
    console.error('Error deleting award:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
