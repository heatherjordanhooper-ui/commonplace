'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function SubscribePage() {
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/stripe/checkout', { method: 'POST' });
      const { url, error } = await response.json();
      if (error) throw new Error(error);
      if (url) window.location.href = url;
    } catch (error) {
      console.error('Subscription error:', error);
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.reload();
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#FAFAF8]">
      <div className="text-center max-w-md">
        <h1 className="text-xs tracking-tight font-light font-serif mb-16">commonplace</h1>
        <p className="text-[9px] text-gray-400 uppercase tracking-[0.25em] font-serif mb-4">
          monthly subscription
        </p>
        <p className="text-[9px] text-gray-500 font-serif mb-12 leading-relaxed">
          unlimited ai-generated lookbooks, palette analysis, and aesthetic curation
        </p>
        <button
          onClick={handleSubscribe}
          disabled={loading}
          className="text-[8px] uppercase tracking-[0.25em] px-8 py-2.5 bg-black text-white hover:bg-gray-800 disabled:opacity-40 transition-all font-serif mb-8"
        >
          {loading ? 'redirecting...' : 'subscribe'}
        </button>
        <div>
          <button
            onClick={handleSignOut}
            className="text-[8px] text-gray-400 uppercase tracking-[0.25em] hover:text-gray-600 transition-colors font-serif"
          >
            sign out
          </button>
        </div>
      </div>
    </div>
  );
}
