const router = require('express').Router();
const auth = require('../middleware/auth');
const db = require('../db/db');

router.post('/', auth, async (req, res) => {
  const { loanId, approver } = req.body;

  await db.execute(
    'INSERT INTO approvals(loan_id,approver) VALUES (?,?)',
    [loanId, approver]
  );

  const [[{ count }]] = await db.execute(
    'SELECT COUNT(*) AS count FROM approvals WHERE loan_id=?',
    [loanId]
  );

  if (count >= 2) {
    await db.execute(
      "UPDATE loans SET status='APPROVED' WHERE id=?",
      [loanId]
    );
  }

  res.json({ message: 'Approval processed', approvals: count });
});

module.exports = router;