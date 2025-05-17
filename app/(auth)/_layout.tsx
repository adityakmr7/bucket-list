import React from 'react';
import { Stack } from 'expo-router';
import { useAuth } from '@/context/AuthProvider';
import { Redirect } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';

export default function AuthLayout() {
  const { user, loading } = useAuth();
  const { getColor } = useTheme();

  // Show loading state
  if (loading) {
    return null;
  }

  // If user is authenticated, redirect to the main app
  if (user) {
    return <Redirect href="/(tabs)" />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: getColor('background'),
        },
      }}
    >
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
    </Stack>
  );
}