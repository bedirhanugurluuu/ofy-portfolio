const express = require('express');
const router = express.Router();
const pool = require('../db');

// GET all awards
router.get('/', async (req, res) => {
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
router.post('/', async (req, res) => {
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

module.exports = router;
