const router = require('express').Router();
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');
const db = require('../db/db');

router.post('/', auth, upload.single('proof'), async (req, res) => {
  const { memberId, amount } = req.body;
  const proof = req.file ? req.file.path : null;

  await db.execute(
    'INSERT INTO contributions(member_id,amount,proof) VALUES (?,?,?)',
    [memberId, amount, proof]
  );

  res.json({ message: 'Contribution submitted' });
});

module.exports = router;

