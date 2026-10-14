
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
import { useTheme } from '../../hooks/useTheme';
import type { ThemeColors } from '../../types/theme';

export function LogoutButton() {
  const { logout } = useAuth();
  const { colors } = useTheme();
  const styles = createStyles(colors);
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
      accessibilityHint="Encerra a sessão e volta para a tela de login"
      accessibilityState={{ disabled: isLoggingOut, busy: isLoggingOut }}
    >
      {isLoggingOut ? (
        <ActivityIndicator color={colors.onPrimary} />
      ) : (
        <Text style={styles.buttonText}>Sair da conta</Text>
      )}
    </Pressable>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    button: {
      minHeight: 44,
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: 10,
      backgroundColor: colors.error,
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
      color: colors.onPrimary,
      fontSize: 14,
      fontWeight: '600',
    },
  });
}
