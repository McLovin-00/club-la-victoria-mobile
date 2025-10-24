import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { parseApiError, requiresLogout } from "./error-handler.util";
import { logger } from "./logger.util";
import { API_URL as apiUrl } from "../constants/api-url";

/**
 * Valida y obtiene la URL del API
 * @throws Error si la URL no está definida
 */
function getApiUrl(): string {
  if (!apiUrl) {
    throw new Error(
      "EXPO_PUBLIC_API_URL no está definida. Verifica tu archivo .env"
    );
  }

  logger.category("Axios").debug("API URL configurada", { apiUrl });

  return apiUrl;
}

export const axiosBase = axios.create({
  baseURL: getApiUrl(),
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000, // 30 segundos
});

// Interceptor de Request - Agregar token de autenticación si existe
axiosBase.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Aquí puedes agregar el token JWT si lo guardas en AsyncStorage
    // const token = await AsyncStorage.getItem('authToken');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor de Response - Manejo global de errores
axiosBase.interceptors.response.use(
  (response) => {
    // Respuesta exitosa, devolver data directamente
    return response;
  },
  (error: AxiosError) => {
    // Parsear el error usando nuestro helper
    const { message, errorCode, statusCode } = parseApiError(error);

    // Si el error requiere logout (token inválido), manejar aquí
    if (requiresLogout(errorCode)) {
      // Aquí puedes agregar lógica para cerrar sesión
      // await AsyncStorage.removeItem('authToken');
      // navigation.navigate('Login');
      console.log("Error de autenticación, se requiere login");
    }

    // Logging en desarrollo
    logger.category("Axios").error("API Error", {
      message,
      errorCode,
      statusCode,
      endpoint: error.config?.url,
    });

    // No mostrar toast aquí, dejar que cada componente decida
    // Pero puedes habilitar esto para errores críticos:
    // if (statusCode && statusCode >= 500) {
    //   showErrorToast(message);
    // }

    // Rechazar el error original para que el sistema de errores centralizado pueda parsearlo correctamente
    return Promise.reject(error);
  }
);
