import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { RolesUsuarios } from '../models/roles-usuarios.enum';
import { rutaInicial } from '../navegacion';
import { AuthService } from '../services/auth.service';

// Guard por rol. Se configura en la ruta:  data: { roles: [RolesUsuarios.PACIENTE] }
// Si el rol no corresponde, lo manda a la pantalla inicial de su propio rol.
export const rolGuard: CanActivateFn = (ruta) => {
    const auth = inject(AuthService);
    const router = inject(Router);

    if (!auth.sesionVigente()) {
        return router.createUrlTree(['/login']);
    }
    const permitidos = (ruta.data['roles'] ?? []) as RolesUsuarios[];
    const rol = auth.usuario()?.rol;
    if (rol && permitidos.includes(rol)) {
        return true;
    }
    return router.createUrlTree([rol ? rutaInicial(rol) : '/login']);
};
