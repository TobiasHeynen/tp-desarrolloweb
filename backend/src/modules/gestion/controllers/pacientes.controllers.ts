import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard.js';
import { Roles } from '../../auth/guards/roles.decorator.js';
import { RolesGuard } from '../../auth/guards/roles.guard.js';
import { UsuarioResumenDto } from '../dtos/output/usuario-resumen.dto.js';
import { RolesUsuarios } from '../enums/roles-usuarios.enum.js';
import { PacientesService } from '../services/pacientes.service.js';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('pacientes')
export class PacientesController {

    constructor(private readonly service: PacientesService) {}

    // ADMINISTRADOR: para elegir a qué paciente le reserva el turno
    @ApiOkResponse({ type: UsuarioResumenDto, isArray: true })
    @Roles(RolesUsuarios.ADMINISTRADOR)
    @Get()
    async listarPacientes(): Promise<UsuarioResumenDto[]> {
        return await this.service.listarPacientes();
    }
}
