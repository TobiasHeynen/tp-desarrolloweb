import { ApiProperty } from '@nestjs/swagger';
import { IsString } from "class-validator";
import { isNotEmpty } from "class-validator";

export class CreateAdministradorDto{
    @ApiProperty ()
    @IsString()
    @isNotEmpty()
    nombre: string;
}
