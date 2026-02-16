/**
 * API Client for Advancia PayLedger Backend
 * 
 * Handles authentication, request/response formatting, and error handling
 */

// Prefer same-origin requests so deployments don't rely on hard-coded backend URLs.
// /api/* is proxied to the backend by the Next.js route handler in app/api/[...path]/route.ts
const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  message?: string;
}

/**
 * Get auth token from localStorage (client-side only)
 */
function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('authToken');
}

/**
 * Save auth token to localStorage
 */
export function setToken(token: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('authToken', token);
  }
}

/**
 * Clear auth token
 */
export function clearToken(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('authToken');
  }
}

/**
 * Make authenticated API request
 */
async function apiRequest<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const token = getToken();
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        error: data.error || data.message || 'Request failed',
      };
    }

    return { data };
  } catch (error: any) {
    return {
      error: error.message || 'Network error',
    };
  }
}

/**
 * Authentication API
 */
export const authApi = {
  /**
   * Register new user
   */
  async register(email: string, password: string, firstName: string, lastName: string) {
    const response = await apiRequest<{ user: any; token: string; message: string }>(
      '/api/auth/register',
      {
        method: 'POST',
        body: JSON.stringify({ email, password, firstName, lastName }),
      }
    );

    if (response.data?.token) {
      setToken(response.data.token);
    }

    return response;
  },

  /**
   * Login existing user
   */
  async login(email: string, password: string) {
    const response = await apiRequest<{ user: any; token: string; message: string }>(
      '/api/auth/login',
      {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }
    );

    if (response.data?.token) {
      setToken(response.data.token);
    }

    return response;
  },

  /**
   * Get current user
   */
  async getCurrentUser() {
    return apiRequest<{ user: any }>('/api/auth/me');
  },

  /**
   * Logout (clear token)
   */
  logout() {
    clearToken();
  },
};

/**
 * Wallet API
 */
export const walletApi = {
  /**
   * Get all user wallets
   */
  async getWallets() {
    return apiRequest<{ wallets: any[] }>('/api/wallet');
  },

  /**
   * Create new wallet
   */
  async createWallet(type: 'crypto' | 'fiat', currency: string, address?: string) {
    return apiRequest<{ wallet: any; message: string }>('/api/wallet', {
      method: 'POST',
      body: JSON.stringify({ type, currency, address }),
    });
  },

  /**
   * Get wallet balance
   */
  async getBalance(currency: string) {
    return apiRequest<{ currency: string; balance: number; type: string; address?: string }>(
      `/api/wallet/${currency}`
    );
  },
};

/**
 * Transaction API
 */
export const transactionApi = {
  /**
   * Get transaction history
   */
  async getTransactions(params?: { status?: string; type?: string; page?: number; limit?: number }) {
    const queryString = params ? `?${new URLSearchParams(params as any).toString()}` : '';
    return apiRequest<{ transactions: any[]; total: number; page: number; limit: number }>(
      `/api/transactions${queryString}`
    );
  },

  /**
   * Create new transaction
   */
  async createTransaction(
    type: 'send' | 'receive' | 'exchange',
    currency: string,
    amount: number,
    toAddress?: string,
    toCurrency?: string
  ) {
    return apiRequest<{ transaction: any; message: string }>('/api/transactions', {
      method: 'POST',
      body: JSON.stringify({ type, currency, amount, toAddress, toCurrency }),
    });
  },

  /**
   * Get transaction by ID
   */
  async getTransaction(id: string) {
    return apiRequest<{ transaction: any }>(`/api/transactions/${id}`);
  },
};

/**
 * Healthcare API
 */
export const healthcareApi = {
  /**
   * Get available plans
   */
  async getPlans() {
    return apiRequest<{ plans: any[] }>('/api/healthcare/plans');
  },

  /**
   * Get user subscriptions
   */
  async getSubscriptions() {
    return apiRequest<{ subscriptions: any[] }>('/api/healthcare/subscriptions');
  },

  /**
   * Subscribe to healthcare plan
   */
  async subscribe(plan: string, provider: string, monthlyPremium: number, dependents?: number) {
    return apiRequest<{ subscription: any; message: string }>('/api/healthcare/subscriptions', {
      method: 'POST',
      body: JSON.stringify({ plan, provider, monthlyPremium, dependents }),
    });
  },
};

/**
 * User API
 */
export const userApi = {
  /**
   * Update user profile
   */
  async updateProfile(data: {
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
    avatar?: string;
  }) {
    return apiRequest<{ user: any; message: string }>('/api/user/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
};

/**
 * Payment API
 */
export const paymentApi = {
  /**
   * Create Stripe payment intent
   */
  async createPaymentIntent(amount: number, currency: string = 'USD') {
    return apiRequest<{ clientSecret: string; amount: number; currency: string }>(
      '/api/payments/create-intent',
      {
        method: 'POST',
        body: JSON.stringify({ amount, currency }),
      }
    );
  },

  /**
   * Process crypto payment
   */
  async processCryptoPayment(currency: string, amount: number, toAddress: string) {
    return apiRequest<{ txHash: string; status: string; amount: number; currency: string }>(
      '/api/payments/crypto',
      {
        method: 'POST',
        body: JSON.stringify({ currency, amount, toAddress }),
      }
    );
  },
};
