import { StyleSheet, TextInput, View } from "react-native";

import { useTheme } from "@/hooks/useTheme";
import type { ThemeColors } from "@/types/theme";

interface CustomInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  secureTextEntry?: boolean;
  accessibilityLabel?: string;
}

export default function CustomInput({
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  accessibilityLabel,
}: CustomInputProps) {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.secondary}
        secureTextEntry={secureTextEntry}
        autoCapitalize="sentences"
        accessibilityLabel={accessibilityLabel ?? placeholder}
      />
    </View>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    container: {
      width: "100%",
    },
    input: {
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 10,
      paddingHorizontal: 14,
      paddingVertical: 12,
      fontSize: 16,
      color: colors.text,
    },
  });
}
