import { CameraView, useCameraPermissions } from "expo-camera";
import { Stack, useRouter, useFocusEffect } from "expo-router";
import {
  AppState,
  Platform,
  StatusBar,
  StyleSheet,
} from "react-native";
import { useEffect, useRef, useCallback } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { showErrorToast } from "../../../utils/toast.util";
import { logger } from "../../../utils/logger.util";
import { Overlay } from "./overlay";

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
    </SafeAreaView>
  );
}
