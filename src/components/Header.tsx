import { StyleSheet, Text, View, Pressable } from "react-native";

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
  return (
    <View style={styles.container}>
      <View style={styles.userInfo}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.role}>{role}</Text>
      </View>

      <Pressable
        onPress={onLogout}
        style={styles.logoutButton}
        accessibilityRole="button"
        accessibilityLabel="Sair da conta"
      >
        <Text style={styles.logoutText}>Sair</Text>
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
  },
  userInfo: {
    flex: 1,
    marginRight: 12,
  },
  name: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#0F172A",
  },
  role: {
    fontSize: 14,
    color: "#64748B",
    marginTop: 4,
  },
  logoutButton: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
    backgroundColor: "#FEE2E2",
  },
  logoutText: {
    color: "#B91C1C",
    fontWeight: "600",
  },
});
