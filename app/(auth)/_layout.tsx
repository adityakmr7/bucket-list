import React from 'react';
import { Stack } from 'expo-router';
import { useAuth } from '@/context/AuthProvider';
import { Redirect } from 'expo-router';

export default function AuthLayout() {
  const { user, loading } = useAuth();

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
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
    </Stack>
  );
}