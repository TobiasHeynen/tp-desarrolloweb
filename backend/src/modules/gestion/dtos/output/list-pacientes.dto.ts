
import { ApiProperty } from "@nestjs/swagger";
import {@ApiProperty} from "@nestjs/swagger";
import EstadoPacienteEnum from "../../enums/estado-paciente.enum.js";

export class ListPacientesDto {

    @ApiProperty()
    id: number;

    @ApiProperty()
    documento: number;

    @ApiProperty()
    apellidos: string;

    @ApiProperty()
    nombres: string;

    @ApiProperty()
    email: string;

    @ApiProperty()
    clave: string;
}

    

    

