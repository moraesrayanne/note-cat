import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '@/theme';
import { styles } from './styles';

interface DiaryBannerProps {
  catName: string;
  onPress?: () => void;
}

export function DiaryBanner({ catName, onPress }: DiaryBannerProps) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7} style={styles.shadow}>
      <LinearGradient
        colors={[colors.primaryBg, colors.primaryBgLight]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.card}
      >
        <View style={styles.iconBox}>
          <Feather name="edit-2" size={18} color="#FFF" />
        </View>
        <View style={styles.content}>
          <Text style={styles.title}>Diário do {catName}</Text>
          <Text style={styles.subtitle}>Como ele está hoje?</Text>
        </View>
        <Feather name="chevron-right" size={18} color={colors.primary} />
      </LinearGradient>
    </TouchableOpacity>
  );
}
