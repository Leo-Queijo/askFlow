import { StyleSheet, Text, View } from "react-native";

import { useTheme } from "@/hooks/useTheme";
import type { ThemeColors } from "@/types/theme";
import type { TaskStatus } from "../types/task";

interface StatusBadgeProps {
  status: TaskStatus;
}

const statusLabels: Record<TaskStatus, string> = {
  pendente: "Pendente",
  em_andamento: "Em andamento",
  concluida: "Concluída",
};

const statusColorKeys: Record<TaskStatus, keyof ThemeColors> = {
  pendente: "warning",
  em_andamento: "primary",
  concluida: "success",
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  const { colors } = useTheme();
  const color = colors[statusColorKeys[status]];

  return (
    <View
      style={[styles.badge, { borderColor: color }]}
      accessible
      accessibilityLabel={`Status: ${statusLabels[status]}`}
    >
      <Text style={[styles.label, { color }]}>
        {statusLabels[status]}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: "flex-start",
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 20,
    borderWidth: 1,
  },
  label: {
    fontSize: 12,
    fontWeight: "600",
  },
});
