import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Modal,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Keyboard,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { axiosBase } from "../utils/axios.util";
import { StatusBadge } from "./StatusBadge";
import {
  borderRadius,
  colors,
  fontSize,
  spacing,
} from "../styles/shared.styles";

interface Socio {
  id: number;
  nombre: string;
  apellido: string;
  dni?: string;
  estado: string;
}

interface SocioSearchModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectSocio: (socio: Socio) => void;
}

export default function SocioSearchModal({
  visible,
  onClose,
  onSelectSocio,
}: SocioSearchModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<Socio[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      return;
    }

    setIsSearching(true);
    setHasSearched(false);
    Keyboard.dismiss();

    try {
      const response = await axiosBase.get("/socios/buscar/nombre", {
        params: { q: searchQuery.trim() },
      });
      setResults(response.data || []);
      setHasSearched(true);
    } catch (error) {
      console.error("Error buscando socios:", error);
      setResults([]);
      setHasSearched(true);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectSocio = (socio: Socio) => {
    onSelectSocio(socio);
    handleClose();
  };

  const handleClose = () => {
    setSearchQuery("");
    setResults([]);
    setHasSearched(false);
    onClose();
  };

  const canSearch = !!searchQuery.trim() && !isSearching;

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={handleClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.dragHandle} />

          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Buscar Socio</Text>
            <TouchableOpacity
              onPress={handleClose}
              style={styles.closeButton}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel="Cerrar búsqueda"
            >
              <Ionicons name="close" size={22} color={colors.gray700} />
            </TouchableOpacity>
          </View>

          <View style={styles.searchRow}>
            <View style={styles.searchContainer}>
              <Ionicons
                name="search"
                size={20}
                color={colors.gray400}
                style={styles.searchIcon}
              />
              <TextInput
                style={styles.searchInput}
                placeholder="Nombre o apellido del socio"
                placeholderTextColor={colors.placeholder}
                value={searchQuery}
                onChangeText={setSearchQuery}
                onSubmitEditing={handleSearch}
                returnKeyType="search"
                autoFocus
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity
                  onPress={() => setSearchQuery("")}
                  style={styles.clearButton}
                  accessibilityLabel="Limpiar búsqueda"
                >
                  <Ionicons name="close-circle" size={18} color={colors.gray400} />
                </TouchableOpacity>
              )}
            </View>

            <TouchableOpacity
              onPress={handleSearch}
              style={[
                styles.searchButton,
                !canSearch && styles.searchButtonDisabled,
              ]}
              disabled={!canSearch}
              activeOpacity={0.85}
              accessibilityRole="button"
            >
              <Text
                style={[
                  styles.searchButtonText,
                  !canSearch && styles.searchButtonTextDisabled,
                ]}
              >
                Buscar
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.resultsContainer}>
            {isSearching ? (
              <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color={colors.primary} />
                <Text style={styles.loadingText}>Buscando...</Text>
              </View>
            ) : hasSearched ? (
              results.length > 0 ? (
                <FlatList
                  data={results}
                  keyExtractor={(item) => item.id.toString()}
                  keyboardShouldPersistTaps="handled"
                  contentContainerStyle={styles.listContent}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.socioItem}
                      onPress={() => handleSelectSocio(item)}
                      activeOpacity={0.7}
                    >
                      <View style={styles.socioInfo}>
                        <Text style={styles.socioName}>
                          {item.apellido}, {item.nombre}
                        </Text>
                        <View style={styles.socioMetaRow}>
                          {item.dni ? (
                            <Text style={styles.socioDni}>DNI: {item.dni}</Text>
                          ) : (
                            <Text style={styles.socioNoDni}>Sin DNI cargado</Text>
                          )}
                          {!!item.estado && <StatusBadge estado={item.estado} />}
                        </View>
                      </View>
                      <Ionicons
                        name="chevron-forward"
                        size={20}
                        color={colors.gray400}
                      />
                    </TouchableOpacity>
                  )}
                  ItemSeparatorComponent={() => <View style={styles.separator} />}
                />
              ) : (
                <View style={styles.centerContainer}>
                  <View style={styles.emptyIconCircle}>
                    <Ionicons name="person-outline" size={32} color={colors.gray400} />
                  </View>
                  <Text style={styles.emptyText}>No se encontraron socios</Text>
                  <Text style={styles.emptySubtext}>Intenta con otro nombre</Text>
                </View>
              )
            ) : (
              <View style={styles.centerContainer}>
                <View style={styles.emptyIconCircle}>
                  <Ionicons name="search-outline" size={32} color={colors.gray400} />
                </View>
                <Text style={styles.instructionText}>
                  Ingresa el nombre o apellido del socio
                </Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(17, 27, 22, 0.48)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: borderRadius.xxl,
    borderTopRightRadius: borderRadius.xxl,
    height: "90%",
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
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray100,
  },
  searchContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.md,
    backgroundColor: colors.surfaceSubtle,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    minHeight: 48,
  },
  searchIcon: {
    marginRight: spacing.sm,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: fontSize.md,
    color: colors.gray900,
  },
  clearButton: {
    padding: 4,
  },
  searchButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    minHeight: 48,
    borderRadius: borderRadius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  searchButtonDisabled: {
    backgroundColor: colors.disabled,
  },
  searchButtonText: {
    color: colors.white,
    fontWeight: "700",
    fontSize: fontSize.sm + 1,
  },
  searchButtonTextDisabled: {
    color: colors.disabledText,
  },
  resultsContainer: {
    flex: 1,
  },
  listContent: {
    paddingBottom: spacing.xl,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.xxl,
  },
  emptyIconCircle: {
    width: 64,
    height: 64,
    borderRadius: borderRadius.full,
    backgroundColor: colors.gray50,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.md,
  },
  loadingText: {
    marginTop: spacing.md,
    fontSize: fontSize.md,
    color: colors.gray600,
    fontWeight: "500",
  },
  emptyText: {
    fontSize: fontSize.md + 1,
    color: colors.gray800,
    fontWeight: "700",
    textAlign: "center",
  },
  emptySubtext: {
    fontSize: fontSize.sm,
    color: colors.gray500,
    marginTop: spacing.xs + 2,
    textAlign: "center",
  },
  instructionText: {
    fontSize: fontSize.md,
    color: colors.gray500,
    textAlign: "center",
    maxWidth: 260,
    lineHeight: 22,
  },
  socioItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: spacing.md + 2,
    paddingHorizontal: spacing.xl,
    minHeight: 68,
  },
  socioInfo: {
    flex: 1,
    paddingRight: spacing.md,
  },
  socioName: {
    fontSize: fontSize.md,
    fontWeight: "700",
    color: colors.gray900,
  },
  socioMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: spacing.sm,
    marginTop: 6,
  },
  socioDni: {
    fontSize: fontSize.sm,
    color: colors.gray600,
    fontVariant: ["tabular-nums"],
  },
  socioNoDni: {
    fontSize: fontSize.sm,
    color: colors.warningText,
    fontStyle: "italic",
  },
  separator: {
    height: 1,
    backgroundColor: colors.gray100,
    marginHorizontal: spacing.xl,
  },
});
