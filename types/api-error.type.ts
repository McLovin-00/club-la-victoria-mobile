import { ErrorCode } from '../constants/error-codes';

/**
 * Interfaz para errores parseados por el interceptor de Axios
 * Este es el tipo de error que recibirás en el catch
 */
export interface ParsedApiError {
  message: string;
  errorCode?: ErrorCode;
  statusCode?: number;
  originalError?: any;
}

/**
 * Type guard para verificar si un error es un ParsedApiError
 */
export function isParsedApiError(error: unknown): error is ParsedApiError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof (error as any).message === 'string'
  );
}
