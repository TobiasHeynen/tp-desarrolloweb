import { HttpErrorResponse } from '@angular/common/http';
import { describe, expect, it } from 'vitest';
import { mensajeDeError } from './errores';

describe('mensajeDeError', () => {
    it('muestra el mensaje que mandó el backend', () => {
        const error = new HttpErrorResponse({ status: 409, error: { message: 'El médico ya tiene un turno en ese horario' } });
        expect(mensajeDeError(error)).toBe('El médico ya tiene un turno en ese horario');
    });

    it('junta los mensajes cuando son varios (validaciones)', () => {
        const error = new HttpErrorResponse({ status: 400, error: { message: ['uno', 'dos'] } });
        expect(mensajeDeError(error)).toBe('uno. dos');
    });

    it('avisa si no hay conexión con el backend', () => {
        expect(mensajeDeError(new HttpErrorResponse({ status: 0 }))).toContain('No se pudo conectar');
    });

    it('tiene un mensaje por defecto', () => {
        expect(mensajeDeError(new Error('x'))).toContain('inesperado');
    });
});
