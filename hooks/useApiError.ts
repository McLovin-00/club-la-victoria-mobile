import { useCallback } from 'react';
import { useRouter } from 'expo-router';
import { parseApiError, requiresLogout, shouldRetryRequest } from '../utils/error-handler.util';
import { showErrorToast } from '../utils/toast.util';
import { ERROR_CODES } from '../constants/error-codes';

interface UseApiErrorOptions {
  /**
   * Ruta a la que redirigir en caso de error
   * Por defecto no redirige
   */
  redirectOnError?: string;

  /**
   * Códigos de error específicos que disparan redirección
   */
  redirectOnErrorCodes?: string[];

  /**
   * Callback personalizado para manejar errores específicos
   */
  onError?: (errorCode?: string, message?: string) => void;

  /**
   * Si debe mostrar toast automáticamente
   * Por defecto: true
   */
  showToast?: boolean;
}

/**
 * Hook para manejar errores de API de forma consistente
 *
 * @example
 * ```tsx
 * const { handleError } = useApiError({
 *   redirectOnError: '/acceso-club',
 *   redirectOnErrorCodes: ['ERR_ALREADY_REGISTERED_TODAY']
 * });
 *
 * try {
 *   await axiosBase.post('...');
 * } catch (error) {
 *   handleError(error);
 * }
 * ```
 */
export function useApiError(options: UseApiErrorOptions = {}) {
  const router = useRouter();
  const {
    redirectOnError,
    redirectOnErrorCodes = [],
    onError,
    showToast = true,
  } = options;

  const handleError = useCallback(
    (error: unknown) => {
      // Parsear el error usando el sistema centralizado
      const { message, errorCode, statusCode } = parseApiError(error);

      // Callback personalizado si existe
      if (onError) {
        onError(errorCode, message);
      }

      // Mostrar toast con el mensaje del backend o el mapeado
      if (showToast) {
        showErrorToast(message);
      }

      // Manejar logout si el token es inválido
      if (errorCode && requiresLogout(errorCode)) {
        // TODO: Implementar lógica de logout cuando se implemente auth
        // await AsyncStorage.removeItem('authToken');
        router.replace('/'); // O ruta de login
        return;
      }

      // Redirigir si el código de error está en la lista
      if (errorCode && redirectOnErrorCodes.includes(errorCode)) {
        if (redirectOnError) {
          router.push(redirectOnError);
        }
        return;
      }

      // Redirigir genéricamente si está configurado y no es un error crítico
      if (redirectOnError && statusCode !== 500) {
        router.push(redirectOnError);
      }
    },
    [router, redirectOnError, redirectOnErrorCodes, onError, showToast]
  );

  /**
   * Wrapper para ejecutar una función async con manejo de errores automático
   *
   * @example
   * ```tsx
   * const handleSubmit = withErrorHandling(async () => {
   *   await axiosBase.post('...');
   *   showSuccessToast('Éxito!');
   * });
   * ```
   */
  const withErrorHandling = useCallback(
    <T extends (...args: any[]) => Promise<any>>(fn: T) => {
      return async (...args: Parameters<T>): Promise<ReturnType<T> | undefined> => {
        try {
          return await fn(...args);
        } catch (error) {
          handleError(error);
          return undefined;
        }
      };
    },
    [handleError]
  );

  return {
    handleError,
    withErrorHandling,
  };
}

/**
 * Hook especializado para registro de ingresos
 * Incluye lógica de negocio específica para los casos de ingreso
 */
export function useIngresoError() {
  return useApiError({
    redirectOnError: '/acceso-club',
    redirectOnErrorCodes: [ERROR_CODES.SOCIO_ALREADY_REGISTERED_TODAY],
    onError: (errorCode, message) => {
      // Lógica específica para errores de ingreso
      if (errorCode === ERROR_CODES.SOCIO_ALREADY_REGISTERED_TODAY) {
        // Podríamos agregar analytics aquí
        if (__DEV__) {
          console.log('[Ingreso] Persona ya registró ingreso hoy');
        }
      }
    },
  });
}
