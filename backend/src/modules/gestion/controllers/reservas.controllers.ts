import {Body, Controller, Get,NotImplementedException, Param, Post, Put,Query} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { CreateReservasDto } from '../dtos/input/create-reservas.dto.js';
import { UpdateReservasDto } from '../dtos/input/update-reservas.dto.js';
import { ListReservasDto } from '../dtos/output/list-reservas.dto.js';
import { EstadoReservasEnum } from '../enums/estados-reservas.enum.js';
import { ReservasService } from '../services/reservas.service.js';

@Controller('administrador/:idAdministrador/reservas')
export class ReservasController {

    constructor(private readonly service: ReservasService) {}

    @ApiBearerAuth()
    @Post()
    async crearReserva(@Body() dto: CreateReservasDto, @Param('idAdministrador') idAdministrador: number, Promise<ListReservasDto> {
        return await this.service.crearReserva('idAdministrador', dto);
    }

    @ApiBearerAuth()
    @Put:(':id')
    async actualizarReserva(@Param('id') id: number, @Body() dto: UpdateReservasDto): Promise<void> {
        return await this.service.editarReserva(id, dto)
    }
    @ApiBearerAuth()
    @ApiOkResponse({ type: ListReservasDto, isArray: true })
    @ApiQuery({
        name: 'estado',
        enum: EstadoReservasEnum, 
        required: false })

    @Get()
    async OkReservas(@Query('estado') estado: EstadoReservasEnum): Promise<ListReservasDto[]> {
        throw new NotImplementedException()