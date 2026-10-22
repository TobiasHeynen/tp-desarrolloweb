import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsPositive } from 'class-validator';

export class UpdateValorConsultaDto {

    @ApiProperty({ example: 25000 })
    @IsInt()
    @IsPositive()
    valorConsulta: number;
}
