'use client';

import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { authApi } from '../lib/api';
import { isSupabaseFrontendEnabled, supabase } from '../lib/supabaseClient';

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
  const useSupabase = isSupabaseFrontendEnabled();

  // Check if user is logged in on mount
  useEffect(() => {
    refreshUser();

    if (useSupabase && supabase) {
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((_event, session) => {
        const u = session?.user;
        if (!u) {
          setUser(null);
          return;
        }
        setUser({
          id: u.id,
          email: u.email || '',
          firstName: (u.user_metadata as any)?.firstName,
          lastName: (u.user_metadata as any)?.lastName,
        });
      });

      return () => {
        subscription.unsubscribe();
      };
    }
  }, []);

  async function refreshUser() {
    setIsLoading(true);

    if (useSupabase && supabase) {
      const { data } = await supabase.auth.getSession();
      const u = data.session?.user;
      if (u) {
        setUser({
          id: u.id,
          email: u.email || '',
          firstName: (u.user_metadata as any)?.firstName,
          lastName: (u.user_metadata as any)?.lastName,
        });
      } else {
        setUser(null);
      }
      setIsLoading(false);
      return;
    }

    const response = await authApi.getCurrentUser();
    if (response.data?.user) {
      setUser(response.data.user);
    } else {
      setUser(null);
    }
    setIsLoading(false);
  }

  async function login(email: string, password: string) {
    if (useSupabase && supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) return { success: false, error: error.message };
      const u = data.user;
      if (!u) return { success: false, error: 'Login failed' };
      setUser({
        id: u.id,
        email: u.email || email,
        firstName: (u.user_metadata as any)?.firstName,
        lastName: (u.user_metadata as any)?.lastName,
      });
      return { success: true };
    }

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
    if (useSupabase && supabase) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { firstName, lastName } },
      });
      if (error) return { success: false, error: error.message };
      if (data.user) {
        setUser({
          id: data.user.id,
          email: data.user.email || email,
          firstName,
          lastName,
        });
      }
      return { success: true };
    }

    const response = await authApi.register(email, password, firstName, lastName);
    if (response.data?.user) {
      setUser(response.data.user);
      return { success: true };
    }
    return { success: false, error: response.error || 'Registration failed' };
  }

  function logout() {
    if (useSupabase && supabase) {
      supabase.auth.signOut().catch(() => {});
      setUser(null);
      return;
    }

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
