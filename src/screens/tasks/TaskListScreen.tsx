import { router } from 'expo-router';
import { useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useTasks } from "@/hooks/useTasks";
import { useTheme } from "@/hooks/useTheme";
import type { Task, TaskStatusFilter } from "@/types/task";
import type { ThemeColors } from "@/types/theme";

const filters: {
  label: string;
  value: TaskStatusFilter;
}[] = [
  { label: "Todas", value: "todas" },
  { label: "Pendentes", value: "pendente" },
  { label: "Em andamento", value: "em_andamento" },
  { label: "Concluídas", value: "concluida" },
];

const statusLabels = {
  pendente: "Pendente",
  em_andamento: "Em andamento",
  concluida: "Concluída",
};

export default function TaskListScreen() {
  const { loading, error, filterTasks, refreshTasks } = useTasks();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const styles = createStyles(colors);

  const [selectedFilter, setSelectedFilter] =
    useState<TaskStatusFilter>("todas");

  const filteredTasks = filterTasks(selectedFilter);

  function renderTask({ item }: { item: Task }) {
    return (
      <Pressable
        style={({ pressed }) => [styles.taskCard, pressed && styles.pressed]}
        accessibilityRole="button"
        accessibilityLabel={`Abrir detalhes de ${item.title}`}
        accessibilityHint="Mostra todos os dados da tarefa, com opções de editar e excluir"
        onPress={() =>
          router.push({
            pathname: "/tasks/[id]",
            params: { id: item.id },
          })
        }
      >
        <Text style={styles.taskTitle}>{item.title}</Text>

        <Text style={styles.taskDescription}>{item.description}</Text>

        <Text style={styles.taskInfo}>Status: {statusLabels[item.status]}</Text>

        <Text style={styles.taskInfo}>Categoria: {item.category}</Text>

        <Text style={styles.taskInfo}>Prioridade: {item.priority}</Text>

        <Text style={styles.taskInfo}>
          Criada em: {new Date(item.createdAt).toLocaleDateString("pt-BR")}
        </Text>

        <Text style={styles.taskInfo}>
          Atualizada em: {new Date(item.updatedAt).toLocaleDateString("pt-BR")}
        </Text>
      </Pressable>
    );
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.taskInfo}>Carregando tarefas...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top + 16 }]}>
      <Text style={styles.heading} accessibilityRole="header">
        Minhas tarefas
      </Text>

      <Pressable
        style={({ pressed }) => [styles.newButton, pressed && styles.pressed]}
        accessibilityRole="button"
        accessibilityLabel="Nova tarefa"
        accessibilityHint="Abre o formulário para cadastrar uma tarefa"
        onPress={() => router.push('/tasks/new')}
      >
        <Text style={styles.newButtonText}>+ Nova tarefa</Text>
      </Pressable>

      <View style={styles.filterContainer}>
        {filters.map((filter) => (
          <Pressable
            key={filter.value}
            accessibilityRole="button"
            accessibilityLabel={`Filtrar: ${filter.label}`}
            accessibilityHint="Mostra apenas as tarefas deste status"
            accessibilityState={{
              selected: selectedFilter === filter.value,
            }}
            onPress={() => setSelectedFilter(filter.value)}
            style={[
              styles.filterButton,
              selectedFilter === filter.value && styles.filterSelected,
            ]}
          >
            <Text
              style={[
                styles.filterText,
                selectedFilter === filter.value && styles.filterTextSelected,
              ]}
            >
              {filter.label}
            </Text>
          </Pressable>
        ))}
      </View>

      {error && (
        <View style={styles.errorContainer} accessibilityRole="alert">
          <Text style={styles.errorText}>{error}</Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Tentar novamente"
            accessibilityHint="Recarrega a lista de tarefas"
            onPress={() => {
              void refreshTasks().catch(() => {});
            }}
          >
            <Text style={styles.retryText}>Tentar novamente</Text>
          </Pressable>
        </View>
      )}

      <FlatList
        data={filteredTasks}
        keyExtractor={(item) => item.id}
        renderItem={renderTask}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Nenhuma tarefa encontrada.</Text>
        }
      />
    </View>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
      backgroundColor: colors.background,
    },
    heading: {
      fontSize: 26,
      fontWeight: "bold",
      color: colors.text,
      marginBottom: 20,
    },
    newButton: {
      backgroundColor: colors.primary,
      padding: 14,
      borderRadius: 10,
      alignItems: 'center',
      marginBottom: 16,
    },
    newButtonText: {
      color: colors.onPrimary,
      fontWeight: 'bold',
    },
    pressed: {
      opacity: 0.85,
    },
    filterContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 8,
      marginBottom: 16,
    },
    filterButton: {
      paddingVertical: 8,
      paddingHorizontal: 12,
      backgroundColor: colors.muted,
      borderRadius: 20,
    },
    filterSelected: {
      backgroundColor: colors.primary,
    },
    filterText: {
      color: colors.text,
      fontSize: 13,
    },
    filterTextSelected: {
      color: colors.onPrimary,
    },
    listContent: {
      paddingBottom: 30,
      flexGrow: 1,
    },
    taskCard: {
      backgroundColor: colors.card,
      padding: 16,
      borderRadius: 12,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: colors.border,
    },
    taskTitle: {
      fontSize: 18,
      fontWeight: "bold",
      color: colors.text,
      marginBottom: 8,
    },
    taskDescription: {
      fontSize: 14,
      color: colors.secondary,
      marginBottom: 10,
    },
    taskInfo: {
      fontSize: 13,
      color: colors.secondary,
      marginTop: 4,
    },
    center: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.background,
    },
    errorContainer: {
      padding: 12,
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.error,
      borderRadius: 8,
      marginBottom: 12,
    },
    errorText: {
      color: colors.error,
    },
    retryText: {
      color: colors.primary,
      fontWeight: "bold",
      marginTop: 8,
    },
    emptyText: {
      textAlign: "center",
      color: colors.secondary,
      marginTop: 40,
    },
  });
}
