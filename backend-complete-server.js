const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const WebSocket = require('ws');
const http = require('http');
const path = require('path');
const fs = require('fs');

// Initialize Express app
const app = express();
const server = http.createServer(app);

// Initialize WebSocket
const wss = new WebSocket.Server({ server });

// Security middleware
app.use(helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false
}));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// CORS
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// API Routes
app.get('/api/dashboard', (req, res) => {
    res.json({
        metrics: {
            monthlyRevenue: '$247K',
            activeFacilities: 24,
            totalTransactions: 1847,
            activePatients: 1083,
            revenueChange: '+42%',
            facilitiesChange: '+2',
            transactionsChange: '+18%',
            patientsChange: '+12%'
        },
        revenueData: [
            { month: 'Jul', revenue: 145000, facilities: 18 },
            { month: 'Aug', revenue: 168000, facilities: 20 },
            { month: 'Sep', revenue: 195000, facilities: 22 },
            { month: 'Oct', revenue: 212000, facilities: 23 },
            { month: 'Nov', revenue: 247000, facilities: 24 }
        ],
        paymentMethods: [
            { method: 'Solana', amount: 98800, color: '#14F195' },
            { method: 'Ethereum', amount: 74100, color: '#627EEA' },
            { method: 'Polygon', amount: 43500, color: '#8247E5' },
            { method: 'Base', amount: 30600, color: '#0052FF' }
        ],
        transactions: [
            { id: 'TX001', facility: 'Healthcare Facility A', amount: 12500, method: 'Solana', status: 'completed', time: '2 min ago' },
            { id: 'TX002', facility: 'Healthcare Facility B', amount: 8900, method: 'Ethereum', status: 'completed', time: '15 min ago' },
            { id: 'TX003', facility: 'Healthcare Facility C', amount: 15300, method: 'Polygon', status: 'pending', time: '32 min ago' },
            { id: 'TX004', facility: 'Healthcare Facility D', amount: 6700, method: 'Base', status: 'completed', time: '1 hr ago' },
            { id: 'TX005', facility: 'Healthcare Facility E', amount: 9400, method: 'Solana', status: 'completed', time: '2 hr ago' }
        ]
    });
});

app.get('/api/facilities', (req, res) => {
    res.json([
        { id: 1, name: 'Healthcare Facility A', location: 'Region 1', revenue: 42500, beds: 150, occupancy: 87, patients: 248 },
        { id: 2, name: 'Healthcare Facility B', location: 'Region 2', revenue: 28300, beds: 80, occupancy: 92, patients: 142 },
        { id: 3, name: 'Healthcare Facility C', location: 'Region 3', revenue: 35700, beds: 120, occupancy: 78, patients: 198 },
        { id: 4, name: 'Healthcare Facility D', location: 'Region 4', revenue: 31200, beds: 95, occupancy: 84, patients: 167 },
        { id: 5, name: 'Healthcare Facility E', location: 'Region 5', revenue: 26800, beds: 70, occupancy: 89, patients: 128 }
    ]);
});

app.get('/api/appointments', (req, res) => {
    res.json([
        { id: 1, patient: 'Patient #1247', facility: 'Healthcare Facility A', time: '10:00 AM', type: 'Consultation', status: 'confirmed' },
        { id: 2, patient: 'Patient #1248', facility: 'Healthcare Facility B', time: '11:30 AM', type: 'Follow-up', status: 'confirmed' },
        { id: 3, patient: 'Patient #1249', facility: 'Healthcare Facility C', time: '2:00 PM', type: 'Surgery', status: 'pending' },
        { id: 4, patient: 'Patient #1250', facility: 'Healthcare Facility D', time: '3:15 PM', type: 'Therapy', status: 'confirmed' }
    ]);
});

app.get('/api/beds', (req, res) => {
    res.json({
        totalBeds: 515,
        occupiedBeds: 441,
        avgOccupancy: 86,
        facilities: [
            { name: 'Healthcare Facility A', totalBeds: 150, occupiedBeds: 131, occupancyRate: 87 },
            { name: 'Healthcare Facility B', totalBeds: 80, occupiedBeds: 74, occupancyRate: 92 },
            { name: 'Healthcare Facility C', totalBeds: 120, occupiedBeds: 94, occupancyRate: 78 },
            { name: 'Healthcare Facility D', totalBeds: 95, occupiedBeds: 80, occupancyRate: 84 },
            { name: 'Healthcare Facility E', totalBeds: 70, occupiedBeds: 62, occupancyRate: 89 }
        ]
    });
});

// WebSocket for real-time updates
wss.on('connection', (ws) => {
    console.log('Client connected to WebSocket');
    
    // Send real-time updates every 5 seconds
    const interval = setInterval(() => {
        const update = {
            type: 'dashboard_update',
            timestamp: new Date().toISOString(),
            data: {
                activeUsers: Math.floor(Math.random() * 100) + 50,
                recentTransactions: Math.floor(Math.random() * 10) + 1,
                systemStatus: 'healthy'
            }
        };
        ws.send(JSON.stringify(update));
    }, 5000);

    ws.on('close', () => {
        clearInterval(interval);
        console.log('Client disconnected from WebSocket');
    });
});

// Serve the demo
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'advancia-demo-standalone.html'));
});

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`🚀 Advancia PayLedger Server running on port ${PORT}`);
    console.log(`📱 Dashboard available at: http://localhost:${PORT}`);
    console.log(`🔗 WebSocket server ready for real-time updates`);
    console.log(`💰 Healthcare Fintech Platform Active`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received, shutting down gracefully');
    server.close(() => {
        console.log('Process terminated');
    });
});

process.on('SIGINT', () => {
    console.log('SIGINT received, shutting down gracefully');
    server.close(() => {
        console.log('Process terminated');
    });
});
