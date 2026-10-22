import { ApiProperty } from '@nestjs/swagger';
import { IsIn } from 'class-validator';
import { EstadosReservas } from '../../enums/estados-reservas.enum.js';

export class UpdateEstadoReservaDto {

    @ApiProperty({ enum: [EstadosReservas.ATENDIDO, EstadosReservas.AUSENTE] })
    @IsIn([EstadosReservas.ATENDIDO, EstadosReservas.AUSENTE])
    estado: EstadosReservas.ATENDIDO | EstadosReservas.AUSENTE;
}
