const router = require('express').Router();
const auth = require('../middleware/auth');
const db = require('../db/db');

router.post('/', auth, async (req, res) => {
  const { memberId, amount } = req.body;

  await db.execute(
    'INSERT INTO loans(member_id,amount,balance,status) VALUES (?,?,?,?)',
    [memberId, amount, amount, 'PENDING']
  );

  res.json({ message: 'Loan requested' });
});

module.exports = router;