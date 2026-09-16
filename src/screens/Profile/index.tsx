import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Alert,
  Keyboard,
} from 'react-native';
import { Image } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';

import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/contexts/ProfileContext';
import { ScreenHeader } from '@/components/ScreenHeader';
import { catIcon, CAT_ICON_BLURHASH } from '@/assets';
import { colors } from '@/theme';
import { saveProfile } from '@/services/profile';
import { commonStyles } from '@/styles/common';
import { styles } from './styles';

export default function ProfileScreen() {
  const { user, signOut } = useAuth();
  const { catName, setCatName } = useProfile();
  const insets = useSafeAreaInsets();
  const [localName, setLocalName] = useState(catName);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  useFocusEffect(
    useCallback(() => {
      setLocalName(catName);
      setEditing(false);
    }, [catName]),
  );

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);

    const trimmed = localName.trim() || 'Baden';
    const { error } = await saveProfile(user.id, trimmed);

    setSaving(false);
    setEditing(false);

    if (error) {
      Alert.alert('Erro', error.message);
    } else {
      setCatName(trimmed);
    }
  };

  const handleSignOut = () => {
    Alert.alert('Sair', 'Tem certeza?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Sair', style: 'destructive', onPress: signOut },
    ]);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <ScreenHeader title="Perfil" subtitle="Informações do gatinho" style={styles.header} />

        <View style={styles.photoContainer}>
          <View style={styles.photoPlaceholder}>
            <Image
              source={catIcon}
              style={styles.photoImg}
              contentFit="cover"
              transition={200}
              placeholder={{ blurhash: CAT_ICON_BLURHASH }}
            />
          </View>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Nome do gatinho</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: Baden"
            placeholderTextColor={colors.textMuted}
            value={localName}
            onChangeText={(text) => {
              setLocalName(text);
              setEditing(true);
            }}
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.cardLabel}>Conta</Text>
          <Text style={styles.cardValue}>{user?.email}</Text>
        </View>

        {editing && (
          <TouchableOpacity
            style={[styles.saveButton, saving && styles.saveButtonDisabled]}
            onPress={handleSave}
            disabled={saving}
          >
            <Text style={commonStyles.saveText}>{saving ? 'Salvando...' : 'Salvar perfil'}</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity style={styles.logoutButton} onPress={handleSignOut}>
          <Text style={styles.logoutText}>Sair da conta</Text>
        </TouchableOpacity>

        <Text style={styles.footer}>Note Cat v1.0</Text>
      </View>
    </TouchableWithoutFeedback>
  );
}
