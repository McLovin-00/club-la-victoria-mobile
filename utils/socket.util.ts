// src/utils/socket.util.ts
import { io, Socket } from "socket.io-client";
import { useEffect, useState } from "react";
import { logger } from "./logger.util";
import type { RegistroIngreso } from "../types";

let socket: Socket | null = null;

/**
 * Interfaz para errores de socket
 */
interface SocketError {
  message: string;
  code?: string;
}

/**
 * Valida y obtiene la URL del socket
 * @throws Error si la URL no está definida
 */
function getSocketUrl(): string {
  const baseUrl = process.env.EXPO_PUBLIC_SOCKETIO_URI;

  if (!baseUrl) {
    throw new Error(
      'EXPO_PUBLIC_SOCKETIO_URI no está definida. Verifica tu archivo .env'
    );
  }

  const namespace = '/registro-ingreso';
  const url = baseUrl.replace(/\/$/, '') + namespace;

  logger.category('Socket').debug('Socket URL configurada', { baseUrl, url });

  return url;
}

/**
 * Conecta el socket (singleton).
 * @returns Instancia del socket
 */
export function connectSocket(): Socket {
  if (socket) return socket;

  const url = getSocketUrl();

  logger.category('Socket').info('Conectando a', url);

  // Permitir polling como fallback (algunas redes/entornos mobile bloquean websocket directo)
  socket = io(url, {
    transports: ['websocket', 'polling'],
    autoConnect: true,
    reconnection: true,
    reconnectionAttempts: 10,
    timeout: 20000,
  });

  // Logs y manejo básico de errores/conexión
  socket.on('connect', () => {
    logger.category('Socket').info('Conectado', { socketId: socket?.id });
  });

  socket.on('connect_error', (err: Error) => {
    logger.category('Socket').error('Error de conexión', {
      message: err?.message,
      error: err,
    });
  });

  socket.on('disconnect', (reason: string) => {
    logger.category('Socket').warn('Desconectado', { reason });
  });

  return socket;
}

/** Obtiene la instancia actual o tira error si no está conectada. */
export function getSocket(): Socket {
  if (!socket) {
    throw new Error("Socket no inicializado: llamá a connectSocket()");
  }
  return socket;
}

/** Desconecta (opcional). */
export function disconnectSocket(): void {
  socket?.disconnect();
  socket = null;
}

/** Pide al backend los registros de pileta de hoy (dispara el evento de respuesta). */
export function getRegistrosPiletaHoy(): void {
  logger.category('Socket').debug('Solicitando registros de pileta');
  getSocket().emit("getRegistrosPiletaHoy");
}

/**
 * Escucha la respuesta con los registros. Devuelve un unsubscribe.
 * @param callback - Función que recibe el array de registros
 * @returns Función para desuscribirse
 */
export function onRegistrosPiletaHoy(
  callback: (data: RegistroIngreso[]) => void
): () => void {
  const socket = getSocket();

  logger.category('Socket').debug('Suscribiéndose a registros de pileta');

  // Escuchamos ambos nombres de evento (compatibilidad con backend)
  socket.on('registrosPiletaHoy', callback);
  socket.on('pileta:registros', callback);

  return () => {
    socket.off('registrosPiletaHoy', callback);
    socket.off('pileta:registros', callback);
  };
}

/**
 * Escucha errores enviados por el server.
 * @param handler - Función que maneja el error
 * @returns Función para desuscribirse
 */
export function onSocketError(
  handler: (err: SocketError) => void
): () => void {
  const socket = getSocket();
  socket.on("error", handler);
  return () => socket.off("error", handler);
}

/**
 * Hook simple para traer y mantener el listado de hoy.
 * Llama automáticamente a getRegistrosPiletaHoy() al montar.
 *
 * @param autoFetch - Si debe cargar automáticamente al montar
 * @returns Estado del hook con data, loading, error y refresh
 */
export function useRegistrosPiletaHoy(autoFetch = true) {
  const [data, setData] = useState<RegistroIngreso[]>([]);
  const [loading, setLoading] = useState<boolean>(autoFetch);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const offData = onRegistrosPiletaHoy((registros: RegistroIngreso[]) => {
      logger.category('Socket').debug('Registros recibidos', {
        cantidad: registros.length,
      });
      setData(registros);
      setLoading(false);
      setError(null);
    });

    const offErr = onSocketError((e: SocketError) => {
      logger.category('Socket').error('Error en socket', e);
      setError(e?.message ?? "Error de socket");
      setLoading(false);
    });

    if (autoFetch) {
      setLoading(true);
      getRegistrosPiletaHoy();
    }

    return () => {
      offData();
      offErr();
    };
  }, [autoFetch]);

  const refresh = () => {
    setLoading(true);
    getRegistrosPiletaHoy();
  };

  return { data, loading, error, refresh };
}
