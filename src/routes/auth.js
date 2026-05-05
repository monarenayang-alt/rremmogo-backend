const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db/db');

router.post('/register', async (req, res) => {
  const { email, password } = req.body;
  const hash = await bcrypt.hash(password, 10);
  await db.execute(
    'INSERT INTO users(email,password) VALUES (?,?)',
    [email, hash]
  );
  res.json({ message: 'User registered' });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const [rows] = await db.execute(
    'SELECT * FROM users WHERE email=?',
    [email]
  );
  if (!rows.length) return res.status(401).json({ error: 'Invalid credentials' });

  const user = rows[0];
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.status(401).json({ error: 'Invalid credentials' });

  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
  res.json({ token });
});

module.exports = router;