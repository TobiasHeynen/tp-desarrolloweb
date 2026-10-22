import { ApiProperty } from '@nestjs/swagger';
import { IsDateString } from 'class-validator';

export class HorariosDisponiblesDto {

    @ApiProperty({ example: '2026-11-03' })
    @IsDateString()
    fecha: string;
}
