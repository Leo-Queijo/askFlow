import { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';
import type { ThemeColors } from '../../types/theme';

export function LoginScreen() {
  const { login } = useAuth();
  const { colors } = useTheme();
  const styles = createStyles(colors);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  function handleUsernameChange(text: string) {
    setUsername(text);
    setErrorMessage('');
  }

  function handlePasswordChange(text: string) {
    setPassword(text);
    setErrorMessage('');
  }

  async function handleLogin() {
    const normalizedUsername = username.trim();

    if (!normalizedUsername || !password) {
      setErrorMessage('Informe seu usuário e sua senha.');
      return;
    }

    try {
      setErrorMessage('');
      setIsSubmitting(true);

      await login({
        username: normalizedUsername,
        password,
      });
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : 'Não foi possível realizar o login. Tente novamente.';

      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.card}>
        <Text style={styles.title} accessibilityRole="header">
          askFlow
        </Text>

        <Text style={styles.subtitle}>
          Organize suas tarefas com facilidade
        </Text>

        <Text style={styles.label}>Usuário</Text>

        <TextInput
          style={styles.input}
          placeholder="Digite seu usuário"
          placeholderTextColor={colors.secondary}
          value={username}
          onChangeText={handleUsernameChange}
          autoCapitalize="none"
          autoCorrect={false}
          editable={!isSubmitting}
          accessibilityLabel="Usuário"
          accessibilityHint="Digite o nome de usuário para entrar"
          returnKeyType="next"
        />

        <Text style={styles.label}>Senha</Text>

        <TextInput
          style={styles.input}
          placeholder="Digite sua senha"
          placeholderTextColor={colors.secondary}
          value={password}
          onChangeText={handlePasswordChange}
          secureTextEntry
          autoCapitalize="none"
          autoCorrect={false}
          editable={!isSubmitting}
          accessibilityLabel="Senha"
          accessibilityHint="Digite sua senha para entrar"
          returnKeyType="done"
          onSubmitEditing={() => {
            void handleLogin();
          }}
        />

        {errorMessage ? (
          <View
            style={styles.errorBox}
            accessibilityRole="alert"
            accessibilityLiveRegion="polite"
          >
            <Text style={styles.errorText}>{errorMessage}</Text>
          </View>
        ) : null}

        <Pressable
          style={({ pressed }) => [
            styles.button,
            pressed && styles.buttonPressed,
            isSubmitting && styles.buttonDisabled,
          ]}
          onPress={() => {
            void handleLogin();
          }}
          disabled={isSubmitting}
          accessibilityRole="button"
          accessibilityLabel="Entrar na aplicação"
          accessibilityHint="Valida usuário e senha e abre o aplicativo"
          accessibilityState={{ disabled: isSubmitting, busy: isSubmitting }}
        >
          {isSubmitting ? (
            <ActivityIndicator color={colors.onPrimary} />
          ) : (
            <Text style={styles.buttonText}>Entrar</Text>
          )}
        </Pressable>

        <Text style={styles.hint}>Acesso de teste</Text>

        <Text style={styles.credentials}>
          Administrador: admin / 123
        </Text>

        <Text style={styles.credentials}>
          Usuário comum: user / 123
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      justifyContent: 'center',
      padding: 24,
    },
    card: {
      backgroundColor: colors.card,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: colors.border,
      padding: 24,
      elevation: 4,
      shadowColor: '#000000',
      shadowOffset: {
        width: 0,
        height: 3,
      },
      shadowOpacity: 0.1,
      shadowRadius: 8,
    },
    title: {
      fontSize: 32,
      fontWeight: 'bold',
      color: colors.primary,
      textAlign: 'center',
    },
    subtitle: {
      fontSize: 14,
      color: colors.secondary,
      textAlign: 'center',
      marginTop: 8,
      marginBottom: 28,
    },
    label: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 8,
    },
    input: {
      height: 48,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 10,
      paddingHorizontal: 12,
      marginBottom: 18,
      color: colors.text,
      backgroundColor: colors.card,
    },
    errorBox: {
      borderWidth: 1,
      borderColor: colors.error,
      borderRadius: 10,
      paddingVertical: 10,
      paddingHorizontal: 12,
      marginBottom: 14,
    },
    errorText: {
      color: colors.error,
      fontSize: 14,
      fontWeight: '600',
      textAlign: 'center',
    },
    button: {
      height: 50,
      backgroundColor: colors.primary,
      borderRadius: 10,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 4,
    },
    buttonPressed: {
      opacity: 0.85,
    },
    buttonDisabled: {
      opacity: 0.6,
    },
    buttonText: {
      color: colors.onPrimary,
      fontSize: 16,
      fontWeight: 'bold',
    },
    hint: {
      marginTop: 20,
      fontSize: 12,
      textAlign: 'center',
      color: colors.secondary,
      fontWeight: '600',
    },
    credentials: {
      marginTop: 5,
      fontSize: 12,
      textAlign: 'center',
      color: colors.secondary,
    },
  });
}
