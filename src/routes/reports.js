const router = require('express').Router();
const auth = require('../middleware/auth');
const db = require('../db/db');

router.get('/yearly/:groupId', auth, async (req, res) => {
  const [rows] = await db.execute(`
    SELECT 
      m.name,
      COALESCE(SUM(c.amount),0) total_contributions,
      COALESCE(SUM(l.amount),0) total_loans,
      COALESCE(SUM(l.balance),0) outstanding_balance
    FROM members m
    LEFT JOIN contributions c ON m.id=c.member_id
    LEFT JOIN loans l ON m.id=l.member_id
    WHERE m.group_id=?
    GROUP BY m.id
  `, [req.params.groupId]);

  res.json(rows);
});

module.exports = router;