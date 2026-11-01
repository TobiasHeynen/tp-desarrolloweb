import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { UsuarioResumen } from '../models/usuario-resumen.interface';
import { API } from '../utils/api';

// Lo usa el administrador (persona 5) para elegir a qué paciente le reserva el turno.
@Injectable({ providedIn: 'root' })
export class PacientesService {
    private readonly http = inject(HttpClient);

    listar(): Observable<UsuarioResumen[]> {
        return this.http.get<UsuarioResumen[]>(`${API}/pacientes`);
    }
}
