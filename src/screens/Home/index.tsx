import React, { useCallback, useRef, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Animated,
  Alert,
} from 'react-native';
import { Image } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';

import { useAuth } from '../../contexts/AuthContext';
import { Medication, MedicationLog } from '../../types';
import { colors } from '../../theme';
import { HomeSkeleton } from '../../components/Skeleton';
import { syncAllNotifications } from '../../lib/notifications';
import {
  fetchActiveMedications,
  fetchTodayLogs,
  createMedicationLog,
  deleteMedicationLog,
} from '../../services/medications';
import { getTodayDate, formatTime, getGreeting, getDateStr } from '../../utils/date';
import { styles } from './styles';

function getMedIcon(time: string): keyof typeof Feather.glyphMap {
  const hour = parseInt(time.substring(0, 2), 10);
  return hour < 18 ? 'sun' : 'moon';
}

interface TodayMed {
  medication: Medication;
  log: MedicationLog | null;
}

function AnimatedCheckbox({ checked }: { checked: boolean }) {
  const scale = useRef(new Animated.Value(1)).current;
  const prevChecked = useRef(checked);

  if (checked !== prevChecked.current) {
    prevChecked.current = checked;
    Animated.sequence([
      Animated.timing(scale, { toValue: 1.3, duration: 120, useNativeDriver: true }),
      Animated.spring(scale, { toValue: 1, friction: 4, useNativeDriver: true }),
    ]).start();
  }

  if (checked) {
    return (
      <Animated.View style={[styles.checkboxChecked, { transform: [{ scale }] }]}>
        <Feather name="check" size={14} color="#FFF" />
      </Animated.View>
    );
  }

  return <Animated.View style={[styles.checkbox, { transform: [{ scale }] }]} />;
}

export default function HomeScreen() {
  const { user, catName } = useAuth();
  const insets = useSafeAreaInsets();
  const [meds, setMeds] = useState<TodayMed[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [togglingIds, setTogglingIds] = useState<Set<string>>(new Set());

  const loadToday = useCallback(async () => {
    if (!user) return;
    const today = getTodayDate();

    const { data: medications } = await fetchActiveMedications(user.id);
    const { data: logs } = await fetchTodayLogs(user.id, today);

    const todayMeds: TodayMed[] = medications.map((med) => ({
      medication: med,
      log: logs.find((l) => l.medication_id === med.id) ?? null,
    }));

    setMeds(todayMeds);
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

    setTogglingIds(prev => new Set(prev).add(medId));

    setMeds(prev => prev.map(m => {
      if (m.medication.id !== medId) return m;
      if (wasTaken) {
        return { ...m, log: null };
      }
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
    }));

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

    setTogglingIds(prev => {
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

  const renderPendingItem = (item: TodayMed) => (
    <TouchableOpacity
      key={item.medication.id}
      style={styles.medCard}
      onPress={() => toggleMed(item)}
      activeOpacity={0.7}
    >
      <View style={styles.medIcon}>
        <Feather name={getMedIcon(item.medication.time)} size={20} color={colors.primary} />
      </View>
      <View style={styles.medContent}>
        <Text style={styles.medName}>{item.medication.name}</Text>
        <Text style={styles.medDose}>
          {item.medication.dose} · {formatTime(item.medication.time)}
        </Text>
      </View>
      <AnimatedCheckbox checked={false} />
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
          <Feather name="check-circle" size={20} color={colors.success} />
        </View>
        <View style={styles.medContent}>
          <Text style={[styles.medName, styles.medNameTaken]}>{item.medication.name}</Text>
          <View style={styles.doseRow}>
            <Text style={styles.medDose}>
              {item.medication.dose} · {formatTime(item.medication.time)}
            </Text>
            <View style={styles.takenTag}>
              <Feather name="check" size={10} color={colors.success} />
              <Text style={styles.takenTagText}>tomado às {takenTime}</Text>
            </View>
          </View>
        </View>
        <AnimatedCheckbox checked={true} />
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.fixedHeader}>
          <View style={styles.headerRow}>
            <View style={styles.catPhoto}>
              <Image
                source={require('../../../assets/cat-icon.png')}
                style={styles.catPhotoImg}
                contentFit="cover"
                transition={200}
                placeholder={{ blurhash: 'LKO2?U%2Tw=w]~RBVZRi};RPxuwH' }}
              />
            </View>
            <View>
              <Text style={styles.greeting}>{getGreeting()}!</Text>
              <Text style={styles.title}>Remédios do {catName} 🐾</Text>
            </View>
          </View>
        </View>
        <HomeSkeleton />
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.fixedHeader}>
        <View style={styles.headerRow}>
          <View style={styles.catPhoto}>
            <Image
              source={require('../../../assets/cat-icon.png')}
              style={styles.catPhotoImg}
              contentFit="cover"
              transition={200}
              placeholder={{ blurhash: 'LKO2?U%2Tw=w]~RBVZRi};RPxuwH' }}
            />
          </View>
          <View>
            <Text style={styles.greeting}>{getGreeting()}!</Text>
            <Text style={styles.title}>Remédios do {catName} 🐾</Text>
          </View>
        </View>
      </View>

      <FlatList
        data={[{ key: 'content' }]}
        renderItem={() => (
          <View>
            <View style={styles.statsWrapper}>
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

            {pending.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionLabel}>Pendentes</Text>
                {pending.map(renderPendingItem)}
              </View>
            )}

            {taken.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionLabelDone}>Tomados</Text>
                {taken.map(renderTakenItem)}
              </View>
            )}

            {meds.length === 0 && (
              <View style={styles.emptyContainer}>
                <Feather name="inbox" size={40} color={colors.textMuted} />
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
