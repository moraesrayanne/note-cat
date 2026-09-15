import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { colors, fonts } from '../theme';

export default function ProfileScreen() {
  const { user, catName, setCatName, signOut } = useAuth();
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

  const saveProfile = async () => {
    if (!user) return;
    setSaving(true);

    const trimmed = localName.trim() || 'Baden';
    const profileData = {
      user_id: user.id,
      cat_name: trimmed,
    };

    const { data: existing } = await supabase
      .from('profiles')
      .select('user_id')
      .eq('user_id', user.id)
      .single();

    let error;
    if (existing) {
      ({ error } = await supabase
        .from('profiles')
        .update(profileData)
        .eq('user_id', user.id));
    } else {
      ({ error } = await supabase.from('profiles').insert(profileData));
    }

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
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Perfil</Text>
        <Text style={styles.subtitle}>Informações do gatinho</Text>
      </View>

      <View style={styles.photoContainer}>
        <View style={styles.photoPlaceholder}>
          <Image
            source={require('../../assets/cat-icon.png')}
            style={styles.photoImg}
          />
        </View>
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Nome do gatinho</Text>
        <TextInput
          style={styles.input}
          placeholder='Ex: Baden'
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
          onPress={saveProfile}
          disabled={saving}
        >
          <Text style={styles.saveText}>
            {saving ? 'Salvando...' : 'Salvar perfil'}
          </Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity style={styles.logoutButton} onPress={handleSignOut}>
        <Text style={styles.logoutText}>Sair da conta</Text>
      </TouchableOpacity>

      <Text style={styles.footer}>Note Cat v1.0</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 24,
  },
  header: {
    marginBottom: 24,
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
  photoContainer: {
    alignSelf: 'center',
    marginBottom: 28,
  },
  photoPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: colors.primaryBorder,
    backgroundColor: colors.primaryBg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoImg: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  field: {
    marginBottom: 20,
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
  card: {
    backgroundColor: colors.cardBg,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 20,
  },
  cardLabel: {
    fontSize: 12,
    color: colors.textMuted,
    fontFamily: fonts.semibold,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  cardValue: {
    fontSize: 16,
    color: colors.text,
    fontFamily: fonts.medium,
    marginTop: 4,
  },
  saveButton: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 4,
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveText: {
    color: '#FFF',
    fontSize: 16,
    fontFamily: fonts.bold,
  },
  logoutButton: {
    backgroundColor: colors.cardBg,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.primary,
  },
  logoutText: {
    color: colors.primary,
    fontSize: 16,
    fontFamily: fonts.semibold,
  },
  footer: {
    textAlign: 'center',
    color: colors.textLight,
    marginTop: 'auto',
    paddingBottom: 16,
    fontSize: 13,
    fontFamily: fonts.regular,
  },
});
