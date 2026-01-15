/**
 * Dashboard API Client
 * Production-ready API functions for dashboard operations
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

interface WithdrawRequest {
  currency: 'USD' | 'BTC' | 'ETH' | 'USDT';
  amount: number;
  address?: string; // Required for crypto
  notes?: string;
}

interface SendRequest {
  recipientEmail?: string;
  recipientId?: string;
  currency: 'USD' | 'BTC' | 'ETH' | 'USDT';
  amount: number;
  notes?: string;
}

/**
 * Get authentication token from storage
 */
function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
}

/**
 * Make authenticated API request
 */
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const token = getAuthToken();
  
  if (!token) {
    throw new Error('Authentication required');
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || `API Error: ${response.statusText}`);
  }

  return data;
}

/**
 * Withdraw money
 */
export async function withdraw(data: WithdrawRequest): Promise<ApiResponse<any>> {
  try {
    // Validation
    if (!data.currency || !data.amount) {
      throw new Error('Currency and amount are required');
    }

    if (data.amount <= 0) {
      throw new Error('Amount must be greater than 0');
    }

    if (['BTC', 'ETH', 'USDT'].includes(data.currency) && !data.address) {
      throw new Error('Withdrawal address is required for crypto');
    }

    return await apiRequest('/api/dashboard/withdraw', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to withdraw',
    };
  }
}

/**
 * Send money to another user
 */
export async function sendMoney(data: SendRequest): Promise<ApiResponse<any>> {
  try {
    // Validation
    if (!data.currency || !data.amount) {
      throw new Error('Currency and amount are required');
    }

    if (!data.recipientEmail && !data.recipientId) {
      throw new Error('Recipient email or ID is required');
    }

    if (data.amount <= 0) {
      throw new Error('Amount must be greater than 0');
    }

    return await apiRequest('/api/dashboard/send', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to send money',
    };
  }
}

/**
 * Get withdrawal history
 */
export async function getWithdrawalHistory(
  page: number = 1,
  limit: number = 20
): Promise<ApiResponse<any>> {
  try {
    return await apiRequest(
      `/api/dashboard/withdraw/history?page=${page}&limit=${limit}`
    );
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch withdrawal history',
    };
  }
}

/**
 * Get dashboard data
 */
export async function getDashboardData(): Promise<ApiResponse<any>> {
  try {
    return await apiRequest('/api/dashboard/banking');
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch dashboard data',
    };
  }
}

/**
 * Get Web3 balance
 */
export async function getWeb3Balance(): Promise<ApiResponse<any>> {
  try {
    return await apiRequest('/api/dashboard/web3/balance');
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch Web3 balance',
    };
  }
}

/**
 * Get user profile (for internal permission checks only - role not displayed to users)
 */
export async function getUserProfile(): Promise<ApiResponse<any>> {
  try {
    return await apiRequest('/api/user/profile');
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch user profile',
    };
  }
}