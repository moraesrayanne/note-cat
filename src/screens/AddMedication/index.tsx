import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Alert,
  Switch,
  ScrollView,
  Keyboard,
  KeyboardAvoidingView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Feather, FontAwesome6 } from '@expo/vector-icons';

import { useAuth } from '@/contexts/AuthContext';
import { colors } from '@/theme';
import { scheduleMedNotification, cancelMedNotification } from '@/lib/notifications';
import { saveMedication } from '@/services/medications';
import { formatTimeInput, isValidTime } from '@/utils/date';
import { RootStackParamList } from '@/navigation/types';
import { styles } from './styles';

type Props = NativeStackScreenProps<RootStackParamList, 'AddMedication'>;

export default function AddMedicationScreen({ navigation, route }: Props) {
  const { user } = useAuth();
  const insets = useSafeAreaInsets();
  const editing = route.params?.medication;

  const [name, setName] = useState(editing?.name ?? '');
  const [dose, setDose] = useState(editing?.dose ?? '');
  const [time, setTime] = useState(() => {
    if (editing?.time) return editing.time.substring(0, 5);
    return '';
  });
  const [active, setActive] = useState(editing?.active ?? true);
  const [saving, setSaving] = useState(false);

  const canSave = name.trim() && dose.trim() && isValidTime(time);

  const handleSave = async () => {
    if (!canSave) {
      Alert.alert('Ops', 'Preencha todos os campos corretamente');
      return;
    }
    if (!user) return;

    setSaving(true);

    const { data: savedMed, error } = await saveMedication(
      {
        name: name.trim(),
        dose: dose.trim(),
        time: `${time}:00`,
        user_id: user.id,
        active,
      },
      editing?.id,
    );

    setSaving(false);

    if (error) {
      Alert.alert('Erro', error.message);
    } else {
      if (savedMed) {
        if (active) {
          scheduleMedNotification(savedMed);
        } else {
          cancelMedNotification(savedMed.id);
        }
      }
      navigation.goBack();
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.headerRow}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backArrow}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{editing ? 'Editar remédio' : 'Novo remédio'}</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: Math.max(insets.bottom, 16) + 16 }]}
        keyboardShouldPersistTaps='handled'
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.formContent}>
          <View style={styles.iconContainer}>
            {editing ? <Feather name="edit-2" size={32} color={colors.primary} /> : <FontAwesome6 name="pills" size={28} color={colors.primary} />}
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

          <View style={styles.switchRow}>
            <View>
              <Text style={styles.label}>Status</Text>
              <Text style={styles.switchDescription}>
                {active ? 'Aparece na tela Hoje' : 'Não aparece na tela Hoje'}
              </Text>
            </View>
            <View style={styles.switchControl}>
              <Text style={[styles.switchLabel, active ? styles.switchLabelActive : styles.switchLabelInactive]}>
                {active ? 'Ativo' : 'Inativo'}
              </Text>
              <Switch
                value={active}
                onValueChange={setActive}
                trackColor={{ false: '#E0D6D0', true: colors.primary }}
                thumbColor="#FFF"
              />
            </View>
          </View>
        </View>

        <View style={styles.bottomButtons}>
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
      </ScrollView>
    </View>
    </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
