import React from 'react';
import { ActivityIndicator, Keyboard, Pressable, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {
  useFonts,
  DMSans_400Regular,
  DMSans_500Medium,
  DMSans_600SemiBold,
  DMSans_700Bold,
} from '@expo-google-fonts/dm-sans';

import { AuthProvider, useAuth } from './src/contexts/AuthContext';
import { colors, fonts } from './src/theme';
import { HomeIcon, HistoryIcon, MedsIcon, ProfileIcon } from './src/components/TabIcons';
import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';
import MedicationsScreen from './src/screens/MedicationsScreen';
import AddMedicationScreen from './src/screens/AddMedicationScreen';
import HistoryScreen from './src/screens/HistoryScreen';
import ProfileScreen from './src/screens/ProfileScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const TAB_ICON_MAP: Record<string, React.FC<{ color: string; filled?: boolean }>> = {
  Hoje: HomeIcon,
  'Histórico': HistoryIcon,
  'Remédios': MedsIcon,
  Perfil: ProfileIcon,
};

function MedsStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.text,
        headerShadowVisible: false,
        headerTitleStyle: { fontFamily: fonts.bold },
      }}
    >
      <Stack.Screen
        name="MedicationsList"
        component={MedicationsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AddMedication"
        component={AddMedicationScreen}
        options={({ route }: any) => ({
          title: route.params?.medication ? 'Editar remédio' : 'Novo remédio',
          headerBackTitle: ' ',
          headerBackTitleVisible: false,
        })}
      />
    </Stack.Navigator>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.text,
        headerShadowVisible: false,
        headerTitleStyle: { fontFamily: fonts.bold },
        tabBarStyle: {
          backgroundColor: colors.cardBg,
          borderTopColor: colors.navBorder,
          borderTopWidth: 1,
          paddingBottom: 28,
          paddingTop: 12,
          height: 80,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textLight,
        tabBarLabelStyle: {
          fontFamily: fonts.medium,
          fontSize: 10,
        },
        tabBarIcon: ({ focused, color }) => {
          const Icon = TAB_ICON_MAP[route.name];
          if (!Icon) return null;
          return <Icon color={color} filled={focused} />;
        },
      })}
    >
      <Tab.Screen name="Hoje" component={HomeScreen} options={{ headerShown: false }} />
      <Tab.Screen
        name="Histórico"
        component={HistoryScreen}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Remédios"
        component={MedsStack}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Perfil"
        component={ProfileScreen}
        options={{ headerShown: false }}
      />
    </Tab.Navigator>
  );
}

function AppContent() {
  const { session, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {session ? <MainTabs /> : <LoginScreen />}
    </NavigationContainer>
  );
}

export default function App() {
  const [fontsLoaded] = useFonts({
    DMSans_400Regular,
    DMSans_500Medium,
    DMSans_600SemiBold,
    DMSans_700Bold,
  });

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <Pressable style={{ flex: 1 }} onPress={Keyboard.dismiss} accessible={false}>
        <AuthProvider>
          <StatusBar style="dark" />
          <AppContent />
        </AuthProvider>
      </Pressable>
    </SafeAreaProvider>
  );
}
