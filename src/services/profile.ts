import { supabase } from '@/lib/supabase';

export async function fetchCatName(userId: string): Promise<string | null> {
  const { data } = await supabase
    .from('profiles')
    .select('cat_name')
    .eq('user_id', userId)
    .single();

  return data?.cat_name ?? null;
}

export async function saveProfile(userId: string, catName: string) {
  const { data: existing } = await supabase
    .from('profiles')
    .select('user_id')
    .eq('user_id', userId)
    .single();

  if (existing) {
    return supabase
      .from('profiles')
      .update({ user_id: userId, cat_name: catName })
      .eq('user_id', userId);
  }
  return supabase.from('profiles').insert({ user_id: userId, cat_name: catName });
}
