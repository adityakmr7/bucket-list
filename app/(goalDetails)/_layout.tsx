import { Stack } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';

export default function GoalDetailsLayout() {
  const { getColor } = useTheme();

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: getColor('card'),
        },
        headerTintColor: getColor('text.primary'),
        headerTitleStyle: {
          fontFamily: 'Inter-SemiBold',
          fontSize: 18,
        },
      }}
    >
      <Stack.Screen
        name="[id]"
        options={{
          headerShown: true,
          headerTitle: 'Goal',
          headerBackTitle: 'Back',
        }}
      />
    </Stack>
  );
}