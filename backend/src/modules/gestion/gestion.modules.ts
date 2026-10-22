import {Module} from '@nestjs/common';
import { AdministradorController } from './controllers/administrador.controllers.js';
import { MedicosController } from './controllers/medicos.controllers.js';
import { PacientesController } from './controllers/pacientes.controllers.js';
import {TypeOrmModule} from '@nestjs/typeorm';
import {Usuarios} from './entities/usuarios.entity.js';
import {Medicos} from './entities/medicos.entity.js';
import {Paciente} from './entities/paciente.entity.js';
import { ReservasService } from './services/reservas.service.js';
import { PacienteService } from './services/pacientes.service.js';

@Module({
    controllers: [AdministradorController, MedicosController, PacientesController],
    imports: [TypeOrmModule.forFeature({Usuarios, Medicos, Paciente})],
    providers: [ReservasService,
    PacienteService,
    {
        provide: 'ADMINISTRADOR_SERVICE',
        useExisting: AdministradorService

    },{
        provide: 'PACIENTE_SERVICE',
        useExisting: PacienteService
    }],
    exports: []
})
export class GestionModule {
    
}