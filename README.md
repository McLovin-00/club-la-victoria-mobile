# Club La Victoria - Mobile App 📱

Aplicación móvil para el control de accesos del Club La Victoria desarrollada con Expo y React Native.

---

## 📋 Tabla de Contenidos

- [Características](#características)
- [Requisitos Previos](#requisitos-previos)
- [Instalación](#instalación)
- [Configuración](#configuración)
- [Ejecución](#ejecución)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Arquitectura](#arquitectura)
- [Desarrollo](#desarrollo)
- [Testing](#testing)
- [Deployment](#deployment)
- [Documentación](#documentación)

---

## ✨ Características

- ✅ **Registro de Ingresos**: Control de acceso para socios y no socios
- ✅ **Escáner QR**: Lectura de QR con DNI para acceso rápido
- ✅ **Gestión de Pileta**: Control de habilitación y pago de pileta
- ✅ **Tiempo Real**: Actualización en vivo via WebSocket (Socket.IO)
- ✅ **Visualización**: Lista de personas habilitadas para pileta hoy
- ✅ **Offline First**: Manejo robusto de errores de red
- ✅ **TypeScript**: Código completamente tipado
- ✅ **Manejo de Errores Centralizado**: Sistema unificado de errores

---

## 📋 Requisitos Previos

- **Node.js** v18 o superior
- **npm** v9 o superior (o **yarn** v1.22+)
- **Expo CLI** (se instala automáticamente)
- **Dispositivo móvil** con Expo Go app O **emulador** Android/iOS

### Verificar versiones:

```bash
node --version  # Debe ser >= v18
npm --version   # Debe ser >= v9
```

---

## 🔧 Instalación

### 1. Clonar el repositorio

```bash
git clone <repository-url>
cd sistema-ingresos-clublavictoria/mobile
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Verificar instalación

```bash
npm list expo
# Debería mostrar expo@~54.0.0
```

---

## ⚙️ Configuración

### 1. Variables de Entorno

Copia el archivo `.env.example` a `.env`:

```bash
cp .env.example .env
```

### 2. Editar `.env` con tus valores

```env
# Para desarrollo en emulador (localhost funciona)
EXPO_PUBLIC_API_URL=http://localhost:3001/api/v1
EXPO_PUBLIC_SOCKETIO_URI=http://localhost:3001/

# Para desarrollo en dispositivo físico (usa tu IP local)
# EXPO_PUBLIC_API_URL=http://192.168.1.100:3001/api/v1
# EXPO_PUBLIC_SOCKETIO_URI=http://192.168.1.100:3001/
```

### 3. Obtener tu IP local (para dispositivo físico)

**Windows:**
```bash
ipconfig
# Buscar "IPv4 Address" de tu adaptador WiFi
```

**Mac/Linux:**
```bash
ifconfig | grep "inet "
# O: ip addr show
```

### 4. Asegúrate que el backend esté corriendo

```bash
# En el directorio del backend
cd ../backend
npm run start:dev
```

---

## 🚀 Ejecución

### Modo Desarrollo (Expo Go)

```bash
npm start
```

Esto abrirá Expo DevTools en tu navegador. Luego:

1. **Android**: Escanea el QR con la app Expo Go
2. **iOS**: Escanea el QR con la app de Cámara (abrirá Expo Go)
3. **Web**: Presiona `w` en la terminal

### Android (Desarrollo)

```bash
npm run android
```

### iOS (Desarrollo - Solo macOS)

```bash
npm run ios
```

### Build para Producción

Ver sección [Deployment](#deployment)

---

## 📁 Estructura del Proyecto

```
mobile/
├── app/                          # Rutas de la aplicación (Expo Router)
│   ├── _layout.tsx              # Layout principal con Toast
│   ├── index.tsx                # Pantalla de inicio
│   ├── acceso-club/             # Módulo de acceso al club
│   │   ├── index.tsx            # Menu de opciones (QR/DNI)
│   │   ├── scanner/             # Escáner de QR
│   │   │   ├── index.tsx        # Lógica del scanner
│   │   │   └── overlay.tsx      # Overlay visual del scanner
│   │   └── socio/
│   │       └── [dni]/
│   │           └── index.tsx    # Detalle y registro por DNI
│   └── pileta/
│       └── index.tsx            # Listado de habilitados pileta
│
├── components/                   # Componentes reutilizables
│   ├── ClubLogo.tsx             # Logo SVG del club
│   ├── Header.tsx               # Header con botón back
│   ├── Footer.tsx               # Footer de navegación
│   ├── StatusBadge.tsx          # Badge de estado (ACTIVO/INACTIVO)
│   ├── PhotoAvatar.tsx          # Avatar con foto o placeholder
│   ├── SocioClub.tsx            # Vista de Socio Club
│   ├── SocioPileta.tsx          # Vista de Socio Pileta
│   └── NoSocio.tsx              # Vista de No Socio
│
├── constants/                    # Constantes y enums
│   ├── error-codes.ts           # Códigos de error del backend
│   ├── tipo-persona.ts          # SOCIO_CLUB, SOCIO_PILETA, NO_SOCIO
│   ├── tipo-ingreso.ts          # Tipos de ingreso
│   ├── metodo-pago.ts           # EFECTIVO, TRANSFERENCIA
│   ├── estado-persona.ts        # ACTIVO, INACTIVO
│   └── genero.ts                # MASCULINO, FEMENINO, OTRO
│
├── hooks/                        # Custom hooks
│   └── useApiError.ts           # Hook para manejo de errores
│
├── styles/                       # Estilos compartidos
│   └── shared.styles.ts         # Estilos, colores, spacing, etc.
│
├── types/                        # Tipos TypeScript centralizados
│   └── index.ts                 # Todas las interfaces y tipos
│
├── utils/                        # Utilidades
│   ├── axios.util.ts            # Configuración de Axios + interceptors
│   ├── error-handler.util.ts   # Parsing y manejo de errores
│   ├── logger.util.ts           # Logger condicional (solo DEV)
│   ├── socket.util.ts           # Cliente Socket.IO + hooks
│   └── toast.util.ts            # Helpers para toast messages
│
├── assets/                       # Recursos estáticos
│   ├── images/                  # Imágenes
│   └── icon.png                 # Icono de la app
│
├── .env.example                  # Plantilla de variables de entorno
├── .gitignore                    # Archivos ignorados por git
├── app.json                      # Configuración de Expo
├── package.json                  # Dependencias
├── tsconfig.json                 # Configuración de TypeScript
├── README.md                     # Este archivo
├── MOBILE_AUDIT.md              # Auditoría completa
└── CAMBIOS_IMPLEMENTADOS.md    # Resumen de cambios
```

---

## 🏗️ Arquitectura

### Navegación

**Expo Router** (file-based routing):
- Rutas automáticas basadas en estructura de carpetas
- `app/index.tsx` → `/`
- `app/acceso-club/index.tsx` → `/acceso-club`
- `app/acceso-club/socio/[dni]/index.tsx` → `/acceso-club/socio/:dni`

### Manejo de Estado

- **React Hooks** (useState, useEffect, useMemo)
- **Custom Hooks** (`useApiError`, `useIngresoError`, `useRegistrosPiletaHoy`)
- **Socket.IO** para estado en tiempo real (pantalla de pileta)

### Comunicación con Backend

#### REST API (Axios)

```tsx
import { axiosBase } from '@/utils/axios.util';

// POST registro de ingreso
await axiosBase.post('registro-ingreso', data);

// GET socio por DNI
const response = await axiosBase.get(`socios/registro/${dni}`);
```

#### WebSocket (Socket.IO)

```tsx
import { connectSocket, onRegistrosPiletaHoy } from '@/utils/socket.util';

// Conectar
connectSocket();

// Escuchar eventos
onRegistrosPiletaHoy((registros) => {
  console.log('Registros actualizados:', registros);
});
```

### Manejo de Errores

Sistema centralizado en 3 capas:

1. **Interceptor de Axios** (`axios.util.ts`) - Parsea errores automáticamente
2. **Error Handler** (`error-handler.util.ts`) - Mapea códigos a mensajes
3. **Hook useApiError** (`hooks/useApiError.ts`) - Uso en componentes

```tsx
// En componentes
const { handleError } = useIngresoError();

try {
  await axiosBase.post('...', data);
  showSuccessToast('Éxito!');
} catch (error) {
  handleError(error); // Maneja automáticamente
}
```

### Logging

Sistema de logger condicional (solo en desarrollo):

```tsx
import { logger } from '@/utils/logger.util';

logger.category('MiComponente').debug('Info', data);
logger.category('API').info('Request enviado');
logger.error('Error crítico'); // Siempre se muestra
```

### Estilos

Sistema de estilos compartidos para consistencia:

```tsx
import { sharedStyles, colors, spacing } from '@/styles/shared.styles';

<View style={sharedStyles.container}>
  <Text style={sharedStyles.title}>Título</Text>
</View>
```

---

## 💻 Desarrollo

### Convenciones de Código

1. **TypeScript**: Todo debe estar tipado
2. **Imports**: Usar rutas absolutas con `@/` (configurado en tsconfig)
3. **Componentes**: PascalCase (`SocioClub.tsx`)
4. **Hooks**: camelCase con prefijo `use` (`useApiError.ts`)
5. **Constantes**: UPPER_SNAKE_CASE
6. **Estilos**: camelCase en StyleSheet

### Estructura de Componentes

```tsx
// 1. Imports agrupados
import React from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';

// 2. Types/Interfaces
interface MyComponentProps {
  title: string;
}

// 3. Componente
export default function MyComponent({ title }: MyComponentProps) {
  // 4. Hooks
  const router = useRouter();
  const [state, setState] = useState('');

  // 5. Effects
  useEffect(() => {
    // ...
  }, []);

  // 6. Handlers
  const handleClick = () => {
    // ...
  };

  // 7. Render
  return <View>...</View>;
}

// 8. Estilos locales
const styles = StyleSheet.create({
  // ...
});
```

### Uso de Hooks Personalizados

#### useApiError

```tsx
import { useApiError } from '@/hooks/useApiError';

// Configuración completa
const { handleError } = useApiError({
  redirectOnError: '/ruta',
  redirectOnErrorCodes: ['ERR_ALREADY_REGISTERED_TODAY'],
  onError: (errorCode, message) => {
    // Custom logic
  },
  showToast: true,
});

// Simplificado para ingresos
const { handleError } = useIngresoError();
```

#### useRegistrosPiletaHoy

```tsx
import { useRegistrosPiletaHoy } from '@/utils/socket.util';

const { data, loading, error, refresh } = useRegistrosPiletaHoy();

// data: RegistroIngreso[]
// loading: boolean
// error: string | null
// refresh: () => void
```

### Componentes Reutilizables

#### StatusBadge

```tsx
import { StatusBadge } from '@/components/StatusBadge';

<StatusBadge estado={socio.estado} />
```

#### PhotoAvatar

```tsx
import { PhotoAvatar } from '@/components/PhotoAvatar';

<PhotoAvatar
  fotoUrl={socio.fotoUrl}
  size={150}
  bordered={true}
/>
```

---

## 🧪 Testing

### Instalación de dependencias de testing

```bash
npm install --save-dev @testing-library/react-native jest
```

### Ejecutar tests

```bash
npm test
npm run test:watch    # Modo watch
npm run test:coverage # Con cobertura
```

### Escribir tests

```tsx
// __tests__/components/StatusBadge.test.tsx
import { render } from '@testing-library/react-native';
import { StatusBadge } from '@/components/StatusBadge';

describe('StatusBadge', () => {
  it('renders ACTIVO state correctly', () => {
    const { getByText } = render(<StatusBadge estado="ACTIVO" />);
    expect(getByText('ACTIVO')).toBeTruthy();
  });
});
```

---

## 📦 Deployment

### Build para Android (APK)

```bash
# Instalar EAS CLI
npm install -g eas-cli

# Login
eas login

# Build
eas build --platform android --profile preview
```

### Build para iOS

```bash
eas build --platform ios --profile preview
```

### Configuración de EAS (eas.json)

```json
{
  "build": {
    "preview": {
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "android": {
        "buildType": "app-bundle"
      },
      "ios": {
        "bundler": "metro"
      }
    }
  }
}
```

### Variables de Entorno en Producción

En **eas.json** o **Expo Dashboard**:

```json
{
  "build": {
    "production": {
      "env": {
        "EXPO_PUBLIC_API_URL": "https://api.clublavictoria.com/api/v1",
        "EXPO_PUBLIC_SOCKETIO_URI": "https://api.clublavictoria.com/"
      }
    }
  }
}
```

---

## 📚 Documentación

### Archivos de Documentación

- **`MOBILE_AUDIT.md`** - Auditoría completa con problemas identificados y mejoras
- **`CAMBIOS_IMPLEMENTADOS.md`** - Resumen de cambios realizados
- **`README.md`** - Este archivo

### Recursos Externos

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/docs/getting-started)
- [Expo Router Documentation](https://expo.github.io/router/docs/)
- [Socket.IO Client Documentation](https://socket.io/docs/v4/client-api/)

---

## 🔍 Troubleshooting

### Error: "EXPO_PUBLIC_API_URL no está definida"

**Solución**: Crea el archivo `.env` copiando `.env.example` y configura las URLs.

```bash
cp .env.example .env
# Edita .env con tus valores
```

### Error de conexión con el backend

**Verificar**:
1. Backend está corriendo (`npm run start:dev`)
2. URL en `.env` es correcta
3. Si usas dispositivo físico, usa IP local (no localhost)
4. Dispositivo y computadora en la misma red WiFi

### QR Scanner no funciona

**Verificar**:
1. Permisos de cámara otorgados
2. En iOS: revisa `app.json` → `ios.infoPlist.NSCameraUsageDescription`
3. En Android: revisa `app.json` → `android.permissions`

### Socket.IO no conecta

**Verificar**:
1. `EXPO_PUBLIC_SOCKETIO_URI` configurada correctamente
2. Backend WebSocket corriendo (puerto 3001)
3. No usar `/api/v1` en SOCKETIO_URI (solo host:port/)

---

## 🤝 Contribución

### Flujo de trabajo

1. Crear branch desde `main`:
   ```bash
   git checkout -b feature/nombre-feature
   ```

2. Hacer cambios y commits:
   ```bash
   git add .
   git commit -m "feat: descripción del cambio"
   ```

3. Push y crear Pull Request:
   ```bash
   git push origin feature/nombre-feature
   ```

### Convenciones de Commits

Seguimos [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` - Nueva funcionalidad
- `fix:` - Corrección de bug
- `docs:` - Cambios en documentación
- `style:` - Cambios de formato (no afectan código)
- `refactor:` - Refactorización de código
- `test:` - Agregar o modificar tests
- `chore:` - Cambios en build, deps, etc.

---

## 📄 Licencia

Privado - Club La Victoria © 2024

---

## 👥 Equipo

- **Desarrollo**: Tu Equipo
- **Backend**: Ver README del backend
- **Diseño**: Club La Victoria

---

## 📞 Soporte

Para problemas o preguntas:

1. Revisar [MOBILE_AUDIT.md](./MOBILE_AUDIT.md) - Problemas conocidos y soluciones
2. Revisar [Troubleshooting](#troubleshooting) en este README
3. Contactar al equipo de desarrollo

---

**Última actualización**: 18 de Octubre, 2025
**Versión**: 1.1.0 (Post-Auditoría)
