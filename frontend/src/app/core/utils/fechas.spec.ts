import { describe, expect, it } from 'vitest';
import {
    armarFechaHora, diaSemana, esFinDeSemana, formatearFecha, formatearFechaHora, hoyArgentina, soloFecha, sumarDias,
} from './fechas';

describe('fechas', () => {
    it('suma días cruzando de mes y de año', () => {
        expect(sumarDias('2026-10-30', 3)).toBe('2026-11-02');
        expect(sumarDias('2026-12-31', 1)).toBe('2027-01-01');
    });

    it('sabe qué día de la semana es', () => {
        expect(diaSemana('2026-11-02')).toBe(1); // lunes
        expect(esFinDeSemana('2026-11-07')).toBe(true);
        expect(esFinDeSemana('2026-11-06')).toBe(false);
    });

    it('formatea sin correrse de día ni de hora', () => {
        expect(formatearFecha('2026-11-02')).toBe('lun 02/11/2026');
        expect(formatearFechaHora('2026-11-02T10:00:00')).toBe('lun 02/11/2026 · 10:00');
    });

    it('arma la fecha y hora que espera el backend, sin zona horaria', () => {
        expect(armarFechaHora('2026-11-02', '10:00')).toBe('2026-11-02T10:00:00');
        expect(soloFecha('2026-11-02T10:00:00')).toBe('2026-11-02');
    });

    it('hoyArgentina() devuelve YYYY-MM-DD', () => {
        expect(hoyArgentina()).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });
});
