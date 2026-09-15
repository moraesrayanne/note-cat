import React from 'react';
import {
  ActivityIndicator,
  View,
  TouchableOpacity,
  StyleSheet,
  Text,
} from 'react-native';
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
import {
  HomeIcon,
  HistoryIcon,
  MedsIcon,
  ProfileIcon,
} from './src/components/TabIcons';
import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';
import MedicationsScreen from './src/screens/MedicationsScreen';
import AddMedicationScreen from './src/screens/AddMedicationScreen';
import HistoryScreen from './src/screens/HistoryScreen';
import ProfileScreen from './src/screens/ProfileScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
const RootStack = createNativeStackNavigator();

const TAB_ICON_MAP: Record<
  string,
  React.FC<{ color: string; filled?: boolean }>
> = {
  Hoje: HomeIcon,
  Histórico: HistoryIcon,
  Remédios: MedsIcon,
  Perfil: ProfileIcon,
};

function DummyScreen() {
  return <View />;
}

function AddButton({ onPress }: { onPress: () => void }) {
  return (
    <View style={tabStyles.addButtonWrapper}>
      <TouchableOpacity
        style={tabStyles.addButton}
        onPress={onPress}
        activeOpacity={0.8}
      >
        <Text style={tabStyles.addButtonText}>+</Text>
      </TouchableOpacity>
    </View>
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
          paddingTop: 10,
          height: 95,
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
      <Tab.Screen
        name='Hoje'
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name='Histórico'
        component={HistoryScreen}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name='Adicionar'
        component={DummyScreen}
        options={({ navigation }) => ({
          headerShown: false,
          tabBarLabel: () => null,
          tabBarIcon: () => null,
          tabBarButton: (props) => (
            <AddButton
              onPress={() => navigation.navigate('AddMedication', {})}
            />
          ),
        })}
      />
      <Tab.Screen
        name='Remédios'
        component={MedicationsScreen}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name='Perfil'
        component={ProfileScreen}
        options={{ headerShown: false }}
      />
    </Tab.Navigator>
  );
}

const tabStyles = StyleSheet.create({
  addButtonWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButton: {
    width: 56,
    height: 56,
    borderRadius: 15,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6,
  },
  addButtonText: {
    color: '#FFF',
    fontSize: 30,
    fontWeight: '300',
    marginTop: -2,
  },
});

function AppContent() {
  const { session, loading } = useAuth();

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: colors.background,
        }}
      >
        <ActivityIndicator size='large' color={colors.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {session ? (
        <RootStack.Navigator screenOptions={{ headerShown: false }}>
          <RootStack.Screen name='Tabs' component={MainTabs} />
          <RootStack.Screen
            name='AddMedication'
            component={AddMedicationScreen}
          />
        </RootStack.Navigator>
      ) : (
        <LoginScreen />
      )}
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
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: colors.background,
        }}
      >
        <ActivityIndicator size='large' color={colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <AuthProvider>
        <StatusBar style='dark' />
        <AppContent />
      </AuthProvider>
    </SafeAreaProvider>
  );
}
