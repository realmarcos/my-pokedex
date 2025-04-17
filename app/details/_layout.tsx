import { Stack } from 'expo-router';

export default function StackLayout() {
  return (
    <Stack>
      <Stack.Screen name="[pokemonId]" options={{ headerShown: false }} />
    </Stack>
  );
}