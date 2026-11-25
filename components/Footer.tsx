import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { borderRadius, colors, fontSize, spacing } from "../styles/shared.styles";

export type FooterTab = "acceso" | "pileta";

interface FooterProps {
  activeTab?: FooterTab;
}

export default function Footer({ activeTab = "acceso" }: FooterProps) {
  const router = useRouter();

  const isAcceso = activeTab === "acceso";
  const isPileta = activeTab === "pileta";

  return (
    <View style={styles.bottomNav}>
      <TouchableOpacity
        style={styles.navItem}
        onPress={() => router.push("/acceso-club")}
        activeOpacity={0.75}
        accessibilityRole="tab"
        accessibilityState={{ selected: isAcceso }}
      >
        <View style={[styles.iconPill, isAcceso && styles.iconPillActive]}>
          <Ionicons
            name={isAcceso ? "home" : "home-outline"}
            size={22}
            color={isAcceso ? colors.primary : colors.gray500}
          />
        </View>
        <Text style={[styles.navText, isAcceso && styles.navTextActive]}>
          Acceso Club
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.navItem}
        onPress={() => router.push("/pileta")}
        activeOpacity={0.75}
        accessibilityRole="tab"
        accessibilityState={{ selected: isPileta }}
      >
        <View style={[styles.iconPill, isPileta && styles.iconPillActive]}>
          <Ionicons
            name={isPileta ? "water" : "water-outline"}
            size={22}
            color={isPileta ? colors.primary : colors.gray500}
          />
        </View>
        <Text style={[styles.navText, isPileta && styles.navTextActive]}>
          Validación Pileta
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  bottomNav: {
    flexDirection: "row",
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.sm,
    paddingBottom: spacing.sm + 2,
    paddingHorizontal: spacing.md,
  },
  navItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 52,
    gap: 4,
  },
  iconPill: {
    paddingHorizontal: 18,
    paddingVertical: 5,
    borderRadius: borderRadius.full,
    alignItems: "center",
    justifyContent: "center",
  },
  iconPillActive: {
    backgroundColor: colors.primaryLight,
  },
  navText: {
    fontSize: fontSize.xs,
    color: colors.gray500,
    fontWeight: "500",
  },
  navTextActive: {
    color: colors.primaryDark,
    fontWeight: "700",
  },
});
