import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { TipoPersona } from "../../../../constants/tipo-persona";
import Header from "../../../../components/Header";
import { axiosBase } from "../../../../utils/axios.util";
import NoSocio from "../../../../components/NoSocio";
import SocioPileta from "../../../../components/SocioPileta";
import SocioClub from "../../../../components/SocioClub";
import { useApiError } from "../../../../hooks/useApiError";
import { logger } from "../../../../utils/logger.util";
import type { Socio, ApiSocioResponse } from "../../../../types";

export default function SocioById() {
    const { id } = useLocalSearchParams<{ id: string }>();
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
                const { socio: socioData, tipoPersona: tipoPersonaData } =
                    response.data as ApiSocioResponse;

                logger.category('SocioById').debug('Socio cargado', {
                    tipoPersona: tipoPersonaData,
                    hasSocio: !!socioData,
                });

                if (socioData) {
                    setSocio({ ...socioData, tipo: tipoPersonaData });
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

    // Mostrar spinner mientras buscamos
    if (isLoading) {
        return (
            <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
                <Header title="Buscando" backRoute="/acceso-club" />
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#0ea5e9" />
                    <Text style={styles.loadingText}>Buscando persona...</Text>
                </View>
            </SafeAreaView>
        );
    }

    // Si no se pudo determinar el tipo de persona después de la búsqueda, mostrar error
    if (!socio || !socio.tipo) {
        return (
            <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
                <Header title="Error" backRoute="/acceso-club" />
                <View style={styles.loadingContainer}>
                    <Text style={styles.loadingText}>No se pudo determinar el tipo de persona</Text>
                </View>
            </SafeAreaView>
        );
    }

    // Renderizar componente según el tipo de persona
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
    container: {
        flex: 1,
        backgroundColor: "#F8F9FA",
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    loadingText: {
        fontSize: 16,
        color: "#6C757D",
        marginTop: 10,
    },
});
