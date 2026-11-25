import React, { useState, useEffect } from "react";
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
import { StatusBadge } from "./StatusBadge";
import { PhotoAvatar } from "./PhotoAvatar";
import { axiosBase } from "../utils/axios.util";
import { TipoIngreso } from "../constants/tipo-ingreso";
import { useIngresoError } from "../hooks/useApiError";
import {
  sharedStyles,
  colors,
  spacing,
  fontSize,
  borderRadius,
  tipoPersonaStyles,
} from "../styles/shared.styles";
import type { Socio, CreateRegistroIngresoDto, MetodoPago } from "../types";

interface SocioClubProps {
  socio: Socio;
}

export default function SocioClub({ socio }: SocioClubProps) {
  const router = useRouter();
  const { handleError } = useIngresoError();

  const [habilitarPileta, setHabilitarPileta] = useState(false);
  const [metodoPago, setMetodoPago] = useState<MetodoPago | undefined>(undefined);
  const [importe, setImporte] = useState("");
  const [metodoPagoError, setMetodoPagoError] = useState("");
  const [importeError, setImporteError] = useState("");

  useEffect(() => {
    setHabilitarPileta(false);
  }, []);

  const handleRegistrarIngreso = async () => {
    setImporteError("");
    setMetodoPagoError("");

    if (habilitarPileta) {
      const importeValido =
        importe.trim() && !isNaN(Number(importe)) && Number(importe) > 0;
      const metodoPagoValido = !!metodoPago;

      if (!importeValido) {
        setImporteError("Ingresa un importe válido mayor a $0");
      }

      if (!metodoPagoValido) {
        setMetodoPagoError("Selecciona un método de pago para continuar");
      }

      if (!importeValido || !metodoPagoValido) {
        return;
      }
    }

    try {
      const registroIngreso: CreateRegistroIngresoDto = {
        idSocio: socio.id,
        dniNoSocio: undefined,
        tipoIngreso: TipoIngreso.SOCIO_CLUB,
        habilitaPileta: habilitarPileta,
        metodoPago: metodoPago,
        importe: importe.length > 0 ? Number(importe) : undefined,
      };

      await axiosBase.post("registro-ingreso", registroIngreso);

      showSuccessToast(
        `Ingreso registrado para socio ${socio.nombre} ${socio.apellido}${habilitarPileta ? " (con pileta)" : " (sin pileta)"}`
      );
      router.push("/acceso-club");
    } catch (error) {
      console.log("handleRegistrarIngreso error", error);
      handleError(error);
    }
  };

  return (
    <SafeAreaView style={sharedStyles.container} edges={["top", "bottom"]}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.surface} />
      <Header title="Información del Socio" backRoute="/acceso-club" />

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
            {/* Perfil del socio */}
            <View style={[sharedStyles.infoSection, styles.profileCard]}>
              <View style={sharedStyles.photoContainer}>
                <PhotoAvatar fotoUrl={socio.fotoUrl} size={104} />
              </View>

              <Text style={sharedStyles.name}>
                {socio.nombre} {socio.apellido}
              </Text>

              <View style={styles.badgesRow}>
                <StatusBadge estado={socio.estado} />
                <View style={[tipoPersonaStyles.container, tipoPersonaStyles.club]}>
                  <Ionicons name="person" size={14} color={colors.warningText} />
                  <Text style={[tipoPersonaStyles.text, tipoPersonaStyles.clubText]}>
                    {socio.tipo}
                  </Text>
                </View>
              </View>
            </View>

            {/* Detalles del socio */}
            <View style={sharedStyles.detailsSection}>
              <View style={sharedStyles.detailRow}>
                <View style={sharedStyles.detailIconWrap}>
                  <Ionicons name="card-outline" size={18} color={colors.gray600} />
                </View>
                <View style={styles.detailContent}>
                  <Text style={sharedStyles.detailLabelInline}>DNI</Text>
                  <Text style={sharedStyles.detailText}>
                    {socio.dni || "Sin DNI cargado"}
                  </Text>
                </View>
              </View>

              <View style={sharedStyles.detailRow}>
                <View style={sharedStyles.detailIconWrap}>
                  <Ionicons name="call-outline" size={18} color={colors.gray600} />
                </View>
                <View style={styles.detailContent}>
                  <Text style={sharedStyles.detailLabelInline}>Teléfono</Text>
                  <Text style={sharedStyles.detailText}>
                    {socio.telefono && socio.telefono.toString().length > 0
                      ? socio.telefono
                      : "-"}
                  </Text>
                </View>
              </View>

              <View style={[sharedStyles.detailRow, sharedStyles.detailRowLast]}>
                <View style={sharedStyles.detailIconWrap}>
                  <Ionicons name="calendar-outline" size={18} color={colors.gray600} />
                </View>
                <View style={styles.detailContent}>
                  <Text style={sharedStyles.detailLabelInline}>Nacimiento</Text>
                  <Text style={sharedStyles.detailText}>
                    {socio.fechaNacimiento || "-"}
                  </Text>
                </View>
              </View>
            </View>

            {/* Formulario de pileta */}
            <View style={styles.piletaSection}>
              <TouchableOpacity
                style={[
                  sharedStyles.card,
                  styles.toggleCard,
                  habilitarPileta && styles.toggleCardActive,
                ]}
                onPress={() => {
                  const nuevoEstado = !habilitarPileta;
                  setHabilitarPileta(nuevoEstado);
                  if (!nuevoEstado) {
                    setMetodoPagoError("");
                    setImporteError("");
                  }
                }}
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
                    Requiere registrar el pago del pase diario
                  </Text>
                </View>
                <Ionicons
                  name={habilitarPileta ? "water" : "water-outline"}
                  size={20}
                  color={habilitarPileta ? colors.primary : colors.gray400}
                />
              </TouchableOpacity>

              {/* Formulario de pago - Solo visible si habilita pileta */}
              {habilitarPileta && (
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
                        placeholder="Ingrese el importe por pileta"
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
              )}
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
  profileCard: {
    alignItems: "center",
    paddingVertical: spacing.xl,
  },
  badgesRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    flexWrap: "wrap",
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  detailContent: {
    flex: 1,
  },
  piletaSection: {
    marginBottom: spacing.md,
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
  inputGroup: {
    marginBottom: spacing.lg,
  },
  inputGroupLast: {
    marginBottom: 0,
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
