/**
 * Nombre y duracion de la cookie de sesion del portal.
 *
 * Vive aparte de `session.ts` porque `proxy.ts` corre en el runtime de borde y
 * no puede importar codigo de servidor ni `node:crypto`.
 */
export const PORTAL_SESSION_COOKIE = "portal_sesion";

// Ocho horas: alcanza para una jornada de seguimiento sin dejar la sesion viva
// para siempre en una computadora compartida.
export const PORTAL_SESSION_MAX_AGE = 60 * 60 * 8;
