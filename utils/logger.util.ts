/**
 * Logger utility para desarrollo
 * Solo muestra logs en modo desarrollo (__DEV__ = true)
 * En producción, los logs no se ejecutan (optimización de rendimiento)
 */

type LogLevel = 'log' | 'info' | 'warn' | 'error' | 'debug';

interface LogOptions {
  /**
   * Categoría del log para facilitar filtrado
   * Ej: 'API', 'Socket', 'Navigation', 'Auth'
   */
  category?: string;

  /**
   * Si debe forzar el log incluso en producción
   * Usar solo para errores críticos
   */
  force?: boolean;
}

class Logger {
  private isDev = __DEV__;

  /**
   * Log genérico
   */
  log(message: string, ...args: any[]) {
    this.print('log', message, ...args);
  }

  /**
   * Log informativo
   */
  info(message: string, ...args: any[]) {
    this.print('info', message, ...args);
  }

  /**
   * Warning
   */
  warn(message: string, ...args: any[]) {
    this.print('warn', message, ...args);
  }

  /**
   * Error (siempre se muestra, incluso en producción)
   */
  error(message: string, ...args: any[]) {
    this.print('error', message, ...args, { force: true });
  }

  /**
   * Debug detallado (solo desarrollo)
   */
  debug(message: string, ...args: any[]) {
    this.print('debug', message, ...args);
  }

  /**
   * Log con categoría para mejor organización
   *
   * @example
   * ```ts
   * logger.category('API').log('Request sent', requestData);
   * logger.category('Socket').info('Connected to server');
   * ```
   */
  category(category: string) {
    return {
      log: (message: string, ...args: any[]) =>
        this.print('log', message, ...args, { category }),
      info: (message: string, ...args: any[]) =>
        this.print('info', message, ...args, { category }),
      warn: (message: string, ...args: any[]) =>
        this.print('warn', message, ...args, { category }),
      error: (message: string, ...args: any[]) =>
        this.print('error', message, ...args, { category, force: true }),
      debug: (message: string, ...args: any[]) =>
        this.print('debug', message, ...args, { category }),
    };
  }

  /**
   * Log de tabla (útil para arrays de objetos)
   */
  table(data: any, ...args: any[]) {
    if (this.isDev && console.table) {
      console.table(data, ...args);
    }
  }

  /**
   * Group logs (colapsables en la consola)
   */
  group(label: string) {
    if (this.isDev && console.group) {
      console.group(label);
    }
  }

  /**
   * Cierra el grupo
   */
  groupEnd() {
    if (this.isDev && console.groupEnd) {
      console.groupEnd();
    }
  }

  /**
   * Timer para medir performance
   *
   * @example
   * ```ts
   * logger.time('API Call');
   * await fetchData();
   * logger.timeEnd('API Call'); // "API Call: 234ms"
   * ```
   */
  time(label: string) {
    if (this.isDev && console.time) {
      console.time(label);
    }
  }

  /**
   * Finaliza el timer
   */
  timeEnd(label: string) {
    if (this.isDev && console.timeEnd) {
      console.timeEnd(label);
    }
  }

  /**
   * Método privado para imprimir
   */
  private print(
    level: LogLevel,
    message: string,
    ...args: any[]
  ) {
    // Extraer opciones del último argumento si existe
    const lastArg = args[args.length - 1];
    const options: LogOptions =
      lastArg && typeof lastArg === 'object' && (lastArg.category || lastArg.force)
        ? args.pop()
        : {};

    // Si no es dev y no es forzado, no hacer nada
    if (!this.isDev && !options.force && level !== 'error') {
      return;
    }

    // Formatear mensaje con categoría
    const prefix = options.category ? `[${options.category}]` : '';
    const formattedMessage = prefix ? `${prefix} ${message}` : message;

    // Imprimir según el nivel
    switch (level) {
      case 'log':
        console.log(formattedMessage, ...args);
        break;
      case 'info':
        console.info(formattedMessage, ...args);
        break;
      case 'warn':
        console.warn(formattedMessage, ...args);
        break;
      case 'error':
        console.error(formattedMessage, ...args);
        break;
      case 'debug':
        console.debug?.(formattedMessage, ...args) ?? console.log(formattedMessage, ...args);
        break;
    }
  }
}

/**
 * Instancia singleton del logger
 * Usar en toda la aplicación en lugar de console.log
 *
 * @example
 * ```ts
 * import { logger } from '@/utils/logger.util';
 *
 * logger.log('Simple log');
 * logger.category('API').info('Request sent', data);
 * logger.error('Critical error', error);
 * ```
 */
export const logger = new Logger();
