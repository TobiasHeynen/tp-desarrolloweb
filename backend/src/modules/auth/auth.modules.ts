import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Medico } from '../gestion/entities/medicos.entity.js';
import { Usuario } from '../gestion/entities/usuarios.entity.js';
import { LoginController } from './controllers/login.controllers.js';
import { JwtAuthGuard } from './guards/jwt-auth.guard.js';
import { RolesGuard } from './guards/roles.guard.js';
import { AuthService } from './services/auth.service.js';

@Module({
    controllers: [LoginController],
    imports: [
        TypeOrmModule.forFeature([Usuario, Medico]),
        JwtModule.registerAsync({
            inject: [ConfigService],
            useFactory: (config: ConfigService): JwtModuleOptions => ({
                secret: config.get<string>('JWT_SECRET') ?? 'secreto-clinica-uner',
                signOptions: {
                    expiresIn: (config.get<string>('JWT_EXPIRES_IN') ?? '4h') as any,
                },
            }),
        }),
    ],
    providers: [AuthService, JwtAuthGuard, RolesGuard],
    exports: [AuthService, JwtAuthGuard, RolesGuard, JwtModule],
})
export class AuthModule {}
