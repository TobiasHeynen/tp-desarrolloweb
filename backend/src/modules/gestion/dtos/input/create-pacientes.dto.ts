import { ApiProperty } from '@nestjs/swagger';
import { IsString } from "class-validator";
import { isNotEmpty } from "class-validator";


export class CreatePacientesDto {

    @ApiProperty({ description: 'Nombre del paciente', example: 'Juan Pérez' })
    @IsString()
    @isNotEmpty()
    nombre: string;
}