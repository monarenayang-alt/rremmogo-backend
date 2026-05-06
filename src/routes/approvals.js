const router = require('express').Router();
const auth = require('../middleware/auth');
const db = require('../db/db');

router.post('/', auth, async (req, res) => {
  try {
    const { loanId, signatoryId } = req.body;

    if (!loanId || !signatoryId) {
      return res.status(400).json({ error: 'loanId and signatoryId are required' });
    }

    await db.execute(
      'INSERT INTO Approval (loan_id, signatory_id, decision) VALUES (?, ?, ?)',
      [loanId, signatoryId, 'approved']
    );

    const [[{ count }]] = await db.execute(
      'SELECT COUNT(*) AS count FROM Approval WHERE loan_id = ?',
      [loanId]
    );

    if (count >= 2) {
      await db.execute(
        "UPDATE loans SET status = 'approved' WHERE id = ?",
        [loanId]
      );
    }

    res.json({ message: 'Approval processed', approvals: count });
  } catch (err) {
    console.error('APPROVAL ERROR:', err);
    res.status(500).json({ error: err.message });
  }
});

router.get('/:loanId', auth, async (req, res) => {
  try {
    const [rows] = await db.execute(
      'SELECT * FROM Approval WHERE loan_id = ?',
      [req.params.loanId]
    );
    res.json(rows);
  } catch (err) {
    console.error('APPROVAL FETCH ERROR:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;