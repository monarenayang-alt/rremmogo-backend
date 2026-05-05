const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const db = require('../db/db');

// Create a new group
router.post('/', auth, async (req, res) => {
  try {
    const { group_name, start_date, status } = req.body;

    if (!group_name || !start_date) {
      return res.status(400).json({ error: 'Group name and start date are required' });
    }

    await db.execute(
      'INSERT INTO MotsheloGroup (group_name, start_date, status) VALUES (?, ?, ?)',
      [group_name, start_date, status || 'active']
    );

    res.json({ message: 'Group created successfully' });
  } catch (error) {
    console.error('GROUP CREATE ERROR:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get all groups
router.get('/', auth, async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM MotsheloGroup');
    res.json(rows);
  } catch (error) {
    console.error('GROUP FETCH ERROR:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;