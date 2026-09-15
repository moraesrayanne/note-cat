import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect } from '@react-navigation/native';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Medication, MedicationLog } from '../types';
import { colors, fonts } from '../theme';
import { HomeSkeleton } from '../components/Skeleton';

function getTodayDate(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}

function formatTime(time: string): string {
  return time.substring(0, 5);
}

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Bom dia';
  if (h < 18) return 'Boa tarde';
  return 'Boa noite';
}

function getDateStr(): string {
  const months = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
  const now = new Date();
  return `${now.getDate()} de ${months[now.getMonth()]}`;
}

const MED_ICONS = ['💊', '💉', '🩹', '💊', '🧴', '💧'];

interface TodayMed {
  medication: Medication;
  log: MedicationLog | null;
}

export default function HomeScreen() {
  const { user } = useAuth();
  const insets = useSafeAreaInsets();
  const [meds, setMeds] = useState<TodayMed[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadToday = useCallback(async () => {
    if (!user) return;
    const today = getTodayDate();

    const { data: medications } = await supabase
      .from('medications')
      .select('*')
      .eq('user_id', user.id)
      .eq('active', true)
      .order('time');

    const { data: logs } = await supabase
      .from('medication_logs')
      .select('*')
      .eq('user_id', user.id)
      .eq('date', today);

    const todayMeds: TodayMed[] = (medications ?? []).map((med) => ({
      medication: med,
      log: (logs ?? []).find((l) => l.medication_id === med.id) ?? null,
    }));

    setMeds(todayMeds);
    setLoading(false);
  }, [user]);

  useFocusEffect(
    useCallback(() => {
      loadToday();
    }, [loadToday])
  );

  const toggleMed = async (item: TodayMed) => {
    if (!user) return;
    const today = getTodayDate();

    if (item.log) {
      await supabase.from('medication_logs').delete().eq('id', item.log.id);
    } else {
      await supabase.from('medication_logs').insert({
        medication_id: item.medication.id,
        user_id: user.id,
        date: today,
        taken_at: new Date().toISOString(),
      });
    }
    loadToday();
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadToday();
    setRefreshing(false);
  };

  const pending = meds.filter((m) => !m.log);
  const taken = meds.filter((m) => m.log);
  const pct = meds.length > 0 ? Math.round((taken.length / meds.length) * 100) : 0;

  const renderPendingItem = (item: TodayMed, index: number) => (
    <TouchableOpacity
      key={item.medication.id}
      style={styles.medCard}
      onPress={() => toggleMed(item)}
      activeOpacity={0.7}
    >
      <View style={styles.medIcon}>
        <Text style={styles.medIconText}>{MED_ICONS[index % MED_ICONS.length]}</Text>
      </View>
      <View style={styles.medContent}>
        <Text style={styles.medName}>{item.medication.name}</Text>
        <Text style={styles.medDose}>
          {item.medication.dose} · {formatTime(item.medication.time)}
        </Text>
      </View>
      <View style={styles.checkbox} />
    </TouchableOpacity>
  );

  const renderTakenItem = (item: TodayMed) => {
    const takenTime = item.log
      ? new Date(item.log.taken_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
      : '';
    return (
      <TouchableOpacity
        key={item.medication.id}
        style={[styles.medCard, styles.medCardTaken]}
        onPress={() => toggleMed(item)}
        activeOpacity={0.7}
      >
        <View style={[styles.medIcon, styles.medIconTaken]}>
          <Text style={styles.medIconText}>🩹</Text>
        </View>
        <View style={styles.medContent}>
          <Text style={[styles.medName, styles.medNameTaken]}>{item.medication.name}</Text>
          <Text style={styles.medDose}>
            {item.medication.dose} · {formatTime(item.medication.time)} — tomado às {takenTime}
          </Text>
        </View>
        <View style={styles.checkboxChecked}>
          <Text style={styles.checkmark}>✓</Text>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <HomeSkeleton />
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <FlatList
        data={[{ key: 'content' }]}
        renderItem={() => (
          <View>
            {/* Header */}
            <View style={styles.header}>
              <View style={styles.headerRow}>
                <View style={styles.catPhoto}>
                  <Text style={styles.catPhotoText}>🐱</Text>
                </View>
                <View>
                  <Text style={styles.greeting}>{getGreeting()}!</Text>
                  <Text style={styles.title}>Remédios do Baden 🐾</Text>
                </View>
              </View>

              {/* Stats card */}
              <LinearGradient
                colors={[colors.primary, colors.primaryLight]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.statsCard}
              >
                <View style={styles.statsCircle1} />
                <View style={styles.statsCircle2} />
                <Text style={styles.statsDate}>Hoje, {getDateStr()}</Text>
                <Text style={styles.statsCount}>
                  {meds.length} remédio{meds.length !== 1 ? 's' : ''}
                </Text>
                <Text style={styles.statsDetail}>
                  {taken.length} tomado{taken.length !== 1 ? 's' : ''} · {pending.length} pendente{pending.length !== 1 ? 's' : ''}
                </Text>
                <View style={styles.progressBg}>
                  <View style={[styles.progressFill, { width: `${pct}%` }]} />
                </View>
              </LinearGradient>
            </View>

            {/* Pending */}
            {pending.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionLabel}>Pendentes</Text>
                {pending.map(renderPendingItem)}
              </View>
            )}

            {/* Taken */}
            {taken.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionLabelDone}>Tomados ✓</Text>
                {taken.map(renderTakenItem)}
              </View>
            )}

            {/* Empty state */}
            {meds.length === 0 && (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyEmoji}>🐱</Text>
                <Text style={styles.emptyText}>Nenhum remédio cadastrado</Text>
                <Text style={styles.emptySubtext}>Vá em Remédios para adicionar</Text>
              </View>
            )}
          </View>
        )}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      />
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
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 20,
  },
  catPhoto: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 2.5,
    borderColor: colors.primaryBorder,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.primaryBg,
  },
  catPhotoText: {
    fontSize: 24,
  },
  greeting: {
    fontSize: 14,
    color: colors.primary,
    fontFamily: fonts.semibold,
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 22,
    fontFamily: fonts.bold,
    color: colors.text,
    lineHeight: 28,
  },
  statsCard: {
    borderRadius: 20,
    padding: 20,
    overflow: 'hidden',
    position: 'relative',
  },
  statsCircle1: {
    position: 'absolute',
    top: -20,
    right: -20,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  statsCircle2: {
    position: 'absolute',
    bottom: -30,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  statsDate: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.85)',
    fontFamily: fonts.regular,
    marginBottom: 4,
  },
  statsCount: {
    fontSize: 28,
    fontFamily: fonts.bold,
    color: '#FFF',
    marginBottom: 2,
  },
  statsDetail: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
    fontFamily: fonts.regular,
  },
  progressBg: {
    marginTop: 14,
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: 3,
  },
  progressFill: {
    height: 6,
    backgroundColor: '#FFF',
    borderRadius: 3,
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 8,
  },
  sectionLabel: {
    fontSize: 13,
    fontFamily: fonts.semibold,
    color: colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 12,
  },
  sectionLabelDone: {
    fontSize: 13,
    fontFamily: fonts.semibold,
    color: colors.success,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 12,
    marginTop: 10,
  },
  medCard: {
    backgroundColor: colors.cardBg,
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  medCardTaken: {
    opacity: 0.6,
  },
  medIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.primaryBg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  medIconTaken: {
    backgroundColor: colors.successBg,
  },
  medIconText: {
    fontSize: 20,
  },
  medContent: {
    flex: 1,
  },
  medName: {
    fontSize: 15,
    fontFamily: fonts.semibold,
    color: colors.text,
  },
  medNameTaken: {
    textDecorationLine: 'line-through',
  },
  medDose: {
    fontSize: 12,
    color: colors.textMuted,
    fontFamily: fonts.regular,
    marginTop: 2,
  },
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2.5,
    borderColor: colors.primaryBorder,
  },
  checkboxChecked: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmark: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  emptyContainer: {
    alignItems: 'center',
    padding: 40,
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
  },
});
