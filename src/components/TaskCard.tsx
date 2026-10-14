import { StyleSheet, Text, View } from "react-native";
import type { Task } from "../types/task";
import StatusBadge from "./StatusBadge";

interface TaskCardProps {
  task: Task;
}

const priorityLabels = {
  baixa: "Baixa",
  media: "Média",
  alta: "Alta",
};

const priorityColors = {
  baixa: "#16A34A",
  media: "#D97706",
  alta: "#DC2626",
};

export default function TaskCard({ task }: TaskCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>{task.title}</Text>
        <StatusBadge status={task.status} />
      </View>

      <Text style={styles.description}>
        {task.description || "Sem descrição"}
      </Text>

      <View style={styles.footer}>
        <Text style={styles.category}>
          Categoria: {task.category}
        </Text>

        <Text
          style={[
            styles.priority,
            { color: priorityColors[task.priority] },
          ]}
        >
          Prioridade: {priorityLabels[task.priority]}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 12,
  },
  header: {
    gap: 10,
    marginBottom: 10,
  },
  title: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#0F172A",
  },
  description: {
    fontSize: 14,
    color: "#64748B",
    lineHeight: 20,
    marginBottom: 14,
  },
  footer: {
    gap: 6,
  },
  category: {
    fontSize: 12,
    color: "#475569",
    textTransform: "capitalize",
  },
  priority: {
    fontSize: 12,
    fontWeight: "600",
  },
});