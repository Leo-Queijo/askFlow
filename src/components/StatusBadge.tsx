import { StyleSheet, Text, View } from "react-native";
import type { TaskStatus } from "../types/task";

interface StatusBadgeProps {
  status: TaskStatus;
}

const statusLabels: Record<TaskStatus, string> = {
  pendente: "Pendente",
  em_andamento: "Em andamento",
  concluida: "Concluída",
};

const statusColors: Record<
  TaskStatus,
  { background: string; text: string }
> = {
  pendente: {
    background: "#FEF3C7",
    text: "#92400E",
  },
  em_andamento: {
    background: "#DBEAFE",
    text: "#1D4ED8",
  },
  concluida: {
    background: "#DCFCE7",
    text: "#166534",
  },
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  const colors = statusColors[status];

  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: colors.background },
      ]}
    >
      <Text style={[styles.label, { color: colors.text }]}>
        {statusLabels[status]}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: "flex-start",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 20,
  },
  label: {
    fontSize: 12,
    fontWeight: "600",
  },
});