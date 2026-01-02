import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  StatusBar,
} from "react-native";
import { Link } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import Header from "../../components/Header";
import { useRouter } from "expo-router";
import SocioSearchModal from "../../components/SocioSearchModal";

export default function ClubAccessScreen() {
  const [dni, setDni] = useState("");
  const [dniError, setDniError] = useState("");
  const [showSearchModal, setShowSearchModal] = useState(false);

  const router = useRouter();

  const validateDNI = (dniValue: string): boolean => {
    const dniStr = dniValue.trim();

    // Verificar que no esté vacío
    if (!dniStr) {
      setDniError("El DNI es requerido");
      return false;
    }

    // Verificar que tenga solo números
    if (!/^\d+$/.test(dniStr)) {
      setDniError("El DNI debe contener solo números");
      return false;
    }

    // Verificar longitud (7-8 dígitos para DNI argentino)
    if (dniStr.length < 7 || dniStr.length > 8) {
      setDniError("El DNI debe tener entre 7 y 8 dígitos");
      return false;
    }

    // DNI válido
    setDniError("");
    return true;
  };

  const handleSearchByDNI = () => {
    if (validateDNI(dni)) {
      router.push(`/acceso-club/socio/${dni}`);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <Header title="Menu registrar ingresos" backRoute="/" />

      {/* Main Content */}
      <View style={styles.mainContent}>
        {/* Scan QR Button */}
        <Link href={"/acceso-club/scanner"} asChild>
          <TouchableOpacity style={styles.scanButton} activeOpacity={0.8}>
            <Ionicons name="qr-code-outline" size={24} color="#1A1A1A" />
            <Text style={styles.scanButtonText}>Escanear QR</Text>
          </TouchableOpacity>
        </Link>

        {/* QR Info Text */}
        <Text style={styles.infoText}>El QR contiene el DNI</Text>

        {/* Divider with "o" */}
        <View style={styles.dividerContainer}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>o</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* DNI Input */}
        <TextInput
          style={[
            styles.dniInput,
            dniError && styles.dniInputError
          ]}
          placeholder="DNI"
          placeholderTextColor="#999999"
          value={dni}
          onChangeText={(text) => {
            setDni(text);
            // Limpiar error cuando el usuario empiece a escribir
            if (dniError) setDniError("");
          }}
          keyboardType="numeric"
          maxLength={8}
        />

        {/* DNI Error Message */}
        {dniError && (
          <Text style={styles.dniErrorText}>{dniError}</Text>
        )}

        {/* Search Button */}
        <TouchableOpacity
          style={[
            styles.searchButton,
            (!dni.trim() || dniError) && styles.searchButtonDisabled,
          ]}
          onPress={handleSearchByDNI}
          disabled={!dni.trim() || !!dniError}
        >
          <Text style={styles.searchButtonText}>Buscar por DNI</Text>
        </TouchableOpacity>

        {/* Divider */}
        <View style={[styles.dividerContainer, { marginVertical: 20 }]}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>o</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* Botón búsqueda por nombre */}
        <TouchableOpacity
          style={styles.nameSearchButton}
          onPress={() => setShowSearchModal(true)}
        >
          <Ionicons name="search-outline" size={20} color="#0ea5e9" />
          <Text style={styles.nameSearchButtonText}>Buscar por nombre</Text>
        </TouchableOpacity>
      </View>

      {/* Modal búsqueda */}
      <SocioSearchModal
        visible={showSearchModal}
        onClose={() => setShowSearchModal(false)}
        onSelectSocio={(socio) => {
          setShowSearchModal(false);
          router.push(`/acceso-club/socio/${socio.id}`);
        }}
      />

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.footerButton, styles.footerButtonActive]}
          onPress={() => router.push("/acceso-club")}
        >
          <Ionicons name="home-outline" size={24} color="#06b6d4" />
          <Text style={[styles.footerButtonText, styles.footerButtonTextActive]}>
            Acceso Club
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.footerButton}
          onPress={() => router.push("/pileta")}
        >
          <Ionicons name="water-outline" size={24} color="#6b7280" />
          <Text style={styles.footerButtonText}>Validación Pileta</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#F5F5F5",
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: "600",
    color: "#1A1A1A",
    textAlign: "center",
    marginRight: 36, // Compensate for back button width
  },
  headerSpacer: {
    width: 36,
  },
  mainContent: {
    flex: 1,
    paddingHorizontal: 28,
    paddingTop: 40,
    paddingBottom: 20,
    justifyContent: "center",
  },
  scanButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#2DD4BF",
    paddingVertical: 18,
    borderRadius: 28,
    gap: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  scanButtonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1A1A1A",
  },
  infoText: {
    fontSize: 14,
    color: "#666666",
    textAlign: "center",
    marginTop: 16,
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 32,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#E0E0E0",
  },
  dividerText: {
    fontSize: 14,
    color: "#999999",
    marginHorizontal: 16,
  },
  dniInput: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 28,
    paddingVertical: 18,
    paddingHorizontal: 24,
    fontSize: 16,
    color: "#1A1A1A",
    marginBottom: 16,
  },
  dniInputError: {
    borderColor: "#DC3545",
    backgroundColor: "#FFF5F5",
  },
  dniErrorText: {
    fontSize: 14,
    color: "#DC3545",
    textAlign: "center",
    marginTop: -8,
    marginBottom: 16,
    fontWeight: "500",
  },
  searchButton: {
    backgroundColor: "#B8E6D5",
    paddingVertical: 18,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  searchButtonDisabled: {
    opacity: 0.5,
  },
  searchButtonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2D9D78",
  },
  nameSearchButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f0f9ff",
    paddingVertical: 16,
    borderRadius: 28,
    gap: 8,
    borderWidth: 1,
    borderColor: "#0ea5e9",
  },
  nameSearchButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0ea5e9",
  },
  footer: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    paddingVertical: 8,
    backgroundColor: "#fff",
  },
  footerButton: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 8,
  },
  footerButtonActive: {
    borderTopWidth: 2,
    borderTopColor: "#06b6d4",
  },
  footerButtonText: {
    marginTop: 4,
    fontSize: 12,
    color: "#6b7280",
  },
  footerButtonTextActive: {
    color: "#06b6d4",
  },
});
