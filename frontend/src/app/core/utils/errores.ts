import { HttpErrorResponse } from '@angular/common/http';

// Saca el mensaje que mandó el backend cuando no se cumple una regla.
// Nest manda { message: string | string[], error, statusCode }.
export function mensajeDeError(error: unknown): string {
    if (error instanceof HttpErrorResponse) {
        if (error.status === 0) {
            return 'No se pudo conectar con el servidor. Verificá que el backend esté levantado.';
        }
        const mensaje: unknown = error.error?.message;
        if (Array.isArray(mensaje)) return mensaje.join('. ');
        if (typeof mensaje === 'string' && mensaje.length > 0) return mensaje;
        if (error.status === 401) return 'Documento o clave incorrectos.';
        if (error.status === 403) return 'No tenés permiso para hacer esto.';
        if (error.status === 501) return 'Esa función todavía no está implementada en el backend.';
    }
    return 'Ocurrió un error inesperado. Probá de nuevo.';
}
