import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  SectionList,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { MedicationLog } from '../types';
import { colors, fonts } from '../theme';
import { ListSkeleton } from '../components/Skeleton';

function formatDateLabel(dateStr: string): string {
  const date = new Date(dateStr + 'T12:00:00');
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  const toYMD = (d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

  if (dateStr === toYMD(today)) return 'Hoje';
  if (dateStr === toYMD(yesterday)) return 'Ontem';

  const days = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
  const months = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
  return `${days[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]}`;
}

function formatTimeFromISO(isoStr: string): string {
  const d = new Date(isoStr);
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

interface Section {
  title: string;
  count: number;
  data: MedicationLog[];
}

export default function HistoryScreen() {
  const { user } = useAuth();
  const insets = useSafeAreaInsets();
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);
  const [daysToLoad, setDaysToLoad] = useState(7);

  const loadHistory = useCallback(async () => {
    if (!user) return;

    const since = new Date();
    since.setDate(since.getDate() - daysToLoad);
    const sinceStr = `${since.getFullYear()}-${String(since.getMonth() + 1).padStart(2, '0')}-${String(since.getDate()).padStart(2, '0')}`;

    const { data } = await supabase
      .from('medication_logs')
      .select('*, medication:medications(*)')
      .eq('user_id', user.id)
      .gte('date', sinceStr)
      .order('date', { ascending: false })
      .order('taken_at', { ascending: true });

    const grouped: Record<string, MedicationLog[]> = {};
    for (const log of data ?? []) {
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
        <Text style={styles.checkText}>✓</Text>
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
        <Text style={styles.subtitle}>Veja o que o Baden já tomou</Text>
      </View>

      {loading ? (
        <ListSkeleton count={4} />
      ) : sections.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyEmoji}>📋</Text>
          <Text style={styles.emptyText}>Nenhum registro ainda</Text>
          <Text style={styles.emptySubtext}>
            Marque remédios como tomados na tela Hoje
          </Text>
        </View>
      ) : (
        <SectionList
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: 24,
    paddingBottom: 16,
  },
  title: {
    fontSize: 28,
    fontFamily: fonts.bold,
    color: colors.text,
  },
  subtitle: {
    fontSize: 13,
    color: colors.textMuted,
    fontFamily: fonts.regular,
    marginTop: 4,
  },
  list: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
    marginTop: 12,
  },
  sectionTitle: {
    fontSize: 13,
    fontFamily: fonts.bold,
    color: colors.primary,
  },
  sectionCount: {
    fontSize: 11,
    fontFamily: fonts.medium,
    color: colors.textMuted,
  },
  logItem: {
    backgroundColor: colors.cardBg,
    borderRadius: 14,
    padding: 14,
    paddingHorizontal: 16,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  checkIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: colors.successBg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkText: {
    color: colors.success,
    fontSize: 16,
    fontWeight: 'bold',
  },
  logContent: {
    flex: 1,
  },
  logMed: {
    fontSize: 14,
    fontFamily: fonts.semibold,
    color: colors.text,
  },
  logDose: {
    fontSize: 12,
    color: colors.textMuted,
    fontFamily: fonts.regular,
    marginTop: 2,
  },
  logTime: {
    fontSize: 12,
    fontFamily: fonts.semibold,
    color: colors.primary,
  },
  loadMore: {
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  loadMoreText: {
    color: colors.primary,
    fontFamily: fonts.semibold,
    fontSize: 14,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyEmoji: {
    fontSize: 40,
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 15,
    fontFamily: fonts.semibold,
    color: colors.text,
  },
  emptySubtext: {
    fontSize: 13,
    color: colors.textMuted,
    fontFamily: fonts.regular,
    marginTop: 4,
    textAlign: 'center',
  },
});
