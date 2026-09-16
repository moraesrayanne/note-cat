import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, fonts } from '@/theme';
import { RootStackParamList, TabParamList } from '@/navigation/types';
import { HomeIcon, HistoryIcon, MedsIcon, ProfileIcon } from '@/components/TabIcons';
import HomeScreen from '@/screens/Home';
import MedicationsScreen from '@/screens/Medications';
import AddMedicationScreen from '@/screens/AddMedication';
import HistoryScreen from '@/screens/History';
import ProfileScreen from '@/screens/Profile';
import DiaryScreen from '@/screens/Diary';
import AddDiaryEntryScreen from '@/screens/AddDiaryEntry';

const Tab = createBottomTabNavigator<TabParamList>();
const RootStack = createNativeStackNavigator<RootStackParamList>();

const TAB_ICON_MAP: Record<string, React.FC<{ color: string; filled?: boolean }>> = {
  Hoje: HomeIcon,
  Histórico: HistoryIcon,
  Remédios: MedsIcon,
  Perfil: ProfileIcon,
};

function DummyScreen() {
  return <View />;
}

function AddButton() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  return (
    <View style={styles.addButtonWrapper}>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('AddMedication', {})}
        activeOpacity={0.8}
      >
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

function MainTabs() {
  const insets = useSafeAreaInsets();
  const bottomPadding = insets.bottom + 20;

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
          paddingBottom: bottomPadding,
          paddingTop: 10,
          height: 60 + bottomPadding,
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
      <Tab.Screen name="Remédios" component={MedicationsScreen} options={{ headerShown: false }} />
      <Tab.Screen
        name="Adicionar"
        component={DummyScreen}
        options={{
          headerShown: false,
          tabBarLabel: () => null,
          tabBarIcon: () => null,
          tabBarButton: () => <AddButton />,
        }}
      />
      <Tab.Screen name="Histórico" component={HistoryScreen} options={{ headerShown: false }} />
      <Tab.Screen name="Perfil" component={ProfileScreen} options={{ headerShown: false }} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        <RootStack.Screen name="Tabs" component={MainTabs} />
        <RootStack.Screen name="AddMedication" component={AddMedicationScreen} />
        <RootStack.Screen name="Diary" component={DiaryScreen} />
        <RootStack.Screen name="AddDiaryEntry" component={AddDiaryEntryScreen} />
      </RootStack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
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
