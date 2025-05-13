import { Stack } from 'expo-router';

export default function GoalDetailsLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="[id]"
        options={{
          headerShown: true,
          headerTitle: 'Goal Details',
          headerBackTitle: 'Back',
        }}
      />
    </Stack>
  );
}