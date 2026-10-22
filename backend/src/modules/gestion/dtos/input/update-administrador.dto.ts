import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from "class-validator";
import { isNotEmpty } from "class-validator"
import { EstadoAdministradorEnum } from "../../enums/estado-administrador.enum.js";
import { CreateAdministradorDto } from "./create-administrador.dto.js";

export class UpdateAdministradorDto extends CreateAdministradorDto {

    @ApiProperty({ enum: EstadoAdministradorEnum, example: EstadoAdministradorEnum.ACTIVO })
    @IsEnum(EstadoAdministradorEnum)
    @isNotEmpty()
    estado: EstadoAdministradorEnum;

}