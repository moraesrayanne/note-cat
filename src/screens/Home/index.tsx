import React, { useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Animated,
} from 'react-native';
import { Image } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';

import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useProfile } from '@/contexts/ProfileContext';
import { catIcon, CAT_ICON_BLURHASH } from '@/assets';
import { colors } from '@/theme';
import { RootStackParamList } from '@/navigation/types';
import { HomeSkeleton } from '@/components/Skeleton';
import { formatTime, getGreeting, getDateStr } from '@/utils/date';
import { TodayMed, useTodayMeds } from '@/hooks/useTodayMeds';
import { DiaryBanner } from '@/components/DiaryBanner';
import { styles } from './styles';

function getMedIcon(time: string): keyof typeof Feather.glyphMap {
  const hour = parseInt(time.substring(0, 2), 10);
  return hour < 18 ? 'sun' : 'moon';
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
  const { catName } = useProfile();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { meds, loading, refreshing, toggleMed, onRefresh, pending, taken, pct } = useTodayMeds();

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

  const header = (
    <View style={styles.fixedHeader}>
      <View style={styles.headerRow}>
        <View style={styles.catPhoto}>
          <Image
            source={catIcon}
            style={styles.catPhotoImg}
            contentFit="cover"
            transition={200}
            placeholder={{ blurhash: CAT_ICON_BLURHASH }}
          />
        </View>
        <View>
          <Text style={styles.greeting}>{getGreeting()}!</Text>
          <Text style={styles.title}>Remédios do {catName} 🐾</Text>
        </View>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        {header}
        <HomeSkeleton />
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {header}

      <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
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

        <View style={styles.diaryWrapper}>
          <DiaryBanner catName={catName} onPress={() => navigation.navigate('Diary')} />
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
      </ScrollView>
    </View>
  );
}
