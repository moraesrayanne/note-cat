import { useCallback, useState } from 'react';
import { Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import { useAuth } from '@/contexts/AuthContext';
import { Medication, MedicationLog } from '@/types';
import { syncAllNotifications } from '@/lib/notifications';
import {
  fetchActiveMedications,
  fetchTodayLogs,
  createMedicationLog,
  deleteMedicationLog,
} from '@/services/medications';
import { getTodayDate } from '@/utils/date';

export interface TodayMed {
  medication: Medication;
  log: MedicationLog | null;
}

export function useTodayMeds() {
  const { user } = useAuth();
  const [meds, setMeds] = useState<TodayMed[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [togglingIds, setTogglingIds] = useState<Set<string>>(new Set());

  const loadToday = useCallback(async () => {
    if (!user) return;
    const today = getTodayDate();

    const { data: medications } = await fetchActiveMedications(user.id);
    const { data: logs } = await fetchTodayLogs(user.id, today);

    setMeds(
      medications.map((med) => ({
        medication: med,
        log: logs.find((l) => l.medication_id === med.id) ?? null,
      }))
    );
    setLoading(false);
    syncAllNotifications(medications);
  }, [user]);

  useFocusEffect(
    useCallback(() => {
      loadToday();
    }, [loadToday])
  );

  const toggleMed = async (item: TodayMed) => {
    if (!user) return;
    const medId = item.medication.id;

    if (togglingIds.has(medId)) return;

    const today = getTodayDate();
    const wasTaken = !!item.log;

    setTogglingIds((prev) => new Set(prev).add(medId));

    setMeds((prev) =>
      prev.map((m) => {
        if (m.medication.id !== medId) return m;
        if (wasTaken) return { ...m, log: null };
        return {
          ...m,
          log: {
            id: 'optimistic-' + medId,
            medication_id: medId,
            user_id: user.id,
            date: today,
            taken_at: new Date().toISOString(),
          } as MedicationLog,
        };
      })
    );

    try {
      if (wasTaken) {
        const { error } = await deleteMedicationLog(item.log!.id);
        if (error) throw error;
      } else {
        const { error } = await createMedicationLog({
          medication_id: medId,
          user_id: user.id,
          date: today,
          taken_at: new Date().toISOString(),
        });
        if (error) throw error;
      }
      await loadToday();
    } catch {
      await loadToday();
      Alert.alert('Erro', 'Não foi possível atualizar. Tente novamente.');
    }

    setTogglingIds((prev) => {
      const next = new Set(prev);
      next.delete(medId);
      return next;
    });
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadToday();
    setRefreshing(false);
  };

  const pending = meds.filter((m) => !m.log);
  const taken = meds.filter((m) => m.log);
  const pct = meds.length > 0 ? Math.round((taken.length / meds.length) * 100) : 0;

  return { meds, loading, refreshing, toggleMed, onRefresh, pending, taken, pct };
}
