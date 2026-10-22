import { ApiProperty } from '@nestjs/swagger';
import { EstadosReservas } from '../../enums/estados-reservas.enum.js';
import { ListMedicosDto } from './list-medicos.dto.js';
import { UsuarioResumenDto } from './usuario-resumen.dto.js';

export class ListReservasDto {

    @ApiProperty()
    id: number;

    @ApiProperty()
    fechaHora: Date;

    @ApiProperty({ enum: EstadosReservas })
    estado: EstadosReservas;

    @ApiProperty()
    valorConsulta: number;

    @ApiProperty({ type: ListMedicosDto })
    medico: ListMedicosDto;

    @ApiProperty({ type: UsuarioResumenDto })
    paciente: UsuarioResumenDto;
}
