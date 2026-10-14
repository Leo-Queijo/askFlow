import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { LogoutButton } from "@/components/auth/LogoutButton";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/hooks/useTheme";
import { getTreatment, saveTreatment } from "@/services/preferencesStorage";
import type { Treatment } from "@/types/preferences";
import type { ThemeColors } from "@/types/theme";

const treatmentOptions: { label: string; value: Treatment | null }[] = [
  { label: "Sr.", value: "Sr." },
  { label: "Sra.", value: "Sra." },
  { label: "Srta.", value: "Srta." },
  { label: "Nenhum", value: null },
];

function showError(title: string, message: string) {
  if (Platform.OS === "web") {
    console.error(`${title}: ${message}`);
    return;
  }

  Alert.alert(title, message);
}

export default function SettingsScreen() {
  const { user } = useAuth();
  const { colors, isDark, toggleTheme } = useTheme();
  const insets = useSafeAreaInsets();
  const styles = createStyles(colors);

  const userId = user?.id;

  const [treatment, setTreatment] = useState<Treatment | null>(null);
  const [loadingTreatment, setLoadingTreatment] = useState(true);

  useEffect(() => {
    let active = true;

    async function loadTreatment() {
      if (!userId) {
        setLoadingTreatment(false);
        return;
      }

      try {
        const stored = await getTreatment(userId);

        if (active) {
          setTreatment(stored);
        }
      } catch {
        if (active) {
          showError(
            "Erro",
            "Não foi possível carregar a preferência de tratamento.",
          );
        }
      } finally {
        if (active) {
          setLoadingTreatment(false);
        }
      }
    }

    void loadTreatment();

    return () => {
      active = false;
    };
  }, [userId]);

  async function handleToggleTheme() {
    try {
      await toggleTheme();
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Erro ao alterar o tema.";
      showError("Erro", message);
    }
  }

  async function handleSelectTreatment(value: Treatment | null) {
    if (!userId) {
      return;
    }

    const previous = treatment;
    setTreatment(value);

    try {
      await saveTreatment(userId, value);
    } catch {
      setTreatment(previous);
      showError(
        "Erro",
        "Não foi possível salvar a preferência de tratamento.",
      );
    }
  }

  const roleLabel = user?.role === "admin" ? "Administrador" : "Usuário";
  const displayName = user
    ? [treatment, user.name].filter(Boolean).join(" ")
    : "";

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[
        styles.content,
        { paddingTop: insets.top + 16 },
      ]}
    >
      <Text style={styles.heading} accessibilityRole="header">
        Configurações
      </Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle} accessibilityRole="header">
          Perfil
        </Text>

        <View style={styles.row}>
          <Text style={styles.rowLabel}>Nome</Text>
          <Text style={styles.rowValue}>{user?.name ?? "-"}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.rowLabel}>Usuário</Text>
          <Text style={styles.rowValue}>{user?.username ?? "-"}</Text>
        </View>

        <View style={[styles.row, styles.lastRow]}>
          <Text style={styles.rowLabel}>Perfil</Text>
          <Text style={styles.rowValue}>{roleLabel}</Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle} accessibilityRole="header">
          Aparência
        </Text>

        <View style={[styles.row, styles.lastRow]}>
          <Text style={styles.rowLabel}>Tema escuro</Text>
          <Switch
            value={isDark}
            onValueChange={() => {
              void handleToggleTheme();
            }}
            trackColor={{ false: colors.muted, true: colors.primary }}
            thumbColor={colors.onPrimary}
            accessibilityRole="switch"
            accessibilityLabel="Tema escuro"
            accessibilityHint="Alterna entre o tema claro e o tema escuro do aplicativo"
            accessibilityState={{ checked: isDark }}
          />
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle} accessibilityRole="header">
          Tratamento
        </Text>

        <Text style={styles.helper}>
          Escolha como prefere ser chamado no aplicativo.
        </Text>

        {loadingTreatment ? (
          <ActivityIndicator color={colors.primary} />
        ) : (
          <>
            <View style={styles.options} accessibilityRole="radiogroup">
              {treatmentOptions.map((option) => {
                const selected = treatment === option.value;

                return (
                  <Pressable
                    key={option.label}
                    onPress={() => {
                      void handleSelectTreatment(option.value);
                    }}
                    style={({ pressed }) => [
                      styles.option,
                      selected && styles.optionSelected,
                      pressed && styles.pressed,
                    ]}
                    accessibilityRole="radio"
                    accessibilityLabel={
                      option.value
                        ? `Tratamento ${option.label}`
                        : "Sem tratamento"
                    }
                    accessibilityHint="Define como você será chamado no aplicativo"
                    accessibilityState={{ checked: selected }}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        selected && styles.optionTextSelected,
                      ]}
                    >
                      {option.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <Text style={styles.preview}>
              Você será chamado de: {displayName}
            </Text>
          </>
        )}
      </View>

      <LogoutButton />
    </ScrollView>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    content: {
      padding: 20,
      paddingBottom: 40,
      gap: 16,
    },
    heading: {
      fontSize: 26,
      fontWeight: "bold",
      color: colors.text,
      marginBottom: 4,
    },
    card: {
      backgroundColor: colors.card,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.border,
      padding: 16,
    },
    cardTitle: {
      fontSize: 18,
      fontWeight: "bold",
      color: colors.text,
      marginBottom: 8,
    },
    row: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      minHeight: 44,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: colors.border,
      gap: 12,
    },
    lastRow: {
      borderBottomWidth: 0,
    },
    rowLabel: {
      fontSize: 15,
      color: colors.secondary,
    },
    rowValue: {
      flexShrink: 1,
      fontSize: 15,
      fontWeight: "600",
      color: colors.text,
      textAlign: "right",
    },
    helper: {
      fontSize: 14,
      color: colors.secondary,
      marginBottom: 12,
    },
    options: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 8,
    },
    option: {
      minHeight: 44,
      minWidth: 64,
      paddingHorizontal: 16,
      borderRadius: 10,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.muted,
    },
    optionSelected: {
      backgroundColor: colors.primary,
    },
    optionText: {
      fontSize: 15,
      color: colors.text,
    },
    optionTextSelected: {
      color: colors.onPrimary,
      fontWeight: "600",
    },
    pressed: {
      opacity: 0.85,
    },
    preview: {
      marginTop: 14,
      fontSize: 14,
      color: colors.secondary,
    },
  });
}
