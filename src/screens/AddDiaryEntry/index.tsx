import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ScrollView,
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Feather } from '@expo/vector-icons';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';

import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/contexts/ProfileContext';
import { colors } from '@/theme';
import {
  upsertDiaryEntry,
  updateDiaryEntry,
  deleteDiaryEntry,
  fetchDiaryEntryByDate,
} from '@/services/diary';
import { getTodayDate, formatDateLabel, toDateStr } from '@/utils/date';
import { RootStackParamList } from '@/navigation/types';
import { commonStyles } from '@/styles/common';
import { ENERGY_EMOJIS, ENERGY_LABELS } from '@/constants/diary';
import { styles } from './styles';

type Props = NativeStackScreenProps<RootStackParamList, 'AddDiaryEntry'>;

export default function AddDiaryEntryScreen({ navigation, route }: Props) {
  const { user } = useAuth();
  const { catName } = useProfile();
  const insets = useSafeAreaInsets();
  const existing = route.params?.entry;
  const today = getTodayDate();

  const [entryDate, setEntryDate] = useState(existing?.date ?? today);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [feeding, setFeeding] = useState(existing?.feeding ?? '');
  const [usedLitterBox, setUsedLitterBox] = useState<boolean | null>(
    existing?.used_litter_box ?? null,
  );
  const [energyLevel, setEnergyLevel] = useState<number | null>(existing?.energy_level ?? null);
  const [bloodPressure, setBloodPressure] = useState(existing?.blood_pressure ?? '');
  const [notes, setNotes] = useState(existing?.notes ?? '');
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const scrollRef = useRef<ScrollView>(null);

  const energyLabel = energyLevel ? ENERGY_LABELS[energyLevel - 1] : null;

  const handleDelete = () => {
    if (!existing) return;
    Alert.alert(
      'Deletar registro',
      'Tem certeza que quer deletar esse registro? Essa ação não pode ser desfeita.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Deletar',
          style: 'destructive',
          onPress: async () => {
            setDeleting(true);
            const { error } = await deleteDiaryEntry(existing.id);
            setDeleting(false);
            if (error) {
              Alert.alert('Erro', 'Não foi possível deletar. Tente novamente.');
            } else {
              navigation.goBack();
            }
          },
        },
      ],
    );
  };

  const handleDateChange = (event: DateTimePickerEvent, selected?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (event.type === 'set' && selected) {
      setEntryDate(toDateStr(selected));
    }
  };

  const saveEntry = async (conflictingIdToRemove?: string) => {
    if (!user) return;
    setSaving(true);

    if (conflictingIdToRemove) {
      await deleteDiaryEntry(conflictingIdToRemove);
    }

    const payload = {
      user_id: user.id,
      date: entryDate,
      feeding: feeding.trim() || null,
      used_litter_box: usedLitterBox,
      energy_level: energyLevel,
      blood_pressure: bloodPressure.trim() || null,
      notes: notes.trim() || null,
    };

    const { error } = existing
      ? await updateDiaryEntry(existing.id, payload)
      : await upsertDiaryEntry(payload);

    setSaving(false);

    if (error) {
      Alert.alert('Erro', 'Não foi possível salvar. Tente novamente.');
    } else {
      navigation.goBack();
    }
  };

  const handleSave = async () => {
    if (!user) return;

    const dateChanged = !existing || existing.date !== entryDate;
    if (dateChanged) {
      const { data: conflicting } = await fetchDiaryEntryByDate(user.id, entryDate);
      if (conflicting && conflicting.id !== existing?.id) {
        Alert.alert(
          'Já existe um registro nessa data',
          'Salvar vai substituir o registro existente para essa data. Deseja continuar?',
          [
            { text: 'Cancelar', style: 'cancel' },
            { text: 'Substituir', style: 'destructive', onPress: () => saveEntry(conflicting.id) },
          ],
        );
        return;
      }
    }

    saveEntry();
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={[styles.container, { paddingTop: insets.top }]}>
          <View style={styles.headerRow}>
            <TouchableOpacity style={commonStyles.backButton} onPress={() => navigation.goBack()}>
              <Text style={commonStyles.backArrow}>‹</Text>
            </TouchableOpacity>
            <View style={styles.headerTexts}>
              <Text style={styles.headerTitle}>
                {existing ? 'Editar registro' : 'Novo registro'}
              </Text>
              <Text style={styles.headerSubtitle}>{formatDateLabel(entryDate)}</Text>
            </View>
            <View style={styles.headerSpacer} />
          </View>

          <ScrollView
            ref={scrollRef}
            contentContainerStyle={[
              styles.scrollContent,
              { paddingBottom: Math.max(insets.bottom, 16) + 16 },
            ]}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.field}>
              <Text style={styles.label}>Data</Text>
              <TouchableOpacity
                style={[styles.input, styles.dateButton]}
                onPress={() => setShowDatePicker(true)}
              >
                <Text style={styles.dateButtonText}>{formatDateLabel(entryDate)}</Text>
                <Feather name="calendar" size={18} color={colors.textMuted} />
              </TouchableOpacity>
              {showDatePicker && (
                <DateTimePicker
                  value={new Date(entryDate + 'T12:00:00')}
                  mode="date"
                  display="default"
                  maximumDate={new Date()}
                  onChange={handleDateChange}
                />
              )}
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Alimentação</Text>
              <TextInput
                style={styles.input}
                placeholder={`Como o ${catName} comeu hoje?`}
                placeholderTextColor={colors.textMuted}
                value={feeding}
                onChangeText={setFeeding}
                multiline
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Usou a caixinha?</Text>
              <View style={styles.toggleRow}>
                <TouchableOpacity
                  style={[styles.toggleButton, usedLitterBox === true && styles.toggleButtonActive]}
                  onPress={() => setUsedLitterBox(usedLitterBox === true ? null : true)}
                >
                  <Text
                    style={[styles.toggleText, usedLitterBox === true && styles.toggleTextActive]}
                  >
                    ✓ Sim
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.toggleButton, usedLitterBox === false && styles.toggleButtonNo]}
                  onPress={() => setUsedLitterBox(usedLitterBox === false ? null : false)}
                >
                  <Text style={[styles.toggleText, usedLitterBox === false && styles.toggleTextNo]}>
                    ✗ Não
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>
                {'Disposição'}
                {energyLabel ? ` — ${ENERGY_EMOJIS[(energyLevel ?? 1) - 1]} ${energyLabel}` : ''}
              </Text>
              <View style={styles.emojiRow}>
                {ENERGY_EMOJIS.map((emoji, idx) => {
                  const level = idx + 1;
                  const selected = energyLevel === level;
                  return (
                    <TouchableOpacity
                      key={level}
                      style={[styles.emojiButton, selected && styles.emojiButtonSelected]}
                      onPress={() => setEnergyLevel(selected ? null : level)}
                    >
                      <Text style={styles.emojiText}>{emoji}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Pressão arterial</Text>
              <TextInput
                style={styles.input}
                placeholder="Ex: 120/80 (opcional)"
                placeholderTextColor={colors.textMuted}
                value={bloodPressure}
                onChangeText={setBloodPressure}
                keyboardType="numbers-and-punctuation"
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Anotações</Text>
              <TextInput
                style={[styles.input, styles.notesInput]}
                placeholder="Observações sobre o dia (opcional)"
                placeholderTextColor={colors.textMuted}
                value={notes}
                onChangeText={setNotes}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                onFocus={() => {
                  setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
                }}
              />
            </View>

            <View style={styles.bottomButtons}>
              <TouchableOpacity
                style={[commonStyles.saveButton, saving && commonStyles.saveButtonDisabled]}
                onPress={handleSave}
                disabled={saving}
              >
                <Text style={[commonStyles.saveText, saving && commonStyles.saveTextDisabled]}>
                  {saving ? 'Salvando...' : 'Salvar registro'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Text style={styles.cancelText}>Cancelar</Text>
              </TouchableOpacity>
              {existing && (
                <TouchableOpacity onPress={handleDelete} disabled={deleting}>
                  <Text style={[styles.deleteText, deleting && styles.deleteTextDisabled]}>
                    {deleting ? 'Deletando...' : 'Deletar registro'}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </ScrollView>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
