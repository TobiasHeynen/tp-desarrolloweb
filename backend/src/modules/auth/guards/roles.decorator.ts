import { SetMetadata } from '@nestjs/common';
import { RolesUsuarios } from '../../gestion/enums/roles-usuarios.enum.js';

export const ROLES_KEY = 'roles';

/**
 * Decorador para restringir un endpoint a uno o más roles de usuario.
 */
export const Roles = (...roles: RolesUsuarios[]) => SetMetadata(ROLES_KEY, roles);

