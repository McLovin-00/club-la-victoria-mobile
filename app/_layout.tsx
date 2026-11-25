import { Stack } from 'expo-router';
import Toast from 'react-native-toast-message';
import { colors } from '../styles/shared.styles';

export default function RootLayout() {
  return (
    <>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: colors.background,
          },
        }}
      >
        <Stack.Screen name="index" />
      </Stack>
      <Toast />
    </>
  );
}
