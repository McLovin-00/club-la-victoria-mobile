import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { borderRadius, colors, fontSize, spacing } from "../styles/shared.styles";

export default function Header({ title, backRoute }: { title: string; backRoute: string }) {
  const router = useRouter();
  return (
    <View style={styles.header}>
      <TouchableOpacity
        onPress={() => router.push(backRoute)}
        style={styles.backButton}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel="Volver"
        hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
      >
        <Ionicons name="chevron-back" size={24} color={colors.gray900} />
      </TouchableOpacity>

      <Text style={styles.headerTitle} numberOfLines={1}>
        {title}
      </Text>

      <View style={styles.spacer} />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.full,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.gray50,
    borderWidth: 1,
    borderColor: colors.border,
  },
  headerTitle: {
    flex: 1,
    fontSize: fontSize.lg,
    fontWeight: "700",
    color: colors.gray900,
    textAlign: "center",
    letterSpacing: -0.3,
    paddingHorizontal: spacing.sm,
  },
  spacer: {
    width: 44,
    height: 44,
  },
});
