import { Tabs } from "expo-router";

import { useTheme } from "@/hooks/useTheme";

export default function TabsLayout() {
  const { colors } = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.secondary,
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopColor: colors.border,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarAccessibilityLabel: "Home",
        }}
      />

      <Tabs.Screen
        name="tasks"
        options={{
          title: "Tarefas",
          tabBarAccessibilityLabel: "Tarefas",
        }}
      />

      <Tabs.Screen
        name="settings"
        options={{
          title: "Configurações",
          tabBarAccessibilityLabel: "Configurações",
        }}
      />
    </Tabs>
  );
}
