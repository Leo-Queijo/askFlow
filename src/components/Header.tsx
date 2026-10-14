
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  useColorScheme,
} from "react-native";

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
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: isDark ? "#070707" : "#FFFFFF",
        },
      ]}
    >
      <View style={styles.userInfo}>
        <Text
          style={[
            styles.name,
            { color: isDark ? "#FFFFFF" : "#0F172A" },
          ]}
        >
          {name}
        </Text>

        <Text
          style={[
            styles.role,
            { color: isDark ? "#B0B4BA" : "#64748B" },
          ]}
        >
          {role}
        </Text>
      </View>

      <Pressable
        onPress={onLogout}
        style={[
          styles.logoutButton,
          { backgroundColor: isDark ? "#3F1D22" : "#FEE2E2" },
        ]}
        accessibilityRole="button"
        accessibilityLabel="Sair da conta"
      >
        <Text
          style={[
            styles.logoutText,
            { color: isDark ? "#FCA5A5" : "#B91C1C" },
          ]}
        >
          Sair
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  
container: {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  paddingVertical: 16,
  paddingHorizontal: 16,
  borderRadius: 16,
},

  userInfo: {
    flex: 1,
    marginRight: 12,
  },
  name: {
    fontSize: 22,
    fontWeight: "bold",
  },
  role: {
    fontSize: 14,
    marginTop: 4,
  },
  logoutButton: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  logoutText: {
    fontWeight: "600",
  },
});
