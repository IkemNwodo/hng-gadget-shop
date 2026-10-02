import React, { createContext, useContext, useEffect, useState } from 'react';
import type { User, Session } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured, signInWithGoogle as supabaseGoogleSignIn, signOut as supabaseSignOut } from '../lib/supabase';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isConfigured: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  simulateGoogleLogin: (email?: string, name?: string) => void;
  isDemoUser: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isDemoUser, setIsDemoUser] = useState<boolean>(false);

  useEffect(() => {
    // Check if demo user was saved in localStorage
    const savedDemo = localStorage.getItem('demo_google_user');
    if (savedDemo) {
      try {
        const parsed = JSON.parse(savedDemo);
        setUser(parsed);
        setIsDemoUser(true);
        setLoading(false);
        return;
      } catch (e) {
        localStorage.removeItem('demo_google_user');
      }
    }

    if (!supabase || !isSupabaseConfigured) {
      setLoading(false);
      return;
    }

    // Get current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen to auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        setIsDemoUser(false);
        localStorage.removeItem('demo_google_user');
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signInWithGoogle = async () => {
    if (!isSupabaseConfigured) {
      throw new Error('Supabase credentials are not configured. Please see the setup guide.');
    }
    await supabaseGoogleSignIn();
  };

  const simulateGoogleLogin = (email = 'alex.developer@gmail.com', name = 'Alex Morgan') => {
    const mockUser: any = {
      id: 'demo-google-user-123456',
      email: email,
      user_metadata: {
        full_name: name,
        avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        email: email,
      },
      app_metadata: {
        provider: 'google',
      },
      aud: 'authenticated',
      created_at: new Date().toISOString(),
    };
    setUser(mockUser);
    setIsDemoUser(true);
    localStorage.setItem('demo_google_user', JSON.stringify(mockUser));
  };

  const signOut = async () => {
    if (isDemoUser) {
      setUser(null);
      setIsDemoUser(false);
      localStorage.removeItem('demo_google_user');
      return;
    }

    if (supabase) {
      await supabaseSignOut();
      setUser(null);
      setSession(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        isConfigured: isSupabaseConfigured,
        signInWithGoogle,
        signOut,
        simulateGoogleLogin,
        isDemoUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
