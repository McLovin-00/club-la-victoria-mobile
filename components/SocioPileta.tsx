import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
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
import type { Socio, CreateRegistroIngresoDto } from "../types";

interface SocioPiletaProps {
  socio: Socio;
}

export default function SocioPileta({ socio }: SocioPiletaProps) {
  const router = useRouter();
  const { handleError } = useIngresoError();

  const handleRegistrarIngreso = async () => {
    try {
      const registroIngreso: CreateRegistroIngresoDto = {
        idSocio: socio.id,
        dniNoSocio: undefined,
        tipoIngreso: TipoIngreso.SOCIO_PILETA,
        habilitaPileta: true,
        metodoPago: undefined, // Socios pileta no requieren método de pago
        importe: undefined, // Socios pileta no requieren importe
      };

      await axiosBase.post("registro-ingreso", registroIngreso);

      showSuccessToast(
        `Ingreso registrado para ${socio.nombre} ${socio.apellido}`
      );
      router.push("/acceso-club");
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <SafeAreaView style={sharedStyles.container} edges={["top", "bottom"]}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.surface} />
      <Header title="Información del Socio" backRoute="/acceso-club" />

      <View style={sharedStyles.content}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={sharedStyles.scrollContent}
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
              <View style={[tipoPersonaStyles.container, tipoPersonaStyles.pileta]}>
                <Ionicons name="water" size={14} color={colors.primaryDark} />
                <Text style={[tipoPersonaStyles.text, tipoPersonaStyles.piletaText]}>
                  {socio.tipo}
                </Text>
              </View>
            </View>

            {socio.certificadoMedicoPresentado === false && (
              <View
                style={styles.certificateWarning}
                accessibilityRole="alert"
              >
                <Ionicons
                  name="warning"
                  size={20}
                  color={colors.warningText}
                  style={styles.warningIcon}
                />
                <View style={styles.certificateWarningText}>
                  <Text style={styles.certificateWarningTitle}>
                    Certificado médico pendiente
                  </Text>
                  <Text style={styles.certificateWarningDescription}>
                    El certificado no figura como presentado para la temporada
                    vigente. El ingreso puede registrarse igualmente.
                  </Text>
                </View>
              </View>
            )}
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
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
  actionsSection: {
    marginTop: spacing.sm,
    gap: spacing.md,
  },
  certificateWarning: {
    width: "100%",
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.sm + 2,
    marginTop: spacing.lg,
    padding: spacing.md + 2,
    borderWidth: 1,
    borderColor: "#F59E0B",
    borderRadius: borderRadius.md,
    backgroundColor: colors.warning,
  },
  warningIcon: {
    marginTop: 1,
  },
  certificateWarningText: {
    flex: 1,
    gap: spacing.xs,
  },
  certificateWarningTitle: {
    fontSize: fontSize.sm,
    color: colors.warningText,
    fontWeight: "700",
  },
  certificateWarningDescription: {
    fontSize: fontSize.sm - 1,
    color: colors.warningText,
    lineHeight: 19,
  },
});
