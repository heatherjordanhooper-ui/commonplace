import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const supabaseAdmin = createClient(
  supabaseUrl,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

export interface Item {
  id: string;
  user_id: string;
  type: 'image' | 'link';
  source_url?: string;
  image_url?: string;
  thumbnail_url?: string;
  title?: string;
  metadata: Record<string, any>;
  reaction?: 'keep' | 'neutral' | 'not_it';
  analysis: {
    colors?: string[];
    dominant_color?: string;
    tags?: string[];
    mood?: string[];
  };
  created_at: string;
}

export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

export async function saveItem(itemData: Partial<Item>) {
  const user = await getCurrentUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('items')
    .insert({
      user_id: user.id,
      ...itemData
    })
    .select()
    .single();

  if (error) throw error;
  return data as Item;
}

export async function getItems(userId: string, startDate?: Date, endDate?: Date) {
  let query = supabase
    .from('items')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (startDate) {
    query = query.gte('created_at', startDate.toISOString());
  }
  if (endDate) {
    query = query.lte('created_at', endDate.toISOString());
  }

  const { data, error } = await query;
  if (error) throw error;
  return data as Item[];
}