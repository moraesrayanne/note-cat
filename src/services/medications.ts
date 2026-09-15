import { supabase } from '../lib/supabase';
import { Medication, MedicationLog } from '../types';

export async function fetchActiveMedications(userId: string) {
  const { data, error } = await supabase
    .from('medications')
    .select('*')
    .eq('user_id', userId)
    .eq('active', true)
    .order('time');

  return { data: (data ?? []) as Medication[], error };
}

export async function fetchTodayLogs(userId: string, date: string) {
  const { data, error } = await supabase
    .from('medication_logs')
    .select('*')
    .eq('user_id', userId)
    .eq('date', date);

  return { data: (data ?? []) as MedicationLog[], error };
}

export async function createMedicationLog(log: {
  medication_id: string;
  user_id: string;
  date: string;
  taken_at: string;
}) {
  return supabase.from('medication_logs').insert(log);
}

export async function deleteMedicationLog(logId: string) {
  return supabase.from('medication_logs').delete().eq('id', logId);
}

export async function fetchAllMedications(userId: string) {
  const { data, error } = await supabase
    .from('medications')
    .select('*')
    .eq('user_id', userId)
    .order('active', { ascending: false })
    .order('time');

  return { data: (data ?? []) as Medication[], error };
}

export async function deactivateMedication(medId: string) {
  return supabase.from('medications').update({ active: false }).eq('id', medId);
}

export async function saveMedication(
  data: {
    name: string;
    dose: string;
    time: string;
    user_id: string;
    active: boolean;
  },
  editingId?: string,
) {
  if (editingId) {
    return supabase
      .from('medications')
      .update(data)
      .eq('id', editingId)
      .select()
      .single();
  }
  return supabase.from('medications').insert(data).select().single();
}

export async function fetchMedicationLogs(userId: string, sinceDate: string) {
  const { data, error } = await supabase
    .from('medication_logs')
    .select('*, medication:medications(*)')
    .eq('user_id', userId)
    .gte('date', sinceDate)
    .order('date', { ascending: false })
    .order('taken_at', { ascending: true });

  return { data: (data ?? []) as MedicationLog[], error };
}
