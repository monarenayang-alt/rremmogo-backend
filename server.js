require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors({
  origin: 'https://re-mmogo-frontend.vercel.app'
}));

app.use(express.json());

// API routes
app.use('/api/auth', require('./src/routes/auth'));
app.use('/api/groups', require('./src/routes/groups'));
app.use('/api/members', require('./src/routes/members'));
app.use('/api/contributions', require('./src/routes/contributions'));
app.use('/api/loans', require('./src/routes/loans'));
app.use('/api/approvals', require('./src/routes/approvals'));
app.use('/api/reports', require('./src/routes/reports'));

// ✅ API root (fixes "Cannot GET /api")
app.get('/api', (req, res) => {
  res.json({ message: 'Re-Mmogo API is running' });
});

// Health check
app.get('/', (req, res) => {
  res.json({ status: 'Re-Mmogo backend running' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});