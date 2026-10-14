
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

export default function TaskDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getTaskById, deleteTask } = useTasks();
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
        <Text>Tarefa não encontrada.</Text>
        <Pressable onPress={() => router.back()}>
          <Text style={styles.link}>Voltar</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{task.title}</Text>
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

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Pressable
        style={styles.editButton}
        accessibilityRole="button"
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
        style={styles.deleteButton}
        accessibilityRole="button"
        disabled={deleting}
        onPress={handleDelete}
      >
        {deleting ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={styles.buttonText}>Excluir tarefa</Text>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F8FAFC',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: '#475569',
    marginBottom: 20,
  },
  info: {
    fontSize: 15,
    color: '#334155',
    marginBottom: 10,
  },
  editButton: {
    backgroundColor: '#2563EB',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  deleteButton: {
    backgroundColor: '#DC2626',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 12,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  error: {
    color: '#DC2626',
    marginTop: 12,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  link: {
    color: '#2563EB',
    marginTop: 16,
  },
});
