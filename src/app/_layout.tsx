import { DarkTheme, DefaultTheme, Slot, ThemeProvider } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { ActivityIndicator, StyleSheet, View } from "react-native";

import { AuthProvider } from "@/context/AuthContext";
import { TaskProvider } from "@/context/TaskContent";
import { ThemeProvider as AppThemeProvider } from "@/context/ThemeContext";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/hooks/useTheme";
import { LoginScreen } from "@/screens/auth/LoginScreen";

SplashScreen.preventAutoHideAsync();

function AuthenticatedLayout() {
  const { user, isLoading } = useAuth();
  const { colors, isLoading: themeLoading } = useTheme();

  if (isLoading || themeLoading) {
    return (
      <View style={[styles.loading, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!user) {
    return <LoginScreen />;
  }

  return <Slot />;
}

function NavigationThemeLayout() {
  const { isDark } = useTheme();

  return (
    <ThemeProvider value={isDark ? DarkTheme : DefaultTheme}>
      <AuthenticatedLayout />
    </ThemeProvider>
  );
}

export default function TabLayout() {
  return (
    <AppThemeProvider>
      <AuthProvider>
        <TaskProvider>
          <NavigationThemeLayout />
        </TaskProvider>
      </AuthProvider>
    </AppThemeProvider>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
