import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  SectionList,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';

import { useAuth } from '@/contexts/AuthContext';
import { MedicationLog } from '@/types';
import { ListSkeleton } from '@/components/Skeleton';
import { fetchMedicationLogs } from '@/services/medications';
import { formatDateLabel, formatTimeFromISO, toDateStr } from '@/utils/date';
import { styles } from './styles';

interface Section {
  title: string;
  count: number;
  data: MedicationLog[];
}

export default function HistoryScreen() {
  const { user, catName } = useAuth();
  const insets = useSafeAreaInsets();
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);
  const [daysToLoad, setDaysToLoad] = useState(7);

  const loadHistory = useCallback(async () => {
    if (!user) return;

    const since = new Date();
    since.setDate(since.getDate() - daysToLoad);

    const { data } = await fetchMedicationLogs(user.id, toDateStr(since));

    const grouped: Record<string, MedicationLog[]> = {};
    for (const log of data) {
      if (!grouped[log.date]) grouped[log.date] = [];
      grouped[log.date].push(log);
    }

    const secs: Section[] = Object.entries(grouped)
      .sort(([a], [b]) => b.localeCompare(a))
      .map(([date, logs]) => ({
        title: formatDateLabel(date),
        count: logs.length,
        data: logs,
      }));

    setSections(secs);
    setLoading(false);
  }, [user, daysToLoad]);

  useFocusEffect(
    useCallback(() => {
      loadHistory();
    }, [loadHistory])
  );

  const renderItem = ({ item }: { item: MedicationLog }) => (
    <View style={styles.logItem}>
      <View style={styles.checkIcon}>
        <Feather name="check" size={16} color="#4CAF50" />
      </View>
      <View style={styles.logContent}>
        <Text style={styles.logMed}>
          {item.medication?.name ?? 'Medicamento removido'}
        </Text>
        <Text style={styles.logDose}>
          {item.medication?.dose ?? ''} · horário {item.medication?.time ? item.medication.time.substring(0, 5) : ''}
        </Text>
      </View>
      <Text style={styles.logTime}>{formatTimeFromISO(item.taken_at)}</Text>
    </View>
  );

  const renderSectionHeader = ({ section }: { section: Section }) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{section.title}</Text>
      <Text style={styles.sectionCount}>
        {section.count} remédio{section.count > 1 ? 's' : ''}
      </Text>
    </View>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Histórico</Text>
        <Text style={styles.subtitle}>Veja o que o {catName} já tomou</Text>
      </View>

      {loading ? (
        <ListSkeleton count={4} />
      ) : sections.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Feather name="clipboard" size={40} color="#B59A8E" />
          <Text style={styles.emptyText}>Nenhum registro ainda</Text>
          <Text style={styles.emptySubtext}>
            Marque remédios como tomados na tela Hoje
          </Text>
        </View>
      ) : (
        <SectionList
          style={{ flex: 1 }}
          sections={sections}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          renderSectionHeader={renderSectionHeader}
          contentContainerStyle={styles.list}
          ListFooterComponent={
            <TouchableOpacity
              style={styles.loadMore}
              onPress={() => setDaysToLoad((d) => d + 7)}
            >
              <Text style={styles.loadMoreText}>Carregar mais dias</Text>
            </TouchableOpacity>
          }
        />
      )}
    </View>
  );
}
