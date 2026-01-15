/**
 * Connection Manager Component
 * Handles all real-time connections and API state
 * Use this at the root of your app for global connection management
 */

'use client';

import React, { useEffect, useState, createContext, useContext } from 'react';
import socketManager, { connectAll, disconnectAll } from '../socket';
import { healthApi } from '../api';

interface ConnectionState {
  connected: boolean;
  namespaces: string[];
  error: string | null;
}

interface ConnectionContextType {
  state: ConnectionState;
  reconnect: () => void;
  disconnect: () => void;
}

const ConnectionContext = createContext<ConnectionContextType | null>(null);

export function useConnection() {
  const context = useContext(ConnectionContext);
  if (!context) {
    throw new Error('useConnection must be used within ConnectionProvider');
  }
  return context;
}

interface ConnectionProviderProps {
  children: React.ReactNode;
  autoConnect?: boolean;
}

export function ConnectionProvider({
  children,
  autoConnect = true,
}: ConnectionProviderProps) {
  const [state, setState] = useState<ConnectionState>({
    connected: false,
    namespaces: [],
    error: null,
  });

  useEffect(() => {
    if (!autoConnect) return;

    // Check API health first
    healthApi
      .check()
      .then(() => {
        // Connect all namespaces
        connectAll();
        setState({
          connected: true,
          namespaces: ['dashboard', 'transactions', 'crypto', 'tokens', 'notifications'],
          error: null,
        });
      })
      .catch((error) => {
        setState({
          connected: false,
          namespaces: [],
          error: error.message || 'Failed to connect',
        });
      });

    // Cleanup on unmount
    return () => {
      disconnectAll();
    };
  }, [autoConnect]);

  const reconnect = () => {
    disconnectAll();
    setTimeout(() => {
      connectAll();
      setState((prev) => ({ ...prev, connected: true, error: null }));
    }, 1000);
  };

  const disconnect = () => {
    disconnectAll();
    setState((prev) => ({ ...prev, connected: false, namespaces: [] }));
  };

  return (
    <ConnectionContext.Provider value={{ state, reconnect, disconnect }}>
      {children}
      {/* Connection status indicator (optional) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 right-4 bg-black bg-opacity-75 text-white text-xs p-2 rounded">
          {state.connected ? '🟢 Connected' : '🔴 Disconnected'}
          {state.error && <div className="text-red-400">{state.error}</div>}
        </div>
      )}
    </ConnectionContext.Provider>
  );
}

/**
 * Hook to use specific socket namespace
 */
export function useSocket(namespace: string) {
  const [connected, setConnected] = useState(false);
  const socket = socketManager.getSocket(namespace);

  useEffect(() => {
    if (socket) {
      setConnected(socket.connected);
      socket.on('connect', () => setConnected(true));
      socket.on('disconnect', () => setConnected(false));
    }
  }, [socket, namespace]);

  return {
    socket,
    connected,
    emit: (event: string, data?: any) => socketManager.emit(namespace, event, data),
    on: (event: string, callback: Function) => socketManager.on(namespace, event, callback),
  };
}
