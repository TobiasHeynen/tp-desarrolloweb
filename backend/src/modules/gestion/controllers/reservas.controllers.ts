import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard.js';
import { Roles } from '../../auth/guards/roles.decorator.js';
import { RolesGuard } from '../../auth/guards/roles.guard.js';
import { UsuarioActual } from '../../auth/guards/usuario-actual.decorator.js';
import type { PayloadJwt } from '../../auth/interfaces/payload-jwt.interface.js';
import { CreateReservaDto } from '../dtos/input/create-reserva.dto.js';
import { FiltrosReservasDto } from '../dtos/input/filtros-reservas.dto.js';
import { UpdateEstadoReservaDto } from '../dtos/input/update-estado-reserva.dto.js';
import { ListReservasDto } from '../dtos/output/list-reservas.dto.js';
import { RolesUsuarios } from '../enums/roles-usuarios.enum.js';
import { ReservasService } from '../services/reservas.service.js';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('reservas')
export class ReservasController {

    constructor(private readonly service: ReservasService) {}

    // PACIENTE y ADMINISTRADOR
    @ApiOkResponse({ type: ListReservasDto })
    @Roles(RolesUsuarios.PACIENTE, RolesUsuarios.ADMINISTRADOR)
    @Post()
    async crearReserva(@Body() dto: CreateReservaDto, @UsuarioActual() usuario: PayloadJwt): Promise<ListReservasDto> {
        return await this.service.crearReserva(dto, usuario);
    }

    // PACIENTE: solo las suyas. MEDICO: solo las suyas (filtrando por fecha). ADMINISTRADOR: todas con filtros.
    @ApiOkResponse({ type: ListReservasDto, isArray: true })
    @Get()
    async listarReservas(@Query() filtros: FiltrosReservasDto, @UsuarioActual() usuario: PayloadJwt): Promise<ListReservasDto[]> {
        return await this.service.listarReservas(filtros, usuario);
    }

    // PACIENTE (hasta el día anterior) y ADMINISTRADOR (hasta que empieza la consulta)
    @Roles(RolesUsuarios.PACIENTE, RolesUsuarios.ADMINISTRADOR)
    @Patch(':id/cancelar')
    async cancelarReserva(@Param('id', ParseIntPipe) id: number, @UsuarioActual() usuario: PayloadJwt): Promise<void> {
        await this.service.cancelarReserva(id, usuario);
    }

    // MEDICO: marca ATENDIDO o AUSENTE
    @Roles(RolesUsuarios.MEDICO)
    @Patch(':id/estado')
    async cambiarEstado(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UpdateEstadoReservaDto,
        @UsuarioActual() usuario: PayloadJwt,
    ): Promise<void> {
        await this.service.cambiarEstado(id, dto, usuario);
    }
}
