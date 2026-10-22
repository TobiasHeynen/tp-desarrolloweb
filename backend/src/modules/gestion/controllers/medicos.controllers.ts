import { Body, Controller, Get, Param, ParseIntPipe, Patch, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse } from '@nestjs/swagger';
import { HorariosDisponiblesDto } from '../dtos/input/horarios-disponibles.dto.js';
import { UpdateValorConsultaDto } from '../dtos/input/update-valor-consulta.dto.js';
import { ListMedicosDto } from '../dtos/output/list-medicos.dto.js';
import { MedicosService } from '../services/medicos.service.js';
import { ReservasService } from '../services/reservas.service.js';

@ApiBearerAuth()
@Controller('medicos')
export class MedicosController {

    constructor(
        private readonly service: MedicosService,
        private readonly reservasService: ReservasService,
    ) {}

    // Todos los roles (para elegir médico al reservar)
    @ApiOkResponse({ type: ListMedicosDto, isArray: true })
    @Get()
    async listarMedicos(): Promise<ListMedicosDto[]> {
        return await this.service.listarMedicos();
    }

    // PACIENTE y ADMINISTRADOR: horarios libres de un médico en una fecha (ej: ['08:00', '09:00'])
    @ApiOkResponse({ type: String, isArray: true })
    @Get(':id/horarios-disponibles')
    async horariosDisponibles(@Param('id', ParseIntPipe) id: number, @Query() dto: HorariosDisponiblesDto): Promise<string[]> {
        return await this.reservasService.horariosDisponibles(id, dto.fecha);
    }

    // ADMINISTRADOR
    @Patch(':id/valor-consulta')
    async actualizarValorConsulta(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateValorConsultaDto): Promise<void> {
        await this.service.actualizarValorConsulta(id, dto);
    }
}
