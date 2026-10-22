import { Controller, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse } from '@nestjs/swagger';
import { UsuarioResumenDto } from '../dtos/output/usuario-resumen.dto.js';
import { PacientesService } from '../services/pacientes.service.js';

@ApiBearerAuth()
@Controller('pacientes')
export class PacientesController {

    constructor(private readonly service: PacientesService) {}

    // ADMINISTRADOR: para elegir a qué paciente le reserva el turno
    @ApiOkResponse({ type: UsuarioResumenDto, isArray: true })
    @Get()
    async listarPacientes(): Promise<UsuarioResumenDto[]> {
        return await this.service.listarPacientes();
    }
}
