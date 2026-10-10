
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Platform,
  Pressable,
  StyleSheet,
  Text,
} from 'react-native';

import { useAuth } from '../../hooks/useAuth';

export function LogoutButton() {
  const { logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  async function handleLogout() {
    try {
      setIsLoggingOut(true);
      await logout();
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : 'Não foi possível sair da conta.';

      if (Platform.OS === 'web') {
        console.error(message);
      } else {
        Alert.alert('Erro ao sair', message);
      }
    } finally {
      setIsLoggingOut(false);
    }
  }

  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        pressed && styles.buttonPressed,
        isLoggingOut && styles.buttonDisabled,
      ]}
      onPress={() => {
        void handleLogout();
      }}
      disabled={isLoggingOut}
      accessibilityRole="button"
      accessibilityLabel="Sair da conta"
    >
      {isLoggingOut ? (
        <ActivityIndicator color="#FFFFFF" />
      ) : (
        <Text style={styles.buttonText}>Sair da conta</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 44,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#DC2626',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonPressed: {
    opacity: 0.85,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});
