import { RolesUsuarios } from './roles-usuarios.enum';

// Payload del token según el contrato: { sub: idUsuario, rol, idMedico? }.
// exp e iat los agrega el JWT (en segundos).
export interface PayloadJwt {
    sub: number;
    rol: RolesUsuarios;
    idMedico?: number;
    exp?: number;
    iat?: number;
}
