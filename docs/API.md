# API Documentation - Advancia PayLedger

## Overview

The Advancia PayLedger API provides programmatic access to cryptocurrency payments, healthcare management, and user account features.

## Base URLs

- **Development**: `http://localhost:4000/api`
- **Production**: `https://api.advanciapayledger.com/api`

## Authentication

All protected endpoints require a JWT bearer token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

### Obtaining a Token

Tokens are issued upon successful login or registration.

## Endpoints

### Authentication

#### POST /auth/register

Create a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!",
  "firstName": "John",
  "lastName": "Doe",
  "phoneNumber": "+1234567890"
}
```

**Response (201 Created):**
```json
{
  "message": "User created successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe"
  }
}
```

#### POST /auth/login

Authenticate and receive access token.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}
```

**Response (200 OK):**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "kycVerified": false
  }
}
```

#### GET /auth/me

Get current user profile (requires authentication).

**Response (200 OK):**
```json
{
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "phoneNumber": "+1234567890",
    "kycVerified": false,
    "twoFactorEnabled": false
  }
}
```

### Wallets

#### GET /wallet

Get all wallets for the authenticated user.

**Authentication**: Required

**Response (200 OK):**
```json
{
  "wallets": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "userId": "507f1f77bcf86cd799439012",
      "type": "crypto",
      "currency": "BTC",
      "address": "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa",
      "balance": 0.5,
      "createdAt": "2026-02-15T10:30:00Z",
      "updatedAt": "2026-02-15T10:30:00Z"
    }
  ]
}
```

#### POST /wallet

Create a new wallet.

**Authentication**: Required

**Request Body:**
```json
{
  "type": "crypto",
  "currency": "ETH",
  "address": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb"
}
```

**Response (201 Created):**
```json
{
  "message": "Wallet created successfully",
  "wallet": {
    "_id": "507f1f77bcf86cd799439013",
    "userId": "507f1f77bcf86cd799439012",
    "type": "crypto",
    "currency": "ETH",
    "address": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
    "balance": 0
  }
}
```

#### GET /wallet/:currency

Get wallet balance for specific currency.

**Authentication**: Required

**Parameters:**
- `currency` (path): Currency code (e.g., BTC, ETH, USDT)

**Response (200 OK):**
```json
{
  "currency": "BTC",
  "balance": 0.5,
  "type": "crypto",
  "address": "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa"
}
```

### Transactions

#### GET /transactions

Get transaction history.

**Authentication**: Required

**Query Parameters:**
- `limit` (optional): Number of records (default: 50)
- `offset` (optional): Pagination offset (default: 0)
- `status` (optional): Filter by status (pending, completed, failed, cancelled)
- `type` (optional): Filter by type (send, receive, swap, payment, healthcare)

**Response (200 OK):**
```json
{
  "transactions": [
    {
      "_id": "507f1f77bcf86cd799439014",
      "userId": "507f1f77bcf86cd799439012",
      "type": "send",
      "currency": "BTC",
      "amount": 0.1,
      "fee": 0.001,
      "status": "completed",
      "toAddress": "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
      "txHash": "a1b2c3d4e5f6...",
      "createdAt": "2026-02-15T10:30:00Z",
      "updatedAt": "2026-02-15T10:31:00Z"
    }
  ],
  "pagination": {
    "total": 125,
    "limit": 50,
    "offset": 0
  }
}
```

#### POST /transactions

Create a new transaction.

**Authentication**: Required

**Request Body:**
```json
{
  "type": "send",
  "currency": "ETH",
  "amount": 0.5,
  "toAddress": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
  "metadata": {
    "note": "Payment for services"
  }
}
```

**Response (201 Created):**
```json
{
  "message": "Transaction created successfully",
  "transaction": {
    "_id": "507f1f77bcf86cd799439015",
    "userId": "507f1f77bcf86cd799439012",
    "type": "send",
    "currency": "ETH",
    "amount": 0.5,
    "fee": 0.005,
    "status": "pending",
    "toAddress": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb"
  }
}
```

#### GET /transactions/:id

Get specific transaction details.

**Authentication**: Required

**Response (200 OK):**
```json
{
  "transaction": {
    "_id": "507f1f77bcf86cd799439014",
    "userId": "507f1f77bcf86cd799439012",
    "type": "send",
    "currency": "BTC",
    "amount": 0.1,
    "fee": 0.001,
    "status": "completed",
    "toAddress": "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
    "txHash": "a1b2c3d4e5f6...",
    "createdAt": "2026-02-15T10:30:00Z"
  }
}
```

### Healthcare

#### GET /healthcare/plans

Get available healthcare plans (no authentication required).

**Response (200 OK):**
```json
{
  "plans": [
    {
      "id": "basic",
      "name": "Basic",
      "monthlyPremium": 99,
      "coverage": ["Basic medical", "Emergency care", "Prescription drugs"],
      "dependents": 0
    },
    {
      "id": "premium",
      "name": "Premium",
      "monthlyPremium": 199,
      "coverage": ["Comprehensive medical", "Dental", "Vision", "Mental health"],
      "dependents": 0
    }
  ]
}
```

#### GET /healthcare/subscriptions

Get user's healthcare subscriptions.

**Authentication**: Required

**Response (200 OK):**
```json
{
  "subscriptions": [
    {
      "_id": "507f1f77bcf86cd799439016",
      "userId": "507f1f77bcf86cd799439012",
      "plan": "premium",
      "status": "active",
      "provider": "HealthCare Plus",
      "monthlyPremium": 199,
      "startDate": "2026-01-01T00:00:00Z",
      "renewalDate": "2027-01-01T00:00:00Z",
      "dependents": 2
    }
  ]
}
```

#### POST /healthcare/subscriptions

Create a healthcare subscription.

**Authentication**: Required

**Request Body:**
```json
{
  "plan": "premium",
  "provider": "HealthCare Plus",
  "monthlyPremium": 199,
  "dependents": 2
}
```

**Response (201 Created):**
```json
{
  "message": "Healthcare subscription created successfully",
  "subscription": {
    "_id": "507f1f77bcf86cd799439016",
    "userId": "507f1f77bcf86cd799439012",
    "plan": "premium",
    "status": "active",
    "provider": "HealthCare Plus",
    "monthlyPremium": 199,
    "startDate": "2026-02-15T00:00:00Z",
    "renewalDate": "2027-02-15T00:00:00Z"
  }
}
```

### Payments

#### POST /payments/create-intent

Create a Stripe payment intent for fiat payments.

**Request Body:**
```json
{
  "amount": 10000,
  "currency": "USD"
}
```

**Response (200 OK):**
```json
{
  "clientSecret": "pi_mock_secret_abc123",
  "amount": 10000,
  "currency": "USD"
}
```

#### POST /payments/crypto

Process a cryptocurrency payment.

**Request Body:**
```json
{
  "currency": "BTC",
  "amount": 0.01,
  "toAddress": "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa"
}
```

**Response (200 OK):**
```json
{
  "txHash": "0xa1b2c3d4...",
  "status": "pending",
  "amount": 0.01,
  "currency": "BTC",
  "toAddress": "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa"
}
```

### User

#### PUT /user/profile

Update user profile.

**Authentication**: Required

**Request Body:**
```json
{
  "firstName": "Jane",
  "lastName": "Smith",
  "phoneNumber": "+1987654321",
  "avatar": "https://example.com/avatar.jpg"
}
```

**Response (200 OK):**
```json
{
  "message": "Profile updated successfully",
  "user": {
    "id": "507f1f77bcf86cd799439012",
    "email": "user@example.com",
    "firstName": "Jane",
    "lastName": "Smith",
    "phoneNumber": "+1987654321",
    "avatar": "https://example.com/avatar.jpg"
  }
}
```

## Error Responses

All error responses follow this format:

```json
{
  "error": "Error message description"
}
```

### Common Status Codes

- `200 OK`: Successful request
- `201 Created`: Resource created successfully
- `400 Bad Request`: Invalid request data
- `401 Unauthorized`: Missing or invalid authentication
- `404 Not Found`: Resource not found
- `409 Conflict`: Resource already exists
- `500 Internal Server Error`: Server error

## Rate Limiting

API requests are limited to 100 requests per 15-minute window per IP address.

When rate limit is exceeded, you'll receive:

```json
{
  "error": "Too many requests, please try again later"
}
```

## Webhooks (Coming Soon)

Webhook endpoints for real-time notifications about:
- Transaction status changes
- Healthcare claim updates
- Account security alerts

---

**Need Help?** Contact support@advanciapayledger.com
