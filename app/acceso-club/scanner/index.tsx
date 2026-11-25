import { CameraView, useCameraPermissions } from "expo-camera";
import { Stack, useRouter, useFocusEffect } from "expo-router";
import {
  AppState,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useEffect, useRef, useCallback } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { showErrorToast } from "../../../utils/toast.util";
import { logger } from "../../../utils/logger.util";
import { Overlay } from "../../../components/scanner/overlay";
import { borderRadius, colors, fontSize, spacing } from "../../../styles/shared.styles";

export default function Scanner() {
  const router = useRouter();
  const qrLock = useRef(false);
  const appState = useRef(AppState.currentState);
  const [permission, requestPermission] = useCameraPermissions();

  // Solicitar permisos automáticamente al montar
  useEffect(() => {
    (async () => {
      if (!permission) return;

      if (!permission.granted) {
        const result = await requestPermission();
        if (!result.granted) {
          logger.category('Scanner').warn('Permisos de cámara denegados');
          showErrorToast('Se requieren permisos de cámara para escanear QR');
          router.replace("/acceso-club");
        }
      }
    })();
  }, [permission]);

  // Reset del lock al volver a foreground
  useEffect(() => {
    const sub = AppState.addEventListener("change", (next) => {
      if (appState.current.match(/inactive|background/) && next === "active") {
        qrLock.current = false;
      }
      appState.current = next;
    });
    return () => sub.remove();
  }, []);

  // Reset del lock al enfocar la pantalla
  useFocusEffect(
    useCallback(() => {
      qrLock.current = false;
      return () => {};
    }, [])
  );

  const handleScan = ({ data }: { data: string }) => {
    if (qrLock.current) return;
    const text = (data || "").trim();
    const match = /^dni:(\d{7,8})$/i.exec(text);

    logger.category('Scanner').debug('QR escaneado', { data: text });

    if (!match) {
      qrLock.current = true; // bloquear para no tostar mil veces
      logger.category('Scanner').warn('QR inválido', { data: text });
      router.replace("/acceso-club");
      showErrorToast("Código qr inválido. Formato: dni:########");
      return;
    }

    qrLock.current = true;
    const dni = match[1];
    logger.category('Scanner').info('DNI extraído del QR', { dni });
    setTimeout(() => {
      router.push(`/acceso-club/socio/${dni}`);
    }, 120);
  };

  // Si no hay permisos aún, no renderizar nada (se solicitarán automáticamente)
  if (!permission?.granted) {
    return (
      <SafeAreaView style={StyleSheet.absoluteFillObject} edges={[]}>
        <Stack.Screen options={{ headerShown: false }} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={StyleSheet.absoluteFillObject} edges={[]}>
      <Stack.Screen options={{ headerShown: false }} />
      {Platform.OS === "android" ? <StatusBar hidden /> : null}

      <CameraView
        style={StyleSheet.absoluteFillObject}
        facing="back"
        barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
        onBarcodeScanned={handleScan}
      />

      <Overlay />

      <SafeAreaView
        style={styles.hudContainer}
        edges={["top", "bottom"]}
        pointerEvents="box-none"
      >
        <View style={styles.topBar} pointerEvents="box-none">
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.replace("/acceso-club")}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel="Volver"
          >
            <Ionicons name="chevron-back" size={24} color={colors.white} />
          </TouchableOpacity>
          <View style={styles.titlePill}>
            <Text style={styles.titleText}>Escanear QR</Text>
          </View>
          <View style={styles.spacer} />
        </View>

        <View style={styles.bottomHint} pointerEvents="none">
          <Ionicons name="qr-code-outline" size={18} color={colors.white} />
          <Text style={styles.hintText}>Apuntá la cámara al código QR</Text>
        </View>
      </SafeAreaView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  hudContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.full,
    backgroundColor: "rgba(17, 27, 22, 0.65)",
    alignItems: "center",
    justifyContent: "center",
  },
  titlePill: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    backgroundColor: "rgba(17, 27, 22, 0.65)",
  },
  titleText: {
    color: colors.white,
    fontSize: fontSize.sm + 1,
    fontWeight: "700",
  },
  spacer: {
    width: 44,
  },
  bottomHint: {
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    backgroundColor: "rgba(17, 27, 22, 0.72)",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.full,
    marginBottom: spacing.xl,
  },
  hintText: {
    color: colors.white,
    fontSize: fontSize.sm,
    fontWeight: "600",
  },
});
