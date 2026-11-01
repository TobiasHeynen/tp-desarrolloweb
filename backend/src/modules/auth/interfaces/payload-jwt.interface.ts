import { RolesUsuarios } from '../../gestion/enums/roles-usuarios.enum.js';

// Payload del JWT según el contrato del README: { sub: idUsuario, rol, idMedico? }.
// idMedico solo viene si el rol es MEDICO.
export interface PayloadJwt {
    sub: number;
    rol: RolesUsuarios;
    idMedico?: number;
}
