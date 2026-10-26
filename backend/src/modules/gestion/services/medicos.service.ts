import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Medico } from '../entities/medicos.entity.js';
import { UpdateValorConsultaDto } from '../dtos/input/update-valor-consulta.dto.js';
import { ListMedicosDto } from '../dtos/output/list-medicos.dto.js';
import { EstadosUsuarios } from '../enums/estados-usuarios.enum.js';

@Injectable()
export class MedicosService {

    constructor(@InjectRepository(Medico) private readonly repository: Repository<Medico>) {}

    async listarMedicos(): Promise<ListMedicosDto[]> {
        const medicos = await this.repository.find({
            relations: { usuario: true },
            order: {
                usuario: {
                    apellidos: 'ASC',
                    nombres: 'ASC',
                },
            },
        });

        return medicos
            .filter((m) => m.usuario?.estado === EstadosUsuarios.ACTIVO)
            .map((m) => ({
                id: m.id,
                apellidos: m.usuario.apellidos,
                nombres: m.usuario.nombres,
                matricula: m.matricula,
                valorConsulta: m.valorConsulta,
            }));
    }

    async actualizarValorConsulta(id: number, dto: UpdateValorConsultaDto): Promise<void> {
        const medico = await this.repository.findOne({ where: { id } });

        if (!medico) {
            throw new NotFoundException(`El médico con id ${id} no existe`);
        }

        medico.valorConsulta = dto.valorConsulta;
        await this.repository.save(medico);
    }
}
