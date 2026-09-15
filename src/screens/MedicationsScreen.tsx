import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Medication } from '../types';
import Svg, { Path } from 'react-native-svg';
import { Feather, FontAwesome6 } from '@expo/vector-icons';
import { colors, fonts } from '../theme';
import { ListSkeleton } from '../components/Skeleton';

export default function MedicationsScreen() {
  const { user } = useAuth();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const [meds, setMeds] = useState<Medication[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const loadMeds = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase
      .from('medications')
      .select('*')
      .eq('user_id', user.id)
      .eq('active', true)
      .order('time');
    setMeds(data ?? []);
    setLoading(false);
  }, [user]);

  useFocusEffect(
    useCallback(() => {
      loadMeds();
    }, [loadMeds])
  );

  const deleteMed = async (med: Medication) => {
    await supabase.from('medications').update({ active: false }).eq('id', med.id);
    setConfirmDelete(null);
    loadMeds();
  };

  const formatTime = (time: string) => time.substring(0, 5);

  const renderItem = ({ item }: { item: Medication }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('AddMedication', { medication: item })}
      activeOpacity={0.7}
    >
      <View style={styles.medIcon}>
        <FontAwesome6 name="pills" size={18} color={colors.primary} />
      </View>
      <View style={styles.cardContent}>
        <Text style={[styles.medName, !item.active && styles.textInactive]}>
          {item.name}
        </Text>
        <Text style={styles.medDose}>
          {item.dose} · {formatTime(item.time)}
        </Text>
      </View>
      {confirmDelete === item.id ? (
        <View style={styles.confirmRow}>
          <TouchableOpacity
            style={styles.confirmDeleteBtn}
            onPress={() => deleteMed(item)}
          >
            <Text style={styles.confirmDeleteText}>Excluir</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.confirmCancelBtn}
            onPress={() => setConfirmDelete(null)}
          >
            <Text style={styles.confirmCancelText}>Não</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity
          style={styles.deleteIconBtn}
          onPress={() => setConfirmDelete(item.id)}
        >
          <Svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke={colors.textLight} strokeWidth={2} strokeLinecap="round">
            <Path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14" />
          </Svg>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Remédios</Text>
          <Text style={styles.subtitle}>
            {meds.length} cadastrado{meds.length !== 1 ? 's' : ''}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('AddMedication', {})}
        >
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ListSkeleton count={3} />
      ) : (
        <FlatList
          data={meds}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Feather name="inbox" size={40} color={colors.textMuted} />
              <Text style={styles.emptyText}>Sem remédios</Text>
              <Text style={styles.emptySubtext}>Toque no + para adicionar</Text>
            </View>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 4,
  },
  addButtonText: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: '300',
    marginTop: -2,
  },
  list: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  card: {
    backgroundColor: colors.cardBg,
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  medIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.primaryBg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContent: {
    flex: 1,
  },
  medName: {
    fontSize: 15,
    fontFamily: fonts.semibold,
    color: colors.text,
  },
  textInactive: {
    textDecorationLine: 'line-through',
    opacity: 0.5,
  },
  medDose: {
    fontSize: 12,
    color: colors.textMuted,
    fontFamily: fonts.regular,
    marginTop: 2,
  },
  confirmRow: {
    flexDirection: 'row',
    gap: 8,
  },
  confirmDeleteBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: colors.primary,
  },
  confirmDeleteText: {
    color: '#FFF',
    fontSize: 11,
    fontFamily: fonts.bold,
  },
  confirmCancelBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#F0E8E4',
  },
  confirmCancelText: {
    color: colors.text,
    fontSize: 11,
    fontFamily: fonts.semibold,
  },
  deleteIconBtn: {
    width: 32,
    height: 32,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteIcon: {
    fontSize: 16,
    opacity: 0.5,
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 80,
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
