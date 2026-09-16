import React, { useCallback, useMemo, useState } from 'react';
import { View, Text, FlatList } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';

import { useAuth } from '@/contexts/AuthContext';
import { ScreenHeader } from '@/components/ScreenHeader';
import { DateStrip, DotData } from '@/components/DateStrip';
import { MedicationLog } from '@/types';
import { ListSkeleton } from '@/components/Skeleton';
import { fetchMedicationLogs, fetchActiveMedications } from '@/services/medications';
import {
  calcMaxHistoryDays,
  formatDateLabel,
  formatTimeFromISO,
  toDateStr,
  getTodayDate,
} from '@/utils/date';
import { styles } from './styles';

const INITIAL_DAYS = 10;

export default function HistoryScreen() {
  const { user } = useAuth();
  const insets = useSafeAreaInsets();
  const [allLogs, setAllLogs] = useState<MedicationLog[]>([]);
  const [totalMeds, setTotalMeds] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(getTodayDate);

  const loadInitialHistory = useCallback(async () => {
    if (!user) return;

    const since = new Date();
    since.setDate(since.getDate() - INITIAL_DAYS);

    const [{ data: logs }, { data: meds }] = await Promise.all([
      fetchMedicationLogs(user.id, toDateStr(since)),
      fetchActiveMedications(user.id),
    ]);

    setAllLogs(logs);
    setTotalMeds(meds.length);
    setLoading(false);
  }, [user]);

  useFocusEffect(
    useCallback(() => {
      loadInitialHistory();
    }, [loadInitialHistory]),
  );

  const handleLoadMoreDays = useCallback(
    async (fromDate: string) => {
      if (!user) return;
      const { data } = await fetchMedicationLogs(user.id, fromDate);
      setAllLogs((prev) => {
        const existingIds = new Set(prev.map((l) => l.id));
        const newLogs = data.filter((l) => !existingIds.has(l.id));
        return [...prev, ...newLogs];
      });
    },
    [user],
  );

  const maxDays = useMemo(
    () => (user?.created_at ? calcMaxHistoryDays(user.created_at) : INITIAL_DAYS),
    [user?.created_at],
  );

  const dotMap = useMemo<Record<string, DotData>>(() => {
    if (totalMeds === 0) return {};
    const map: Record<string, DotData> = {};
    for (const log of allLogs) {
      if (!map[log.date]) map[log.date] = { taken: 0, total: totalMeds };
      map[log.date].taken++;
    }
    return map;
  }, [allLogs, totalMeds]);

  const selectedLogs = useMemo(
    () => allLogs.filter((log) => log.date === selectedDate),
    [allLogs, selectedDate],
  );

  const selectedLabel = useMemo(() => formatDateLabel(selectedDate), [selectedDate]);

  const renderItem = ({ item }: { item: MedicationLog }) => (
    <View style={styles.logItem}>
      <View style={styles.checkIcon}>
        <Feather name="check" size={16} color="#4CAF50" />
      </View>
      <View style={styles.logContent}>
        <Text style={styles.logMed}>{item.medication?.name ?? 'Medicamento removido'}</Text>
        <Text style={styles.logDose}>
          {item.medication?.dose ?? ''} · previsto{' '}
          {item.medication?.time ? item.medication.time.substring(0, 5) : '--:--'}
        </Text>
      </View>
      <Text style={styles.logTime}>{formatTimeFromISO(item.taken_at)}</Text>
    </View>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScreenHeader
        title="Histórico"
        subtitle="Toque em uma data para ver detalhes"
        style={styles.header}
      />

      <DateStrip
        selectedDate={selectedDate}
        onSelect={setSelectedDate}
        dotMap={dotMap}
        onLoadMoreDays={handleLoadMoreDays}
        maxDays={maxDays}
      />

      {loading ? (
        <ListSkeleton count={4} />
      ) : (
        <FlatList
          style={{ flex: 1 }}
          data={selectedLogs}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          ListHeaderComponent={
            selectedLogs.length > 0 ? (
              <View style={styles.dayHeader}>
                <Text style={styles.dayTitle}>{selectedLabel}</Text>
                {totalMeds > 0 && (
                  <Text style={styles.dayCount}>
                    {selectedLogs.length}/{totalMeds}
                  </Text>
                )}
              </View>
            ) : null
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Feather name="clipboard" size={40} color="#B59A8E" />
              <Text style={styles.emptyText}>Nenhum registro neste dia</Text>
              <Text style={styles.emptySubtext}>Marque remédios como tomados na tela Hoje</Text>
            </View>
          }
        />
      )}
    </View>
  );
}
