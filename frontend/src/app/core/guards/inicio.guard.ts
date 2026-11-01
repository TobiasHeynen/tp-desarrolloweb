import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { rutaInicial } from '../navegacion';
import { AuthService } from '../services/auth.service';

// Para la ruta '/' y para '/login': si ya hay sesión, va directo a la pantalla de su rol.
export const inicioGuard: CanActivateFn = () => {
    const auth = inject(AuthService);
    const router = inject(Router);
    const rol = auth.sesionVigente() ? auth.usuario()?.rol : undefined;
    return rol ? router.createUrlTree([rutaInicial(rol)]) : true;
};
