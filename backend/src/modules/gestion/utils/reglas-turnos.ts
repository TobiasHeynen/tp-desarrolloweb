import { RolesUsuarios } from '../enums/roles-usuarios.enum.js';
import { FechaLocal } from './fecha-local.js';

// Primer turno a las 8:00 y último a las 15:00 (cada turno dura 1 hora).
export enum Horario {
    PRIMER_TURNO = 8,
    ULTIMO_TURNO = 15,
}

export const DIAS_MAXIMOS_ANTICIPACION = 30;

// Reglas de negocio del README, sin base de datos: así se pueden probar solas.
export class ReglasTurnos {

    // ['08:00', '09:00', ..., '15:00']
    static horasDeTurno(): number[] {
        const horas: number[] = [];
        for (let hora = Horario.PRIMER_TURNO; hora <= Horario.ULTIMO_TURNO; hora++) {
            horas.push(hora);
        }
        return horas;
    }

    static esHoraDeTurno(fechaHora: FechaLocal): boolean {
        return fechaHora.minutos === 0 && fechaHora.segundos === 0 &&
            fechaHora.hora >= Horario.PRIMER_TURNO && fechaHora.hora <= Horario.ULTIMO_TURNO;
    }

    // No se puede en el pasado ni con más de 30 días de anticipación.
    static estaEnRangoPermitido(fechaHora: FechaLocal, ahora: FechaLocal): boolean {
        const limite = ahora.sumarDias(DIAS_MAXIMOS_ANTICIPACION);
        return fechaHora.esPosteriorA(ahora) && !fechaHora.esPosteriorA(limite);
    }

    // PACIENTE: hasta las 23:59 del día anterior. ADMINISTRADOR: hasta la hora de inicio.
    static puedeCancelar(rol: RolesUsuarios, fechaHoraTurno: FechaLocal, ahora: FechaLocal): boolean {
        if (rol === RolesUsuarios.ADMINISTRADOR) {
            return !ahora.esPosteriorA(fechaHoraTurno);
        }
        if (rol === RolesUsuarios.PACIENTE) {
            return ahora.esAnteriorA(fechaHoraTurno.inicioDelDia());
        }
        return false;
    }
}
