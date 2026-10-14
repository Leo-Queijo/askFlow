
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Platform,
    Pressable,
    StyleSheet,
    Text,
    View
} from 'react-native';

import { useTasks } from '@/hooks/useTasks';
import { useTheme } from '@/hooks/useTheme';
import type { ThemeColors } from '@/types/theme';

export default function TaskDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getTaskById, deleteTask } = useTasks();
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');

  const task = getTaskById(id);

  async function confirmDelete() {
    setDeleting(true);
    setError('');

    try {
      await deleteTask(id);
      router.replace('/tasks');
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Erro ao excluir tarefa';
      setError(message);
    } finally {
      setDeleting(false);
    }
  }


function handleDelete() {
  const message = 'Tem certeza que deseja excluir esta tarefa?';

  if (Platform.OS === 'web') {
    const confirmed = window.confirm(message);

    if (confirmed) {
      void confirmDelete();
    }

    return;
  }

  Alert.alert('Excluir tarefa', message, [
    {
      text: 'Cancelar',
      style: 'cancel',
    },
    {
      text: 'Excluir',
      style: 'destructive',
      onPress: () => void confirmDelete(),
    },
  ]);
}


  if (!task) {
    return (
      <View style={styles.center}>
        <Text style={styles.info}>Tarefa não encontrada.</Text>
        <Pressable
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Voltar"
          accessibilityHint="Volta para a tela anterior"
        >
          <Text style={styles.link}>Voltar</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title} accessibilityRole="header">
        {task.title}
      </Text>
      <Text style={styles.description}>{task.description}</Text>

      <Text style={styles.info}>Status: {task.status}</Text>
      <Text style={styles.info}>Prioridade: {task.priority}</Text>
      <Text style={styles.info}>Categoria: {task.category}</Text>
      <Text style={styles.info}>
        Criada em: {new Date(task.createdAt).toLocaleDateString('pt-BR')}
      </Text>
      <Text style={styles.info}>
        Atualizada em: {new Date(task.updatedAt).toLocaleDateString('pt-BR')}
      </Text>

      {error ? (
        <Text style={styles.error} accessibilityRole="alert">
          {error}
        </Text>
      ) : null}

      <Pressable
        style={({ pressed }) => [styles.editButton, pressed && styles.pressed]}
        accessibilityRole="button"
        accessibilityLabel={`Editar tarefa ${task.title}`}
        accessibilityHint="Abre o formulário para alterar esta tarefa"
        onPress={() =>
          router.push({
            pathname: '/tasks/edit',
            params: { id: task.id },
          })
        }
      >
        <Text style={styles.buttonText}>Editar tarefa</Text>
      </Pressable>

      <Pressable
        style={({ pressed }) => [
          styles.deleteButton,
          pressed && styles.pressed,
          deleting && styles.disabled,
        ]}
        accessibilityRole="button"
        accessibilityLabel={`Excluir tarefa ${task.title}`}
        accessibilityHint="Pede confirmação e remove esta tarefa permanentemente"
        accessibilityState={{ disabled: deleting, busy: deleting }}
        disabled={deleting}
        onPress={handleDelete}
      >
        {deleting ? (
          <ActivityIndicator color={colors.onPrimary} />
        ) : (
          <Text style={styles.buttonText}>Excluir tarefa</Text>
        )}
      </Pressable>
    </View>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: colors.background,
    },
    title: {
      fontSize: 26,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 12,
    },
    description: {
      fontSize: 16,
      color: colors.secondary,
      marginBottom: 20,
    },
    info: {
      fontSize: 15,
      color: colors.text,
      marginBottom: 10,
    },
    editButton: {
      backgroundColor: colors.primary,
      padding: 16,
      borderRadius: 10,
      alignItems: 'center',
      marginTop: 20,
    },
    deleteButton: {
      backgroundColor: colors.error,
      padding: 16,
      borderRadius: 10,
      alignItems: 'center',
      marginTop: 12,
    },
    pressed: {
      opacity: 0.85,
    },
    disabled: {
      opacity: 0.6,
    },
    buttonText: {
      color: colors.onPrimary,
      fontWeight: 'bold',
    },
    error: {
      color: colors.error,
      marginTop: 12,
    },
    center: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.background,
    },
    link: {
      color: colors.primary,
      marginTop: 16,
      padding: 8,
    },
  });
}
