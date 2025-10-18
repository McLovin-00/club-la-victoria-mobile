import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
  } from "react-native";
  import { useRouter } from "expo-router";
  import { Ionicons } from "@expo/vector-icons";

export default function Footer() {

    const router = useRouter();
  const handleAccesoClub = () => {
    router.push("/acceso-club")
  };

  const handleValidacionPileta = () => {
    // TODO: Navigate to pool validation screen
    console.log("Validación Pileta pressed");
  };

  return (
    <View style={styles.bottomNav}>
      <TouchableOpacity
        style={styles.navItem}
        onPress={handleAccesoClub}
        activeOpacity={0.7}
      >
        <Ionicons name="business" size={24} color="#2DD4BF" />
        <Text style={[styles.navText, styles.navTextActive]}>Acceso Club</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.navItem}
        onPress={handleValidacionPileta}
        activeOpacity={0.7}
      >
        <Ionicons name="water-outline" size={24} color="#999999" />
        <Text style={styles.navText}>Validación Pileta</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  bottomNav: {
    flexDirection: "row",
    backgroundColor: "#F5F5F5",
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
    paddingBottom: 20,
    paddingTop: 12,
  },
  navItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
  },
  navText: {
    fontSize: 12,
    color: "#999999",
    marginTop: 4,
  },
  navTextActive: {
    color: "#2DD4BF",
    fontWeight: "600",
  },
});
