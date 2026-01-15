/**
 * Comprehensive API Client
 * Covers ALL backend routes and endpoints
 * Production-ready with error handling and TypeScript types
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

// ============================================
// AUTHENTICATION
// ============================================

function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
}

// ============================================
// CORE API REQUEST FUNCTION
// ============================================

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const token = getAuthToken();
  
  if (!token && !endpoint.includes('/auth/login')) {
    throw new Error('Authentication required');
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || `API Error: ${response.statusText}`);
  }

  return data;
}

// ============================================
// DASHBOARD API (Already created)
// ============================================

export * from './dashboard';

// ============================================
// USER API
// ============================================

export const userApi = {
  getProfile: () => apiRequest('/api/user/profile'),
  updateProfile: (data: any) => apiRequest('/api/user/profile', { method: 'PUT', body: JSON.stringify(data) }),
  getSettings: () => apiRequest('/api/user/settings'),
  updateSettings: (data: any) => apiRequest('/api/user/settings', { method: 'PUT', body: JSON.stringify(data) }),
};

// ============================================
// TRANSACTIONS API
// ============================================

export const transactionsApi = {
  getAll: (page = 1, limit = 20) => apiRequest(`/api/transactions?page=${page}&limit=${limit}`),
  getById: (id: string) => apiRequest(`/api/transactions/${id}`),
  getBalance: (userId: string) => apiRequest(`/api/transactions/balance/${userId}`),
  create: (data: any) => apiRequest('/api/transactions', { method: 'POST', body: JSON.stringify(data) }),
};

// ============================================
// CRYPTO API
// ============================================

export const cryptoApi = {
  getBalance: () => apiRequest('/api/crypto/balance'),
  getWallets: () => apiRequest('/api/crypto/wallets'),
  deposit: (data: any) => apiRequest('/api/crypto/deposit', { method: 'POST', body: JSON.stringify(data) }),
  withdraw: (data: any) => apiRequest('/api/crypto/withdraw', { method: 'POST', body: JSON.stringify(data) }),
  getHistory: (page = 1, limit = 20) => apiRequest(`/api/crypto/history?page=${page}&limit=${limit}`),
  getPrices: () => apiRequest('/api/crypto/prices'),
};

// ============================================
// TOKENS API
// ============================================

export const tokensApi = {
  getBalance: (userId: string) => apiRequest(`/api/tokens/balance/${userId}`),
  transfer: (data: any) => apiRequest('/api/tokens/transfer', { method: 'POST', body: JSON.stringify(data) }),
  getHistory: (page = 1, limit = 20) => apiRequest(`/api/tokens/history?page=${page}&limit=${limit}`),
  getStats: () => apiRequest('/api/tokens/stats'),
};

// ============================================
// WITHDRAWALS API
// ============================================

export const withdrawalsApi = {
  create: (data: any) => apiRequest('/api/withdrawals/request', { method: 'POST', body: JSON.stringify(data) }),
  getMyRequests: (page = 1, limit = 20) => apiRequest(`/api/withdrawals/my-requests?page=${page}&limit=${limit}`),
  getById: (id: string) => apiRequest(`/api/withdrawals/${id}`),
  cancel: (id: string) => apiRequest(`/api/withdrawals/${id}/cancel`, { method: 'POST' }),
};

// ============================================
// DEBIT CARD API
// ============================================

export const debitCardApi = {
  getCards: () => apiRequest('/api/debit-card'),
  createCard: (data: any) => apiRequest('/api/debit-card', { method: 'POST', body: JSON.stringify(data) }),
  getCardById: (id: string) => apiRequest(`/api/debit-card/${id}`),
  activateCard: (id: string) => apiRequest(`/api/debit-card/${id}/activate`, { method: 'POST' }),
  deactivateCard: (id: string) => apiRequest(`/api/debit-card/${id}/deactivate`, { method: 'POST' }),
};

// ============================================
// MEDBEDS API
// ============================================

export const medbedsApi = {
  getBookings: (page = 1, limit = 20) => apiRequest(`/api/medbeds/bookings?page=${page}&limit=${limit}`),
  createBooking: (data: any) => apiRequest('/api/medbeds/bookings', { method: 'POST', body: JSON.stringify(data) }),
  getBookingById: (id: string) => apiRequest(`/api/medbeds/bookings/${id}`),
  cancelBooking: (id: string) => apiRequest(`/api/medbeds/bookings/${id}/cancel`, { method: 'POST' }),
};

// ============================================
// REWARDS API
// ============================================

export const rewardsApi = {
  getRewards: () => apiRequest('/api/rewards'),
  claimReward: (id: string) => apiRequest(`/api/rewards/${id}/claim`, { method: 'POST' }),
  getHistory: (page = 1, limit = 20) => apiRequest(`/api/rewards/history?page=${page}&limit=${limit}`),
};

// ============================================
// SUPPORT API
// ============================================

export const supportApi = {
  getTickets: (page = 1, limit = 20) => apiRequest(`/api/support/tickets?page=${page}&limit=${limit}`),
  createTicket: (data: any) => apiRequest('/api/support/tickets', { method: 'POST', body: JSON.stringify(data) }),
  getTicketById: (id: string) => apiRequest(`/api/support/tickets/${id}`),
  addMessage: (id: string, data: any) => apiRequest(`/api/support/tickets/${id}/messages`, { method: 'POST', body: JSON.stringify(data) }),
};

// ============================================
// ADMIN API
// ============================================

export const adminApi = {
  getStats: () => apiRequest('/api/admin/stats'),
  getUsers: (page = 1, limit = 20, filters?: any) => {
    const params = new URLSearchParams({ page: String(page), limit: String(limit), ...filters });
    return apiRequest(`/api/admin/users?${params}`);
  },
  getUserById: (id: string) => apiRequest(`/api/admin/users/${id}`),
  updateUser: (id: string, data: any) => apiRequest(`/api/admin/users/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  getTransactions: (page = 1, limit = 20) => apiRequest(`/api/admin/transactions?page=${page}&limit=${limit}`),
  approveWithdrawal: (id: string) => apiRequest(`/api/admin/withdrawals/${id}/approve`, { method: 'POST' }),
  rejectWithdrawal: (id: string, reason?: string) => apiRequest(`/api/admin/withdrawals/${id}/reject`, { method: 'POST', body: JSON.stringify({ reason }) }),
};

// ============================================
// AI API
// ============================================

export const aiApi = {
  sendCommand: (data: any) => apiRequest('/api/ai/command', { method: 'POST', body: JSON.stringify(data) }),
  getStatus: () => apiRequest('/api/ai-status'),
  getDiagrams: () => apiRequest('/api/ai-diagrams'),
  getMasterAIStatus: () => apiRequest('/api/master-ai/status'),
};

// ============================================
// WEB3 API
// ============================================

export const web3Api = {
  getNonce: (walletAddress: string) => apiRequest('/api/auth/web3/nonce', { method: 'POST', body: JSON.stringify({ walletAddress }) }),
  verify: (data: any) => apiRequest('/api/auth/web3/verify', { method: 'POST', body: JSON.stringify(data) }),
  getStatus: () => apiRequest('/api/auth/web3/status'),
  linkWallet: (data: any) => apiRequest('/api/auth/web3/link', { method: 'POST', body: JSON.stringify(data) }),
  unlinkWallet: () => apiRequest('/api/auth/web3/unlink', { method: 'POST' }),
};

// ============================================
// RPA API
// ============================================

export const rpaApi = {
  getWorkflows: () => apiRequest('/api/rpa/workflows'),
  createWorkflow: (data: any) => apiRequest('/api/rpa/workflows', { method: 'POST', body: JSON.stringify(data) }),
  executeWorkflow: (id: string) => apiRequest(`/api/rpa/workflows/${id}/execute`, { method: 'POST' }),
  getExecutions: (page = 1, limit = 20) => apiRequest(`/api/rpa/executions?page=${page}&limit=${limit}`),
};

// ============================================
// CHAT API
// ============================================

export const chatApi = {
  getMessages: (chatId: string, page = 1, limit = 50) => apiRequest(`/api/chat/${chatId}/messages?page=${page}&limit=${limit}`),
  sendMessage: (chatId: string, data: any) => apiRequest(`/api/chat/${chatId}/messages`, { method: 'POST', body: JSON.stringify(data) }),
  getChats: () => apiRequest('/api/chat'),
  createChat: (data: any) => apiRequest('/api/chat', { method: 'POST', body: JSON.stringify(data) }),
};

// ============================================
// NOTIFICATIONS API
// ============================================

export const notificationsApi = {
  getAll: (page = 1, limit = 20) => apiRequest(`/api/notifications?page=${page}&limit=${limit}`),
  markAsRead: (id: string) => apiRequest(`/api/notifications/${id}/read`, { method: 'PUT' }),
  markAllAsRead: () => apiRequest('/api/notifications/read-all', { method: 'PUT' }),
  getUnreadCount: () => apiRequest('/api/notifications/unread-count'),
};

// ============================================
// HEALTH CHECK
// ============================================

export const healthApi = {
  check: () => apiRequest('/api/health'),
};

// Export all APIs
export default {
  user: userApi,
  transactions: transactionsApi,
  crypto: cryptoApi,
  tokens: tokensApi,
  withdrawals: withdrawalsApi,
  debitCard: debitCardApi,
  medbeds: medbedsApi,
  rewards: rewardsApi,
  support: supportApi,
  admin: adminApi,
  ai: aiApi,
  web3: web3Api,
  rpa: rpaApi,
  chat: chatApi,
  notifications: notificationsApi,
  health: healthApi,
};
