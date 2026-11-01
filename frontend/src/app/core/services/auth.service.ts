import { HttpClient } from '@angular/common/http';
import { Injectable, Signal, computed, inject, signal } from '@angular/core';
import { Observable, map, tap } from 'rxjs';
import { LoginPeticion, LoginRespuesta } from '../models/login.interface';
import { PayloadJwt } from '../models/payload-jwt.interface';
import { RolesUsuarios } from '../models/roles-usuarios.enum';
import { API } from '../utils/api';

// Lo que necesita el resto de la app de la sesión.
export interface ISesion {
    readonly usuario: Signal<PayloadJwt | null>;
    login(documento: string, clave: string): Observable<void>;
    logout(): void;
    sesionVigente(): boolean;
}

const CLAVE_TOKEN = 'clinica.token';

function leerToken(): string | null {
    try {
        return localStorage.getItem(CLAVE_TOKEN);
    } catch {
        return null;
    }
}

function guardarToken(token: string | null): void {
    try {
        if (token) localStorage.setItem(CLAVE_TOKEN, token);
        else localStorage.removeItem(CLAVE_TOKEN);
    } catch {
        // sin localStorage la sesión dura hasta recargar la página
    }
}

// Un JWT es "header.payload.firma" en base64url. Solo se lee el payload para saber
// quién es y qué rol tiene (para el menú y los guards): la seguridad real la hace el backend.
export function decodificarToken(token: string): PayloadJwt | null {
    try {
        const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
        const bytes = Uint8Array.from(atob(base64), (caracter) => caracter.charCodeAt(0));
        const payload = JSON.parse(new TextDecoder().decode(bytes)) as PayloadJwt;
        const rolValido = Object.values(RolesUsuarios).includes(payload.rol);
        return typeof payload.sub === 'number' && rolValido ? payload : null;
    } catch {
        return null;
    }
}

function estaVencido(payload: PayloadJwt): boolean {
    return payload.exp !== undefined && payload.exp * 1000 <= Date.now();
}

@Injectable({ providedIn: 'root' })
export class AuthService implements ISesion {
    private readonly http = inject(HttpClient);
    private readonly token = signal<string | null>(leerToken());

    readonly usuario: Signal<PayloadJwt | null> = computed(() => {
        const token = this.token();
        return token ? decodificarToken(token) : null;
    });

    // Lo usa el interceptor para mandar Authorization: Bearer
    obtenerToken(): string | null {
        return this.token();
    }

    login(documento: string, clave: string): Observable<void> {
        const peticion: LoginPeticion = { documento, clave };
        return this.http.post<LoginRespuesta>(`${API}/auth/login`, peticion).pipe(
            tap((respuesta) => {
                guardarToken(respuesta.accessToken);
                this.token.set(respuesta.accessToken);
            }),
            map(() => undefined),
        );
    }

    logout(): void {
        guardarToken(null);
        this.token.set(null);
    }

    // Hay sesión y el token no venció. Si venció, la cierra.
    sesionVigente(): boolean {
        const usuario = this.usuario();
        if (!usuario) return false;
        if (estaVencido(usuario)) {
            this.logout();
            return false;
        }
        return true;
    }
}
