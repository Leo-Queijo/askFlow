import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useColorScheme } from "react-native";

import { getThemeMode, saveThemeMode } from "../services/preferencesStorage";
import type { ThemeColors, ThemeMode } from "../types/theme";

export const lightColors: ThemeColors = {
  background: "#F8FAFC",
  card: "#FFFFFF",
  text: "#0F172A",
  primary: "#2563EB",
  secondary: "#64748B",
  success: "#16A34A",
  error: "#DC2626",
  warning: "#D97706",
  border: "#E2E8F0",
  muted: "#E2E8F0",
  onPrimary: "#FFFFFF",
};

export const darkColors: ThemeColors = {
  background: "#0F172A",
  card: "#1E293B",
  text: "#F1F5F9",
  primary: "#3B82F6",
  secondary: "#94A3B8",
  success: "#22C55E",
  error: "#EF4444",
  warning: "#F59E0B",
  border: "#334155",
  muted: "#334155",
  onPrimary: "#FFFFFF",
};

interface ThemeContextData {
  mode: ThemeMode;
  isDark: boolean;
  colors: ThemeColors;
  isLoading: boolean;
  setThemeMode: (mode: ThemeMode) => Promise<void>;
  toggleTheme: () => Promise<void>;
}

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeContext = createContext<ThemeContextData | undefined>(
  undefined,
);

export function ThemeProvider({ children }: ThemeProviderProps) {
  const systemScheme = useColorScheme();

  // null = o usuário ainda não escolheu; segue o tema do sistema.
  const [storedMode, setStoredMode] = useState<ThemeMode | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function restoreTheme() {
      try {
        setStoredMode(await getThemeMode());
      } catch (error) {
        console.error("Erro ao recuperar tema:", error);
      } finally {
        setIsLoading(false);
      }
    }

    void restoreTheme();
  }, []);

  const mode: ThemeMode =
    storedMode ?? (systemScheme === "dark" ? "dark" : "light");

  const setThemeMode = useCallback(async (nextMode: ThemeMode) => {
    // Atualiza a tela na hora; se falhar ao salvar, o tema vale só nesta sessão.
    setStoredMode(nextMode);

    try {
      await saveThemeMode(nextMode);
    } catch {
      throw new Error("Não foi possível salvar a preferência de tema.");
    }
  }, []);

  const toggleTheme = useCallback(
    () => setThemeMode(mode === "dark" ? "light" : "dark"),
    [mode, setThemeMode],
  );

  const value = useMemo(
    () => ({
      mode,
      isDark: mode === "dark",
      colors: mode === "dark" ? darkColors : lightColors,
      isLoading,
      setThemeMode,
      toggleTheme,
    }),
    [mode, isLoading, setThemeMode, toggleTheme],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}
