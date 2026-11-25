import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { showSuccessToast } from "../utils/toast.util";
import Header from "./Header";
import { TipoIngreso } from "../constants/tipo-ingreso";
import { axiosBase } from "../utils/axios.util";
import { useIngresoError } from "../hooks/useApiError";
import {
  sharedStyles,
  colors,
  spacing,
  fontSize,
  borderRadius,
} from "../styles/shared.styles";
import type { MetodoPago, CreateRegistroIngresoDto } from "../types";

interface NoSocioProps {
  dni: string;
}

export default function NoSocio({ dni }: NoSocioProps) {
  const router = useRouter();
  const { handleError } = useIngresoError();

  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [metodoPago, setMetodoPago] = useState<MetodoPago | undefined>(undefined);
  const [importe, setImporte] = useState("");
  const [habilitarPileta, setHabilitarPileta] = useState(false);
  const [nombreError, setNombreError] = useState("");
  const [apellidoError, setApellidoError] = useState("");
  const [metodoPagoError, setMetodoPagoError] = useState("");
  const [importeError, setImporteError] = useState("");

  const handleRegistrarIngreso = async () => {
    setNombreError("");
    setApellidoError("");
    setImporteError("");
    setMetodoPagoError("");

    const nombreValido = nombre.trim().length > 0;
    const apellidoValido = apellido.trim().length > 0;
    const importeValido =
      importe.trim() && !isNaN(Number(importe)) && Number(importe) > 0;
    const metodoPagoValido = !!metodoPago;

    if (!nombreValido) {
      setNombreError("Ingresa el nombre");
    }

    if (!apellidoValido) {
      setApellidoError("Ingresa el apellido");
    }

    if (!importeValido) {
      setImporteError("Ingresa un importe válido mayor a $0");
    }

    if (!metodoPagoValido) {
      setMetodoPagoError("Selecciona un método de pago para continuar");
    }

    if (!nombreValido || !apellidoValido || !importeValido || !metodoPagoValido) {
      return;
    }

    try {
      const registroIngreso: CreateRegistroIngresoDto = {
        idSocio: undefined,
        dniNoSocio: dni,
        nombreNoSocio: nombre.trim(),
        apellidoNoSocio: apellido.trim(),
        tipoIngreso: TipoIngreso.NO_SOCIO,
        habilitaPileta: habilitarPileta,
        metodoPago: metodoPago,
        importe: Number(importe),
      };

      await axiosBase.post("registro-ingreso", registroIngreso);

      showSuccessToast(
        `Ingreso registrado para no socio DNI: ${dni}${habilitarPileta ? " (con pileta)" : " (sin pileta)"}`
      );
      router.push("/acceso-club");
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <SafeAreaView style={sharedStyles.container} edges={["top", "bottom"]}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.surface} />
      <Header title="Acceso No Socio" backRoute="/acceso-club" />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={sharedStyles.content}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={sharedStyles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
            {/* Identificación por DNI */}
            <View style={[sharedStyles.infoSection, styles.dniBanner]}>
              <View style={styles.dniIconWrap}>
                <Ionicons name="person-add-outline" size={22} color={colors.primaryDark} />
              </View>
              <View style={styles.dniMeta}>
                <Text style={styles.dniBadgeLabel}>Visitante no socio</Text>
                <Text style={styles.dniNumber}>DNI: {dni}</Text>
              </View>
            </View>

            {/* Datos personales */}
            <View style={sharedStyles.card}>
              <Text style={sharedStyles.subtitle}>Datos Personales</Text>

              {/* Nombre */}
              <View style={styles.inputGroup}>
                <Text style={sharedStyles.label}>Nombre</Text>
                <TextInput
                  style={[
                    sharedStyles.input,
                    !!nombreError && sharedStyles.inputError,
                  ]}
                  value={nombre}
                  onChangeText={(text) => {
                    setNombre(text);
                    if (nombreError) setNombreError("");
                  }}
                  placeholder="Ingrese el nombre"
                  placeholderTextColor={colors.placeholder}
                  autoCapitalize="words"
                />
                {!!nombreError && (
                  <View style={sharedStyles.errorRow}>
                    <Ionicons
                      name="alert-circle"
                      size={16}
                      color={colors.errorAccent}
                    />
                    <Text style={sharedStyles.errorText}>{nombreError}</Text>
                  </View>
                )}
              </View>

              {/* Apellido */}
              <View style={styles.inputGroupLast}>
                <Text style={sharedStyles.label}>Apellido</Text>
                <TextInput
                  style={[
                    sharedStyles.input,
                    !!apellidoError && sharedStyles.inputError,
                  ]}
                  value={apellido}
                  onChangeText={(text) => {
                    setApellido(text);
                    if (apellidoError) setApellidoError("");
                  }}
                  placeholder="Ingrese el apellido"
                  placeholderTextColor={colors.placeholder}
                  autoCapitalize="words"
                />
                {!!apellidoError && (
                  <View style={sharedStyles.errorRow}>
                    <Ionicons
                      name="alert-circle"
                      size={16}
                      color={colors.errorAccent}
                    />
                    <Text style={sharedStyles.errorText}>{apellidoError}</Text>
                  </View>
                )}
              </View>
            </View>

            {/* Configuración de pileta */}
            <TouchableOpacity
              style={[
                sharedStyles.card,
                styles.toggleCard,
                habilitarPileta && styles.toggleCardActive,
              ]}
              onPress={() => setHabilitarPileta(!habilitarPileta)}
              activeOpacity={0.8}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: habilitarPileta }}
            >
              <View
                style={[
                  sharedStyles.checkbox,
                  habilitarPileta && sharedStyles.checkboxChecked,
                ]}
              >
                {habilitarPileta && (
                  <Ionicons name="checkmark" size={16} color={colors.white} />
                )}
              </View>
              <View style={styles.toggleTextWrap}>
                <Text style={sharedStyles.checkboxLabel}>
                  Habilitar acceso a pileta
                </Text>
                <Text style={styles.toggleHint}>
                  Incluye el ingreso a la pileta en este pase
                </Text>
              </View>
              <Ionicons
                name={habilitarPileta ? "water" : "water-outline"}
                size={20}
                color={habilitarPileta ? colors.primary : colors.gray400}
              />
            </TouchableOpacity>

            {/* Formulario de pago - SIEMPRE visible */}
            <View style={sharedStyles.card}>
              <Text style={sharedStyles.subtitle}>Información de Pago</Text>

              {/* Método de pago */}
              <View style={styles.inputGroup}>
                <Text style={sharedStyles.label}>Método de Pago</Text>
                <View
                  style={[
                    styles.paymentOptionsRow,
                    !!metodoPagoError && styles.radioGroupError,
                  ]}
                >
                  <TouchableOpacity
                    style={[
                      styles.paymentOption,
                      metodoPago === "EFECTIVO" && styles.paymentOptionSelected,
                    ]}
                    onPress={() => {
                      setMetodoPago("EFECTIVO" as MetodoPago);
                      if (metodoPagoError) setMetodoPagoError("");
                    }}
                    activeOpacity={0.8}
                    accessibilityRole="radio"
                    accessibilityState={{ selected: metodoPago === "EFECTIVO" }}
                  >
                    <View
                      style={[
                        sharedStyles.radio,
                        metodoPago === "EFECTIVO" && sharedStyles.radioSelected,
                      ]}
                    >
                      {metodoPago === "EFECTIVO" && (
                        <View style={sharedStyles.radioDot} />
                      )}
                    </View>
                    <Text
                      style={[
                        sharedStyles.radioLabel,
                        metodoPago === "EFECTIVO" && styles.paymentOptionTextSelected,
                      ]}
                    >
                      Efectivo
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.paymentOption,
                      metodoPago === "TRANSFERENCIA" && styles.paymentOptionSelected,
                    ]}
                    onPress={() => {
                      setMetodoPago("TRANSFERENCIA" as MetodoPago);
                      if (metodoPagoError) setMetodoPagoError("");
                    }}
                    activeOpacity={0.8}
                    accessibilityRole="radio"
                    accessibilityState={{
                      selected: metodoPago === "TRANSFERENCIA",
                    }}
                  >
                    <View
                      style={[
                        sharedStyles.radio,
                        metodoPago === "TRANSFERENCIA" &&
                          sharedStyles.radioSelected,
                      ]}
                    >
                      {metodoPago === "TRANSFERENCIA" && (
                        <View style={sharedStyles.radioDot} />
                      )}
                    </View>
                    <Text
                      style={[
                        sharedStyles.radioLabel,
                        metodoPago === "TRANSFERENCIA" &&
                          styles.paymentOptionTextSelected,
                      ]}
                    >
                      Transferencia
                    </Text>
                  </TouchableOpacity>
                </View>

                {!!metodoPagoError && (
                  <View style={sharedStyles.errorRow}>
                    <Ionicons
                      name="alert-circle"
                      size={16}
                      color={colors.errorAccent}
                    />
                    <Text style={sharedStyles.errorText}>{metodoPagoError}</Text>
                  </View>
                )}
              </View>

              {/* Importe */}
              <View style={styles.inputGroupLast}>
                <Text style={sharedStyles.label}>Importe ($)</Text>
                <View
                  style={[
                    styles.importeContainer,
                    !!importeError && sharedStyles.inputError,
                  ]}
                >
                  <Text style={styles.currencySymbol}>$</Text>
                  <TextInput
                    style={styles.importeInput}
                    value={importe}
                    onChangeText={(text) => {
                      setImporte(text);
                      if (importeError) setImporteError("");
                    }}
                    placeholder={
                      habilitarPileta
                        ? "Ingrese el importe por pileta"
                        : "Ingrese el importe por entrada"
                    }
                    keyboardType="numeric"
                    placeholderTextColor={colors.placeholder}
                  />
                </View>
                {!!importeError && (
                  <View style={sharedStyles.errorRow}>
                    <Ionicons
                      name="alert-circle"
                      size={16}
                      color={colors.errorAccent}
                    />
                    <Text style={sharedStyles.errorText}>{importeError}</Text>
                  </View>
                )}
              </View>
            </View>

            {/* Botones de acción */}
            <View style={styles.actionsSection}>
              <TouchableOpacity
                style={sharedStyles.primaryButton}
                onPress={handleRegistrarIngreso}
                activeOpacity={0.85}
                accessibilityRole="button"
              >
                <Ionicons name="checkmark-circle" size={20} color={colors.white} />
                <Text style={sharedStyles.primaryButtonText}>Registrar Ingreso</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={sharedStyles.secondaryButton}
                onPress={() => router.push("/acceso-club")}
                activeOpacity={0.8}
                accessibilityRole="button"
              >
                <Text style={sharedStyles.secondaryButtonText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  dniBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    paddingVertical: spacing.lg,
  },
  dniIconWrap: {
    width: 46,
    height: 46,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.primaryLight,
    borderWidth: 1,
    borderColor: colors.primaryBorder,
    alignItems: "center",
    justifyContent: "center",
  },
  dniMeta: {
    flex: 1,
  },
  dniBadgeLabel: {
    fontSize: fontSize.xs,
    fontWeight: "600",
    color: colors.gray500,
    marginBottom: 2,
  },
  dniNumber: {
    fontSize: fontSize.xl,
    fontWeight: "700",
    color: colors.gray900,
    letterSpacing: -0.3,
    fontVariant: ["tabular-nums"],
  },
  inputGroup: {
    marginBottom: spacing.lg,
  },
  inputGroupLast: {
    marginBottom: 0,
  },
  toggleCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    paddingVertical: spacing.lg,
    minHeight: 64,
  },
  toggleCardActive: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primaryBorder,
  },
  toggleTextWrap: {
    flex: 1,
  },
  toggleHint: {
    fontSize: fontSize.xs,
    color: colors.gray500,
    marginTop: 2,
  },
  paymentOptionsRow: {
    flexDirection: "row",
    gap: spacing.sm + 2,
  },
  paymentOption: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    minHeight: 50,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1.5,
    borderColor: colors.borderStrong,
    backgroundColor: colors.surfaceSubtle,
  },
  paymentOptionSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  paymentOptionTextSelected: {
    color: colors.primaryDark,
  },
  radioGroupError: {
    borderWidth: 1.5,
    borderColor: colors.errorAccent,
    borderRadius: borderRadius.md,
    padding: spacing.xs + 2,
    backgroundColor: colors.errorBg,
  },
  importeContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surfaceSubtle,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md + 2,
    minHeight: 50,
    borderWidth: 1,
    borderColor: colors.borderStrong,
  },
  importeInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: fontSize.md,
    fontWeight: "600",
    color: colors.gray900,
    fontVariant: ["tabular-nums"],
  },
  currencySymbol: {
    fontSize: fontSize.md + 1,
    fontWeight: "700",
    color: colors.gray500,
    marginRight: spacing.sm,
  },
  actionsSection: {
    marginTop: spacing.sm,
    gap: spacing.md,
  },
});
