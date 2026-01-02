import React, { useState, useEffect } from "react";
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
import { StatusBadge } from "./StatusBadge";
import { PhotoAvatar } from "./PhotoAvatar";
import { axiosBase } from "../utils/axios.util";
import { TipoIngreso } from "../constants/tipo-ingreso";
import { useIngresoError } from "../hooks/useApiError";
import { sharedStyles, colors, spacing, fontSize, borderRadius } from "../styles/shared.styles";
import { tipoPersonaStyles } from "../styles/shared.styles";
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
    // Reset errors
    setImporteError("");
    setMetodoPagoError("");

    // Solo validar pago si habilitó pileta
    if (habilitarPileta) {
      const importeValido = importe.trim() && !isNaN(Number(importe)) && Number(importe) > 0;
      const metodoPagoValido = !!metodoPago;

      if (!importeValido) {
        setImporteError("⚠️ Ingresa un importe válido mayor a $0");
      }

      if (!metodoPagoValido) {
        setMetodoPagoError("⚠️ Selecciona un método de pago para continuar");
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

      showSuccessToast(`Ingreso registrado para socio ${socio.nombre} ${socio.apellido}${habilitarPileta ? ' (con pileta)' : ' (sin pileta)'}`);
      router.push("/acceso-club");
    } catch (error) {
      console.log('handleRegistrarIngreso error', error);
      handleError(error);
    }
  };

  return (
    <SafeAreaView style={sharedStyles.container} edges={["top", "bottom"]}>
      <Header title="Información del Socio" backRoute="/acceso-club" />

      <View style={sharedStyles.content}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={sharedStyles.scrollContent}
        >
          {/* Información del socio */}
          <View style={sharedStyles.infoSection}>
            <View style={sharedStyles.spaceBetween}>
              <Text style={sharedStyles.name}>
                {socio.nombre} {socio.apellido}
              </Text>
              <StatusBadge estado={socio.estado} />
            </View>

            {/* Foto del socio */}
            <View style={sharedStyles.photoContainer}>
              <PhotoAvatar fotoUrl={socio.fotoUrl} />
            </View>

            <View style={[tipoPersonaStyles.container, tipoPersonaStyles.club]}>
              <Ionicons name="person" size={20} color={colors.warningText} />
              <Text style={[tipoPersonaStyles.text, tipoPersonaStyles.clubText]}>
                {socio.tipo}
              </Text>
            </View>
          </View>

          {/* Detalles del socio */}
          <View style={sharedStyles.detailsSection}>
            <View style={sharedStyles.detailRow}>
              <Ionicons name="card" size={20} color={colors.gray600} />
              <Text style={sharedStyles.detailText}>
                DNI: {socio.dni || "Sin DNI cargado"}
              </Text>
            </View>

            <View style={sharedStyles.detailRow}>
              <Ionicons name="call" size={20} color={colors.gray600} />
              <Text style={sharedStyles.detailText}>
                {socio.telefono && socio.telefono.toString().length > 0
                  ? socio.telefono
                  : "-"}
              </Text>
            </View>

            <View style={sharedStyles.detailRow}>
              <Ionicons name="calendar" size={20} color={colors.gray600} />
              <Text style={sharedStyles.detailText}>
                Nacimiento: {socio.fechaNacimiento}
              </Text>
            </View>
          </View>

          {/* Formulario de pileta */}
          <View style={styles.piletaSection}>
            <View style={sharedStyles.card}>
              <TouchableOpacity
                style={sharedStyles.row}
                onPress={() => {
                  const nuevoEstado = !habilitarPileta;
                  setHabilitarPileta(nuevoEstado);
                  if (!nuevoEstado) {
                    setMetodoPagoError('');
                    setImporteError('');
                  }
                }}
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

            {/* Formulario de pago - Solo visible si habilita pileta */}
            {habilitarPileta && (
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
                      placeholder="Ingrese el importe por pileta"
                      keyboardType="numeric"
                      placeholderTextColor={colors.gray600}
                    />
                  </View>
                  {importeError && (
                    <Text style={sharedStyles.errorText}>{importeError}</Text>
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
    marginBottom: spacing.xxl,
    gap: spacing.lg,
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
  actionsSection: {
    gap: spacing.lg,
  },
});
