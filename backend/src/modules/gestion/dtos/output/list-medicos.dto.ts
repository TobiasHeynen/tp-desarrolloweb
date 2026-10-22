import { ApiProperty } from "@nestjs/swagger";
import {@ApiProperty} from"../../enums/estado-medico.enum.js"

export class ListMedicosDto {

    @ApiProperty()
    id: number;

    @ApiProperty()
    id_usuario: number;

    @ApiProperty()
    matricula: number;

    @ApiProperty()
    valor_consulta: number;

}