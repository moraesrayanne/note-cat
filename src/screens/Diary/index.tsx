import React, { useCallback, useMemo, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
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
import { commonStyles } from '@/styles/common';
import { ENERGY_EMOJIS, ENERGY_LABELS } from '@/constants/diary';
import { styles } from './styles';

function energyValueStyle(level: number) {
  if (level >= 4) return styles.gridCellValueGood;
  if (level <= 2) return styles.gridCellValueBad;
  return styles.gridCellValueNormal;
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

  const hasTodayEntry = useMemo(() => entries.some((e) => e.date === getTodayDate()), [entries]);

  const renderEntry = ({ item }: { item: DiaryEntry }) => {
    const hasEnergy = item.energy_level != null;
    const emoji = hasEnergy ? ENERGY_EMOJIS[item.energy_level! - 1] : null;
    const label = hasEnergy ? ENERGY_LABELS[item.energy_level! - 1] : null;
    const energyStyle = hasEnergy
      ? energyValueStyle(item.energy_level!)
      : styles.gridCellValueNormal;

    const isToday = item.date === getTodayDate();
    const showGrid = hasEnergy || item.used_litter_box != null;

    return (
      <View style={styles.entryGroup}>
        {/* Big white card — fully tappable */}
        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate('AddDiaryEntry', { entry: item })}
          activeOpacity={0.75}
        >
          {/* Date row inside the card */}
          <View style={styles.cardDateRow}>
            <View style={styles.sectionLeft}>
              <Text style={styles.sectionDateText}>{formatDateLabel(item.date)}</Text>
              {isToday && <View style={styles.sectionDot} />}
            </View>
            <Feather name="chevron-right" size={18} color={colors.textLight} />
          </View>

          {/* Mini card: Alimentação (salmon) */}
          {item.feeding ? (
            <View style={styles.feedingMiniCard}>
              <View style={styles.feedingLabelRow}>
                <Text style={{ fontSize: 14 }}>🐾</Text>
                <Text style={styles.feedingLabelText}>Alimentação</Text>
              </View>
              <Text style={styles.feedingText}>{item.feeding}</Text>
            </View>
          ) : null}

          {/* Mini cards row: Disposição + Caixinha */}
          {showGrid ? (
            <View style={styles.gridRow}>
              {hasEnergy ? (
                <View style={[styles.gridMiniCard, styles.disposicaoCard]}>
                  <Text style={styles.gridEmoji}>{emoji}</Text>
                  <Text style={styles.gridCellLabel}>Disposição</Text>
                  <Text style={[styles.gridCellValue, energyStyle]}>{label}</Text>
                </View>
              ) : null}

              {item.used_litter_box != null ? (
                <View
                  style={[
                    styles.gridMiniCard,
                    item.used_litter_box ? styles.caixinhaCardGreen : styles.caixinhaCardRed,
                  ]}
                >
                  <Feather
                    name={item.used_litter_box ? 'check' : 'x'}
                    size={22}
                    color={item.used_litter_box ? colors.success : colors.error}
                  />
                  <Text style={styles.gridCellLabel}>Caixinha</Text>
                  <Text
                    style={[
                      styles.gridCellValue,
                      item.used_litter_box ? styles.gridCellValueGreen : styles.gridCellValueBad,
                    ]}
                  >
                    {item.used_litter_box ? 'Usou' : 'Não usou'}
                  </Text>
                </View>
              ) : null}
            </View>
          ) : null}

          {/* Mini card: Pressão */}
          {item.blood_pressure ? (
            <View style={styles.bpMiniCard}>
              <View style={styles.bpLabelRow}>
                <Text style={{ fontSize: 14 }}>❤️</Text>
                <Text style={styles.gridCellLabel}>Pressão:</Text>
                <Text style={styles.bpValue}>{item.blood_pressure}</Text>
              </View>
            </View>
          ) : null}

          {/* Mini card: Notas */}
          {item.notes ? (
            <View style={styles.notesMiniCard}>
              <Feather
                name="message-circle"
                size={14}
                color={colors.primary}
                style={{ marginTop: 2, opacity: 0.75 }}
              />
              <Text style={styles.notesText}>{item.notes}</Text>
            </View>
          ) : null}
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.headerRow}>
        <TouchableOpacity style={commonStyles.backButton} onPress={() => navigation.goBack()}>
          <Text style={commonStyles.backArrow}>‹</Text>
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
          <Text style={styles.emptySubtext}>Comece registrando o dia a dia do {catName}</Text>
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
