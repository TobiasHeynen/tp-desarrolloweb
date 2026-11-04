import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { inicioGuard } from './core/guards/inicio.guard';
import { rolGuard } from './core/guards/rol.guard';
import { RolesUsuarios } from './core/models/roles-usuarios.enum';
import { LayoutComponent } from './layout/layout.component';
import { LoginComponent } from './pages/login/login.component';
import { MisTurnosComponent } from './pages/paciente/mis-turnos/mis-turnos.component';
import { ReservarTurnoComponent } from './pages/paciente/reservar-turno/reservar-turno.component';
import { AgendaComponent } from './pages/medico/agenda.component';
import { MedicosComponent } from './pages/admin/medicos/medicosadmin.component'
import { ReservarComponent } from './pages/admin/reservar/reservar.component';
import { TurnosComponent } from './pages/admin/turnos/turnos.component';

export const routes: Routes = [
    { path: 'login', component: LoginComponent, canActivate: [inicioGuard], title: 'Ingresar' },

    {
        path: '',
        component: LayoutComponent,
        canActivate: [authGuard],
        children: [
            // ----- PACIENTE (persona 4) -----//
            {
                path: 'paciente/reservar', component: ReservarTurnoComponent, title: 'Reservar turno',
                canActivate: [rolGuard], data: { roles: [RolesUsuarios.PACIENTE] },
            },
            {
                path: 'paciente/mis-turnos', component: MisTurnosComponent, title: 'Mis turnos',
                canActivate: [rolGuard], data: { roles: [RolesUsuarios.PACIENTE] },
            },

            // ----- MEDICO (persona 5) -----//
            {
                path: 'medico/agenda', component: AgendaComponent, title: 'Mi agenda',
                canActivate: [rolGuard], data: { roles: [RolesUsuarios.MEDICO] },
            }, 

            // --- ADMIN ---//
            {
                path: 'admin/turnos', component: TurnosComponent, title: 'Turnos',
                canActivate: [rolGuard], data: { roles: [RolesUsuarios.ADMINISTRADOR] },
            },
            {
                path: 'admin/medicos', component: MedicosComponent, title: 'Médicos',
                canActivate: [rolGuard], data: { roles: [RolesUsuarios.ADMINISTRADOR] },
            },
            {
                path: 'admin/reservar', component: ReservarComponent, title: 'Reservar turno (Admin)',
                canActivate: [rolGuard], data: { roles: [RolesUsuarios.ADMINISTRADOR] },
            },
        ],
    },

    { path: '**', redirectTo: '' },
];