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

import { useTasks } from "@/hooks/useTasks";
import type { Task, TaskStatusFilter } from "@/types/task";

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

  const [selectedFilter, setSelectedFilter] =
    useState<TaskStatusFilter>("todas");

  const filteredTasks = filterTasks(selectedFilter);

  function renderTask({ item }: { item: Task }) {
    return (
      <Pressable
  style={styles.taskCard}
  accessibilityRole="button"
  accessibilityLabel={`Abrir detalhes de ${item.title}`}
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
        <ActivityIndicator size="large" color="#2563EB" />
        <Text>Carregando tarefas...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Minhas tarefas</Text>

      <Pressable
        style={{
            backgroundColor: '#2563EB',
            padding: 14,
            borderRadius: 10,
            alignItems: 'center',
            marginBottom: 16,
        }}
        accessibilityRole="button"
        onPress={() => router.push('/tasks/new')}
        >
         <Text style={{ color: '#FFFFFF', fontWeight: 'bold' }}>
            + Nova tarefa
         </Text>
        </Pressable>

      <View style={styles.filterContainer}>
        {filters.map((filter) => (

            
          <Pressable
            key={filter.value}
            accessibilityRole="button"
            accessibilityLabel={`Filtrar: ${filter.label}`}
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
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <Pressable
            accessibilityRole="button"
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#F8FAFC",
  },
  heading: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#0F172A",
    marginBottom: 20,
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
    backgroundColor: "#E2E8F0",
    borderRadius: 20,
  },
  filterSelected: {
    backgroundColor: "#2563EB",
  },
  filterText: {
    color: "#334155",
    fontSize: 13,
  },
  filterTextSelected: {
    color: "#FFFFFF",
  },
  listContent: {
    paddingBottom: 30,
    flexGrow: 1,
  },
  taskCard: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  taskTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0F172A",
    marginBottom: 8,
  },
  taskDescription: {
    fontSize: 14,
    color: "#475569",
    marginBottom: 10,
  },
  taskInfo: {
    fontSize: 13,
    color: "#64748B",
    marginTop: 4,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  errorContainer: {
    padding: 12,
    backgroundColor: "#FEE2E2",
    borderRadius: 8,
    marginBottom: 12,
  },
  errorText: {
    color: "#B91C1C",
  },
  retryText: {
    color: "#1D4ED8",
    fontWeight: "bold",
    marginTop: 8,
  },
  emptyText: {
    textAlign: "center",
    color: "#64748B",
    marginTop: 40,
  },
});
