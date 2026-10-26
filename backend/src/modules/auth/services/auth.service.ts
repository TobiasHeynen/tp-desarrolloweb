import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { Medico } from '../../gestion/entities/medicos.entity.js';
import { Usuario } from '../../gestion/entities/usuarios.entity.js';
import { EstadosUsuarios } from '../../gestion/enums/estados-usuarios.enum.js';
import { RolesUsuarios } from '../../gestion/enums/roles-usuarios.enum.js';
import { LoginDTO } from '../dtos/input/login.dto.js';
import { LoginResponseDTO } from '../dtos/output/login-response.dto.js';
import { JwtPayload } from '../guards/usuario-actual.decorator.js';

@Injectable()
export class AuthService {

    constructor(
        @InjectRepository(Usuario) private readonly usuariosRepository: Repository<Usuario>,
        @InjectRepository(Medico) private readonly medicosRepository: Repository<Medico>,
        private readonly jwtService: JwtService,
    ) {}

    async login(dto: LoginDTO): Promise<LoginResponseDTO> {
        const usuario = await this.usuariosRepository.findOne({
            where: { documento: dto.documento },
        });

        if (!usuario || usuario.estado !== EstadosUsuarios.ACTIVO) {
            throw new UnauthorizedException('Credenciales inválidas');
        }

        const claveValida = await bcrypt.compare(dto.clave, usuario.clave);
        if (!claveValida) {
            throw new UnauthorizedException('Credenciales inválidas');
        }

        const payload: JwtPayload = {
            sub: usuario.id,
            rol: usuario.rol,
        };

        if (usuario.rol === RolesUsuarios.MEDICO) {
            const medico = await this.medicosRepository.findOne({
                where: { idUsuario: usuario.id },
            });
            if (medico) {
                payload.idMedico = medico.id;
            }
        }

        const accessToken = await this.jwtService.signAsync(payload);

        return { accessToken };
    }
}
