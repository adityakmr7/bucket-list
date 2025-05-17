import { Stack } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';

export default function OnboardingLayout() {
  const { getColor } = useTheme();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: getColor('background'),
        },
      }}
    >
      <Stack.Screen name="index" />
    </Stack>
  );
} 