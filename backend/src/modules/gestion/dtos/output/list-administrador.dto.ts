import { ApiProperty } from "@nestjs/swagger";


export class ListAdministradorDto {

    @ApiProperty()
    id: number;

    @ApiProperty()
    id_medico: number;

    @ApiProperty()
    id_paciente: number;

    @ApiProperty()
    fecha_hora: number;

    @ApiProperty()
    estado_reserva: string;

    @ApiProperty()
    valor_consulta: number;

}
