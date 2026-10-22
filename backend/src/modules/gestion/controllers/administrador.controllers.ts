import {Body, Controller, Get,NotImplementedException, Param, Post, Put,Query} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { CreateAdministradorDto } from '../dtos/input/create-administrador.dto.js';
import { UpdateAdministradorDto } from '../dtos/input/update-administrador.dto.js';
import { ListAdministradorDto } from '../dtos/output/list-administrador.dto.js';
import { EstadoAdministradorEnum } from '../enums/estado-administrador.enum.js';

@Controller('administrador')
export class AdministradorController {

    constructor() {}

    @ApiBearerAuth()
    @Post()
    async create(@Body() dto: CreateAdministradorDto: CreateAdministradorDto), Promise<ListAdministradorDto> {
        throw new NotImplementedException()

    @ApiBearerAuth()
    @Put:('/:id')
    async actualizarAdministrador(@Param('id') id: number, @Body() dto: UpdateAdministradorDto): Promise<void> {
        throw new NotImplementedException()

    @ApiBearerAuth()
    @ApiOkResponse({ type: ListAdministradorDto, isArray: true })
    @ApiQuery({
        name: 'estado',
        enum: EstadoAdministradorEnum, 
        required: false })

    @Get()
    async OkAdministradores(@Query('estado') estado: EstadoAdministradorEnum): Promise<ListAdministradorDto[]> {
        throw new NotImplementedException()

    }