const router = require('express').Router();
const auth = require('../middleware/auth');
const db = require('../db/db');

router.post('/', auth, async (req, res) => {
  try {
    const { memberId, amount, groupId } = req.body;

    if (!memberId || !amount || !groupId) {
      return res.status(400).json({ error: 'memberId, amount and groupId are required' });
    }

    await db.execute(
      'INSERT INTO loans (member_id, group_id, amount, balance, status) VALUES (?, ?, ?, ?, ?)',
      [memberId, groupId, amount, amount, 'pending']
    );

    res.json({ message: 'Loan requested' });
  } catch (err) {
    console.error('LOAN ERROR:', err);
    res.status(500).json({ error: err.message });
  }
});

router.get('/:groupId', auth, async (req, res) => {
  try {
    const [rows] = await db.execute(
      'SELECT * FROM loans WHERE group_id = ?',
      [req.params.groupId]
    );
    res.json(rows);
  } catch (err) {
    console.error('LOAN FETCH ERROR:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;