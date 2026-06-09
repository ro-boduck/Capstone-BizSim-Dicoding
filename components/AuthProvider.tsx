'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabaseClient';
import { User, Session } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  token: string | null;
  loading: boolean;
  isDemo: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  // Local storage simulations for demo fallback
  demoSimulations: any[];
  addDemoSimulation: (sim: any) => void;
  removeDemoSimulation: (id: string) => void;
  // Local storage monthly logs for demo fallback
  demoMonthlyLogs: any[];
  addDemoMonthlyLog: (log: any) => void;
  removeDemoMonthlyLog: (id: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDemo, setIsDemo] = useState(!isSupabaseConfigured);
  const [demoSimulations, setDemoSimulations] = useState<any[]>([]);
  const [demoMonthlyLogs, setDemoMonthlyLogs] = useState<any[]>([]);
  const router = useRouter();

  // Load demo simulations and logs on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedSims = localStorage.getItem('bizsim_simulations');
      if (storedSims) {
        try {
          setDemoSimulations(JSON.parse(storedSims));
        } catch (e) {
          console.error('Failed to parse local simulations', e);
        }
      }

      const storedLogs = localStorage.getItem('bizsim_monthly_logs');
      if (storedLogs) {
        try {
          setDemoMonthlyLogs(JSON.parse(storedLogs));
        } catch (e) {
          console.error('Failed to parse local monthly logs', e);
        }
      }
    }
  }, []);

  // Sync demo simulations to localStorage
  const addDemoSimulation = (sim: any) => {
    const updated = [sim, ...demoSimulations];
    setDemoSimulations(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('bizsim_simulations', JSON.stringify(updated));
    }
  };

  const removeDemoSimulation = (id: string) => {
    const updated = demoSimulations.filter(s => s.id !== id);
    setDemoSimulations(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('bizsim_simulations', JSON.stringify(updated));
    }
  };

  // Sync demo monthly logs to localStorage
  const addDemoMonthlyLog = (log: any) => {
    const updated = [...demoMonthlyLogs, log].sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
    setDemoMonthlyLogs(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('bizsim_monthly_logs', JSON.stringify(updated));
    }
  };

  const removeDemoMonthlyLog = (id: string) => {
    const updated = demoMonthlyLogs.filter(s => s.id !== id);
    setDemoMonthlyLogs(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('bizsim_monthly_logs', JSON.stringify(updated));
    }
  };

  useEffect(() => {
    if (!isSupabaseConfigured) {
      // Setup demo user session
      const storedUser = localStorage.getItem('bizsim_demo_user');
      if (storedUser) {
        try {
          const u = JSON.parse(storedUser);
          setUser(u);
          setToken('mock-demo-jwt-token');
        } catch (e) {
          console.error(e);
        }
      }
      setIsDemo(true);
      setLoading(false);
      return;
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setToken(session?.access_token ?? null);
      setIsDemo(false);
      setLoading(false);
    });

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setToken(session?.access_token ?? null);
      setIsDemo(false);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    if (isDemo) {
      // Simulate success and store mock user session
      const mockUser = {
        id: 'demo-user-id',
        email,
        aud: 'authenticated',
        role: 'authenticated',
        created_at: new Date().toISOString(),
        app_metadata: {},
        user_metadata: { business_name: 'UMKM Mandiri' },
      } as any as User;
      setUser(mockUser);
      setToken('mock-demo-jwt-token');
      localStorage.setItem('bizsim_demo_user', JSON.stringify(mockUser));
      return { success: true };
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) return { success: false, error: error.message };
      return { success: true };
    } catch (e: any) {
      return { success: false, error: e.message || 'Login failed' };
    }
  };

  const register = async (email: string, password: string) => {
    if (isDemo) {
      // Simulate success
      const mockUser = {
        id: 'demo-user-id',
        email,
        aud: 'authenticated',
        role: 'authenticated',
        created_at: new Date().toISOString(),
        app_metadata: {},
        user_metadata: { business_name: 'UMKM Mandiri' },
      } as any as User;
      setUser(mockUser);
      setToken('mock-demo-jwt-token');
      localStorage.setItem('bizsim_demo_user', JSON.stringify(mockUser));
      return { success: true };
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            business_name: 'UMKM Mandiri',
          }
        }
      });
      if (error) return { success: false, error: error.message };
      return { success: true };
    } catch (e: any) {
      return { success: false, error: e.message || 'Registration failed' };
    }
  };

  const logout = async () => {
    if (isDemo) {
      setUser(null);
      setToken(null);
      localStorage.removeItem('bizsim_demo_user');
      router.push('/');
      return;
    }

    await supabase.auth.signOut();
    router.push('/');
  };

  return (
    <AuthContext.Provider value={{
      user,
      session,
      token,
      loading,
      isDemo,
      login,
      register,
      logout,
      demoSimulations,
      addDemoSimulation,
      removeDemoSimulation,
      demoMonthlyLogs,
      addDemoMonthlyLog,
      removeDemoMonthlyLog,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
