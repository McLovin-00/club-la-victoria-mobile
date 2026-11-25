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
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { StatusBadge } from "../../components/StatusBadge";
import {
  connectSocket,
  getRegistrosPiletaHoy,
  onRegistrosPiletaHoy,
  onSocketError,
} from "../../utils/socket.util";
import { Genero } from "../../constants/genero";
import { TipoIngreso } from "../../constants/tipo-ingreso";
import { MetodoPago } from "../../constants/metodo-pago";
import {
  borderRadius,
  colors,
  fontSize,
  shadows,
  spacing,
} from "../../styles/shared.styles";

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
  nombreNoSocio: string | null;
  apellidoNoSocio: string | null;
  importe: number | null;
  metodoPago: MetodoPago | null;
}

export default function HabilitadosPiletaScreen() {
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
    };
  }, []);

  const registrosFiltrados = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return registros;
    return registros.filter((r) => {
      const nombre = r.socio
        ? `${r.socio.nombre} ${r.socio.apellido}`.toLowerCase()
        : r.nombreNoSocio && r.apellidoNoSocio
          ? `${r.nombreNoSocio} ${r.apellidoNoSocio}`.toLowerCase()
          : "no socio";
      const dni = (r.socio?.dni ?? r.dniNoSocio ?? "").toLowerCase();
      return nombre.includes(q) || dni.includes(q);
    });
  }, [searchQuery, registros]);

  const handleRefresh = () => {
    setIsLoading(true);
    setErrorMsg(null);
    getRegistrosPiletaHoy();
  };

  const hasSearchFilter = searchQuery.trim().length > 0;

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.surface} />

      <Header title="Habilitados pileta - Hoy" backRoute="/" />

      {/* Barra de búsqueda + actualizar */}
      <View style={styles.toolbar}>
        <View
          style={[
            styles.searchContainer,
            !registros.length && styles.searchContainerDisabled,
          ]}
        >
          <Ionicons
            name="search"
            size={20}
            color={registros.length ? colors.gray400 : colors.gray300}
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
            placeholderTextColor={registros.length ? colors.placeholder : colors.gray400}
            editable={registros.length > 0}
            pointerEvents={registros.length > 0 ? "auto" : "none"}
          />
          {hasSearchFilter && (
            <TouchableOpacity
              onPress={() => setSearchQuery("")}
              style={styles.clearButton}
              accessibilityLabel="Limpiar filtro"
            >
              <Ionicons name="close-circle" size={18} color={colors.gray400} />
            </TouchableOpacity>
          )}
        </View>

        {!isLoading && (
          <TouchableOpacity
            onPress={handleRefresh}
            style={styles.refreshButton}
            activeOpacity={0.75}
            accessibilityRole="button"
            accessibilityLabel="Actualizar registros"
          >
            <Ionicons name="refresh" size={20} color={colors.primaryDark} />
          </TouchableOpacity>
        )}
      </View>

      {!isLoading && !errorMsg && registros.length > 0 && (
        <View style={styles.summaryBar}>
          <Text style={styles.summaryText}>
            {hasSearchFilter
              ? `${registrosFiltrados.length} de ${registros.length} registros`
              : `${registros.length} ${registros.length === 1 ? "registro hoy" : "registros hoy"}`}
          </Text>
        </View>
      )}

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Cargando registros</Text>
        </View>
      ) : errorMsg ? (
        <View style={styles.messageContainer}>
          <View style={styles.errorIconCircle}>
            <Ionicons name="alert-circle-outline" size={34} color={colors.errorAccent} />
          </View>
          <Text style={styles.messageText}>{errorMsg}</Text>
          <TouchableOpacity
            onPress={handleRefresh}
            style={styles.retryButton}
            activeOpacity={0.8}
          >
            <Ionicons name="refresh" size={16} color={colors.primaryDark} />
            <Text style={styles.retryButtonText}>Reintentar</Text>
          </TouchableOpacity>
        </View>
      ) : registrosFiltrados.length === 0 ? (
        <View style={styles.messageContainer}>
          <View style={styles.emptyIconCircle}>
            <Ionicons
              name={hasSearchFilter ? "search-outline" : "water-outline"}
              size={34}
              color={colors.gray400}
            />
          </View>
          <Text style={styles.messageText}>
            {hasSearchFilter
              ? "Sin coincidencias"
              : "No hay registros de pileta para hoy"}
          </Text>
          <Text style={styles.messageSubtext}>
            {hasSearchFilter
              ? "Probá con otro nombre o número de DNI"
              : "Los registros aparecerán aquí cuando las personas ingresen a la pileta"}
          </Text>
        </View>
      ) : (
        <ScrollView
          style={styles.list}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        >
          {registrosFiltrados.map((registro) => {
            const fecha = new Date(registro.fechaHoraIngreso);
            const horaFormateada = `${fecha.getHours().toString().padStart(2, "0")}:${fecha.getMinutes().toString().padStart(2, "0")}`;
            const isSocio = !!registro.socio;

            return (
              <TouchableOpacity
                key={registro.idIngreso}
                style={styles.personCard}
                onPress={() => registro.socio && handlePressPersona(registro.socio)}
                activeOpacity={isSocio ? 0.75 : 1}
                accessibilityRole={isSocio ? "button" : "none"}
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
                    <Text style={styles.personName} numberOfLines={1}>
                      {registro.socio
                        ? `${registro.socio.nombre} ${registro.socio.apellido}`
                        : registro.nombreNoSocio && registro.apellidoNoSocio
                          ? `${registro.nombreNoSocio} ${registro.apellidoNoSocio}`
                          : "No Socio"}
                    </Text>

                    <Text style={styles.personDni}>
                      DNI: {registro.socio?.dni || registro.dniNoSocio}
                    </Text>

                    <View style={styles.badgesRow}>
                      <View
                        style={[
                          styles.piletaStatus,
                          registro.habilitaPileta
                            ? styles.piletaStatusOk
                            : styles.piletaStatusDenied,
                        ]}
                      >
                        <Ionicons
                          name={
                            registro.habilitaPileta
                              ? "checkmark-circle"
                              : "close-circle"
                          }
                          size={13}
                          color={
                            registro.habilitaPileta
                              ? colors.successText
                              : colors.errorText
                          }
                        />
                        <Text
                          style={[
                            styles.piletaStatusText,
                            {
                              color: registro.habilitaPileta
                                ? colors.successText
                                : colors.errorText,
                            },
                          ]}
                        >
                          Pileta habilitada: {registro.habilitaPileta ? "Sí" : "No"}
                        </Text>
                      </View>

                      {registro.tipoIngreso === "NO_SOCIO" && (
                        <View style={styles.noSocioTag}>
                          <Text style={styles.noSocioText}>No Socio</Text>
                        </View>
                      )}
                    </View>
                  </View>

                  <View style={styles.rightContent}>
                    <Text style={styles.time}>{horaFormateada}</Text>
                    {isSocio && (
                      <Ionicons
                        name="chevron-forward"
                        size={18}
                        color={colors.gray400}
                      />
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      )}

      <Footer activeTab="pileta" />

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.dragHandle} />

            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Detalles del Socio</Text>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.closeButton}
                activeOpacity={0.7}
                accessibilityRole="button"
                accessibilityLabel="Cerrar"
              >
                <Ionicons name="close" size={22} color={colors.gray700} />
              </TouchableOpacity>
            </View>

            {selectedPerson && (
              <ScrollView
                style={styles.modalBody}
                contentContainerStyle={styles.modalBodyContent}
                showsVerticalScrollIndicator={false}
              >
                <View style={styles.modalHero}>
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
                  <Text style={styles.modalPersonName}>
                    {selectedPerson.nombre} {selectedPerson.apellido}
                  </Text>
                  <View style={styles.modalStatusWrap}>
                    <StatusBadge estado={selectedPerson.estado} />
                  </View>
                </View>

                <View style={styles.modalDetailsCard}>
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
                      {selectedPerson.direccion || "-"}
                    </Text>
                  </View>

                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Teléfono</Text>
                    <Text style={styles.detailValue}>
                      {selectedPerson.telefono || "-"}
                    </Text>
                  </View>

                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Email</Text>
                    <Text style={styles.detailValue}>
                      {selectedPerson.email || "-"}
                    </Text>
                  </View>

                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Género</Text>
                    <Text style={styles.detailValue}>
                      {selectedPerson.genero || "-"}
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

                  <View style={[styles.detailItem, styles.lastDetailItem]}>
                    <Text style={styles.detailLabel}>Fecha de alta</Text>
                    <Text style={styles.detailValue}>
                      {new Date(selectedPerson.fechaAlta).toLocaleDateString(
                        "es-AR"
                      )}
                    </Text>
                  </View>
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
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  toolbar: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  searchContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    minHeight: 48,
    ...shadows.sm,
  },
  searchContainerDisabled: {
    backgroundColor: colors.gray100,
    borderColor: colors.border,
  },
  searchIcon: {
    marginRight: spacing.sm,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 11,
    fontSize: fontSize.md,
    color: colors.gray900,
  },
  searchInputDisabled: {
    color: colors.gray400,
  },
  clearButton: {
    padding: 4,
  },
  refreshButton: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.primaryLight,
    borderWidth: 1,
    borderColor: colors.primaryBorder,
    alignItems: "center",
    justifyContent: "center",
  },
  summaryBar: {
    paddingHorizontal: spacing.lg + 2,
    paddingBottom: spacing.sm,
  },
  summaryText: {
    fontSize: fontSize.xs + 1,
    fontWeight: "600",
    color: colors.gray500,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
    gap: spacing.sm + 2,
  },
  personCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md + 2,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.sm,
  },
  personInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.full,
    backgroundColor: colors.gray100,
    borderWidth: 1.5,
    borderColor: colors.border,
    overflow: "hidden",
  },
  avatarImage: {
    width: "100%",
    height: "100%",
  },
  personDetails: {
    flex: 1,
    marginLeft: spacing.md,
    marginRight: spacing.sm,
  },
  personName: {
    fontSize: fontSize.md,
    fontWeight: "700",
    color: colors.gray900,
  },
  personDni: {
    fontSize: fontSize.sm - 1,
    color: colors.gray500,
    marginTop: 2,
    fontVariant: ["tabular-nums"],
  },
  badgesRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 6,
    marginTop: 6,
  },
  piletaStatus: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: borderRadius.full,
    borderWidth: 1,
  },
  piletaStatusOk: {
    backgroundColor: colors.success,
    borderColor: colors.successBorder,
  },
  piletaStatusDenied: {
    backgroundColor: colors.error,
    borderColor: colors.errorBorder,
  },
  piletaStatusText: {
    fontSize: fontSize.xs,
    fontWeight: "600",
  },
  noSocioTag: {
    backgroundColor: colors.gray100,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: borderRadius.full,
  },
  noSocioText: {
    fontSize: fontSize.xs,
    color: colors.gray700,
    fontWeight: "600",
  },
  rightContent: {
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: 6,
  },
  time: {
    fontSize: fontSize.sm - 1,
    fontWeight: "600",
    color: colors.gray600,
    fontVariant: ["tabular-nums"],
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: spacing.md,
    fontSize: fontSize.md,
    color: colors.gray600,
    fontWeight: "500",
  },
  messageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.xxl,
  },
  emptyIconCircle: {
    width: 68,
    height: 68,
    borderRadius: borderRadius.full,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.md,
  },
  errorIconCircle: {
    width: 68,
    height: 68,
    borderRadius: borderRadius.full,
    backgroundColor: colors.errorBg,
    borderWidth: 1,
    borderColor: colors.errorBorder,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.md,
  },
  messageText: {
    fontSize: fontSize.md + 1,
    color: colors.gray800,
    textAlign: "center",
    fontWeight: "700",
  },
  messageSubtext: {
    fontSize: fontSize.sm,
    color: colors.gray500,
    textAlign: "center",
    marginTop: spacing.xs + 2,
    maxWidth: 280,
    lineHeight: 20,
  },
  retryButton: {
    marginTop: spacing.lg,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: colors.primaryLight,
    borderWidth: 1,
    borderColor: colors.primaryBorder,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
  },
  retryButtonText: {
    color: colors.primaryDark,
    fontWeight: "700",
    fontSize: fontSize.sm + 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(17, 27, 22, 0.48)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: borderRadius.xxl,
    borderTopRightRadius: borderRadius.xxl,
    maxHeight: "90%",
    paddingBottom: spacing.xl,
  },
  dragHandle: {
    width: 40,
    height: 4,
    borderRadius: borderRadius.full,
    backgroundColor: colors.gray300,
    alignSelf: "center",
    marginTop: spacing.sm + 2,
    marginBottom: spacing.xs,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalTitle: {
    fontSize: fontSize.lg,
    fontWeight: "700",
    color: colors.gray900,
    letterSpacing: -0.3,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.full,
    backgroundColor: colors.gray50,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  modalBody: {
    paddingHorizontal: spacing.xl,
  },
  modalBodyContent: {
    paddingTop: spacing.xl,
    paddingBottom: spacing.xl,
  },
  modalHero: {
    alignItems: "center",
    marginBottom: spacing.xl,
  },
  modalImageContainer: {
    width: 104,
    height: 104,
    borderRadius: borderRadius.full,
    backgroundColor: colors.gray100,
    borderWidth: 3,
    borderColor: colors.primaryBorder,
    marginBottom: spacing.md,
    overflow: "hidden",
  },
  modalImage: {
    width: "100%",
    height: "100%",
  },
  modalPersonName: {
    fontSize: fontSize.xl,
    fontWeight: "700",
    color: colors.gray900,
    textAlign: "center",
    letterSpacing: -0.3,
  },
  modalStatusWrap: {
    marginTop: spacing.sm,
  },
  modalDetailsCard: {
    backgroundColor: colors.surfaceSubtle,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xs,
  },
  detailItem: {
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
  },
  lastDetailItem: {
    borderBottomWidth: 0,
  },
  detailLabel: {
    fontSize: fontSize.xs,
    fontWeight: "600",
    color: colors.gray500,
    marginBottom: 3,
  },
  detailValue: {
    fontSize: fontSize.md - 1,
    fontWeight: "500",
    color: colors.gray900,
    fontVariant: ["tabular-nums"],
  },
});
