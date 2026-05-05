const router = require('express').Router();
const auth = require('../middleware/auth');
const db = require('../db/db');

// GET /dashboard/stats
router.get('/stats', auth, async (req, res) => {
  try {
    const [[{ totalMembers }]] = await db.execute(
      'SELECT COUNT(*) as totalMembers FROM Member'
    );

    const [[{ monthlyContributions }]] = await db.execute(
      'SELECT COALESCE(SUM(amount), 0) as monthlyContributions FROM Contribution WHERE MONTH(month) = MONTH(CURDATE()) AND YEAR(month) = YEAR(CURDATE())'
    );

    const [[{ activeLoans }]] = await db.execute(
      'SELECT COUNT(*) as activeLoans FROM Contribution WHERE status = "pending"'
    );

    const [[{ pendingApprovals }]] = await db.execute(
      'SELECT COUNT(*) as pendingApprovals FROM Contribution WHERE status = "pending"'
    );

    res.json({
      totalMembers,
      monthlyContributions,
      activeLoans,
      pendingApprovals,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to load dashboard stats', error: error.message });
  }
});

module.exports = router;