import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// API routes
app.get('/api/users', (req, res) => {
  res.json({ users: [], message: 'Users endpoint working' });
});

app.get('/api/transactions', (req, res) => {
  res.json({ transactions: [], message: 'Transactions endpoint working' });
});

// Start server
app.listen(PORT, () => {
  console.log(🚀 Advancia Pay Ledger Backend running on http://localhost:);
  console.log(📊 Health check: http://localhost:/health);
});
