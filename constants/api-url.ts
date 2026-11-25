const API_URL_PRODUCCION = "https://api.clublavictoria.com.ar/api/v1";
const SOCKET_URL_PRODUCCION = "https://api.clublavictoria.com.ar/";

export const API_URL =
  process.env.EXPO_PUBLIC_API_URL || API_URL_PRODUCCION;
export const SOCKET_URL =
  process.env.EXPO_PUBLIC_SOCKET_URL ||
  (process.env.EXPO_PUBLIC_API_URL
    ? process.env.EXPO_PUBLIC_API_URL.replace(/\/api\/v1\/?$/, "/")
    : SOCKET_URL_PRODUCCION);
