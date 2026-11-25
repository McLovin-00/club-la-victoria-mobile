import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, StatusBar } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { TipoPersona } from "../../../../constants/tipo-persona";
import Header from "../../../../components/Header";
import { axiosBase } from "../../../../utils/axios.util";
import NoSocio from "../../../../components/NoSocio";
import SocioPileta from "../../../../components/SocioPileta";
import SocioClub from "../../../../components/SocioClub";
import { useApiError } from "../../../../hooks/useApiError";
import { logger } from "../../../../utils/logger.util";
import { colors, sharedStyles, spacing } from "../../../../styles/shared.styles";
import type { Socio, ApiSocioResponse } from "../../../../types";

export default function SocioById() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { handleError } = useApiError({
    redirectOnError: '/acceso-club',
  });

  const [socio, setSocio] = useState<Socio | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadSocioData = async () => {
      try {
        // El backend acepta tanto ID como DNI
        const response = await axiosBase.get(`socios/registro/${id}`);
        const {
          socio: socioData,
          tipoPersona: tipoPersonaData,
          certificadoMedicoPresentado,
        } = response.data as ApiSocioResponse;

        logger.category('SocioById').debug('Socio cargado', {
          tipoPersona: tipoPersonaData,
          hasSocio: !!socioData,
        });

        if (socioData) {
          setSocio({
            ...socioData,
            tipo: tipoPersonaData,
            certificadoMedicoPresentado,
          });
        } else {
          setSocio({
            nombre: "",
            apellido: "",
            dni: "",
            telefono: "",
            email: "",
            fechaAlta: "",
            fechaNacimiento: "",
            direccion: "",
            estado: null,
            genero: "",
            fotoUrl: "",
            tipo: tipoPersonaData,
            certificadoMedicoPresentado,
          });
        }
        setIsLoading(false);
      } catch (error) {
        logger.category('SocioById').error("Error cargando socio", error);
        handleError(error);
        setIsLoading(false);
      }
    };

    loadSocioData();
  }, [id]);

  if (isLoading) {
    return (
      <SafeAreaView style={sharedStyles.container} edges={["top", "bottom"]}>
        <StatusBar barStyle="dark-content" backgroundColor={colors.surface} />
        <Header title="Buscando" backRoute="/acceso-club" />
        <View style={sharedStyles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={sharedStyles.loadingText}>Buscando persona...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!socio || !socio.tipo) {
    return (
      <SafeAreaView style={sharedStyles.container} edges={["top", "bottom"]}>
        <StatusBar barStyle="dark-content" backgroundColor={colors.surface} />
        <Header title="Error" backRoute="/acceso-club" />
        <View style={sharedStyles.loadingContainer}>
          <Ionicons name="alert-circle-outline" size={44} color={colors.errorAccent} />
          <Text style={sharedStyles.loadingText}>
            No se pudo determinar el tipo de persona
          </Text>
          <TouchableOpacity
            style={[sharedStyles.secondaryButton, styles.backAction]}
            onPress={() => router.push("/acceso-club")}
            activeOpacity={0.8}
          >
            <Text style={sharedStyles.secondaryButtonText}>Volver a Acceso Club</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  switch (socio.tipo) {
    case TipoPersona.NOSOCIO:
      // Para NO_SOCIO, usar el ID como DNI (el backend lo maneja)
      return <NoSocio dni={id} />;

    case TipoPersona.SOCIOPILETA:
      return <SocioPileta socio={socio} />;

    case TipoPersona.SOCIOCLUB:
      return <SocioClub socio={socio} />;

    default:
      return <NoSocio dni={id} />;
  }
}

const styles = StyleSheet.create({
  backAction: {
    marginTop: spacing.xl,
    paddingHorizontal: spacing.xxl,
  },
});
