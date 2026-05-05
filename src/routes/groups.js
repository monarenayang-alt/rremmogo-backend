const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const db = require('../db/db');

// Create a new group
router.post('/', auth, async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Group name is required' });
    }

    await db.execute(
      'INSERT INTO groups (name) VALUES (?)',
      [name]
    );

    res.json({ message: 'Group created' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all groups
router.get('/', auth, async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM groups');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;