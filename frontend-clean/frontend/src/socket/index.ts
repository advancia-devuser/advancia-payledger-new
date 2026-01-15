/**
 * Centralized Socket.IO Connection Manager
 * Manages ALL real-time connections for the application
 * Production-ready with auto-reconnection and error handling
 */

import { io, Socket } from 'socket.io-client';

const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

// Socket instances for different namespaces
const sockets: Map<string, Socket> = new Map();

// Event listeners registry
const listeners: Map<string, Map<string, Function[]>> = new Map();

/**
 * Get authentication token
 */
function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
}

/**
 * Connect to a Socket.IO namespace
 */
function connectNamespace(namespace: string): Socket | null {
  // Return existing connection if available
  if (sockets.has(namespace) && sockets.get(namespace)?.connected) {
    return sockets.get(namespace)!;
  }

  const token = getAuthToken();
  if (!token) {
    console.warn(`[Socket] No auth token found, cannot connect to ${namespace}`);
    return null;
  }

  const socket = io(`${SOCKET_URL}${namespace}`, {
    auth: { token },
    transports: ['websocket', 'polling'],
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: 5,
    timeout: 20000,
  });

  socket.on('connect', () => {
    console.log(`[Socket] Connected to ${namespace}`);
  });

  socket.on('disconnect', (reason) => {
    console.log(`[Socket] Disconnected from ${namespace}:`, reason);
  });

  socket.on('connect_error', (error) => {
    console.error(`[Socket] Connection error for ${namespace}:`, error);
  });

  socket.on('error', (error) => {
    console.error(`[Socket] Error on ${namespace}:`, error);
  });

  sockets.set(namespace, socket);
  return socket;
}

/**
 * Disconnect from a namespace
 */
export function disconnectNamespace(namespace: string) {
  const socket = sockets.get(namespace);
  if (socket) {
    socket.disconnect();
    sockets.delete(namespace);
    listeners.delete(namespace);
  }
}

/**
 * Disconnect all namespaces
 */
export function disconnectAll() {
  sockets.forEach((socket, namespace) => {
    socket.disconnect();
  });
  sockets.clear();
  listeners.clear();
}

/**
 * Listen to an event on a namespace
 */
export function on(namespace: string, event: string, callback: Function) {
  const socket = connectNamespace(namespace);
  if (!socket) return () => {};

  socket.on(event, callback);

  // Register listener for cleanup
  if (!listeners.has(namespace)) {
    listeners.set(namespace, new Map());
  }
  const namespaceListeners = listeners.get(namespace)!;
  if (!namespaceListeners.has(event)) {
    namespaceListeners.set(event, []);
  }
  namespaceListeners.get(event)!.push(callback);

  // Return unsubscribe function
  return () => {
    socket.off(event, callback);
    const eventListeners = namespaceListeners.get(event);
    if (eventListeners) {
      const index = eventListeners.indexOf(callback);
      if (index > -1) {
        eventListeners.splice(index, 1);
      }
    }
  };
}

/**
 * Emit an event on a namespace
 */
export function emit(namespace: string, event: string, data?: any) {
  const socket = connectNamespace(namespace);
  if (!socket) {
    console.warn(`[Socket] Cannot emit to ${namespace}: not connected`);
    return false;
  }
  socket.emit(event, data);
  return true;
}

/**
 * Get socket instance for a namespace
 */
export function getSocket(namespace: string): Socket | null {
  return sockets.get(namespace) || null;
}

// ============================================
// NAMESPACE-SPECIFIC HELPERS
// ============================================

/**
 * Dashboard namespace
 */
export const dashboardSocket = {
  connect: () => connectNamespace('/dashboard'),
  onUpdate: (callback: (data: any) => void) => on('/dashboard', 'dashboard:update', callback),
  onWeb3BalanceUpdate: (callback: (data: any) => void) => on('/dashboard', 'web3:balance-update', callback),
  disconnect: () => disconnectNamespace('/dashboard'),
};

/**
 * Transactions namespace
 */
export const transactionsSocket = {
  connect: () => connectNamespace('/transactions'),
  onTransactionCreated: (callback: (data: any) => void) => on('/transactions', 'transaction-created', callback),
  onBalanceUpdated: (callback: (data: any) => void) => on('/transactions', 'balance-updated', callback),
  disconnect: () => disconnectNamespace('/transactions'),
};

/**
 * Crypto namespace
 */
export const cryptoSocket = {
  connect: () => connectNamespace('/crypto'),
  onDeposit: (callback: (data: any) => void) => on('/crypto', 'crypto:deposit', callback),
  onWithdrawal: (callback: (data: any) => void) => on('/crypto', 'crypto:withdrawal', callback),
  onBalanceUpdate: (callback: (data: any) => void) => on('/crypto', 'crypto:balance-update', callback),
  disconnect: () => disconnectNamespace('/crypto'),
};

/**
 * Tokens namespace
 */
