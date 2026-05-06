require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors({
  origin: [
    'https://re-mmogo-frontend.vercel.app',
    'https://remmogo-frontend.vercel.app',
    'http://localhost:5173',
    'http://localhost:3000'
  ],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API routes
app.use('/api/auth',          require('./src/routes/auth'));
app.use('/api/groups',        require('./src/routes/groups'));
app.use('/api/members',       require('./src/routes/members'));
app.use('/api/contributions', require('./src/routes/contributions'));
app.use('/api/loans',         require('./src/routes/loans'));
app.use('/api/approvals',     require('./src/routes/approvals'));
app.use('/api/reports',       require('./src/routes/reports'));
app.use('/api/dashboard',     require('./src/routes/dashboard'));

// API root
app.get('/api', (req, res) => {
  res.json({ message: 'Re-Mmogo API is running ✅' });
});

// Health check
app.get('/', (req, res) => {
  res.json({ status: 'Re-Mmogo backend running ✅' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('GLOBAL ERROR:', err);
  res.status(500).json({ error: err.message || 'Internal server error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});