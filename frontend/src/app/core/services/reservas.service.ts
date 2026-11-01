import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { EstadosReservas } from '../models/estados-reservas.enum';
import { FiltrosReservas, NuevaReserva, Reserva } from '../models/reserva.interface';
import { API } from '../utils/api';

export interface IReservasApi {
    crear(reserva: NuevaReserva): Observable<Reserva>;
    listar(filtros?: FiltrosReservas): Observable<Reserva[]>;
    cancelar(id: number): Observable<void>;
    cambiarEstado(id: number, estado: EstadosReservas.ATENDIDO | EstadosReservas.AUSENTE): Observable<void>;
}

@Injectable({ providedIn: 'root' })
export class ReservasService implements IReservasApi {
    private readonly http = inject(HttpClient);

    crear(reserva: NuevaReserva): Observable<Reserva> {
        return this.http.post<Reserva>(`${API}/reservas`, reserva);
    }

    // El backend ya filtra según el rol: el paciente y el médico solo reciben las suyas.
    listar(filtros: FiltrosReservas = {}): Observable<Reserva[]> {
        let params = new HttpParams();
        if (filtros.fecha) params = params.set('fecha', filtros.fecha);
        if (filtros.idMedico) params = params.set('idMedico', filtros.idMedico);
        if (filtros.idPaciente) params = params.set('idPaciente', filtros.idPaciente);
        if (filtros.estado) params = params.set('estado', filtros.estado);
        return this.http.get<Reserva[]>(`${API}/reservas`, { params });
    }

    cancelar(id: number): Observable<void> {
        return this.http.patch<void>(`${API}/reservas/${id}/cancelar`, {});
    }

    // Lo usa el médico (persona 5)
    cambiarEstado(id: number, estado: EstadosReservas.ATENDIDO | EstadosReservas.AUSENTE): Observable<void> {
        return this.http.patch<void>(`${API}/reservas/${id}/estado`, { estado });
    }
}
