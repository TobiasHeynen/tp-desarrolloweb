import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from '../entities/usuarios.entity.js';
import { UsuarioResumenDto } from '../dtos/output/usuario-resumen.dto.js';
import { EstadosUsuarios } from '../enums/estados-usuarios.enum.js';
import { RolesUsuarios } from '../enums/roles-usuarios.enum.js';

// Los pacientes son usuarios con rol PACIENTE. Solo lectura: el ABM de usuarios no es parte del TP.
@Injectable()
export class PacientesService {

    constructor(@InjectRepository(Usuario) private readonly repository: Repository<Usuario>) {}

    async listarPacientes(): Promise<UsuarioResumenDto[]> {
        const pacientes = await this.repository.find({
            where: {
                rol: RolesUsuarios.PACIENTE,
                estado: EstadosUsuarios.ACTIVO,
            },
            order: {
                apellidos: 'ASC',
                nombres: 'ASC',
            },
        });

        return pacientes.map((u) => ({
            id: u.id,
            documento: u.documento,
            apellidos: u.apellidos,
            nombres: u.nombres,
        }));
    }
}
