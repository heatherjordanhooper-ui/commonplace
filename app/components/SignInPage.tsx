'use client';

import { createClient } from '@/lib/supabase/client';

export default function SignInPage() {
  const handleSignIn = async () => {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#FAFAF8]">
      <div className="text-center">
        <h1 className="text-xs tracking-tight font-light font-serif mb-16">commonplace</h1>
        <p className="text-[9px] text-gray-400 uppercase tracking-[0.25em] font-serif mb-12">
          an ai-powered aesthetic lookbook
        </p>
        <button
          onClick={handleSignIn}
          className="text-[8px] uppercase tracking-[0.25em] px-8 py-2.5 bg-black text-white hover:bg-gray-800 transition-all font-serif"
        >
          sign in with google
        </button>
      </div>
    </div>
  );
}
