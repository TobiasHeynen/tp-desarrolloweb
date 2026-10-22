import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from "class-validator";
import { isNotEmpty } from "class-validator"
import { EstadoMedicoEnum } from "../../enums/estado-medico.enum";

export class UpdateMedicosDto extends CreateMedicosDto {
    @ApiProperty( Enum EstadoMedicoEnum, example: EstadoMedicoEnum.ACTIVO )
    @IsEnum(EstadoMedicoEnum)
    @isNotEmpty()
    estado: EstadoMedicoEnum;

}