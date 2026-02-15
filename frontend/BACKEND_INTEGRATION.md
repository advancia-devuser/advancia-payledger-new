# Frontend Backend Integration Guide

## 🔗 Connecting to Backend API

The frontend is now configured to connect to the backend API with full authentication support.

### Quick Start

1. **Backend must be running**:
   ```bash
   cd backend
   npm run dev
   # Server runs on http://localhost:4000
   ```

2. **Frontend environment configured**:
   - `.env.local` already set to `http://localhost:4000`
   - For production, update to your deployed backend URL

3. **Start frontend**:
   ```bash
   npm run dev
   # Frontend runs on http://localhost:3000
   ```

### 📦 API Client Library

All backend API calls are handled through `app/lib/api.ts`:

#### Authentication
```typescript
import { authApi } from '@/app/lib/api';

// Register new user
const { data, error } = await authApi.register(
  'user@example.com',
  'password123',
  'John',
  'Doe'
);

// Login
const { data, error } = await authApi.login('user@example.com', 'password123');

// Get current user
const { data, error } = await authApi.getCurrentUser();

// Logout
authApi.logout();
```

#### Wallets
```typescript
import { walletApi } from '@/app/lib/api';

// Get all wallets
const { data } = await walletApi.getWallets();

// Create wallet
const { data } = await walletApi.createWallet('crypto', 'BTC', '0x123...');

// Get balance
const { data } = await walletApi.getBalance('BTC');
```

#### Transactions
```typescript
import { transactionApi } from '@/app/lib/api';

// Get transaction history
const { data } = await transactionApi.getTransactions({ page: 1, limit: 10 });

// Create transaction
const { data } = await transactionApi.createTransaction(
  'send',
  'BTC',
  0.5,
  '0xrecipient...'
);
```

#### Healthcare
```typescript
import { healthcareApi } from '@/app/lib/api';

// Get available plans
const { data } = await healthcareApi.getPlans();

// Subscribe to plan
const { data } = await healthcareApi.subscribe(
  'Premium',
  'Blue Cross',
  299.99,
  2
);
```

### 🎣 Authentication Hook

Use the `useAuth` hook for easy authentication state management:

```typescript
'use client';
import { useAuth } from '@/app/hooks/useAuth';

export default function MyComponent() {
  const { user, isAuthenticated, login, logout, isLoading } = useAuth();

  if (isLoading) return <div>Loading...</div>;

  if (!isAuthenticated) {
    return <button onClick={() => login('email', 'pass')}>Login</button>;
  }

  return (
    <div>
      <h1>Welcome {user.firstName}!</h1>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

### 🧩 Pre-built Components

#### AuthForm Component

Ready-to-use login/register form:

```typescript
import AuthForm from '@/app/components/AuthForm';

export default function Page() {
  return (
    <div className="p-8">
      <AuthForm />
    </div>
  );
}
```

Features:
- ✅ Login/Register toggle
- ✅ Form validation
- ✅ Error handling
- ✅ Auto-saves JWT token
- ✅ Shows user info when logged in

### 🔐 How Authentication Works

1. **User logs in/registers**
   - API call to backend
   - Backend returns JWT token

2. **Token stored in localStorage**
   - Automatically saved by API client
   - Persists across page refreshes

3. **Token sent with requests**
   - API client auto-includes in Authorization header
   - Format: `Bearer <token>`

4. **Token validation**
   - Backend verifies JWT on protected routes
   - Returns user data or 401 Unauthorized

### 🌐 Environment Variables

**Development** (`.env.local`):
```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

**Production** (Vercel):
```env
NEXT_PUBLIC_API_URL=https://your-backend.railway.app
```

### 📝 Usage Example

Complete example integrating auth with wallet:

```typescript
'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/app/hooks/useAuth';
import { walletApi } from '@/app/lib/api';

export default function WalletPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [wallets, setWallets] = useState([]);

  useEffect(() => {
    if (isAuthenticated) {
      loadWallets();
    }
  }, [isAuthenticated]);

  async function loadWallets() {
    const { data } = await walletApi.getWallets();
    if (data?.wallets) {
      setWallets(data.wallets);
    }
  }

  async function createBTCWallet() {
    const { data, error } = await walletApi.createWallet(
      'crypto',
      'BTC',
      '0x' + Math.random().toString(36).substring(7)
    );
    if (data) {
      loadWallets(); // Refresh
    } else {
      alert(error);
    }
  }

  if (isLoading) return <div>Loading...</div>;
  if (!isAuthenticated) return <div>Please log in</div>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">My Wallets</h1>
      
      <button
        onClick={createBTCWallet}
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded"
      >
        Create BTC Wallet
      </button>

      <div className="grid gap-4">
        {wallets.map((wallet: any) => (
          <div key={wallet.id} className="p-4 border rounded">
            <p className="font-bold">{wallet.currency}</p>
            <p>Balance: {wallet.balance}</p>
            <p className="text-sm text-gray-500">{wallet.address}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
```

### 🚀 Deployment

#### Vercel Deployment

1. **Set environment variable**:
   ```bash
   vercel env add NEXT_PUBLIC_API_URL
   # Enter your production backend URL
   ```

2. **Deploy**:
   ```bash
   vercel --prod
   ```

#### Backend URL Options

- **Railway**: `https://your-app.railway.app`
- **Render**: `https://your-app.onrender.com`
- **Fly.io**: `https://your-app.fly.dev`
- **VPS**: `https://api.yourdomain.com`

### 🔧 CORS Configuration

Make sure your backend allows your frontend domain:

**Backend `.env`**:
```env
# Development
CORS_ORIGIN=http://localhost:3000

# Production
CORS_ORIGIN=https://www.advanciapayledger.com
```

### 🐛 Troubleshooting

**CORS errors**:
- Check backend `CORS_ORIGIN` setting
- Verify frontend `NEXT_PUBLIC_API_URL`
- Ensure backend is running

**401 Unauthorized**:
- Check token in localStorage (DevTools → Application → Local Storage)
- Verify JWT_SECRET matches between sessions
- Token may have expired (re-login)

**Network error**:
- Verify backend is running on correct port
- Check firewall/antivirus blocking localhost
- Try `curl http://localhost:4000` to test backend

**TypeScript errors**:
- Run `npm run build` to check for errors
- Ensure all imports are correct
- Check `tsconfig.json` paths

### 📚 API Reference

See backend documentation:
- [API.md](../../backend/docs/API.md) - Complete endpoint reference
- [Backend README](../../backend/README.md) - Setup and architecture

### ✨ Next Steps

1. **Add authentication to existing pages**
   - Wrap app with `<AuthProvider>`
   - Use `useAuth()` in components

2. **Build wallet interface**
   - Use `walletApi` to display/create wallets
   - Integrate with WalletConnect component

3. **Add transaction history**
   - Use `transactionApi.getTransactions()`
   - Display in table/list format

4. **Healthcare integration**
   - Build plan selection UI
   - Subscribe users to plans

5. **Deploy backend**
   - Choose platform (Railway, Render, VPS)
   - Update `NEXT_PUBLIC_API_URL`
   - Redeploy frontend

---

**Built with ❤️ for Advancia PayLedger**
