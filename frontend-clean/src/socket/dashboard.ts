/**
 * Dashboard Socket.IO Client
 * Real-time updates for dashboard data
 */

import { io, Socket } from 'socket.io-client';

const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

let socket: Socket | null = null;

/**
 * Get authentication token
 */
function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
}

/**
 * Connect to dashboard Socket.IO namespace
 */
export function connectDashboardSocket() {
  if (socket?.connected) {
    return socket;
  }

  const token = getAuthToken();
  if (!token) {
    console.warn('No auth token found, cannot connect to dashboard socket');
    return null;
  }

  socket = io(`${SOCKET_URL}/dashboard`, {
    auth: {
      token,
    },
    transports: ['websocket', 'polling'],
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionAttempts: 5,
  });

  socket.on('connect', () => {
    console.log('[Dashboard Socket] Connected');
  });

  socket.on('disconnect', () => {
    console.log('[Dashboard Socket] Disconnected');
  });

  socket.on('connect_error', (error) => {
    console.error('[Dashboard Socket] Connection error:', error);
  });

  return socket;
}

/**
 * Disconnect dashboard socket
 */
export function disconnectDashboardSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}

/**
 * Listen for dashboard updates
 */
export function onDashboardUpdate(callback: (data: any) => void) {
  const s = connectDashboardSocket();
  if (!s) return () => {};

  s.on('dashboard:update', callback);

  return () => {
    s.off('dashboard:update', callback);
  };
}

/**
 * Listen for Web3 balance updates
 */
export function onWeb3BalanceUpdate(callback: (data: any) => void) {
  const s = connectDashboardSocket();
  if (!s) return () => {};

  s.on('web3:balance-update', callback);

  return () => {
    s.off('web3:balance-update', callback);
  };
}

/**
 * Get current socket instance
 */
export function getDashboardSocket(): Socket | null {
  return socket;
}
