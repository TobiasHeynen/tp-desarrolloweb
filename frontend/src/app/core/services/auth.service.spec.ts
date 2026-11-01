import { describe, expect, it } from 'vitest';
import { RolesUsuarios } from '../models/roles-usuarios.enum';
import { decodificarToken } from './auth.service';

// Arma un JWT de prueba (la firma no importa: el front solo lee el payload).
function tokenDe(payload: object): string {
    const base64Url = (objeto: object): string =>
        btoa(JSON.stringify(objeto)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    return `${base64Url({ alg: 'HS256', typ: 'JWT' })}.${base64Url(payload)}.firma`;
}

describe('decodificarToken', () => {
    it('lee sub, rol e idMedico del payload', () => {
        const payload = decodificarToken(tokenDe({ sub: 2, rol: 'MEDICO', idMedico: 1 }));
        expect(payload).toMatchObject({ sub: 2, rol: RolesUsuarios.MEDICO, idMedico: 1 });
    });

    it('devuelve null si el token está mal formado', () => {
        expect(decodificarToken('basura')).toBeNull();
        expect(decodificarToken('a.b.c')).toBeNull();
    });

    it('devuelve null si el rol no existe', () => {
        expect(decodificarToken(tokenDe({ sub: 1, rol: 'SUPERUSUARIO' }))).toBeNull();
    });
});
