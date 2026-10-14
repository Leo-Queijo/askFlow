
import CustomButton from "@/components/CustomButton";
import Header from "@/components/Header";
import { useAuth } from "@/hooks/useAuth";
import { useTasks } from "@/hooks/useTasks";
import { useTheme } from "@/hooks/useTheme";
import { getRandomQuote, type Quote } from "@/services/api";
import type { ThemeColors } from "@/types/theme";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

export default function HomePage() {
  const { user, logout } = useAuth();
  const { tasks, loading } = useTasks();
  const { colors } = useTheme();
  const styles = createStyles(colors);

  const [quote, setQuote] = useState<Quote | null>(null);
  const [quoteLoading, setQuoteLoading] = useState(true);
  const [quoteError, setQuoteError] = useState<string | null>(null);

  const completedTasks = tasks.filter(
    (task) => task.status === "concluida",
  ).length;

  async function loadQuote() {
    setQuoteLoading(true);
    setQuoteError(null);

    try {
      const result = await getRandomQuote();
      setQuote(result);
    } catch {
      setQuoteError("Não foi possível carregar a frase.");
    } finally {
      setQuoteLoading(false);
    }
  }

  useEffect(() => {
    void loadQuote();
  }, []);

  return (
    <View style={styles.container}>
      <Header
        name={user?.name ?? "Usuário"}
        role={user?.role === "admin" ? "Administrador" : "Usuário"}
        onLogout={() => {
          void logout();
        }}
      />

      <Text style={styles.title} accessibilityRole="header">
        askFlow
      </Text>

      <Text style={styles.subtitle}>
        Olá, {user?.name ?? "usuário"}!
      </Text>

      <Text style={styles.text}>
        Perfil: {user?.role === "admin" ? "Administrador" : "Usuário"}
      </Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle} accessibilityRole="header">
          Resumo das tarefas
        </Text>

        {loading ? (
          <Text style={styles.text}>Carregando tarefas...</Text>
        ) : (
          <>
            <Text style={styles.text}>
              Total de tarefas: {tasks.length}
            </Text>

            <Text style={styles.text}>
              Tarefas concluídas: {completedTasks}
            </Text>
          </>
        )}
      </View>

      <View style={styles.quoteCard}>
        <Text style={styles.cardTitle} accessibilityRole="header">
          Frase motivacional
        </Text>

        {quoteLoading ? (
          <Text style={styles.text}>Carregando frase...</Text>
        ) : quoteError ? (
          <>
            <Text style={styles.error} accessibilityRole="alert">
              {quoteError}
            </Text>
            <CustomButton
              title="Tentar novamente"
              accessibilityHint="Tenta carregar a frase motivacional de novo"
              onPress={() => {
                void loadQuote();
              }}
            />
          </>
        ) : quote ? (
          <>
            <Text style={styles.quoteText}>
              "{quote.quote}"
            </Text>
            <Text style={styles.author}>— {quote.author}</Text>
            <CustomButton
              title="Nova frase"
              accessibilityHint="Carrega outra frase motivacional"
              onPress={() => {
                void loadQuote();
              }}
            />
          </>
        ) : null}
      </View>

      <CustomButton
        title="Ver minhas tarefas"
        accessibilityHint="Abre a lista das suas tarefas"
        onPress={() => router.push("/(tabs)/tasks")}
      />
    </View>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    container: {
      flex: 1,
      padding: 24,
      paddingTop: 10,
      justifyContent: "flex-start",
      backgroundColor: colors.background,
    },
    title: {
      fontSize: 28,
      fontWeight: "bold",
      color: colors.text,
      marginBottom: 16,
    },
    subtitle: {
      fontSize: 22,
      fontWeight: "600",
      color: colors.text,
      marginBottom: 8,
    },
    text: {
      fontSize: 16,
      color: colors.secondary,
      marginBottom: 8,
    },
    card: {
      marginTop: 24,
      padding: 20,
      borderRadius: 12,
      backgroundColor: colors.card,
    },
    cardTitle: {
      fontSize: 18,
      fontWeight: "bold",
      color: colors.text,
      marginBottom: 12,
    },
    quoteCard: {
      marginTop: 16,
      marginBottom: 16,
      padding: 20,
      borderRadius: 12,
      backgroundColor: colors.card,
    },
    quoteText: {
      fontSize: 16,
      fontStyle: "italic",
      color: colors.text,
      marginBottom: 12,
    },
    author: {
      fontSize: 14,
      color: colors.secondary,
      textAlign: "right",
      marginBottom: 16,
    },
    error: {
      fontSize: 14,
      color: colors.error,
      marginBottom: 12,
    },
  });
}
