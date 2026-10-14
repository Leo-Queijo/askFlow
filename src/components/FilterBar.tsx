import { Pressable, StyleSheet, Text, View } from "react-native";
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

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  filter: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: "#E2E8F0",
  },
  selectedFilter: {
    backgroundColor: "#2563EB",
  },
  label: {
    fontSize: 13,
    color: "#334155",
    fontWeight: "500",
  },
  selectedLabel: {
    color: "#FFFFFF",
  },
});