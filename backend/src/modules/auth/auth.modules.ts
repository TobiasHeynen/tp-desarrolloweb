import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoginController } from './controllers/login.controllers.js';
import { Usuario } from '../gestion/entities/usuarios.entity.js';
import { Medico } from '../gestion/entities/medicos.entity.js';

@Module({
    controllers: [LoginController],
    imports: [TypeOrmModule.forFeature([Usuario, Medico])],
    providers: [],
    exports: [],
})
export class AuthModule {}
