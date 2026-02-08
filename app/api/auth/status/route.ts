import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
      return NextResponse.json({ state: 'signed_out' });
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('subscription_status')
      .eq('id', user.id)
      .single();

    const subscriptionStatus = profile?.subscription_status ?? 'none';
    const subscribed = subscriptionStatus === 'active' || subscriptionStatus === 'trialing';

    return NextResponse.json({
      state: subscribed ? 'active' : 'no_subscription',
      subscribed,
      email: user.email,
      userId: user.id,
    });
  } catch {
    return NextResponse.json({ state: 'signed_out' });
  }
}
