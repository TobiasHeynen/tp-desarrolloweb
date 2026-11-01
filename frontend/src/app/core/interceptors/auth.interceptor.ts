import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

// Manda Authorization: Bearer en todas las llamadas a /api y,
// si el backend contesta 401 (token vencido o inválido), cierra la sesión y vuelve al login.
export const authInterceptor: HttpInterceptorFn = (peticion, siguiente) => {
    const auth = inject(AuthService);
    const router = inject(Router);

    const token = auth.obtenerToken();
    const esApi = peticion.url.startsWith('/api');
    const peticionFinal = token && esApi
        ? peticion.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
        : peticion;

    return siguiente(peticionFinal).pipe(
        catchError((error: unknown) => {
            const esLogin = peticion.url.endsWith('/auth/login');
            if (error instanceof HttpErrorResponse && error.status === 401 && !esLogin) {
                auth.logout();
                void router.navigate(['/login']);
            }
            return throwError(() => error);
        }),
    );
};
