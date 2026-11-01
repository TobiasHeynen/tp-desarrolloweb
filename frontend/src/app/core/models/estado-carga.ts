// Estado de una pantalla que carga datos del backend.
// Es genérico: EstadoCarga<Medico[]>, EstadoCarga<Reserva[]>, EstadoCarga<string[]>...
export interface EstadoCarga<T> {
    cargando: boolean;
    datos: T;
    error: string | null;
}

export function cargando<T>(datos: T): EstadoCarga<T> {
    return { cargando: true, datos, error: null };
}

export function cargado<T>(datos: T): EstadoCarga<T> {
    return { cargando: false, datos, error: null };
}

export function fallido<T>(datos: T, error: string): EstadoCarga<T> {
    return { cargando: false, datos, error };
}
