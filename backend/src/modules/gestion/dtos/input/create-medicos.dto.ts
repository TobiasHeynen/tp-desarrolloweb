import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";
import { isNotEmpty } from "class-validator";



export class CreateMedicosDto {

    @ApiProperty(),
    @IsString()
    @isNotEmpty()
    nombre: string;
}