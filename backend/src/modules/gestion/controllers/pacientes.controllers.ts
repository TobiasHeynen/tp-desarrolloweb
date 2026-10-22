import {Body, Controller, Get,NotImplementedException, Param, Post, Put,Query} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { CreatePacientesDto } from '../dtos/input/create-pacientes.dto.js';
import { UpdatePacientesDto } from '../dtos/input/update-pacientes.dto.js';
import { ListPacientesDto } from '../dtos/output/list-pacientes.dto.js';
import { EstadoPacienteEnum } from '../enums/estado-paciente.enum.js';

@Controller('pacientes')
export class PacientesController {

    constructor() {}

    @ApiBearerAuth()
    @Post()
    async create(@Body() dto: CreatePacientesDto: CreatePacientesDto): Promise<ListPacientesDto> {
        throw new NotImplementedException()

    @ApiBearerAuth()
    @Put:('/:id')
    async actualizarPaciente(@Param('id') id: number, @Body() dto: UpdatePacientesDto): Promise<void> {
        throw new NotImplementedException()

    @ApiBearerAuth()
    @ApiOkResponse({ type: ListPacientesDto, isArray: true })
    @ApiQuery({
        name: 'estado',
        enum: EstadoPacienteEnum, 
        required: false })

    @Get()
    async OPacientes(@Query('estado') estado: EstadoPacienteEnum): Promise<ListPacientesDto[]> {
        throw new NotImplementedException()

    }