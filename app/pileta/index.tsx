// mobile/app/pileta/page.tsx
import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  Image,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  Modal,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

import Header from "../../components/Header";
import {
  connectSocket,
  getRegistrosPiletaHoy,
  onRegistrosPiletaHoy,
  onSocketError,
} from "../../utils/socket.util";
import { Genero } from "../../constants/genero";
import { TipoIngreso } from "../../constants/tipo-ingreso";
import { MetodoPago } from "../../constants/metodo-pago";

export interface Persona {
  id: number;
  nombre: string;
  apellido: string;
  dni: string;
  direccion: string;
  telefono: string;
  email: string;
  estado: string;
  fechaAlta: string;
  fechaNacimiento: string;
  fotoUrl: string;
  genero: Genero;
}

export interface RegistroIngreso {
  idIngreso: number;
  fechaHoraIngreso: string;
  habilitaPileta: boolean; 
  tipoIngreso: TipoIngreso;
  idSocio: number | null;
  socio: Persona | null;
  dniNoSocio: string | null;
  importe: number | null;
  metodoPago: MetodoPago | null;
}

export default function HabilitadosPiletaScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [registros, setRegistros] = useState<RegistroIngreso[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [selectedPerson, setSelectedPerson] = useState<Persona | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const handlePressPersona = (persona: Persona) => {
    setSelectedPerson(persona);
    setModalVisible(true);
  };

  useEffect(() => {
    // Asegura una única instancia y conexión
    connectSocket(); // si ya existe, la reutiliza

    // Suscriptores
    const offData = onRegistrosPiletaHoy((data) => {
      setRegistros((data as RegistroIngreso[]) ?? []);
      setIsLoading(false);
      setErrorMsg(null);
    });

    const offErr = onSocketError((e) => {
      setIsLoading(false);
      setErrorMsg(e?.message ?? "Error de socket");
    });

    // Primer pedido
    setIsLoading(true);
    getRegistrosPiletaHoy();

    return () => {
      offData();
      offErr();
      // Si querés cortar WS al salir de la pantalla:
      // disconnectSocket();
    };
  }, []);

  const registrosFiltrados = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return registros;
    return registros.filter((r) => {
      const nombre = r.socio
        ? `${r.socio.nombre} ${r.socio.apellido}`.toLowerCase()
        : "no socio";
      const dni = (r.socio?.dni ?? r.dniNoSocio ?? "").toLowerCase();
      return nombre.includes(q) || dni.includes(q);
    });
  }, [searchQuery, registros]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <Header title="Habilitados pileta - Hoy" backRoute="/" />

      <View
        style={[
          styles.searchContainer,
          !registros.length && styles.searchContainerDisabled,
        ]}
      >
        <Ionicons
          name="search"
          size={20}
          color={registros.length ? "#9ca3af" : "#d1d5db"}
          style={styles.searchIcon}
        />
        <TextInput
          style={[
            styles.searchInput,
            !registros.length && styles.searchInputDisabled,
          ]}
          placeholder={
            isLoading
              ? "Cargando registros..."
              : registros.length
              ? "DNI / Nombre"
              : "No hay registros para buscar"
          }
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor={registros.length ? "#9ca3af" : "#d1d5db"}
          editable={registros.length > 0}
          pointerEvents={registros.length > 0 ? "auto" : "none"}
        />
        {!isLoading && (
          <TouchableOpacity
            onPress={() => {
              setIsLoading(true);
              setErrorMsg(null);
              getRegistrosPiletaHoy();
            }}
            style={{ padding: 8 }}
          >
            <Ionicons name="refresh" size={20} color="#0ea5e9" />
          </TouchableOpacity>
        )}
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0ea5e9" />
          <Text style={styles.loadingText}>Cargando registros</Text>
        </View>
      ) : errorMsg ? (
        <View style={styles.messageContainer}>
          <Ionicons name="alert-circle-outline" size={50} color="#ef4444" />
          <Text style={styles.messageText}>{errorMsg}</Text>
          <TouchableOpacity
            onPress={() => {
              setIsLoading(true);
              setErrorMsg(null);
              getRegistrosPiletaHoy();
            }}
            style={{ marginTop: 12 }}
          >
            <Text style={{ color: "#0ea5e9", fontWeight: "600" }}>
              Reintentar
            </Text>
          </TouchableOpacity>
        </View>
      ) : registrosFiltrados.length === 0 ? (
        <View style={styles.messageContainer}>
          <Ionicons name="water-outline" size={50} color="#9ca3af" />
          <Text style={styles.messageText}>
            No hay registros de pileta para hoy
          </Text>
          <Text style={styles.messageSubtext}>
            Los registros aparecerán aquí cuando las personas ingresen a la
            pileta
          </Text>
        </View>
      ) : (
        <ScrollView style={styles.list}>
          {registrosFiltrados.map((registro) => (
            <TouchableOpacity
              key={registro.idIngreso}
              style={styles.personCard}
              onPress={() =>
                registro.socio && handlePressPersona(registro.socio)
              }
              activeOpacity={0.7}
            >
              <View style={styles.personInfo}>
                <View style={styles.avatar}>
                  <Image
                    source={
                      registro.socio?.fotoUrl
                        ? { uri: registro.socio.fotoUrl }
                        : require("../../assets/images/default-avatar.png")
                    }
                    style={styles.avatarImage}
                  />
                </View>

                <View style={styles.personDetails}>
                  <Text style={styles.personName}>
                    {registro.socio
                      ? `${registro.socio.nombre} ${registro.socio.apellido}`
                      : "No Socio"}
                  </Text>
                  <Text style={styles.personDni}>
                    DNI: {registro.socio?.dni || registro.dniNoSocio}
                  </Text>
                  <View
                    style={[
                      styles.piletaStatus,
                      {
                        backgroundColor:
                          registro.habilitaPileta ? "#dcfce7" : "#fee2e2",
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.piletaStatusText,
                        {
                          color:
                            registro.habilitaPileta
                              ? "#166534"
                              : "#991b1b",
                        },
                      ]}
                    >
                      Pileta habilitada:{" "}
                      {registro.habilitaPileta ? "Sí" : "No"}
                    </Text>
                  </View>
                </View>

                <View style={styles.rightContent}>
                  <Text style={styles.time}>
                    {registro.fechaHoraIngreso.split("T")[1].split(":")[0]}
                    :
                    {registro.fechaHoraIngreso.split("T")[1].split(":")[1]}
                  </Text>
                  {registro.tipoIngreso === "NO_SOCIO" && (
                    <View style={styles.noSocioTag}>
                      <Text style={styles.noSocioText}>No Socio</Text>
                    </View>
                  )}
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.footerButton}
          onPress={() => router.push("/acceso-club")}
        >
          <Ionicons name="home-outline" size={24} color="#000" />
          <Text style={styles.footerButtonText}>Acceso Club</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.footerButton, styles.footerButtonActive]}
          onPress={() => router.push("/pileta")}
        >
          <Ionicons name="water-outline" size={24} color="#06b6d4" />
          <Text
            style={[styles.footerButtonText, styles.footerButtonTextActive]}
          >
            Validación Pileta
          </Text>
        </TouchableOpacity>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Detalles del Socio</Text>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={24} color="#6b7280" />
              </TouchableOpacity>
            </View>

            {selectedPerson && (
              <ScrollView style={styles.modalBody}>
                <View style={styles.modalImageContainer}>
                  <Image
                    source={
                      selectedPerson.fotoUrl
                        ? { uri: selectedPerson.fotoUrl }
                        : require("../../assets/images/default-avatar.png")
                    }
                    style={styles.modalImage}
                  />
                </View>

                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Nombre completo</Text>
                  <Text style={styles.detailValue}>
                    {selectedPerson.nombre} {selectedPerson.apellido}
                  </Text>
                </View>

                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>DNI</Text>
                  <Text style={styles.detailValue}>{selectedPerson.dni}</Text>
                </View>

                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Dirección</Text>
                  <Text style={styles.detailValue}>
                    {selectedPerson.direccion}
                  </Text>
                </View>

                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Teléfono</Text>
                  <Text style={styles.detailValue}>
                    {selectedPerson.telefono}
                  </Text>
                </View>

                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Email</Text>
                  <Text style={styles.detailValue}>{selectedPerson.email}</Text>
                </View>

                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Género</Text>
                  <Text style={styles.detailValue}>
                    {selectedPerson.genero}
                  </Text>
                </View>

                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Fecha de nacimiento</Text>
                  <Text style={styles.detailValue}>
                    {new Date(
                      selectedPerson.fechaNacimiento
                    ).toLocaleDateString("es-AR")}
                  </Text>
                </View>

                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Fecha de alta</Text>
                  <Text style={styles.detailValue}>
                    {new Date(selectedPerson.fechaAlta).toLocaleDateString(
                      "es-AR"
                    )}
                  </Text>
                </View>

                <View style={[styles.detailItem, styles.lastDetailItem]}>
                  <Text style={styles.detailLabel}>Estado</Text>
                  <Text
                    style={[
                      styles.detailValue,
                      {
                        color:
                          selectedPerson.estado === "ACTIVO"
                            ? "#166534"
                            : "#991b1b",
                      },
                    ]}
                  >
                    {selectedPerson.estado}
                  </Text>
                </View>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    margin: 16,
    paddingHorizontal: 12,
    backgroundColor: "#f9fafb",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, paddingVertical: 12, fontSize: 16 },
  list: { flex: 1 },
  personCard: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  personInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#f3f4f6",
    overflow: "hidden",
  },
  avatarImage: { width: "100%", height: "100%" },
  personDetails: { flex: 1, marginLeft: 12 },
  personName: { fontSize: 16, fontWeight: "600", color: "#111827" },
  personDni: { fontSize: 14, color: "#6b7280", marginTop: 2 },
  piletaStatus: {
    marginTop: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: "flex-start",
  },
  piletaStatusText: { fontSize: 12, fontWeight: "500" },
  rightContent: {
    alignItems: "flex-end",
    justifyContent: "flex-start",
    flexDirection: "column",
    gap: 8,
    minWidth: 80,
  },
  time: { fontSize: 14, color: "#6b7280" },
  footer: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    paddingVertical: 8,
  },
  footerButton: { flex: 1, alignItems: "center", paddingVertical: 8 },
  footerButtonActive: { borderTopWidth: 2, borderTopColor: "#06b6d4" },
  footerButtonText: { marginTop: 4, fontSize: 12, color: "#6b7280" },
  footerButtonTextActive: { color: "#06b6d4" },
  noSocioTag: {
    backgroundColor: "#f3f4f6",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginTop: 4,
  },
  noSocioText: { fontSize: 12, color: "#374151", fontWeight: "500" },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#6b7280",
    fontWeight: "500",
  },
  searchContainerDisabled: {
    backgroundColor: "#f3f4f6",
    borderColor: "#e5e7eb",
  },
  searchInputDisabled: { color: "#9ca3af" },
  messageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  messageText: {
    fontSize: 18,
    color: "#4b5563",
    textAlign: "center",
    marginTop: 12,
    fontWeight: "600",
  },
  messageSubtext: {
    fontSize: 14,
    color: "#9ca3af",
    textAlign: "center",
    marginTop: 8,
    maxWidth: "80%",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "90%",
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
  },
  closeButton: {
    padding: 8,
  },
  modalBody: {
    padding: 16,
  },
  modalImageContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#f3f4f6",
    alignSelf: "center",
    marginBottom: 24,
    overflow: "hidden",
  },
  modalImage: {
    width: "100%",
    height: "100%",
  },
  detailItem: {
    marginBottom: 16,
  },
  lastDetailItem: {
    marginBottom: 0,
  },
  detailLabel: {
    fontSize: 12,
    color: "#6b7280",
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    color: "#111827",
  },
});