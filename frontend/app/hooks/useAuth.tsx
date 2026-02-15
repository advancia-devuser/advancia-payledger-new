'use client';

import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { authApi, clearToken } from '../lib/api';

interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Auth Provider Component
 * Wrap your app with this to enable authentication
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is logged in on mount
  useEffect(() => {
    refreshUser();
  }, []);

  async function refreshUser() {
    setIsLoading(true);
    const response = await authApi.getCurrentUser();
    if (response.data?.user) {
      setUser(response.data.user);
    } else {
      setUser(null);
    }
    setIsLoading(false);
  }

  async function login(email: string, password: string) {
    const response = await authApi.login(email, password);
    if (response.data?.user) {
      setUser(response.data.user);
      return { success: true };
    }
    return { success: false, error: response.error || 'Login failed' };
  }

  async function register(
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ) {
    const response = await authApi.register(email, password, firstName, lastName);
    if (response.data?.user) {
      setUser(response.data.user);
      return { success: true };
    }
    return { success: false, error: response.error || 'Registration failed' };
  }

  function logout() {
    authApi.logout();
    setUser(null);
  }

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Hook to use authentication
 * 
 * @example
 * const { user, isAuthenticated, login, logout } = useAuth();
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
