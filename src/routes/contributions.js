const router = require('express').Router();
const auth = require('../middleware/auth');
const db = require('../db/db');

router.post('/', auth, async (req, res) => {
  try {
    const { member_id, group_id, amount, month, status } = req.body;

    if (!member_id || !group_id || !amount || !month) {
      return res.status(400).json({ error: 'member_id, group_id, amount and month are required' });
    }

    // Convert month from "2026-05" to "2026-05-01"
    const monthDate = `${month}-01`;

    await db.execute(
      'INSERT INTO contributions (member_id, group_id, amount, month, status) VALUES (?, ?, ?, ?, ?)',
      [member_id, group_id, amount, monthDate, status || 'pending']
    );

    res.json({ message: 'Contribution recorded successfully' });
  } catch (err) {
    console.error('CONTRIBUTION ERROR:', err);
    res.status(500).json({ error: err.message });
  }
});

router.get('/:groupId', auth, async (req, res) => {
  try {
    const [rows] = await db.execute(
      'SELECT * FROM contributions WHERE group_id = ?',
      [req.params.groupId]
    );
    res.json(rows);
  } catch (err) {
    console.error('CONTRIBUTION FETCH ERROR:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;