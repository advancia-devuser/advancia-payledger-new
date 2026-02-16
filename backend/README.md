# Advancia PayLedger Backend API

Complete backend API for cryptocurrency payments and healthcare management using **in-memory storage** (no database required).

## 🌟 Key Features

- **Zero Database Setup**: Uses in-memory storage with JavaScript Maps - no MongoDB/PostgreSQL installation needed
- **Full REST API**: 15+ endpoints for auth, wallets, transactions, healthcare, and payments
- **JWT Authentication**: Secure token-based authentication with bcrypt password hashing
- **Rate Limiting**: 100 requests per 15 minutes per IP to prevent abuse
- **Security Hardened**: Helmet.js, CORS protection, input validation
- **TypeScript**: Full type safety with strict compilation
- **Hot Reload**: ts-node-dev for instant development feedback

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ (tested with Node.js 24.x)
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server (port 4000 by default)
npm run dev
```

The server will start at `http://localhost:4000` with in-memory storage.

### Verify Installation

```bash
curl http://localhost:4000/

# Response:
# {
#   "message": "Advancia PayLedger API",
#   "version": "1.0.0",
#   "storage": "in-memory",
#   "note": "No database required - data stored in memory",
#   "endpoints": {...}
# }
```

## 📦 In-Memory Storage

### How It Works

All data is stored in JavaScript `Map` objects in RAM instead of a database:

- **Users**: Email, password (bcrypt hashed), profile info, KYC status
- **Wallets**: Multi-currency (BTC, ETH, USDT, USD, EUR, etc.) with balances
- **Transactions**: Send, receive, exchange history with status tracking
- **Healthcare**: Subscription plans with providers and renewal dates

### Data Persistence

⚠️ **Important**: Data is stored in memory and will be **cleared when the server restarts**.

- Development: This is perfect for testing without database setup
- Production: Consider upgrading to MongoDB/PostgreSQL for data persistence

### Storage Architecture

Located in `src/store.ts`:

```typescript
class InMemoryStore {
  private users: Map<string, User> = new Map();
  private wallets: Map<string, Wallet> = new Map();
  private transactions: Map<string, Transaction> = new Map();
  private healthcare: Map<string, HealthcareSubscription> = new Map();
  
  createUser(data) { /* ... */ }
  findUserByEmail(email) { /* ... */ }
  // ... 15+ CRUD methods
}

export const store = new InMemoryStore(); // Singleton
```

## 🔐 API Endpoints

### Authentication (`/api/auth`)

- `POST /register` - Create new user account
- `POST /login` - Login and receive JWT token
- `GET /me` - Get current user (requires auth)

### Wallets (`/api/wallet`)

- `GET /` - List all user wallets (requires auth)
- `POST /` - Create new wallet (requires auth)
- `GET /:currency` - Get wallet balance by currency (requires auth)

### Transactions (`/api/transactions`)

- `GET /` - List transaction history with pagination (requires auth)
- `POST /` - Create new transaction (requires auth)
- `GET /:id` - Get transaction details (requires auth)

### Healthcare (`/api/healthcare`)

- `GET /plans` - List available healthcare plans
- `GET /subscriptions` - Get user subscriptions (requires auth)
- `POST /subscribe` - Create healthcare subscription (requires auth)

### Payments (`/api/payments`)

- `POST /create-intent` - Create payment intent (mock Stripe)
- `POST /crypto` - Process crypto payment (mock Web3)

### User (`/api/user`)

- `PUT /profile` - Update user profile (requires auth)

See [API.md](../docs/API.md) for complete documentation with request/response examples.

## 🔧 Environment Variables

Create `.env` file in the backend directory:

```env
# Server Configuration
PORT=4000
NODE_ENV=development

# JWT Secret (change in production!)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# CORS Settings
CORS_ORIGIN=http://localhost:3000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Demo seed (optional)
# Seeds in-memory data on startup for demos.
# Defaults to ON in development, OFF in production unless DEMO_SEED=true.
DEMO_SEED=true
DEMO_USER_EMAIL=demo@advancia.local
DEMO_USER_PASSWORD=Demo12345!
```

**Note**: No database connection string needed!

## 🧪 Testing

### Manual Testing with cURL

