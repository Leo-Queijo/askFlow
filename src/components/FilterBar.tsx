import { Pressable, StyleSheet, Text, View } from "react-native";

import { useTheme } from "@/hooks/useTheme";
import type { ThemeColors } from "@/types/theme";
import type { TaskStatusFilter } from "../types/task";

interface FilterBarProps {
  selectedFilter: TaskStatusFilter;
  onSelectFilter: (filter: TaskStatusFilter) => void;
}

const filters: { label: string; value: TaskStatusFilter }[] = [
  { label: "Todas", value: "todas" },
  { label: "Pendentes", value: "pendente" },
  { label: "Em andamento", value: "em_andamento" },
  { label: "Concluídas", value: "concluida" },
];

export default function FilterBar({
  selectedFilter,
  onSelectFilter,
}: FilterBarProps) {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  return (
    <View style={styles.container}>
      {filters.map((filter) => {
        const isSelected = selectedFilter === filter.value;

        return (
          <Pressable
            key={filter.value}
            style={[
              styles.filter,
              isSelected && styles.selectedFilter,
            ]}
            onPress={() => onSelectFilter(filter.value)}
            accessibilityRole="button"
            accessibilityLabel={`Filtrar: ${filter.label}`}
            accessibilityHint="Mostra apenas as tarefas deste status"
            accessibilityState={{ selected: isSelected }}
          >
            <Text
              style={[
                styles.label,
                isSelected && styles.selectedLabel,
              ]}
            >
              {filter.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    container: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 8,
    },
    filter: {
      paddingVertical: 8,
      paddingHorizontal: 12,
      borderRadius: 20,
      backgroundColor: colors.muted,
    },
    selectedFilter: {
      backgroundColor: colors.primary,
    },
    label: {
      fontSize: 13,
      color: colors.text,
      fontWeight: "500",
    },
    selectedLabel: {
      color: colors.onPrimary,
    },
  });
}
