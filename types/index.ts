/**
 * Tipos centralizados para la aplicación móvil
 * Mantener sincronizado con el backend
 */

import { TipoPersona } from '../constants/tipo-persona';
import { TipoIngreso } from '../constants/tipo-ingreso';
import { MetodoPago } from '../constants/metodo-pago';
import { Genero } from '../constants/genero';
import { EstadoPersona } from '../constants/estado-persona';

// ============================================
// SOCIO
// ============================================

/**
 * Representa un socio del club (Club o Pileta)
 */
export interface Socio {
  id?: number;
  nombre: string;
  apellido: string;
  dni: string;
  telefono?: string;
  email?: string;
  fechaAlta?: string;
  fechaNacimiento?: string;
  direccion?: string;
  estado: string | null;
  genero?: string;
  fotoUrl?: string;
  tipo: TipoPersona;
}

/**
 * Datos de un socio extendido con información de persona
 * Usado en la pantalla de pileta
 */
export interface Persona {
  id: number;
  nombre: string;
  apellido: string;
  dni: string;
  direccion: string;
  telefono: string;
  email: string;
  estado: string;
  fechaAlta: string;
  fechaNacimiento: string;
  fotoUrl: string;
  genero: Genero;
}

// ============================================
// REGISTRO DE INGRESO
// ============================================

/**
 * DTO para crear un nuevo registro de ingreso
 */
export interface CreateRegistroIngresoDto {
  idSocio?: number;
  dniNoSocio?: string;
  tipoIngreso: TipoIngreso;
  habilitaPileta: boolean;
  metodoPago?: MetodoPago;
  importe?: number;
}

/**
 * Registro de ingreso completo (respuesta del backend)
 */
export interface RegistroIngreso {
  idIngreso: number;
  fechaHoraIngreso: string;
  habilitaPileta: boolean;
  tipoIngreso: TipoIngreso;
  idSocio: number | null;
  socio: Persona | null;
  dniNoSocio: string | null;
  importe: number | null;
  metodoPago: MetodoPago | null;
}

// ============================================
// API RESPONSES
// ============================================

/**
 * Respuesta al buscar un socio por DNI
 */
export interface ApiSocioResponse {
  socio: Socio | null;
  tipoPersona: TipoPersona;
}

/**
 * Respuesta genérica de éxito
 */
export interface ApiSuccessResponse<T = any> {
  success: true;
  data: T;
  message?: string;
}

// ============================================
// FORMULARIOS
// ============================================

/**
 * Estado del formulario de pago para pileta
 */
export interface PaymentFormState {
  metodoPago?: MetodoPago;
  importe: string;
  habilitarPileta: boolean;
}

/**
 * Errores del formulario de pago
 */
export interface PaymentFormErrors {
  metodoPago?: string;
  importe?: string;
}

/**
 * Validación de DNI
 */
export interface DniValidation {
  valid: boolean;
  error?: string;
}

// ============================================
// NAVEGACIÓN
// ============================================

/**
 * Parámetros de ruta para pantallas
 */
export interface RouteParams {
  'acceso-club/socio/[dni]': { dni: string };
}

// ============================================
// SOCKET.IO
// ============================================

/**
 * Eventos de Socket.io
 */
export interface SocketEvents {
  // Cliente -> Servidor
  getRegistrosPiletaHoy: () => void;

  // Servidor -> Cliente
  registrosPiletaHoy: (data: RegistroIngreso[]) => void;
  'pileta:registros': (data: RegistroIngreso[]) => void;
  error: (error: { message: string; code?: string }) => void;
}

/**
 * Estado de conexión del socket
 */
export interface SocketState {
  isConnected: boolean;
  lastError: string | null;
}

// ============================================
// UTILIDADES
// ============================================

/**
 * Estado de carga genérico
 */
export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

/**
 * Estado de paginación (para futuro)
 */
export interface PaginationState {
  page: number;
  pageSize: number;
  total: number;
  hasMore: boolean;
}

// ============================================
// RE-EXPORTS
// ============================================

// Re-exportar enums para conveniencia
export { TipoPersona, TipoIngreso, MetodoPago, Genero, EstadoPersona };
