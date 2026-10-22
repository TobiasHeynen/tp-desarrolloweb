import { ApiProperty } from '@nestjs/swagger';

// Datos públicos de un usuario. Nunca exponer la clave.
export class UsuarioResumenDto {

    @ApiProperty()
    id: number;

    @ApiProperty()
    documento: string;

    @ApiProperty()
    apellidos: string;

    @ApiProperty()
    nombres: string;
}
