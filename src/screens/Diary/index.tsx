import React, { useCallback, useMemo, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Feather } from '@expo/vector-icons';

import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/contexts/ProfileContext';
import { DiaryEntry } from '@/types';
import { colors } from '@/theme';
import { fetchDiaryEntries } from '@/services/diary';
import { formatDateLabel, getTodayDate } from '@/utils/date';
import { RootStackParamList } from '@/navigation/types';
import { styles } from './styles';

const ENERGY_EMOJIS = ['😿', '😾', '🐱', '😸', '😻'];
const ENERGY_LABELS = ['Muito baixa', 'Baixa', 'Normal', 'Boa', 'Ótima'];

function energyColor(level: number): string {
  if (level >= 4) return colors.primary;
  if (level <= 2) return '#E57373';
  return colors.textMuted;
}

type Props = NativeStackScreenProps<RootStackParamList, 'Diary'>;

export default function DiaryScreen({ navigation }: Props) {
  const { user } = useAuth();
  const { catName } = useProfile();
  const insets = useSafeAreaInsets();
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadEntries = useCallback(async () => {
    if (!user) return;
    const { data } = await fetchDiaryEntries(user.id);
    setEntries(data ?? []);
    setLoading(false);
  }, [user]);

  useFocusEffect(
    useCallback(() => {
      loadEntries();
    }, [loadEntries]),
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await loadEntries();
    setRefreshing(false);
  };

  const hasTodayEntry = useMemo(
    () => entries.some((e) => e.date === getTodayDate()),
    [entries],
  );

  const renderEntry = ({ item }: { item: DiaryEntry }) => {
    const hasEnergy = item.energy_level != null;
    const emoji = hasEnergy ? ENERGY_EMOJIS[item.energy_level! - 1] : null;
    const label = hasEnergy ? ENERGY_LABELS[item.energy_level! - 1] : null;
    const color = hasEnergy ? energyColor(item.energy_level!) : colors.textMuted;

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate('AddDiaryEntry', { entry: item })}
        activeOpacity={0.75}
      >
        <View style={styles.cardHeader}>
          <Text style={styles.cardDate}>{formatDateLabel(item.date)}</Text>
          <View style={styles.energyBadge}>
            {hasEnergy && (
              <Text style={[styles.energyLabel, { color }]}>
                {label} {emoji}
              </Text>
            )}
          </View>
          <Feather name="chevron-right" size={16} color={colors.textLight} />
        </View>

        {item.feeding ? (
          <Text style={styles.feedingText} numberOfLines={2}>
            {item.feeding}
          </Text>
        ) : null}

        <View style={styles.chipsRow}>
          {item.used_litter_box != null && (
            <View
              style={[
                styles.chip,
                item.used_litter_box ? styles.chipGreen : styles.chipRed,
              ]}
            >
              <Text
                style={[
                  styles.chipText,
                  item.used_litter_box ? styles.chipTextGreen : styles.chipTextRed,
                ]}
              >
                {item.used_litter_box ? '✓' : '✗'} Caixinha
              </Text>
            </View>
          )}
          {item.blood_pressure ? (
            <View style={styles.chip}>
              <Text style={styles.chipText}>♥ {item.blood_pressure}</Text>
            </View>
          ) : null}
        </View>

        {item.notes ? (
          <Text style={styles.notesText} numberOfLines={2}>
            {item.notes}
          </Text>
        ) : null}
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.headerRow}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backArrow}>‹</Text>
        </TouchableOpacity>
        <View style={styles.headerTexts}>
          <Text style={styles.headerTitle}>Diário</Text>
          <Text style={styles.headerSubtitle}>Acompanhamento diário do {catName}</Text>
        </View>
        <TouchableOpacity
          style={[styles.addButton, hasTodayEntry && styles.addButtonDisabled]}
          onPress={() => !hasTodayEntry && navigation.navigate('AddDiaryEntry', {})}
          activeOpacity={hasTodayEntry ? 1 : 0.8}
        >
          <Feather name="plus" size={20} color="#FFF" />
        </TouchableOpacity>
      </View>

      {loading ? null : entries.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyEmoji}>📖</Text>
          <Text style={styles.emptyText}>Nenhum registro ainda</Text>
          <Text style={styles.emptySubtext}>
            Comece registrando o dia a dia do {catName}
          </Text>
          <TouchableOpacity
            style={styles.emptyButton}
            onPress={() => navigation.navigate('AddDiaryEntry', {})}
          >
            <Text style={styles.emptyButtonText}>Registrar hoje</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={entries}
          keyExtractor={(item) => item.id}
          renderItem={renderEntry}
          contentContainerStyle={styles.list}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={<View style={{ height: insets.bottom + 16 }} />}
        />
      )}
    </View>
  );
}
