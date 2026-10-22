import { Injectable } from  @nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Reserva } from '../entities/reservas.entities.ts';
import { Repository} from 'typeorm';
import { CreateAdministradorDto } from '../dtos/input/create-administrador.dto.js';
import { EstadosReservasEnum } from '../enums/estados-reservas.enum.js';
import { UpdateAdministradorDto } from '../dtos/input/update-administrador.dto.js';
import { BadRequestException } from '@nestjs/common';



@Injectable()
export class ReservasService{

    constructor (@InjectRepository(Reserva)private  readonly repository: Repository<Reserva>){

    }
    async crearReserva(idAdministrador: number, dto: CreateAdministradorDto):Promise<{id:number}>{
        const reserva: Reserva = this.repository.create()

        reserva.estado = EstadosReservasEnum.PENDIENTE

        reserva.idAdministador = idAdministrador

        await this.repository.save(reserva);

        return {id: reserva.id}
    }
    async editarReserva(idReserva: number, dto: UpdateAdministradorDto):Promise<void>{

        const reserva: Reserva | null = await this.repository.findOne({
            where: {
                id: idReserva

            }

        });
        if (!reserva){
            throw new BadRequestException('Turno inexistente');
        }

        this.repository.merge(reserva, dto);

        await this.repository.save(reserva);


    }

}