import { StyleSheet, Text, View } from "react-native";

import { useTheme } from "@/hooks/useTheme";
import type { ThemeColors } from "@/types/theme";
import type { Task, TaskPriority } from "../types/task";
import StatusBadge from "./StatusBadge";

interface TaskCardProps {
  task: Task;
}

const priorityLabels = {
  baixa: "Baixa",
  media: "Média",
  alta: "Alta",
};

const priorityColorKeys: Record<TaskPriority, keyof ThemeColors> = {
  baixa: "success",
  media: "warning",
  alta: "error",
};

export default function TaskCard({ task }: TaskCardProps) {
  const { colors } = useTheme();
  const styles = createStyles(colors);

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
            { color: colors[priorityColorKeys[task.priority]] },
          ]}
        >
          Prioridade: {priorityLabels[task.priority]}
        </Text>
      </View>
    </View>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    card: {
      backgroundColor: colors.card,
      padding: 16,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.border,
      marginBottom: 12,
    },
    header: {
      gap: 10,
      marginBottom: 10,
    },
    title: {
      fontSize: 17,
      fontWeight: "bold",
      color: colors.text,
    },
    description: {
      fontSize: 14,
      color: colors.secondary,
      lineHeight: 20,
      marginBottom: 14,
    },
    footer: {
      gap: 6,
    },
    category: {
      fontSize: 12,
      color: colors.secondary,
      textTransform: "capitalize",
    },
    priority: {
      fontSize: 12,
      fontWeight: "600",
    },
  });
}
