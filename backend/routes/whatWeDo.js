const express = require('express');
const router = express.Router();
const pool = require('../db');

// GET - What We Do content
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM what_we_do LIMIT 1');
    
    if (rows.length === 0) {
      // Return default structure if no data exists
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
});

// PUT - Update What We Do content
router.put('/', async (req, res) => {
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

    // Check if record exists
    const [existingRows] = await pool.execute('SELECT id FROM what_we_do LIMIT 1');
    
    if (existingRows.length === 0) {
      // Insert new record
      await pool.execute(`
        INSERT INTO what_we_do (
          title, subtitle, 
          service_1_title, service_1_items,
          service_2_title, service_2_items,
          service_3_title, service_3_items
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `, [title, subtitle, service_1_title, service_1_items, service_2_title, service_2_items, service_3_title, service_3_items]);
    } else {
      // Update existing record
      await pool.execute(`
        UPDATE what_we_do SET 
          title = ?, subtitle = ?,
          service_1_title = ?, service_1_items = ?,
          service_2_title = ?, service_2_items = ?,
          service_3_title = ?, service_3_items = ?
        WHERE id = ?
      `, [title, subtitle, service_1_title, service_1_items, service_2_title, service_2_items, service_3_title, service_3_items, existingRows[0].id]);
    }

    res.json({ message: 'What We Do content updated successfully' });
  } catch (error) {
    console.error('Error updating what we do content:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
