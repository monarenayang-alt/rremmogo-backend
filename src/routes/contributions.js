const router = require('express').Router();
const auth = require('../middleware/auth');
const db = require('../db/db');

router.post('/', auth, async (req, res) => {
  try {
    const { memberId, amount, groupId } = req.body;

    if (!memberId || !amount || !groupId) {
      return res.status(400).json({ error: 'memberId, amount and groupId are required' });
    }

    const month = new Date().toISOString().slice(0, 10);

    await db.execute(
      'INSERT INTO contributions (member_id, group_id, amount, month) VALUES (?, ?, ?, ?)',
      [memberId, groupId, amount, month]
    );

    res.json({ message: 'Contribution submitted' });
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