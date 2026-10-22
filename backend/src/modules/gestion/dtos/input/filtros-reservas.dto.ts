import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDateString, IsEnum, IsInt, IsOptional, IsPositive } from 'class-validator';
import { EstadosReservas } from '../../enums/estados-reservas.enum.js';

export class FiltrosReservasDto {

    @ApiPropertyOptional({ example: '2026-11-03' })
    @IsOptional()
    @IsDateString()
    fecha?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @IsPositive()
    idMedico?: number;

    @ApiPropertyOptional()
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @IsPositive()
    idPaciente?: number;

    @ApiPropertyOptional({ enum: EstadosReservas })
    @IsOptional()
    @IsEnum(EstadosReservas)
    estado?: EstadosReservas;
}
