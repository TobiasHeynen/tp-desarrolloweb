import { RolesUsuarios } from './models/roles-usuarios.enum';

export interface ItemMenu {
    texto: string;
    ruta: string;
}

// Menú del layout según el rol. La persona 5 agrega/ajusta acá los items de MEDICO y ADMINISTRADOR.
export const MENU_POR_ROL: Record<RolesUsuarios, ItemMenu[]> = {
    [RolesUsuarios.PACIENTE]: [
        { texto: 'Reservar turno', ruta: '/paciente/reservar' },
        { texto: 'Mis turnos', ruta: '/paciente/mis-turnos' },
    ],
    [RolesUsuarios.MEDICO]: [
        { texto: 'Mi agenda', ruta: '/medico/agenda' },
    ],
    [RolesUsuarios.ADMINISTRADOR]: [
        { texto: 'Turnos', ruta: '/admin/turnos' },
        { texto: 'Médicos', ruta: '/admin/medicos' },
    ],
};

export function rutaInicial(rol: RolesUsuarios): string {
    return MENU_POR_ROL[rol][0].ruta;
}

export const NOMBRE_DE_ROL: Record<RolesUsuarios, string> = {
    [RolesUsuarios.PACIENTE]: 'Paciente',
    [RolesUsuarios.MEDICO]: 'Médico',
    [RolesUsuarios.ADMINISTRADOR]: 'Administrador',
};
