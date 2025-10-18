import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { showSuccessToast } from "../utils/toast.util";
import Header from "./Header";
import { TipoIngreso } from "../constants/tipo-ingreso";
import { axiosBase } from "../utils/axios.util";
import { useIngresoError } from "../hooks/useApiError";
import { sharedStyles, colors, spacing, fontSize, borderRadius } from "../styles/shared.styles";
import type { MetodoPago, CreateRegistroIngresoDto } from "../types";

interface NoSocioProps {
  dni: string;
}

export default function NoSocio({ dni }: NoSocioProps) {
  const router = useRouter();
  const { handleError } = useIngresoError();

  const [metodoPago, setMetodoPago] = useState<MetodoPago | undefined>(undefined);
  const [importe, setImporte] = useState("");
  const [habilitarPileta, setHabilitarPileta] = useState(false);
  const [metodoPagoError, setMetodoPagoError] = useState("");
  const [importeError, setImporteError] = useState("");

  const handleRegistrarIngreso = async () => {
    // Reset errors
    setImporteError("");
    setMetodoPagoError("");

    // Validaciones
    const importeValido = importe.trim() && !isNaN(Number(importe)) && Number(importe) > 0;
    const metodoPagoValido = !!metodoPago;

    // Establecer errores si no son válidos
    if (!importeValido) {
      setImporteError("⚠️ Ingresa un importe válido mayor a $0");
    }

    if (!metodoPagoValido) {
      setMetodoPagoError("⚠️ Selecciona un método de pago para continuar");
    }

    // Solo proceder si todo es válido
    if (!importeValido || !metodoPagoValido) {
      return;
    }

    try {
      const registroIngreso: CreateRegistroIngresoDto = {
        idSocio: undefined,
        dniNoSocio: dni,
        tipoIngreso: TipoIngreso.NO_SOCIO,
        habilitaPileta: habilitarPileta,
        metodoPago: metodoPago,
        importe: Number(importe),
      };

      await axiosBase.post('registro-ingreso', registroIngreso);

      showSuccessToast(
        `Ingreso registrado para no socio DNI: ${dni}${habilitarPileta ? ' (con pileta)' : ' (sin pileta)'}`
      );
      router.push("/acceso-club");
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <SafeAreaView style={sharedStyles.container} edges={["top", "bottom"]}>
      <Header title="Acceso No Socio" backRoute="/acceso-club" />

      <View style={sharedStyles.content}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={sharedStyles.scrollContent}
        >
          {/* Información básica */}
          <View style={sharedStyles.infoSection}>
            <Text style={sharedStyles.name}>DNI: {dni}</Text>
          </View>

          {/* Configuración de pileta */}
          <View style={styles.piletaSection}>
            <View style={sharedStyles.card}>
              <TouchableOpacity
                style={sharedStyles.row}
                onPress={() => setHabilitarPileta(!habilitarPileta)}
                activeOpacity={0.8}
              >
                <View style={[
                  sharedStyles.checkbox,
                  habilitarPileta && sharedStyles.checkboxChecked,
                ]}>
                  {habilitarPileta && (
                    <Ionicons name="checkmark" size={16} color={colors.white} />
                  )}
                </View>
                <Text style={[sharedStyles.checkboxLabel, { marginLeft: spacing.md }]}>
                  Habilitar acceso a pileta
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Formulario de pago - SIEMPRE visible */}
          <View style={sharedStyles.card}>
            <Text style={sharedStyles.subtitle}>Información de Pago</Text>

            {/* Método de pago */}
            <View style={styles.inputGroup}>
              <Text style={sharedStyles.label}>Método de Pago</Text>
              <View style={[
                sharedStyles.row,
                { gap: spacing.lg },
                metodoPagoError && styles.radioGroupError
              ]}>
                <TouchableOpacity
                  style={sharedStyles.row}
                  onPress={() => {
                    setMetodoPago('EFECTIVO' as MetodoPago);
                    if (metodoPagoError) setMetodoPagoError("");
                  }}
                >
                  <View style={[
                    sharedStyles.radio,
                    metodoPago === 'EFECTIVO' && sharedStyles.radioSelected,
                  ]}>
                    {metodoPago === 'EFECTIVO' && (
                      <View style={sharedStyles.radioDot} />
                    )}
                  </View>
                  <Text style={[sharedStyles.radioLabel, { marginLeft: spacing.sm }]}>
                    Efectivo
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={sharedStyles.row}
                  onPress={() => {
                    setMetodoPago('TRANSFERENCIA' as MetodoPago);
                    if (metodoPagoError) setMetodoPagoError("");
                  }}
                >
                  <View style={[
                    sharedStyles.radio,
                    metodoPago === 'TRANSFERENCIA' && sharedStyles.radioSelected,
                  ]}>
                    {metodoPago === 'TRANSFERENCIA' && (
                      <View style={sharedStyles.radioDot} />
                    )}
                  </View>
                  <Text style={[sharedStyles.radioLabel, { marginLeft: spacing.sm }]}>
                    Transferencia
                  </Text>
                </TouchableOpacity>
              </View>
              {metodoPagoError && (
                <Text style={sharedStyles.errorText}>{metodoPagoError}</Text>
              )}
            </View>

            {/* Importe */}
            <View style={styles.inputGroup}>
              <Text style={sharedStyles.label}>Importe ($)</Text>
              <View style={[
                styles.importeContainer,
                importeError && sharedStyles.inputError,
              ]}>
                <Text style={styles.currencySymbol}>$</Text>
                <TextInput
                  style={styles.importeInput}
                  value={importe}
                  onChangeText={(text) => {
                    setImporte(text);
                    if (importeError) setImporteError("");
                  }}
                  placeholder={habilitarPileta ? "Ingrese el importe por pileta" : "Ingrese el importe por entrada"}
                  keyboardType="numeric"
                  placeholderTextColor={colors.gray600}
                />
              </View>
              {importeError && (
                <Text style={sharedStyles.errorText}>{importeError}</Text>
              )}
            </View>
          </View>

          {/* Espacio entre formulario y botones */}
          <View style={styles.spacer} />

          {/* Botones de acción */}
          <View style={styles.actionsSection}>
            <TouchableOpacity
              style={sharedStyles.primaryButton}
              onPress={handleRegistrarIngreso}
              activeOpacity={0.8}
            >
              <Ionicons name="checkmark-circle" size={20} color={colors.white} />
              <Text style={sharedStyles.primaryButtonText}>Registrar Ingreso</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={sharedStyles.secondaryButton}
              onPress={() => router.push("/acceso-club")}
              activeOpacity={0.8}
            >
              <Text style={sharedStyles.secondaryButtonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  piletaSection: {
    marginBottom: spacing.lg,
  },
  inputGroup: {
    marginBottom: spacing.xl,
  },
  radioGroupError: {
    borderWidth: 2,
    borderColor: '#DC3545',
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    backgroundColor: '#FFF5F5',
  },
  importeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.gray50,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderWidth: 1,
    borderColor: colors.gray300,
  },
  importeInput: {
    flex: 1,
    fontSize: fontSize.lg,
    fontWeight: 'bold',
    color: colors.gray900,
    marginLeft: spacing.sm,
  },
  currencySymbol: {
    fontSize: fontSize.lg,
    fontWeight: 'bold',
    color: colors.gray600,
    marginRight: spacing.sm,
  },
  spacer: {
    height: spacing.xxl,
  },
  actionsSection: {
    marginTop: spacing.sm,
    gap: spacing.lg,
  },
});
