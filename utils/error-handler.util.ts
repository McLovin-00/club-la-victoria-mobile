import { AxiosError } from 'axios';
import { ERROR_CODES, ErrorCode } from '../constants/error-codes';

// Interfaz para la respuesta de error del backend
export interface ApiErrorResponse {
  success: false;
  statusCode: number;
  timestamp: string;
  path: string;
  message: string | string[];
  errorCode?: ErrorCode;
}

// Mensajes user-friendly en español para cada código de error
export const ERROR_MESSAGES_UI: Record<string, string> = {
  // Generales
  [ERROR_CODES.INTERNAL_SERVER_ERROR]:
    'Error interno del servidor. Por favor, intenta nuevamente.',
  [ERROR_CODES.UNEXPECTED_ERROR]:
    'Ocurrió un error inesperado. Intenta nuevamente más tarde.',

  // Autenticación
  [ERROR_CODES.USER_NOT_FOUND]:
    'Usuario no encontrado. Verifica tus credenciales.',
  [ERROR_CODES.INVALID_PASSWORD]: 'Contraseña incorrecta. Intenta nuevamente.',
  [ERROR_CODES.UNAUTHORIZED]: 'No tienes autorización para realizar esta acción.',
  [ERROR_CODES.TOKEN_INVALID]: 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.',

  // Validación
  [ERROR_CODES.VALIDATION_ERROR]:
    'Los datos ingresados no son válidos. Revisa los campos e intenta nuevamente.',
  [ERROR_CODES.INVALID_DNI]: 'El DNI ingresado no es válido.',
  [ERROR_CODES.DNI_ALREADY_EXISTS]:
    'Este DNI ya está registrado en el sistema.',

  // Recursos no encontrados
  [ERROR_CODES.SOCIO_NOT_FOUND]:
    'No se encontró el socio en el sistema.',
  [ERROR_CODES.TEMPORADA_NOT_FOUND]: 'No se encontró la temporada solicitada.',
  [ERROR_CODES.REGISTRO_NOT_FOUND]: 'No se encontró el registro de ingreso.',
  [ERROR_CODES.ASOCIACION_NOT_FOUND]: 'No se encontró la asociación.',

  // Negocio
  [ERROR_CODES.SOCIO_ALREADY_REGISTERED_TODAY]:
    'Esta persona ya registró su ingreso hoy.',
  [ERROR_CODES.OVERLAPPING_SEASONS]:
    'Las fechas se solapan con otra temporada existente.',
  [ERROR_CODES.CANNOT_DELETE_SOCIO]:
    'No se puede eliminar el socio porque tiene registros asociados.',

  // Base de datos
  [ERROR_CODES.DB_CONSTRAINT_ERROR]:
    'Error de restricción en la base de datos.',
  [ERROR_CODES.DB_CONNECTION_ERROR]:
    'Error de conexión con el servidor. Verifica tu conexión a internet.',
  [ERROR_CODES.DB_UNIQUE_VIOLATION]:
    'El valor ingresado ya existe en el sistema.',
  [ERROR_CODES.DB_FOREIGN_KEY_VIOLATION]:
    'No se puede completar la operación por dependencias existentes.',
};

/**
 * Obtiene el mensaje de error user-friendly según el código de error
 * @param errorCode - Código de error del backend
 * @param defaultMessage - Mensaje por defecto si no se encuentra el código
 * @returns Mensaje de error en español
 */
export function getErrorMessage(
  errorCode?: string,
  defaultMessage?: string,
): string {
  // Siempre mostrar el mensaje del backend si existe
  if (defaultMessage) {
    return defaultMessage;
  }
  if (!errorCode) {
    return 'Ocurrió un error inesperado';
  }
  return (
    ERROR_MESSAGES_UI[errorCode] ||
    'Error desconocido. Contacta con soporte.'
  );
}

/**
 * Extrae la información del error desde una respuesta de Axios
 * @param error - Error de Axios
 * @returns Información estructurada del error
 */
export function parseApiError(error: unknown): {
  message: string;
  errorCode?: ErrorCode;
  statusCode?: number;
} {
  // Si es un error de Axios con respuesta
  if (error instanceof Error && 'isAxiosError' in error) {
    const axiosError = error as AxiosError<ApiErrorResponse>;

    if (axiosError.response?.data) {
      const { errorCode, message, statusCode } = axiosError.response.data;

      // Si el mensaje es un array (errores de validación)
      const errorMessage = Array.isArray(message) ? message.join(', ') : message;

      return {
        message: getErrorMessage(errorCode, errorMessage),
        errorCode: errorCode as ErrorCode,
        statusCode,
      };
    }

    // Error de red o sin respuesta del servidor
    if (axiosError.code === 'ERR_NETWORK' || !axiosError.response) {
      return {
        message: 'No se pudo conectar con el servidor. Verifica tu conexión a internet.',
        errorCode: ERROR_CODES.DB_CONNECTION_ERROR as ErrorCode,
      };
    }

    // Timeout
    if (axiosError.code === 'ECONNABORTED') {
      return {
        message: 'La solicitud tardó demasiado tiempo. Intenta nuevamente.',
      };
    }
  }

  // Error genérico
  return {
    message: error instanceof Error ? error.message : 'Error desconocido',
  };
}

/**
 * Determina si un error requiere reintentar la operación
 * @param errorCode - Código de error
 * @returns true si se debe reintentar
 */
export function shouldRetryRequest(errorCode?: string): boolean {
  const retryableErrors: string[] = [
    ERROR_CODES.DB_CONNECTION_ERROR,
    ERROR_CODES.INTERNAL_SERVER_ERROR,
  ];
  return errorCode ? retryableErrors.includes(errorCode) : false;
}

/**
 * Determina si un error requiere cerrar sesión
 * @param errorCode - Código de error
 * @returns true si se debe cerrar sesión
 */
export function requiresLogout(errorCode?: string): boolean {
  const logoutErrors: string[] = [ERROR_CODES.TOKEN_INVALID, ERROR_CODES.UNAUTHORIZED];
  return errorCode ? logoutErrors.includes(errorCode) : false;
}

/**
 * Determina el tipo de alerta a mostrar según el error
 * @param errorCode - Código de error
 * @returns Tipo de alerta: 'error' | 'warning' | 'info'
 */
export function getErrorType(errorCode?: string): 'error' | 'warning' | 'info' {
  const warningErrors: string[] = [
    ERROR_CODES.SOCIO_ALREADY_REGISTERED_TODAY,
    ERROR_CODES.DNI_ALREADY_EXISTS,
  ];

  if (errorCode && warningErrors.includes(errorCode)) {
    return 'warning';
  }

  const criticalErrors: string[] = [
    ERROR_CODES.DB_CONNECTION_ERROR,
    ERROR_CODES.INTERNAL_SERVER_ERROR,
  ];

  if (errorCode && criticalErrors.includes(errorCode)) {
    return 'error';
  }

  return 'info';
}
