const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const db = require('../db/db');

router.post('/', auth, async (req, res) => {
  try {
    const { name, groupId } = req.body;

    if (!name || !groupId) {
      return res.status(400).json({
        error: 'name and groupId are required'
      });
    }

    await db.execute(
      'INSERT INTO members (name, group_id) VALUES (?, ?)',
      [name, groupId]
    );

    res.json({ message: 'Member added' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/:groupId', auth, async (req, res) => {
  try {
    const [rows] = await db.execute(
      'SELECT * FROM members WHERE group_id = ?',
      [req.params.groupId]
    );

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
