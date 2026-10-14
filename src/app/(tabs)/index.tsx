
import CustomButton from "@/components/CustomButton";
import Header from "@/components/Header";
import { useAuth } from "@/hooks/useAuth";
import { useTasks } from "@/hooks/useTasks";
import { getRandomQuote, type Quote } from "@/services/api";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

export default function HomePage() {
  const { user, logout } = useAuth();
  const { tasks, loading } = useTasks();

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

      <Text style={styles.title}>askFlow</Text>

      <Text style={styles.subtitle}>
        Olá, {user?.name ?? "usuário"}!
      </Text>

      <Text style={styles.text}>
        Perfil: {user?.role === "admin" ? "Administrador" : "Usuário"}
      </Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Resumo das tarefas</Text>

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
        <Text style={styles.cardTitle}>Frase motivacional</Text>

        {quoteLoading ? (
          <Text style={styles.text}>Carregando frase...</Text>
        ) : quoteError ? (
          <>
            <Text style={styles.error}>{quoteError}</Text>
            <CustomButton
              title="Tentar novamente"
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
              onPress={() => {
                void loadQuote();
              }}
            />
          </>
        ) : null}
      </View>

      <CustomButton
        title="Ver minhas tarefas"
        onPress={() => router.push("/(tabs)/tasks")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
    backgroundColor: "#F8FAFC",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#0F172A",
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 22,
    fontWeight: "600",
    color: "#0F172A",
    marginBottom: 8,
  },
  text: {
    fontSize: 16,
    color: "#475569",
    marginBottom: 8,
  },
  card: {
    marginTop: 24,
    padding: 20,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0F172A",
    marginBottom: 12,
  },
  quoteCard: {
    marginTop: 16,
    padding: 20,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
  },
  quoteText: {
    fontSize: 16,
    fontStyle: "italic",
    color: "#334155",
    marginBottom: 12,
  },
  author: {
    fontSize: 14,
    color: "#64748B",
    textAlign: "right",
    marginBottom: 16,
  },
  error: {
    fontSize: 14,
    color: "#DC2626",
    marginBottom: 12,
  },
});
