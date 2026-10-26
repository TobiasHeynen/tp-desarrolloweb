import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { RolesUsuarios } from '../../gestion/enums/roles-usuarios.enum.js';

export interface JwtPayload {
    sub: number;
    rol: RolesUsuarios;
    idMedico?: number;
}

export const UsuarioActual = createParamDecorator(
    (_data: unknown, ctx: ExecutionContext): JwtPayload => {
        const request = ctx.switchToHttp().getRequest<{ user: JwtPayload }>();
        return request.user;
    },
);
