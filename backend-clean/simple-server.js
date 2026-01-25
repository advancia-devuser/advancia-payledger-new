const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Advancia PayLedger API is running' });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  if (email === 'admin@advancia.com' && password === 'Admin123!') {
    res.json({
      token: 'mock-jwt-token',
      user: { id: 'admin-1', email: 'admin@advancia.com', role: 'ADMIN', status: 'ACTIVE' }
    });
    return;
  }
  
  res.status(401).json({ error: 'Invalid credentials' });
});

app.listen(PORT, () => {
  console.log('🚀 Advancia PayLedger API running on port ' + PORT);
  console.log('📊 Health: http://localhost:' + PORT + '/health');
  console.log('🔐 Login: http://localhost:' + PORT + '/api/auth/login');
  console.log('');
  console.log('👑 Admin Credentials:');
  console.log('📧 Email: admin@advancia.com');
  console.log('🔑 Password: Admin123!');
  console.log('🎉 SYSTEM IS LIVE! 🎉');
});
