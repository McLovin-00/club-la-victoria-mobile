import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
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
import { sharedStyles, colors, spacing } from "../styles/shared.styles";
import { tipoPersonaStyles } from "../styles/shared.styles";
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

            <View style={[tipoPersonaStyles.container, tipoPersonaStyles.pileta]}>
              <Ionicons name="person" size={20} color={colors.successText} />
              <Text style={[tipoPersonaStyles.text, tipoPersonaStyles.piletaText]}>
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
  actionsSection: {
    gap: spacing.lg,
  },
});
