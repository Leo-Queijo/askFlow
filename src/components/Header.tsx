import { Pressable, StyleSheet, Text, View } from "react-native";

import { useTheme } from "@/hooks/useTheme";
import type { ThemeColors } from "@/types/theme";

interface HeaderProps {
  name: string;
  role: string;
  onLogout: () => void;
}

export default function Header({
  name,
  role,
  onLogout,
}: HeaderProps) {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  return (
    <View style={styles.container}>
      <View style={styles.userInfo}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.role}>{role}</Text>
      </View>

      <Pressable
        onPress={onLogout}
        style={({ pressed }) => [
          styles.logoutButton,
          pressed && styles.pressed,
        ]}
        accessibilityRole="button"
        accessibilityLabel="Sair da conta"
        accessibilityHint="Encerra a sessão e volta para a tela de login"
      >
        <Text style={styles.logoutText}>Sair</Text>
      </Pressable>
    </View>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: 16,
      paddingHorizontal: 16,
      borderRadius: 16,
      backgroundColor: colors.card,
    },
    userInfo: {
      flex: 1,
      marginRight: 12,
    },
    name: {
      fontSize: 22,
      fontWeight: "bold",
      color: colors.text,
    },
    role: {
      fontSize: 14,
      marginTop: 4,
      color: colors.secondary,
    },
    logoutButton: {
      minHeight: 44,
      justifyContent: "center",
      paddingHorizontal: 14,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.error,
    },
    pressed: {
      opacity: 0.85,
    },
    logoutText: {
      fontWeight: "600",
      color: colors.error,
    },
  });
}
