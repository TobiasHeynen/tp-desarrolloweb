import { Injectable, NotImplementedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from '../entities/usuarios.entity.js';
import { UsuarioResumenDto } from '../dtos/output/usuario-resumen.dto.js';

// Los pacientes son usuarios con rol PACIENTE. Solo lectura: el ABM de usuarios no es parte del TP.
@Injectable()
export class PacientesService {

    constructor(@InjectRepository(Usuario) private readonly repository: Repository<Usuario>) {}

    async listarPacientes(): Promise<UsuarioResumenDto[]> {
        throw new NotImplementedException();
    }
}
