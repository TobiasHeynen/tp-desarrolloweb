import type { PayloadJwt } from '../../auth/interfaces/payload-jwt.interface.js';
import type { CreateReservaDto } from '../dtos/input/create-reserva.dto.js';
import type { FiltrosReservasDto } from '../dtos/input/filtros-reservas.dto.js';
import type { UpdateEstadoReservaDto } from '../dtos/input/update-estado-reserva.dto.js';
import type { ListReservasDto } from '../dtos/output/list-reservas.dto.js';

// Contrato del service de reservas. Todos los métodos que dependen de quién
// pregunta reciben el payload del token.
export interface IReservasService {
    crearReserva(dto: CreateReservaDto, usuario: PayloadJwt): Promise<ListReservasDto>;
    listarReservas(filtros: FiltrosReservasDto, usuario: PayloadJwt): Promise<ListReservasDto[]>;
    cancelarReserva(id: number, usuario: PayloadJwt): Promise<void>;
    cambiarEstado(id: number, dto: UpdateEstadoReservaDto, usuario: PayloadJwt): Promise<void>;
    horariosDisponibles(idMedico: number, fecha: string): Promise<string[]>;
}
