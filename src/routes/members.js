const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const db = require('../db/db');
const bcrypt = require('bcryptjs');

router.post('/', auth, async (req, res) => {
  try {
    const { full_name, email, phone, role, group_id, password } = req.body;

    if (!full_name || !group_id || !email) {
      return res.status(400).json({ error: 'full_name, email and group_id are required' });
    }

    const hashedPassword = password ? await bcrypt.hash(password, 10) : null;

    await db.execute(
      'INSERT INTO members (name, email, phone, role, group_id) VALUES (?, ?, ?, ?, ?)',
      [full_name, email, phone || null, role || 'member', group_id]
    );

    // Also create a users record so member can log in
    if (email && password) {
      const [existing] = await db.execute('SELECT id FROM users WHERE email = ?', [email]);
      if (existing.length === 0) {
        await db.execute(
          'INSERT INTO users (email, password, role) VALUES (?, ?, ?)',
          [email, hashedPassword, role || 'member']
        );
      }
    }

    res.json({ message: 'Member added successfully' });
  } catch (err) {
    console.error('MEMBER ADD ERROR:', err);
    res.status(500).json({ error: err.message });
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
    console.error('MEMBER FETCH ERROR:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;