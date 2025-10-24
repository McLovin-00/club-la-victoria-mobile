# Instrucciones para generar APK de Club la Victoria

## Configuración completada ✅

La aplicación ha sido configurada con:
- **Nombre:** Club la Victoria
- **Package:** com.clublavictoria.mobile
- **Icono:** assets/images/logo.png (adaptado para Android)

## Requisitos previos

1. Tener instalado Node.js y npm
2. Tener instalado Java JDK (versión 17 o superior recomendada)
3. Tener configurado Android SDK
4. Tener una cuenta en Expo (para usar EAS Build)

## Opción 1: Generar APK con EAS Build (Recomendado)

EAS Build es el servicio de Expo que compila la app en la nube, no necesitas tener Android Studio instalado localmente.

### Paso 1: Instalar EAS CLI
```bash
npm install -g eas-cli
```

### Paso 2: Iniciar sesión en Expo
```bash
eas login
```

### Paso 3: Generar APK de producción
```bash
eas build --platform android --profile production
```

O para un build de preview (más rápido):
```bash
eas build --platform android --profile preview
```

### Paso 4: Descargar el APK
Una vez completado el build, EAS te proporcionará un link para descargar el APK directamente.

## Opción 2: Generar APK localmente

Si prefieres compilar localmente (requiere Android Studio y SDK configurados):

### Paso 1: Generar archivos nativos
```bash
npx expo prebuild --platform android
```

### Paso 2: Compilar el APK
```bash
cd android
.\gradlew assembleRelease
cd ..
```

El APK se generará en: `android/app/build/outputs/apk/release/app-release.apk`

## Perfiles de build disponibles

En `eas.json` hay 3 perfiles configurados:

- **development**: Para desarrollo con DevClient, genera APK
- **preview**: Para testing interno, genera APK
- **production**: Para producción, genera APK

## Notas importantes

- El icono se adaptará automáticamente a los diferentes tamaños requeridos por Android
- El nombre "Club la Victoria" aparecerá debajo del icono cuando la app esté instalada
- El package `com.clublavictoria.mobile` es único y diferencia esta app de otras

## Actualizar versión

Para actualizar la versión de la app, modifica estos archivos:

1. `app.json`: Actualiza el campo `version`
2. `android/app/build.gradle`: Incrementa `versionCode` y actualiza `versionName`

