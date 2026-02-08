'use client';

import { useAuth } from './AuthGuard';

export default function UserMenu() {
  const auth = useAuth();

  const handleSignOut = async () => {
    const res = await fetch('/api/auth/signout', { method: 'POST' });
    if (res.ok) window.location.reload();
  };

  const handlePortal = async () => {
    const response = await fetch('/api/stripe/portal', { method: 'POST' });
    const { url } = await response.json();
    if (url) window.location.href = url;
  };

  if (!auth?.email) return null;

  return (
    <div className="flex items-center gap-6 text-[8px] uppercase tracking-[0.25em] font-serif">
      <span className="text-gray-400 normal-case tracking-normal lowercase">{auth.email}</span>
      {auth.subscribed && (
        <button onClick={handlePortal} className="text-gray-400 hover:text-gray-600 transition-colors">
          account
        </button>
      )}
      <button onClick={handleSignOut} className="text-gray-400 hover:text-gray-600 transition-colors">
        sign out
      </button>
    </div>
  );
}
