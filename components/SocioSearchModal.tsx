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

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={handleClose}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>Buscar Socio</Text>
                        <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
                            <Ionicons name="close" size={24} color="#6b7280" />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.searchContainer}>
                        <Ionicons
                            name="search"
                            size={20}
                            color="#9ca3af"
                            style={styles.searchIcon}
                        />
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Nombre o apellido del socio"
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                            onSubmitEditing={handleSearch}
                            autoFocus
                        />
                        <TouchableOpacity
                            onPress={handleSearch}
                            style={styles.searchButton}
                            disabled={isSearching || !searchQuery.trim()}
                        >
                            <Text
                                style={[
                                    styles.searchButtonText,
                                    (!searchQuery.trim() || isSearching) &&
                                    styles.searchButtonTextDisabled,
                                ]}
                            >
                                Buscar
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.resultsContainer}>
                        {isSearching ? (
                            <View style={styles.centerContainer}>
                                <ActivityIndicator size="large" color="#0ea5e9" />
                                <Text style={styles.loadingText}>Buscando...</Text>
                            </View>
                        ) : hasSearched ? (
                            results.length > 0 ? (
                                <FlatList
                                    data={results}
                                    keyExtractor={(item) => item.id.toString()}
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
                                                {item.dni && (
                                                    <Text style={styles.socioDni}>DNI: {item.dni}</Text>
                                                )}
                                                {!item.dni && (
                                                    <Text style={styles.socioNoDni}>Sin DNI cargado</Text>
                                                )}
                                            </View>
                                            <Ionicons
                                                name="chevron-forward"
                                                size={20}
                                                color="#9ca3af"
                                            />
                                        </TouchableOpacity>
                                    )}
                                    ItemSeparatorComponent={() => (
                                        <View style={styles.separator} />
                                    )}
                                />
                            ) : (
                                <View style={styles.centerContainer}>
                                    <Ionicons name="person-outline" size={50} color="#9ca3af" />
                                    <Text style={styles.emptyText}>No se encontraron socios</Text>
                                    <Text style={styles.emptySubtext}>
                                        Intenta con otro nombre
                                    </Text>
                                </View>
                            )
                        ) : (
                            <View style={styles.centerContainer}>
                                <Ionicons name="search-outline" size={50} color="#d1d5db" />
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
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        justifyContent: "flex-end",
    },
    modalContent: {
        backgroundColor: "white",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        height: "95%",
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
    searchIcon: {
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        paddingVertical: 12,
        fontSize: 16,
    },
    searchButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    searchButtonText: {
        color: "#0ea5e9",
        fontWeight: "600",
        fontSize: 16,
    },
    searchButtonTextDisabled: {
        color: "#9ca3af",
    },
    resultsContainer: {
        flex: 1,
        minHeight: 300,
    },
    centerContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    loadingText: {
        marginTop: 12,
        fontSize: 16,
        color: "#6b7280",
    },
    emptyText: {
        fontSize: 18,
        color: "#4b5563",
        fontWeight: "600",
        marginTop: 12,
    },
    emptySubtext: {
        fontSize: 14,
        color: "#9ca3af",
        marginTop: 8,
    },
    instructionText: {
        fontSize: 16,
        color: "#9ca3af",
        marginTop: 12,
        textAlign: "center",
    },
    socioItem: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 16,
        paddingHorizontal: 16,
    },
    socioInfo: {
        flex: 1,
    },
    socioName: {
        fontSize: 16,
        fontWeight: "600",
        color: "#111827",
    },
    socioDni: {
        fontSize: 14,
        color: "#6b7280",
        marginTop: 4,
    },
    socioNoDni: {
        fontSize: 14,
        color: "#f59e0b",
        marginTop: 4,
        fontStyle: "italic",
    },
    separator: {
        height: 1,
        backgroundColor: "#e5e7eb",
        marginHorizontal: 16,
    },
});
