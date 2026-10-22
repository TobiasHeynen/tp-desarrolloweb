import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsInt, IsOptional, IsPositive } from 'class-validator';

export class CreateReservaDto {

    @ApiProperty()
    @IsInt()
    @IsPositive()
    idMedico: number;

    @ApiProperty({ example: '2026-11-03T10:00:00' })
    @IsDateString()
    fechaHora: string;

    // Solo lo usa el ADMINISTRADOR. Si reserva un PACIENTE se toma su id del token.
    @ApiPropertyOptional()
    @IsOptional()
    @IsInt()
    @IsPositive()
    idPaciente?: number;
}
