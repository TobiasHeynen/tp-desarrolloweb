import { EstadosReservas } from './estados-reservas.enum';
import { Medico } from './medico.interface';
import { UsuarioResumen } from './usuario-resumen.interface';

// ListReservasDto del backend.
// fechaHora es la hora local de Argentina como texto 'YYYY-MM-DDTHH:mm:ss' (sin zona).
// NO se convierte con new Date(): se trabaja siempre como texto (ver core/utils/fechas.ts).
export interface Reserva {
    id: number;
    fechaHora: string;
    estado: EstadosReservas;
    valorConsulta: number;
    medico: Medico;
    paciente: UsuarioResumen;
}

// POST /reservas
export interface NuevaReserva {
    idMedico: number;
    fechaHora: string;
    idPaciente?: number; // solo lo manda el ADMINISTRADOR
}

// GET /reservas?fecha&idMedico&idPaciente&estado
export interface FiltrosReservas {
    fecha?: string;
    idMedico?: number;
    idPaciente?: number;
    estado?: EstadosReservas;
}
