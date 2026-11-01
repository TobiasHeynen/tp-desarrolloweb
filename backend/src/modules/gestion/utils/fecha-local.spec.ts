import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { DiasSemana, FechaLocal } from './fecha-local.js';

describe('FechaLocal', () => {
    afterEach(() => vi.useRealTimers());

    it('interpreta una fecha y hora sin zona horaria tal cual viene', () => {
        const fecha = FechaLocal.desdeTextoFechaHora('2026-11-03T10:00:00');
        expect(fecha?.hora).toBe(10);
        expect(fecha?.aTexto()).toBe('2026-11-03T10:00:00');
        expect(fecha?.diaSemana).toBe(DiasSemana.MARTES);
    });

    it('acepta la hora sin segundos', () => {
        expect(FechaLocal.desdeTextoFechaHora('2026-11-03T10:00')?.aTexto()).toBe('2026-11-03T10:00:00');
    });

    it('rechaza textos con zona horaria, para no mezclar con toISOString()', () => {
        expect(FechaLocal.desdeTextoFechaHora('2026-11-03T10:00:00Z')).toBeNull();
        expect(FechaLocal.desdeTextoFechaHora('2026-11-03T10:00:00-03:00')).toBeNull();
    });

    it('rechaza fechas que no existen', () => {
        expect(FechaLocal.desdeTextoFecha('2026-02-31')).toBeNull();
        expect(FechaLocal.desdeTextoFecha('2026-13-01')).toBeNull();
        expect(FechaLocal.desdeTextoFechaHora('2026-11-03T25:00:00')).toBeNull();
        expect(FechaLocal.desdeTextoFecha('hola')).toBeNull();
    });

    it('detecta los fines de semana', () => {
        expect(FechaLocal.desdeTextoFecha('2026-10-31')?.esFinDeSemana).toBe(true); // sábado
        expect(FechaLocal.desdeTextoFecha('2026-11-01')?.esFinDeSemana).toBe(true); // domingo
        expect(FechaLocal.desdeTextoFecha('2026-11-02')?.esFinDeSemana).toBe(false); // lunes
    });

    it('suma días cruzando el cambio de mes', () => {
        expect(FechaLocal.desdeTextoFecha('2026-10-30')?.sumarDias(3).aTextoFecha()).toBe('2026-11-02');
    });

    describe('ahora()', () => {
        beforeEach(() => vi.useFakeTimers());

        it('devuelve la hora de Argentina (UTC-3), no la UTC', () => {
            vi.setSystemTime(new Date('2026-11-03T13:30:00Z'));
            expect(FechaLocal.ahora().aTexto()).toBe('2026-11-03T10:30:00');
        });

        it('cambia de día según Argentina: 01:00 UTC todavía es el día anterior allá', () => {
            vi.setSystemTime(new Date('2026-11-03T01:00:00Z'));
            expect(FechaLocal.ahora().aTextoFecha()).toBe('2026-11-02');
        });
    });
});
