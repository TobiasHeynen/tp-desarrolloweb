import { Injectable } from "@nestjs/common/decorators/core/injectable.decorator";
import { FindOptionsWhere, Repository } from 'typeorm';
import { ListPacientesDto } from "../dtos/output/list-pacientes.dto.js";
import { BadRequestException, forwardRef, Inject } from "@nestjs/common";
import { AdministradorService } from './administrador.service.js';
import { CreatePacientesDto } from "../dtos/input/create-pacientes.dto.js";
import { EstadosPacientesEnum } from '../enums/estados-pacientes.enum.js';
import { UpdatePacientesDto } from '../dtos/input/update-pacientes.dto.js';
import { BadRequestException } from '@nestjs/common';
import { ApiProperty } from "@nestjs/swagger";


@Injectable()
export class PacienteService {

    constructor(@InjectRepository(Paciente) private readonly repository: Repository<PacienteService>() {
        @Inject(forwardRef( ()=> 'ADMINISTRADOR_SERVICE')) private readonly AdministradorService() 
            
        }
    async crearPaciente(dto: CreatePacientesDto): Promise<( id: number )> {

        const paciente: Paciente = this.repository.create(dto);
        paciente.estado = EstadosPacientesEnum.ACTIVO;
        await this.repository.save(paciente);
        return {id: paciente.id};
    }
    
    async editarPaciente(id: number, dto: UpdatePacienteDto):Promise<void>{
        const paciente: Paciente | null = await this.repository.findOneBy({ id })
    
    };

        if (!paciente){
        throw new BadRequestException('Paciente inexistente');

}
    const relacionadoConAdministrador: boolean = await this.administradorService.existeAdministradorPorIdPaciente(id);

    if(relacionadoConAdministrador && dot.estado === EstadosPacientesEnum.BAJA)(
        throw new BadRequestException('No se puede dar de baja un paciente con turnos relacionados ');
    )

        this.repository.merge(paciente, dto);
    
        await this.repository.save(paciente);

    
    @ApiProperty( ( enum: EstadosPacientesEnum, example: EstadosPacientesEnum.ACTIVO ))
    @IsEnum(EstadosPacientesEnum)
    @IsNotEnpty()
    estado!: EstadosPacientesEnum;

}