```bash
# Register user
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123456","firstName":"John","lastName":"Doe"}'

# Login (save the token)
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123456"}'

# Create wallet (replace YOUR_TOKEN)
curl -X POST http://localhost:4000/api/wallet \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"type":"crypto","currency":"BTC","address":"0x123..."}'
```

### Automated Testing

```bash
# Run test suite
node test-api.js
```

## 📁 Project Structure

```
backend/
├── src/
│   ├── index.ts              # Express server setup
│   ├── store.ts              # In-memory storage (Map-based)
│   └── routes/
│       ├── auth.ts           # Authentication endpoints
│       ├── wallet.ts         # Wallet management
│       ├── transactions.ts   # Transaction processing
│       ├── healthcare.ts     # Healthcare subscriptions
│       ├── payments.ts       # Payment processing (mock)
│       └── user.ts           # User profile management
├── package.json
├── tsconfig.json
├── .env
└── README.md (this file)
```

## 🔄 Upgrading to Database (Optional)

If you need data persistence, you can upgrade to MongoDB:

### 1. Install Mongoose

```bash
npm install mongoose
```

### 2. Create Models

Replace `store.ts` with Mongoose models in `src/models/`:

```typescript
// src/models/User.ts
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  // ... other fields
});

export default mongoose.model('User', userSchema);
```

### 3. Update Routes

Replace `store.createUser()` with `new User().save()`:

```typescript
// Before (in-memory)
const user = store.createUser({ email, password });

// After (MongoDB)
const user = new User({ email, password });
await user.save();
```

### 4. Connect to MongoDB

In `src/index.ts`:

```typescript
import mongoose from 'mongoose';

await mongoose.connect(process.env.MONGODB_URI);
console.log('✅ Connected to MongoDB');
```

See [DEPLOYMENT.md](../docs/DEPLOYMENT.md) for MongoDB Atlas setup guide.

## 🛡️ Security Features

- **bcrypt**: Password hashing with 12 salt rounds
- **JWT**: Token-based authentication (1-week expiry)
- **Helmet.js**: HTTP security headers
- **CORS**: Cross-origin request protection
- **Rate Limiting**: 100 requests per 15 minutes
- **Input Validation**: express-validator for request validation
- **No SQL Injection**: In-memory storage is immune to SQL/NoSQL injection

## 📊 Production Deployment

### Option 1: Vercel (Serverless)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

### Option 2: VPS (Ubuntu)

```bash
# Install dependencies
npm install --production

# Build TypeScript
npm run build

# Start with PM2
pm2 start dist/index.js --name advancia-api
```

### Option 3: Docker

```dockerfile
FROM node:24-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
RUN npm run build
CMD ["node", "dist/index.js"]
```

See [DEPLOYMENT.md](../docs/DEPLOYMENT.md) for complete deployment guides.

## 🐛 Troubleshooting

### Server won't start

```bash
# Check if port 4000 is in use
netstat -ano | findstr :4000

# Kill the process (Windows)
taskkill /PID <PID> /F

# Or use different port
PORT=5000 npm run dev
```

### TypeScript compilation errors

```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
```

### CORS errors

Update `.env`:
```env
CORS_ORIGIN=*  # Allow all origins (development only!)
```

## 📝 Development

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Run production build
- `npm test` - Run test suite (if configured)

### Code Quality

```bash
# Format code
npx prettier --write "src/**/*.ts"

# Lint
npx eslint src/
```

## 📚 Resources

- [API Documentation](../docs/API.md)
- [Deployment Guide](../docs/DEPLOYMENT.md)
- [Express.js Docs](https://expressjs.com/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

MIT License - see LICENSE file for details

## 💡 FAQ

**Q: Why in-memory storage instead of a database?**  
A: Simplifies development by eliminating database setup. Perfect for prototyping, testing, and local development.

**Q: How do I make data persist?**  
A: See "Upgrading to Database" section above for MongoDB integration.

**Q: Is this production-ready?**  
A: The code is production-quality, but you should upgrade to a real database for production use with persistent data.

**Q: How many requests can it handle?**  
A: In-memory storage is extremely fast. The rate limiter caps at 100 req/15min per IP, but you can adjust this.

**Q: Can I use PostgreSQL instead of MongoDB?**  
A: Yes! Replace `store.ts` with any ORM like Prisma, Sequelize, or TypeORM.

---

**Built with ❤️ for Advancia PayLedger**
