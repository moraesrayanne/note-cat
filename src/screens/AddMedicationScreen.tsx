import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { colors, fonts } from '../theme';

type Props = NativeStackScreenProps<any, 'AddMedication'>;

function formatTimeInput(prev: string, raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 4);

  // Validate each digit as it's typed
  if (digits.length >= 1) {
    const d0 = parseInt(digits[0]);
    if (d0 > 2) return prev;
  }
  if (digits.length >= 2) {
    const hh = parseInt(digits.slice(0, 2));
    if (hh > 23) return prev;
  }
  if (digits.length >= 3) {
    const d2 = parseInt(digits[2]);
    if (d2 > 5) return prev;
  }
  if (digits.length >= 4) {
    const mm = parseInt(digits.slice(2, 4));
    if (mm > 59) return prev;
  }

  if (digits.length <= 2) return digits;
  return digits.slice(0, 2) + ':' + digits.slice(2);
}

function isValidTime(value: string): boolean {
  return /^([01]\d|2[0-3]):[0-5]\d$/.test(value);
}

export default function AddMedicationScreen({ navigation, route }: Props) {
  const { user } = useAuth();
  const editing = route.params?.medication;

  const [name, setName] = useState(editing?.name ?? '');
  const [dose, setDose] = useState(editing?.dose ?? '');
  const [time, setTime] = useState(() => {
    if (editing?.time) return editing.time.substring(0, 5);
    return '';
  });
  const [saving, setSaving] = useState(false);

  const canSave = name.trim() && dose.trim() && isValidTime(time);

  const handleSave = async () => {
    if (!canSave) {
      Alert.alert('Ops', 'Preencha todos os campos corretamente');
      return;
    }
    if (!user) return;

    setSaving(true);

    const timeStr = `${time}:00`;
    const data = {
      name: name.trim(),
      dose: dose.trim(),
      time: timeStr,
      user_id: user.id,
      active: true,
    };

    let error;
    if (editing) {
      ({ error } = await supabase
        .from('medications')
        .update(data)
        .eq('id', editing.id));
    } else {
      ({ error } = await supabase.from('medications').insert(data));
    }

    setSaving(false);

    if (error) {
      Alert.alert('Erro', error.message);
    } else {
      navigation.goBack();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>{editing ? '✏️' : '💊'}</Text>
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Nome do remédio</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: Prednisolona"
          placeholderTextColor={colors.textMuted}
          value={name}
          onChangeText={setName}
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Dose</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: 5mg, 2ml, 1 comprimido"
          placeholderTextColor={colors.textMuted}
          value={dose}
          onChangeText={setDose}
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Horário</Text>
        <TextInput
          style={styles.timeInput}
          placeholder="20:00"
          placeholderTextColor={colors.textMuted}
          value={time}
          onChangeText={(text) => setTime(formatTimeInput(time, text))}
          keyboardType="number-pad"
          maxLength={5}
        />
      </View>

      <TouchableOpacity
        style={[styles.saveButton, !canSave && styles.saveButtonDisabled]}
        onPress={handleSave}
        disabled={saving || !canSave}
      >
        <Text style={[styles.saveText, !canSave && styles.saveTextDisabled]}>
          {saving ? 'Salvando...' : editing ? 'Salvar alterações' : 'Salvar remédio'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.cancelText}>Cancelar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 24,
  },
  iconContainer: {
    width: 72,
    height: 72,
    borderRadius: 20,
    backgroundColor: colors.primaryBgLight,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 28,
    marginTop: 8,
  },
  icon: {
    fontSize: 32,
  },
  field: {
    marginBottom: 18,
  },
  label: {
    fontSize: 12,
    fontFamily: fonts.bold,
    color: colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.background,
    borderRadius: 14,
    padding: 14,
    paddingHorizontal: 16,
    fontSize: 16,
    fontFamily: fonts.regular,
    borderWidth: 2,
    borderColor: colors.primaryBgInput,
    color: colors.text,
  },
  timeInput: {
    backgroundColor: colors.background,
    borderRadius: 14,
    padding: 14,
    fontSize: 24,
    fontFamily: fonts.semibold,
    borderWidth: 2,
    borderColor: colors.primaryBgInput,
    color: colors.primary,
    textAlign: 'center',
    letterSpacing: 4,
  },
  saveButton: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    marginTop: 32,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 4,
  },
  saveButtonDisabled: {
    backgroundColor: colors.primaryBgInput,
    shadowOpacity: 0,
    elevation: 0,
  },
  saveText: {
    color: '#FFF',
    fontSize: 16,
    fontFamily: fonts.bold,
  },
  saveTextDisabled: {
    color: '#D4A99E',
  },
  cancelText: {
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: 16,
    fontSize: 14,
    fontFamily: fonts.medium,
  },
});
