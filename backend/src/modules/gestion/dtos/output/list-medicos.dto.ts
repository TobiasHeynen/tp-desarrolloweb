import { ApiProperty } from '@nestjs/swagger';

export class ListMedicosDto {

    @ApiProperty()
    id: number;

    @ApiProperty()
    apellidos: string;

    @ApiProperty()
    nombres: string;

    @ApiProperty()
    matricula: number;

    @ApiProperty()
    valorConsulta: number;
}
