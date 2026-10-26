import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RolesUsuarios } from '../../gestion/enums/roles-usuarios.enum.js';
import { ROLES_KEY } from './roles.decorator.js';
import { JwtPayload } from './usuario-actual.decorator.js';

/**
 * Guard que valida que el rol del usuario autenticado coincida con los roles permitidos en la ruta.
 */
@Injectable()
export class RolesGuard implements CanActivate {

    constructor(private readonly reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        const rolesRequeridos = this.reflector.getAllAndOverride<RolesUsuarios[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        if (!rolesRequeridos || rolesRequeridos.length === 0) {
            return true;
        }

        const request = context.switchToHttp().getRequest<{ user?: JwtPayload }>();
        const usuario = request.user;

        if (!usuario || !rolesRequeridos.includes(usuario.rol)) {
            throw new ForbiddenException('No tiene permisos suficientes para realizar esta operación');
        }

        return true;
    }
}

