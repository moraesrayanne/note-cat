import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Svg, { Path } from 'react-native-svg';
import { Feather, FontAwesome6 } from '@expo/vector-icons';

import { useAuth } from '@/contexts/AuthContext';
import { Medication } from '@/types';
import { colors } from '@/theme';
import { ListSkeleton } from '@/components/Skeleton';
import { cancelMedNotification } from '@/lib/notifications';
import { fetchAllMedications, deactivateMedication } from '@/services/medications';
import { formatTime } from '@/utils/date';
import { RootStackParamList } from '@/navigation/types';
import { styles } from './styles';

export default function MedicationsScreen() {
  const { user } = useAuth();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [meds, setMeds] = useState<Medication[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const loadMeds = useCallback(async () => {
    if (!user) return;
    const { data } = await fetchAllMedications(user.id);
    setMeds(data);
    setLoading(false);
  }, [user]);

  useFocusEffect(
    useCallback(() => {
      loadMeds();
    }, [loadMeds])
  );

  const deleteMed = async (med: Medication) => {
    await deactivateMedication(med.id);
    await cancelMedNotification(med.id);
    setConfirmDelete(null);
    loadMeds();
  };

  const renderItem = ({ item }: { item: Medication }) => (
    <TouchableOpacity
      style={[styles.card, !item.active && styles.cardInactive]}
      onPress={() => navigation.navigate('AddMedication', { medication: item })}
      activeOpacity={0.7}
    >
      <View style={[styles.medIcon, !item.active && styles.medIconInactive]}>
        <FontAwesome6 name="pills" size={18} color={item.active ? colors.primary : colors.textMuted} />
      </View>
      <View style={styles.cardContent}>
        <View style={styles.nameRow}>
          <Text style={[styles.medName, !item.active && styles.textInactive]}>
            {item.name}
          </Text>
          <View style={[styles.statusTag, item.active ? styles.statusActive : styles.statusInactive]}>
            <Text style={[styles.statusTagText, item.active ? styles.statusActiveText : styles.statusInactiveText]}>
              {item.active ? 'ATIVO' : 'INATIVO'}
            </Text>
          </View>
        </View>
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
            {meds.filter(m => m.active).length} ativo{meds.filter(m => m.active).length !== 1 ? 's' : ''} · {meds.length} cadastrado{meds.length !== 1 ? 's' : ''}
          </Text>
        </View>
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
