export interface Medication {
  id: string;
  user_id: string;
  name: string;
  dose: string;
  time: string;
  active: boolean;
  created_at: string;
}

export interface MedicationLog {
  id: string;
  medication_id: string;
  user_id: string;
  date: string;
  taken_at: string;
  created_at: string;
  medication?: Medication;
}

export interface DiaryEntry {
  id: string;
  user_id: string;
  date: string;
  feeding: string | null;
  used_litter_box: boolean | null;
  energy_level: number | null;
  blood_pressure: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}
