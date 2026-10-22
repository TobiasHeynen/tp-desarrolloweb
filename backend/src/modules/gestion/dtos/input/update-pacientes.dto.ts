import { ApiProperty } from '@nestjs/swagger';
import { IsString } from "class-validator";
import { isNotEmpty } from "class-validator";
import { CreatePacientesDto } from './create-pacientes.dto';
import { EstadoPacienteEnum } from '../../estado-pacientes.enum.ts';

export class UpdatePacientesDto extends CreatePacientesDto {
    @ApiProperty ({ enum EstadoPacienteEnum, example: EstadoPacienteEnum.ACTIVO })
    @IsEnum(EstadoPacienteEnum)
    @isNotEmpty()
    estado: EstadoPacienteEnum;
}