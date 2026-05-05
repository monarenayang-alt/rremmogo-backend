require('dotenv').config();

const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', require('./src/routes/auth'));
app.use('/api/groups', require('./src/routes/groups'));
app.use('/api/members', require('./src/routes/members'));
app.use('/api/contributions', require('./src/routes/contributions'));
app.use('/api/loans', require('./src/routes/loans'));
app.use('/api/approvals', require('./src/routes/approvals'));
app.use('/api/reports', require('./src/routes/reports'));

app.get('/', (req, res) => {
  res.json({ status: 'Re‑Mmogo API running' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});