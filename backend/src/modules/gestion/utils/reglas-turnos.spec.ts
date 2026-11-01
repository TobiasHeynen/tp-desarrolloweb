import { describe, expect, it } from 'vitest';
import { RolesUsuarios } from '../enums/roles-usuarios.enum.js';
import { FechaLocal } from './fecha-local.js';
import { ReglasTurnos } from './reglas-turnos.js';

// Se arma siempre a partir de un texto para que quede claro qué fecha es.
function fecha(texto: string): FechaLocal {
    const resultado = FechaLocal.desdeTextoFechaHora(texto);
    if (!resultado) throw new Error(`Fecha de prueba inválida: ${texto}`);
    return resultado;
}

describe('ReglasTurnos', () => {
    it('genera los 8 turnos de 08:00 a 15:00', () => {
        expect(ReglasTurnos.horasDeTurno()).toEqual([8, 9, 10, 11, 12, 13, 14, 15]);
    });

    it('solo acepta horas en punto entre las 8 y las 15', () => {
        expect(ReglasTurnos.esHoraDeTurno(fecha('2026-11-03T08:00:00'))).toBe(true);
        expect(ReglasTurnos.esHoraDeTurno(fecha('2026-11-03T15:00:00'))).toBe(true);
        expect(ReglasTurnos.esHoraDeTurno(fecha('2026-11-03T07:00:00'))).toBe(false);
        expect(ReglasTurnos.esHoraDeTurno(fecha('2026-11-03T16:00:00'))).toBe(false);
        expect(ReglasTurnos.esHoraDeTurno(fecha('2026-11-03T10:30:00'))).toBe(false);
        expect(ReglasTurnos.esHoraDeTurno(fecha('2026-11-03T10:00:01'))).toBe(false);
    });

    describe('rango permitido (a futuro y hasta 30 días)', () => {
        const ahora = fecha('2026-11-03T10:00:00');

        it('rechaza el pasado y el momento actual', () => {
            expect(ReglasTurnos.estaEnRangoPermitido(fecha('2026-11-03T09:00:00'), ahora)).toBe(false);
            expect(ReglasTurnos.estaEnRangoPermitido(fecha('2026-11-03T10:00:00'), ahora)).toBe(false);
        });

        it('acepta mañana y el día 30', () => {
            expect(ReglasTurnos.estaEnRangoPermitido(fecha('2026-11-04T08:00:00'), ahora)).toBe(true);
            expect(ReglasTurnos.estaEnRangoPermitido(fecha('2026-12-03T10:00:00'), ahora)).toBe(true);
        });

        it('rechaza pasados los 30 días', () => {
            expect(ReglasTurnos.estaEnRangoPermitido(fecha('2026-12-03T11:00:00'), ahora)).toBe(false);
        });
    });

    describe('cancelación según el rol', () => {
        const turno = fecha('2026-11-10T09:00:00');

        it('el paciente cancela hasta las 23:59 del día anterior', () => {
            expect(ReglasTurnos.puedeCancelar(RolesUsuarios.PACIENTE, turno, fecha('2026-11-09T23:59:00'))).toBe(true);
            expect(ReglasTurnos.puedeCancelar(RolesUsuarios.PACIENTE, turno, fecha('2026-11-10T00:00:00'))).toBe(false);
            expect(ReglasTurnos.puedeCancelar(RolesUsuarios.PACIENTE, turno, fecha('2026-11-10T08:00:00'))).toBe(false);
        });

        it('el administrador cancela hasta la hora de inicio', () => {
            expect(ReglasTurnos.puedeCancelar(RolesUsuarios.ADMINISTRADOR, turno, fecha('2026-11-10T08:59:00'))).toBe(true);
            expect(ReglasTurnos.puedeCancelar(RolesUsuarios.ADMINISTRADOR, turno, fecha('2026-11-10T09:01:00'))).toBe(false);
        });

        it('el médico no cancela', () => {
            expect(ReglasTurnos.puedeCancelar(RolesUsuarios.MEDICO, turno, fecha('2026-11-01T00:00:00'))).toBe(false);
        });
    });
});
