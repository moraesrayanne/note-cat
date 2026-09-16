import { supabase } from '@/lib/supabase';
import { DiaryEntry } from '@/types';

export async function fetchDiaryEntries(userId: string, limit = 30) {
  return supabase
    .from('diary_entries')
    .select('*')
    .eq('user_id', userId)
    .order('date', { ascending: false })
    .limit(limit);
}

export async function fetchDiaryEntryByDate(userId: string, date: string) {
  return supabase
    .from('diary_entries')
    .select('*')
    .eq('user_id', userId)
    .eq('date', date)
    .maybeSingle();
}

type UpsertPayload = Omit<DiaryEntry, 'id' | 'created_at' | 'updated_at'>;

export async function upsertDiaryEntry(entry: UpsertPayload) {
  return supabase
    .from('diary_entries')
    .upsert({ ...entry, updated_at: new Date().toISOString() }, { onConflict: 'user_id,date' })
    .select()
    .single();
}

export async function deleteDiaryEntry(id: string) {
  return supabase.from('diary_entries').delete().eq('id', id);
}