export const tokensSocket = {
  connect: () => connectNamespace('/tokens'),
  onTransfer: (callback: (data: any) => void) => on('/tokens', 'token:transfer', callback),
  onBalanceUpdate: (callback: (data: any) => void) => on('/tokens', 'token:balance-update', callback),
  disconnect: () => disconnectNamespace('/tokens'),
};

/**
 * Notifications namespace
 */
export const notificationsSocket = {
  connect: () => connectNamespace('/notifications'),
  onNotification: (callback: (data: any) => void) => on('/notifications', 'notification', callback),
  disconnect: () => disconnectNamespace('/notifications'),
};

/**
 * Chat namespace
 */
export const chatSocket = {
  connect: () => connectNamespace('/chat'),
  onMessage: (callback: (data: any) => void) => on('/chat', 'message', callback),
  onTyping: (callback: (data: any) => void) => on('/chat', 'typing', callback),
  sendMessage: (data: any) => emit('/chat', 'message', data),
  disconnect: () => disconnectNamespace('/chat'),
};

/**
 * Support namespace
 */
export const supportSocket = {
  connect: () => connectNamespace('/support'),
  onTicketUpdate: (callback: (data: any) => void) => on('/support', 'ticket:update', callback),
  onMessage: (callback: (data: any) => void) => on('/support', 'message', callback),
  disconnect: () => disconnectNamespace('/support'),
};

/**
 * Admin namespace
 */
export const adminSocket = {
  connect: () => connectNamespace('/admin'),
  onUserUpdate: (callback: (data: any) => void) => on('/admin', 'user:update', callback),
  onWithdrawalRequest: (callback: (data: any) => void) => on('/admin', 'new-withdrawal-request', callback),
  onStatsUpdate: (callback: (data: any) => void) => on('/admin', 'stats:update', callback),
  disconnect: () => disconnectNamespace('/admin'),
};

/**
 * AI namespace
 */
export const aiSocket = {
  connect: () => connectNamespace('/ai-dashboard'),
  onAgentUpdate: (callback: (data: any) => void) => on('/ai-dashboard', 'agents:update', callback),
  onTaskUpdate: (callback: (data: any) => void) => on('/ai-dashboard', 'task:update', callback),
  disconnect: () => disconnectNamespace('/ai-dashboard'),
};

/**
 * Rewards namespace
 */
export const rewardsSocket = {
  connect: () => connectNamespace('/rewards'),
  onRewardUpdate: (callback: (data: any) => void) => on('/rewards', 'reward:update', callback),
  onClaimUpdate: (callback: (data: any) => void) => on('/rewards', 'claim:update', callback),
  disconnect: () => disconnectNamespace('/rewards'),
};

/**
 * RPA namespace
 */
export const rpaSocket = {
  connect: () => connectNamespace('/rpa'),
  onWorkflowUpdate: (callback: (data: any) => void) => on('/rpa', 'workflow:update', callback),
  onExecutionUpdate: (callback: (data: any) => void) => on('/rpa', 'execution:update', callback),
  disconnect: () => disconnectNamespace('/rpa'),
};

/**
 * Debit Card namespace
 */
export const debitCardSocket = {
  connect: () => connectNamespace('/debit-card'),
  onCardUpdate: (callback: (data: any) => void) => on('/debit-card', 'card:update', callback),
  onTransaction: (callback: (data: any) => void) => on('/debit-card', 'transaction', callback),
  disconnect: () => disconnectNamespace('/debit-card'),
};

/**
 * Medbeds namespace
 */
export const medbedsSocket = {
  connect: () => connectNamespace('/medbeds'),
  onBookingUpdate: (callback: (data: any) => void) => on('/medbeds', 'booking:update', callback),
  disconnect: () => disconnectNamespace('/medbeds'),
};

// ============================================
// AUTO-CONNECT ALL NAMESPACES
// ============================================

/**
 * Connect to all commonly used namespaces
 */
export function connectAll() {
  dashboardSocket.connect();
  transactionsSocket.connect();
  cryptoSocket.connect();
  tokensSocket.connect();
  notificationsSocket.connect();
  chatSocket.connect();
  supportSocket.connect();
}

/**
 * Disconnect all namespaces
 */
export function disconnectAllNamespaces() {
  disconnectAll();
}

// Export default connection manager
export default {
  connect: connectNamespace,
  disconnect: disconnectNamespace,
  disconnectAll,
  on,
  emit,
  getSocket,
  // Namespace helpers
  dashboard: dashboardSocket,
  transactions: transactionsSocket,
  crypto: cryptoSocket,
  tokens: tokensSocket,
  notifications: notificationsSocket,
  chat: chatSocket,
  support: supportSocket,
  admin: adminSocket,
  ai: aiSocket,
  rewards: rewardsSocket,
  rpa: rpaSocket,
  debitCard: debitCardSocket,
  medbeds: medbedsSocket,
  // Auto-connect
  connectAll,
  disconnectAll: disconnectAllNamespaces,
};
