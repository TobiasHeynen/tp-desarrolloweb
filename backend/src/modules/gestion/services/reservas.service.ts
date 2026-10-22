import { Injectable, NotImplementedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reserva } from '../entities/reservas.entity.js';
import { Medico } from '../entities/medicos.entity.js';
import { CreateReservaDto } from '../dtos/input/create-reserva.dto.js';
import { FiltrosReservasDto } from '../dtos/input/filtros-reservas.dto.js';
import { UpdateEstadoReservaDto } from '../dtos/input/update-estado-reserva.dto.js';
import { ListReservasDto } from '../dtos/output/list-reservas.dto.js';

@Injectable()
export class ReservasService {

    constructor(
        @InjectRepository(Reserva) private readonly repository: Repository<Reserva>,
        @InjectRepository(Medico) private readonly medicosRepository: Repository<Medico>,
    ) {}

    async crearReserva(dto: CreateReservaDto): Promise<ListReservasDto> {
        throw new NotImplementedException();
    }

    async listarReservas(filtros: FiltrosReservasDto): Promise<ListReservasDto[]> {
        throw new NotImplementedException();
    }

    async cancelarReserva(id: number): Promise<void> {
        throw new NotImplementedException();
    }

    async cambiarEstado(id: number, dto: UpdateEstadoReservaDto): Promise<void> {
        throw new NotImplementedException();
    }

    async horariosDisponibles(idMedico: number, fecha: string): Promise<string[]> {
        throw new NotImplementedException();
    }
}
