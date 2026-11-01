import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { inicioGuard } from './core/guards/inicio.guard';
import { rolGuard } from './core/guards/rol.guard';
import { RolesUsuarios } from './core/models/roles-usuarios.enum';
import { LayoutComponent } from './layout/layout.component';
import { EnConstruccionComponent } from './pages/en-construccion/en-construccion.component';
import { LoginComponent } from './pages/login/login.component';
import { MisTurnosComponent } from './pages/paciente/mis-turnos/mis-turnos.component';
import { ReservarTurnoComponent } from './pages/paciente/reservar-turno/reservar-turno.component';

export const routes: Routes = [
    // Si ya hay sesión, el login redirige a la pantalla del rol
    { path: 'login', component: LoginComponent, canActivate: [inicioGuard], title: 'Ingresar' },

    {
        path: '',
        component: LayoutComponent,
        canActivate: [authGuard],
        children: [
            // '/' manda a la pantalla inicial de cada rol (ver core/navegacion.ts)
            { path: '', pathMatch: 'full', canActivate: [inicioGuard], component: EnConstruccionComponent },

            // ----- PACIENTE (persona 4) -----
            {
                path: 'paciente/reservar', component: ReservarTurnoComponent, title: 'Reservar turno',
                canActivate: [rolGuard], data: { roles: [RolesUsuarios.PACIENTE] },
            },
            {
                path: 'paciente/mis-turnos', component: MisTurnosComponent, title: 'Mis turnos',
                canActivate: [rolGuard], data: { roles: [RolesUsuarios.PACIENTE] },
            },

            // ----- MEDICO y ADMINISTRADOR (persona 5): reemplazar EnConstruccionComponent por la pantalla real -----
            {
                path: 'medico/agenda', component: EnConstruccionComponent, title: 'Mi agenda',
                canActivate: [rolGuard], data: { roles: [RolesUsuarios.MEDICO] },
            },
            {
                path: 'admin/turnos', component: EnConstruccionComponent, title: 'Turnos',
                canActivate: [rolGuard], data: { roles: [RolesUsuarios.ADMINISTRADOR] },
            },
            {
                path: 'admin/medicos', component: EnConstruccionComponent, title: 'Médicos',
                canActivate: [rolGuard], data: { roles: [RolesUsuarios.ADMINISTRADOR] },
            },
        ],
    },

    { path: '**', redirectTo: '' },
];
