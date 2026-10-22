import { Injectable, NotImplementedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Medico } from '../entities/medicos.entity.js';
import { UpdateValorConsultaDto } from '../dtos/input/update-valor-consulta.dto.js';
import { ListMedicosDto } from '../dtos/output/list-medicos.dto.js';

@Injectable()
export class MedicosService {

    constructor(@InjectRepository(Medico) private readonly repository: Repository<Medico>) {}

    async listarMedicos(): Promise<ListMedicosDto[]> {
        throw new NotImplementedException();
    }

    async actualizarValorConsulta(id: number, dto: UpdateValorConsultaDto): Promise<void> {
        throw new NotImplementedException();
    }
}
