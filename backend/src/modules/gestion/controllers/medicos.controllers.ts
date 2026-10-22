import {Body, Controller, Get,NotImplementedException, Param, Post, Put,Query} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { CreateMedicosDto } from '../dtos/input/create-medicos.dto.js';
import { UpdateMedicosDto } from '../dtos/input/update-medicos.dto.js';
import { ListMedicosDto } from '../dtos/output/list-medicos.dto.js';
import { EstadoMedicosEnum } from '../enums/estado-medicos.enum.js';

@Controller('medicos')
export class MedicosController {


    constructor() {}

    @ApiBearerAuth()
    @Post()
    async create(@Body() dto: CreateMedicosDto: CreateMedicosDto): Promise<ListMedicosDto> {
        throw new NotImplementedException()

    @ApiBearerAuth()
    @Put:('/:id')
    async actualizarMedicos(@Param('id') id: number, @Body() dto: UpdateMedicosDto): Promise<void> {
        throw new NotImplementedException()

    @ApiBearerAuth()
    @ApiOkResponse({ type: ListMedicosDto, isArray: true })
    @ApiQuery({
        name: 'estado',
        enum: EstadoMEnum, 
        required: false })

    @Get()
    async OKMedicos(@Query('estado') estado: EstadoMedicosEnum): Promise<ListMedicosDto[]> {
        throw new NotImplementedException()

    }