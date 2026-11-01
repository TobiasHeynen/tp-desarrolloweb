import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Medico } from '../models/medico.interface';
import { API } from '../utils/api';

export interface IMedicosApi {
    listar(): Observable<Medico[]>;
    horariosDisponibles(idMedico: number, fecha: string): Observable<string[]>;
    actualizarValorConsulta(idMedico: number, valorConsulta: number): Observable<void>;
}

@Injectable({ providedIn: 'root' })
export class MedicosService implements IMedicosApi {
    private readonly http = inject(HttpClient);

    listar(): Observable<Medico[]> {
        return this.http.get<Medico[]>(`${API}/medicos`);
    }

    // fecha: 'YYYY-MM-DD'. Devuelve por ejemplo ['08:00', '09:00']
    horariosDisponibles(idMedico: number, fecha: string): Observable<string[]> {
        return this.http.get<string[]>(`${API}/medicos/${idMedico}/horarios-disponibles`, { params: { fecha } });
    }

    // Lo usa el administrador (persona 5)
    actualizarValorConsulta(idMedico: number, valorConsulta: number): Observable<void> {
        return this.http.patch<void>(`${API}/medicos/${idMedico}/valor-consulta`, { valorConsulta });
    }
}
