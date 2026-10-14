import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

import { useTasks } from "@/hooks/useTasks";
import { useTheme } from "@/hooks/useTheme";
import type {
    TaskCategory,
    TaskInput,
    TaskPriority,
    TaskStatus,
} from "@/types/task";
import type { ThemeColors } from "@/types/theme";

const statuses: TaskStatus[] = ["pendente", "em_andamento", "concluida"];

const priorities: TaskPriority[] = ["baixa", "media", "alta"];

const categories: TaskCategory[] = [
  "pessoal",
  "estudos",
  "trabalho",
  "saude",
  "outros",
];

export default function TaskFormScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { addTask, updateTask, getTaskById, loading } = useTasks();
  const { colors } = useTheme();
  const styles = createStyles(colors);

  const existingTask = id ? getTaskById(id) : undefined;
  const isEditing = Boolean(id);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<TaskStatus>("pendente");
  const [priority, setPriority] = useState<TaskPriority>("media");
  const [category, setCategory] = useState<TaskCategory>("pessoal");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (existingTask) {
      setTitle(existingTask.title);
      setDescription(existingTask.description);
      setStatus(existingTask.status);
      setPriority(existingTask.priority);
      setCategory(existingTask.category);
    }
  }, [existingTask]);

  async function handleSave() {
    setError("");

    if (title.trim().length < 3) {
      setError("O título deve ter pelo menos 3 caracteres.");
      return;
    }

    if (description.trim().length < 5) {
      setError("A descrição deve ter pelo menos 5 caracteres.");
      return;
    }

    const input: TaskInput = {
      title: title.trim(),
      description: description.trim(),
      status,
      priority,
      category,
    };

    setSaving(true);

    try {
      if (isEditing && id) {
        await updateTask(id, input);
      } else {
        await addTask(input);
      }

      router.back();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Erro ao salvar tarefa";

      setError(message);
      Alert.alert("Erro", message);
    } finally {
      setSaving(false);
    }
  }

  function renderOptions<T extends string>(
    label: string,
    options: T[],
    selected: T,
    onChange: (value: T) => void,
  ) {
    return (
      <View style={styles.field}>
        <Text style={styles.label}>{label}</Text>
        <View style={styles.options} accessibilityRole="radiogroup">
          {options.map((option) => {
            const optionLabel = option.replace(/_/g, " ");

            return (
              <Pressable
                key={option}
                accessibilityRole="radio"
                accessibilityLabel={`${label}: ${optionLabel}`}
                accessibilityHint={`Define ${label.toLowerCase()} da tarefa`}
                accessibilityState={{ checked: selected === option }}
                onPress={() => onChange(option)}
                style={[
                  styles.option,
                  selected === option && styles.selectedOption,
                ]}
              >
                <Text
                  style={[
                    styles.optionText,
                    selected === option && styles.selectedText,
                  ]}
                >
                  {optionLabel}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (isEditing && !existingTask) {
    return (
      <View style={styles.center}>
        <Text style={styles.label}>Tarefa não encontrada.</Text>
        <Pressable
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Voltar"
          accessibilityHint="Volta para a tela anterior"
        >
          <Text style={styles.backText}>Voltar</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.heading} accessibilityRole="header">
        {isEditing ? "Editar tarefa" : "Nova tarefa"}
      </Text>

      <Text style={styles.label}>Título *</Text>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        placeholder="Digite o título"
        placeholderTextColor={colors.secondary}
        accessibilityLabel="Título da tarefa"
        accessibilityHint="Obrigatório, com pelo menos 3 caracteres"
        maxLength={100}
      />

      <Text style={styles.label}>Descrição *</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        value={description}
        onChangeText={setDescription}
        placeholder="Descreva a tarefa"
        placeholderTextColor={colors.secondary}
        accessibilityLabel="Descrição da tarefa"
        accessibilityHint="Obrigatória, com pelo menos 5 caracteres"
        multiline
        numberOfLines={4}
        textAlignVertical="top"
      />

      {renderOptions("Status", statuses, status, setStatus)}
      {renderOptions("Prioridade", priorities, priority, setPriority)}
      {renderOptions("Categoria", categories, category, setCategory)}

      {error ? (
        <Text style={styles.error} accessibilityRole="alert">
          {error}
        </Text>
      ) : null}

      <Pressable
        style={[styles.saveButton, saving && styles.disabled]}
        disabled={saving}
        accessibilityRole="button"
        accessibilityLabel={isEditing ? "Salvar alterações" : "Cadastrar tarefa"}
        accessibilityHint={
          isEditing
            ? "Salva as alterações e volta para a tela anterior"
            : "Cria a tarefa e volta para a lista"
        }
        accessibilityState={{ disabled: saving, busy: saving }}
        onPress={() => void handleSave()}
      >
        {saving ? (
          <ActivityIndicator color={colors.onPrimary} />
        ) : (
          <Text style={styles.saveText}>
            {isEditing ? "Salvar alterações" : "Cadastrar tarefa"}
          </Text>
        )}
      </Pressable>
    </ScrollView>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    content: { padding: 20, paddingBottom: 60 },
    heading: {
      fontSize: 26,
      fontWeight: "bold",
      color: colors.text,
      marginBottom: 24,
    },
    label: {
      fontSize: 15,
      fontWeight: "600",
      color: colors.text,
      marginBottom: 8,
    },
    input: {
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 10,
      padding: 14,
      fontSize: 16,
      color: colors.text,
      marginBottom: 20,
    },
    textArea: { minHeight: 110 },
    field: { marginBottom: 22 },
    options: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
    option: {
      paddingHorizontal: 14,
      paddingVertical: 10,
      backgroundColor: colors.muted,
      borderRadius: 8,
    },
    selectedOption: { backgroundColor: colors.primary },
    optionText: { color: colors.text, textTransform: "capitalize" },
    selectedText: { color: colors.onPrimary, fontWeight: "600" },
    error: { color: colors.error, marginBottom: 16 },
    saveButton: {
      backgroundColor: colors.primary,
      padding: 16,
      borderRadius: 10,
      alignItems: "center",
    },
    saveText: { color: colors.onPrimary, fontWeight: "bold", fontSize: 16 },
    disabled: { opacity: 0.6 },
    center: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.background,
    },
    backText: { color: colors.primary, marginTop: 16, padding: 8 },
  });
}
