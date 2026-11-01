import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { EstadoCarga, cargado, cargando, fallido } from '../../../core/models/estado-carga';
import { EstadosReservas } from '../../../core/models/estados-reservas.enum';
import { Reserva } from '../../../core/models/reserva.interface';
import { ReservasService } from '../../../core/services/reservas.service';
import { mensajeDeError } from '../../../core/utils/errores';
import { hoyArgentina, soloFecha } from '../../../core/utils/fechas';
import { FechaHoraTurnoPipe } from '../../../shared/pipes/fecha-hora-turno.pipe';
import { PrecioPipe } from '../../../shared/pipes/precio.pipe';

// El filtro puede ser un estado o 'TODOS' (union type).
type FiltroEstado = EstadosReservas | 'TODOS';

@Component({
    selector: 'app-mis-turnos',
    imports: [RouterLink, PrecioPipe, FechaHoraTurnoPipe],
    templateUrl: './mis-turnos.component.html',
})
export class MisTurnosComponent implements OnInit {
    private readonly reservasService = inject(ReservasService);

    protected readonly estados: EstadosReservas[] = Object.values(EstadosReservas);
    protected readonly reservas = signal<EstadoCarga<Reserva[]>>(cargando([]));
    protected readonly filtro = signal<FiltroEstado>('TODOS');

    // Turno que está esperando la confirmación "¿Seguro?" y turno que se está cancelando.
    protected readonly idPorConfirmar = signal<number | null>(null);
    protected readonly idCancelando = signal<number | null>(null);
    protected readonly errorAccion = signal<string | null>(null);
    protected readonly mensajeAccion = signal<string | null>(null);

    protected readonly visibles = computed<Reserva[]>(() => {
        const filtro = this.filtro();
        const lista = this.reservas().datos;
        return filtro === 'TODOS' ? lista : lista.filter((reserva) => reserva.estado === filtro);
    });

    ngOnInit(): void {
        this.cargar();
    }

    protected cambiarFiltro(valor: string): void {
        this.filtro.set(valor as FiltroEstado);
    }

    // El paciente cancela hasta las 23:59 del día anterior: solo si el turno es de un día posterior a hoy.
    // (Es solo para mostrar o no el botón: el que decide de verdad es el backend.)
    protected puedeCancelar(reserva: Reserva): boolean {
        return reserva.estado === EstadosReservas.ACTIVO && soloFecha(reserva.fechaHora) > hoyArgentina();
    }

    protected pedirConfirmacion(id: number): void {
        this.idPorConfirmar.set(id);
        this.errorAccion.set(null);
        this.mensajeAccion.set(null);
    }

    protected descartarConfirmacion(): void {
        this.idPorConfirmar.set(null);
    }

    protected cancelar(reserva: Reserva): void {
        this.idCancelando.set(reserva.id);
        this.errorAccion.set(null);
        this.reservasService.cancelar(reserva.id).subscribe({
            next: () => {
                this.idCancelando.set(null);
                this.idPorConfirmar.set(null);
                this.mensajeAccion.set(`Cancelaste el turno del ${reserva.fechaHora.slice(8, 10)}/${reserva.fechaHora.slice(5, 7)} a las ${reserva.fechaHora.slice(11, 16)}.`);
                this.cargar();
            },
            error: (error: unknown) => {
                this.idCancelando.set(null);
                this.idPorConfirmar.set(null);
                this.errorAccion.set(mensajeDeError(error));
                this.cargar(); // por si el estado cambió mientras tanto
            },
        });
    }

    protected cargar(): void {
        this.reservas.update((actual) => cargando(actual.datos));
        this.reservasService.listar().subscribe({
            next: (lista) => this.reservas.set(cargado(lista)),
            error: (error: unknown) => this.reservas.set(fallido([], mensajeDeError(error))),
        });
    }
}
