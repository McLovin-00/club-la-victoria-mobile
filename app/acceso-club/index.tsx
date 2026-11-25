import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  StatusBar,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Link, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import SocioSearchModal from "../../components/SocioSearchModal";
import {
  borderRadius,
  colors,
  fontSize,
  shadows,
  sharedStyles,
  spacing,
} from "../../styles/shared.styles";

export default function ClubAccessScreen() {
  const [dni, setDni] = useState("");
  const [dniError, setDniError] = useState("");
  const [dniFocused, setDniFocused] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);

  const router = useRouter();

  const validateDNI = (dniValue: string): boolean => {
    const dniStr = dniValue.trim();

    if (!dniStr) {
      setDniError("El DNI es requerido");
      return false;
    }

    if (!/^\d+$/.test(dniStr)) {
      setDniError("El DNI debe contener solo números");
      return false;
    }

    if (dniStr.length < 7 || dniStr.length > 8) {
      setDniError("El DNI debe tener entre 7 y 8 dígitos");
      return false;
    }

    setDniError("");
    return true;
  };

  const handleSearchByDNI = () => {
    if (validateDNI(dni)) {
      router.push(`/acceso-club/socio/${dni}`);
    }
  };

  const isDniDisabled = !dni.trim() || !!dniError;

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.surface} />

      <Header title="Registrar ingresos" backRoute="/" />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.mainContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Acción principal: Escáner QR */}
          <View style={styles.qrBlock}>
            <Link href={"/acceso-club/scanner"} asChild>
              <TouchableOpacity
                style={styles.scanButton}
                activeOpacity={0.85}
                accessibilityRole="button"
              >
                <Ionicons name="qr-code-outline" size={24} color={colors.white} />
                <Text style={styles.scanButtonText}>Escanear QR</Text>
              </TouchableOpacity>
            </Link>
            <Text style={styles.infoText}>Para socios con credencial QR</Text>
          </View>

          {/* Separador */}
          <View style={styles.dividerContainer}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>o</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Tarjeta de ingreso por DNI (socios y no socios) */}
          <View style={styles.dniCard}>
            <Text style={styles.dniSectionTitle}>
              Buscar socio o registrar ingreso de un no socio
            </Text>
            <Text style={styles.dniHelpText}>
              Ingresá el DNI. Si no figura como socio, podrás cargar sus datos y el pago.
            </Text>

            <Text style={styles.dniLabel}>DNI del socio o visitante</Text>
            <TextInput
              style={[
                styles.dniInput,
                dniFocused && styles.dniInputFocused,
                !!dniError && styles.dniInputError,
              ]}
              placeholder="Ej. 12345678"
              accessibilityLabel="DNI del socio o visitante"
              placeholderTextColor={colors.placeholder}
              value={dni}
              onChangeText={(text) => {
                setDni(text);
                if (dniError) setDniError("");
              }}
              onFocus={() => setDniFocused(true)}
              onBlur={() => setDniFocused(false)}
              onSubmitEditing={handleSearchByDNI}
              returnKeyType="search"
              keyboardType="numeric"
              maxLength={8}
            />

            {!!dniError && (
              <View style={sharedStyles.errorRow}>
                <Ionicons
                  name="alert-circle"
                  size={16}
                  color={colors.errorAccent}
                />
                <Text style={sharedStyles.errorText}>{dniError}</Text>
              </View>
            )}

            <TouchableOpacity
              style={[
                styles.searchButton,
                isDniDisabled && styles.searchButtonDisabled,
              ]}
              onPress={handleSearchByDNI}
              disabled={isDniDisabled}
              activeOpacity={0.85}
              accessibilityRole="button"
            >
              <Text
                style={[
                  styles.searchButtonText,
                  isDniDisabled && styles.searchButtonTextDisabled,
                ]}
              >
                Continuar con DNI
              </Text>
              <Ionicons
                name="arrow-forward"
                size={18}
                color={isDniDisabled ? colors.disabledText : colors.primaryDark}
              />
            </TouchableOpacity>
          </View>

          {/* Separador */}
          <View style={styles.dividerContainer}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>o</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Búsqueda por nombre */}
          <TouchableOpacity
            style={styles.nameSearchButton}
            onPress={() => setShowSearchModal(true)}
            activeOpacity={0.8}
            accessibilityRole="button"
          >
            <Ionicons name="search-outline" size={20} color={colors.primary} />
            <Text style={styles.nameSearchButtonText}>Buscar socio por nombre</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>

      <SocioSearchModal
        visible={showSearchModal}
        onClose={() => setShowSearchModal(false)}
        onSelectSocio={(socio) => {
          setShowSearchModal(false);
          router.push(`/acceso-club/socio/${socio.id}`);
        }}
      />

      <Footer activeTab="acceso" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  mainContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.xxl,
    justifyContent: "center",
  },
  qrBlock: {
    alignItems: "center",
  },
  scanButton: {
    width: "100%",
    minHeight: 58,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primary,
    paddingVertical: 16,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.lg,
    gap: 10,
    ...shadows.xl,
  },
  scanButtonText: {
    fontSize: fontSize.md + 1,
    fontWeight: "700",
    color: colors.white,
    letterSpacing: 0.1,
  },
  infoText: {
    fontSize: fontSize.sm,
    color: colors.gray500,
    textAlign: "center",
    marginTop: spacing.sm + 2,
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: spacing.lg,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  dividerText: {
    fontSize: fontSize.xs + 1,
    fontWeight: "600",
    color: colors.gray500,
    marginHorizontal: spacing.md,
  },
  dniCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.sm,
  },
  dniSectionTitle: {
    fontSize: fontSize.md,
    fontWeight: "700",
    color: colors.gray900,
    marginBottom: spacing.xs + 2,
    letterSpacing: -0.2,
  },
  dniHelpText: {
    fontSize: fontSize.sm,
    lineHeight: 20,
    color: colors.gray600,
    marginBottom: spacing.lg,
  },
  dniLabel: {
    fontSize: fontSize.sm,
    fontWeight: "600",
    color: colors.gray700,
    marginBottom: spacing.sm,
  },
  dniInput: {
    backgroundColor: colors.surfaceSubtle,
    borderWidth: 1.5,
    borderColor: colors.borderStrong,
    borderRadius: borderRadius.md,
    paddingVertical: 14,
    paddingHorizontal: spacing.lg,
    fontSize: fontSize.md,
    fontWeight: "500",
    color: colors.gray900,
    minHeight: 50,
    fontVariant: ["tabular-nums"],
  },
  dniInputFocused: {
    borderColor: colors.primary,
    backgroundColor: colors.white,
  },
  dniInputError: {
    borderColor: colors.errorAccent,
    backgroundColor: colors.errorBg,
  },
  searchButton: {
    marginTop: spacing.md + 2,
    backgroundColor: colors.primaryLight,
    borderWidth: 1.5,
    borderColor: colors.primaryBorder,
    minHeight: 52,
    paddingVertical: 14,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.lg,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
  },
  searchButtonDisabled: {
    backgroundColor: colors.disabled,
    borderColor: colors.border,
  },
  searchButtonText: {
    fontSize: fontSize.md,
    fontWeight: "700",
    color: colors.primaryDark,
  },
  searchButtonTextDisabled: {
    color: colors.disabledText,
  },
  nameSearchButton: {
    width: "100%",
    minHeight: 52,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surface,
    paddingVertical: 14,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.lg,
    gap: 10,
    borderWidth: 1.5,
    borderColor: colors.borderStrong,
    ...shadows.sm,
  },
  nameSearchButtonText: {
    fontSize: fontSize.md,
    fontWeight: "600",
    color: colors.primaryDark,
  },
});
