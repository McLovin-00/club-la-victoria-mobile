import { Dimensions, StyleSheet, View } from "react-native";

/**
 * Versión web del overlay del escáner.
 *
 * `@shopify/react-native-skia` no funciona en web sin CanvasKit, así que en web
 * dibujamos la máscara con Views: cuatro bandas semitransparentes alrededor de
 * una ventana central transparente, más el borde redondeado.
 *
 * Metro resuelve este archivo antes que `overlay.tsx` cuando la plataforma es web,
 * por lo que Skia nunca entra al bundle web.
 */
const { width, height } = Dimensions.get("window");

const innerDimension = 300;
const top = height / 2 - innerDimension / 2;
const left = width / 2 - innerDimension / 2;

const MASK_COLOR = "rgba(0, 0, 0, 0.5)";

export const Overlay = () => {
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFillObject}>
      <View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: top,
          backgroundColor: MASK_COLOR,
        }}
      />
      <View
        style={{
          position: "absolute",
          top: top + innerDimension,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: MASK_COLOR,
        }}
      />
      <View
        style={{
          position: "absolute",
          top,
          left: 0,
          width: left,
          height: innerDimension,
          backgroundColor: MASK_COLOR,
        }}
      />
      <View
        style={{
          position: "absolute",
          top,
          left: left + innerDimension,
          right: 0,
          height: innerDimension,
          backgroundColor: MASK_COLOR,
        }}
      />
      <View
        style={{
          position: "absolute",
          top,
          left,
          width: innerDimension,
          height: innerDimension,
          borderWidth: 2,
          borderColor: "rgba(255, 255, 255, 0.8)",
          borderRadius: 50,
        }}
      />
    </View>
  );
};

export default Overlay;
