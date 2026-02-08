'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import SignInPage from './SignInPage';

type AuthInfo = {
  email: string;
  userId: string;
  subscribed: boolean;
};

const AuthContext = createContext<AuthInfo | null>(null);

export function useAuth() {
  return useContext(AuthContext);
}

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<'loading' | 'signed_out' | 'signed_in'>('loading');
  const [authInfo, setAuthInfo] = useState<AuthInfo | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/auth/status');
        const data = await res.json();
        if (data.state === 'signed_out') {
          setState('signed_out');
        } else {
          setAuthInfo({ email: data.email, userId: data.userId, subscribed: data.subscribed });
          setState('signed_in');
        }
      } catch {
        setState('signed_out');
      }
    };

    checkAuth();
  }, []);

  if (state === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAF8]">
        <p className="text-[9px] text-gray-400 uppercase tracking-[0.25em] font-serif">loading...</p>
      </div>
    );
  }

  if (state === 'signed_out') return <SignInPage />;

  return <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>;
}
