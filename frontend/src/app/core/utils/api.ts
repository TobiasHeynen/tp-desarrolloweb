// Todas las llamadas usan ruta relativa: en desarrollo la resuelve proxy.conf.json
// y en "producción" la resuelve nginx. Nunca poner http://localhost:3000 acá.
export const API = '/api/v1';
