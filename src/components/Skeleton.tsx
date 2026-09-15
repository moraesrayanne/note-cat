import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { colors } from '../theme';

function SkeletonBlock({ width, height, borderRadius = 8, style }: {
  width: number | string;
  height: number;
  borderRadius?: number;
  style?: any;
}) {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 800, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.3, duration: 800, useNativeDriver: true }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, [opacity]);

  return (
    <Animated.View
      style={[
        { width: width as any, height, borderRadius, backgroundColor: colors.primaryBgLight, opacity },
        style,
      ]}
    />
  );
}

export function HomeSkeleton() {
  return (
    <View style={styles.container}>
      {/* Header row */}
      <View style={styles.headerRow}>
        <SkeletonBlock width={52} height={52} borderRadius={26} />
        <View style={{ gap: 8, flex: 1 }}>
          <SkeletonBlock width={90} height={14} />
          <SkeletonBlock width={200} height={22} />
        </View>
      </View>

      {/* Stats card */}
      <SkeletonBlock width="100%" height={140} borderRadius={20} style={{ marginBottom: 24 }} />

      {/* Section label */}
      <SkeletonBlock width={90} height={13} style={{ marginBottom: 12 }} />

      {/* Med cards */}
      {[0, 1, 2].map((i) => (
        <View key={i} style={styles.cardSkeleton}>
          <SkeletonBlock width={44} height={44} borderRadius={12} />
          <View style={{ gap: 6, flex: 1 }}>
            <SkeletonBlock width={120 + i * 20} height={15} />
            <SkeletonBlock width={80} height={12} />
          </View>
          <SkeletonBlock width={28} height={28} borderRadius={14} />
        </View>
      ))}
    </View>
  );
}

export function ListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <View style={styles.listContainer}>
      {Array.from({ length: count }).map((_, i) => (
        <View key={i} style={styles.cardSkeleton}>
          <SkeletonBlock width={36} height={36} borderRadius={10} />
          <View style={{ gap: 6, flex: 1 }}>
            <SkeletonBlock width={100 + i * 30} height={14} />
            <SkeletonBlock width={80} height={12} />
          </View>
          <SkeletonBlock width={40} height={12} />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 20,
  },
  cardSkeleton: {
    backgroundColor: colors.cardBg,
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  listContainer: {
    paddingHorizontal: 24,
  },
});
