import React from 'react';
import { Tabs } from 'expo-router';
import { Platform } from 'react-native';
import { ChartBar as BarChart3, Chrome as Home, Plus, Target, User } from 'lucide-react-native';
import { useAuth } from '@/context/AuthProvider';
import { Redirect } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import { BottomTabHeaderProps } from '@react-navigation/bottom-tabs'
import AppHeader from '@/components/AppHeader';

export default function TabLayout() {
  const { user } = useAuth();
  const { getColor } = useTheme();

  // If user is not authenticated, redirect to auth
  if (!user) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <Tabs
      screenOptions={{
        header: (props: BottomTabHeaderProps) => <AppHeader name={user?.name || ''} headerProps={props} />,
        tabBarActiveTintColor: getColor('primary'),
        tabBarInactiveTintColor: getColor('text.secondary'),
        tabBarStyle: {
          height: Platform.OS === 'ios' ? 90 : 65,
          paddingBottom: Platform.OS === 'ios' ? 30 : 10,
          paddingTop: 10,
          backgroundColor: getColor('card'),
          borderTopColor: getColor('border'),
        },
        tabBarLabelStyle: {
          fontFamily: 'Inter-Medium',
          fontSize: 12,
          marginBottom: Platform.OS === 'ios' ? 0 : 5,
        },
        headerStyle: {
          height: Platform.OS === 'ios' ? 110 : 75,
          shadowOpacity: 0,
          shadowOffset: { width: 0, height: 2 },
          shadowRadius: 4,
          elevation: 0,
          backgroundColor: getColor('card'),
          borderBottomColor: getColor('border'),
        },
        headerTitleStyle: {
          fontFamily: 'Inter-SemiBold',
          fontSize: 18,
          color: getColor('text.primary'),
        },
        headerTitleAlign: 'center',
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color, size }) => (
            <Home color={color} size={size} />
          ),
          headerTitle: 'Dashboard',
          headerShown: true,
        }}
      />
      <Tabs.Screen
        name="goals"
        options={{
          title: 'Goals',
          tabBarIcon: ({ color, size }) => (
            <Target color={color} size={size} />
          ),
          headerTitle: 'My Goals',
          headerShown: true,
        }}
      />
      <Tabs.Screen
        name="add"
        options={{
          title: 'Add',
          tabBarIcon: ({ color, size }) => (
            <Plus color={color} size={size} />
          ),
          headerTitle: 'Add New Goal',
          headerShown: true,
        }}
      />
      <Tabs.Screen
        name="progress"
        options={{
          title: 'Insights',
          tabBarIcon: ({ color, size }) => (
            <BarChart3 color={color} size={size} />
          ),
          headerTitle: 'Goal Insights',
          headerShown: true,
        }}
      />

    </Tabs>
  );
}