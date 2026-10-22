import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MedicosController } from './controllers/medicos.controllers.js';
import { PacientesController } from './controllers/pacientes.controllers.js';
import { ReservasController } from './controllers/reservas.controllers.js';
import { Medico } from './entities/medicos.entity.js';
import { Reserva } from './entities/reservas.entity.js';
import { Usuario } from './entities/usuarios.entity.js';
import { MedicosService } from './services/medicos.service.js';
import { PacientesService } from './services/pacientes.service.js';
import { ReservasService } from './services/reservas.service.js';

@Module({
    controllers: [ReservasController, MedicosController, PacientesController],
    imports: [TypeOrmModule.forFeature([Usuario, Medico, Reserva])],
    providers: [ReservasService, MedicosService, PacientesService],
    exports: [],
})
export class GestionModule {}
