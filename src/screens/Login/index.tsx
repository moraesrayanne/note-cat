import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Alert,
  Keyboard,
  KeyboardAvoidingView,
} from 'react-native';
import { Image } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAuth } from '@/contexts/AuthContext';
import { colors } from '@/theme';
import { catLogin } from '@/assets';
import { styles } from './styles';

export default function LoginScreen() {
  const { signIn, signUp } = useAuth();
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email || !password) {
      Alert.alert('Ops', 'Preencha email e senha');
      return;
    }

    setLoading(true);
    const { error } = isSignUp ? await signUp(email, password) : await signIn(email, password);
    setLoading(false);

    if (error) {
      Alert.alert('Erro', error.message);
    } else if (isSignUp) {
      Alert.alert('Conta criada!', 'Você já pode usar o app.');
    }
  };

  return (
    <KeyboardAvoidingView style={[styles.container, { paddingTop: insets.top }]} behavior="padding">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={styles.content}>
          <View style={styles.photoContainer}>
            <Image
              source={catLogin}
              style={styles.photoImg}
              contentFit="cover"
              transition={200}
              placeholder={{ blurhash: 'LKO2?U%2Tw=w]~RBVZRi};RPxuwH' }}
            />
          </View>
          <Text style={styles.title}>Note Cat</Text>
          <Text style={styles.subtitle}>Controle de medicamentos do seu gato</Text>

          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor={colors.textMuted}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <TextInput
            style={styles.input}
            placeholder="Senha"
            placeholderTextColor={colors.textMuted}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleSubmit}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? 'Aguarde...' : isSignUp ? 'Criar conta' : 'Entrar'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setIsSignUp(!isSignUp)}>
            <Text style={styles.switchText}>
              {isSignUp ? 'Já tem conta? Entrar' : 'Não tem conta? Criar'}
            </Text>
          </TouchableOpacity>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
