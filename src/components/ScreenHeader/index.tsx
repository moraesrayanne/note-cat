import React from 'react';
import { View, Text, ViewStyle } from 'react-native';
import { styles } from './styles';

interface Props {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
  style?: ViewStyle;
}

export function ScreenHeader({ title, subtitle, right, style }: Props) {
  return (
    <View style={[styles.header, style]}>
      <View>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
      {right ?? null}
    </View>
  );
}
