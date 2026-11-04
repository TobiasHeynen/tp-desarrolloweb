import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { EstadoCarga, cargado, cargando, fallido } from '../../../core/models/estado-carga';
import { EstadosReservas } from '../../../core/models/estados-reservas.enum';
import { Medico } from '../../../core/models/medico.interface';
import { Reserva } from '../../../core/models/reserva.interface';
import { UsuarioResumen } from '../../../core/models/usuario-resumen.interface';
import { MedicosService } from '../../../core/services/medicos.service';
import { PacientesService } from '../../../core/services/pacientes.service';
import { ReservasService } from '../../../core/services/reservas.service';
import { mensajeDeError } from '../../../core/utils/errores';
import { FechaHoraTurnoPipe } from '../../../shared/pipes/fecha-hora-turno.pipe';
import { PrecioPipe } from '../../../shared/pipes/precio.pipe';

type FiltroEstado = EstadosReservas | 'TODOS';

@Component({
    selector: 'app-admin-turnos',
    imports: [RouterLink, PrecioPipe, FechaHoraTurnoPipe],
    templateUrl: './turnos.component.html',
})
export class TurnosComponent implements OnInit {
    private readonly reservasService = inject(ReservasService);
    private readonly medicosService = inject(MedicosService);
    private readonly pacientesService = inject(PacientesService);

    protected readonly activo = EstadosReservas.ACTIVO;
    protected readonly estados = Object.values(EstadosReservas);

    protected readonly reservas = signal<EstadoCarga<Reserva[]>>(cargando([]));
    protected readonly medicos = signal<EstadoCarga<Medico[]>>(cargando([]));
    protected readonly pacientes = signal<EstadoCarga<UsuarioResumen[]>>(cargando([]));

    // Filtros//
    protected readonly filtroMedico = signal<number | null>(null);
    protected readonly filtroPaciente = signal<number | null>(null);
    protected readonly filtro = signal<FiltroEstado>('TODOS');
    protected readonly filtroFecha = signal<string>('');

    protected readonly idPorConfirmar = signal<number | null>(null);
    protected readonly idCancelando = signal<number | null>(null);
    protected readonly errorAccion = signal<string | null>(null);
    protected readonly mensajeAccion = signal<string | null>(null);

    protected readonly visibles = computed<Reserva[]>(() => {
        const medico = this.filtroMedico();
        const paciente = this.filtroPaciente();
        const filtro = this.filtro();
        const fecha = this.filtroFecha();
        let lista = this.reservas().datos;
        if (medico !== null) lista = lista.filter((r) => r.medico.id === medico);
        if (paciente !== null) lista = lista.filter((r) => r.paciente.id === paciente);
        if (filtro !== 'TODOS') lista = lista.filter((r) => r.estado === filtro);
        if (fecha !== '') lista = lista.filter((r) => r.fechaHora.startsWith(fecha));
        return lista;
    });

    ngOnInit(): void {
        this.cargar();
        this.medicosService.listar().subscribe({
            next: (lista) => this.medicos.set(cargado(lista)),
            error: (e) => this.medicos.set(fallido([], mensajeDeError(e))),
        });
        this.pacientesService.listar().subscribe({
            next: (lista) => this.pacientes.set(cargado(lista)),
            error: (e) => this.pacientes.set(fallido([], mensajeDeError(e))),
        });
    }

    protected cambiarMedico(valor: string): void {
        this.filtroMedico.set(valor === '' ? null : Number(valor));
    }

    protected cambiarPaciente(valor: string): void {
        this.filtroPaciente.set(valor === '' ? null : Number(valor));
    }

    protected cambiarFiltro(valor: string): void {
        this.filtro.set(valor as FiltroEstado);
    }

    protected cambiarFecha(valor: string): void {
        this.filtroFecha.set(valor);
    }

    protected pedirConfirmacion(id: number): void {
        this.idPorConfirmar.set(id);
        this.errorAccion.set(null);
        this.mensajeAccion.set(null);
    }
    
    protected descartarConfirmacion(): void {
    this.idPorConfirmar.set(null);
    }

    protected puedeCancelar(reserva: Reserva): boolean {
         return reserva.estado === this.activo && reserva.fechaHora > new Date().toISOString();
    }

    // El admin puede cancelar mientras el turno no haya iniciado//
    
    protected cancelar(reserva: Reserva): void {
        const ahora = new Date().toISOString();
        if (reserva.fechaHora < ahora) {
            this.errorAccion.set('No se puede cancelar un turno comenzado.');
            this.idPorConfirmar.set(null);
            return;
        }
        this.idCancelando.set(reserva.id);
        this.errorAccion.set(null);

        this.reservasService.cancelar(reserva.id).subscribe({
            next: () => {
                this.idCancelando.set(null);
                this.idPorConfirmar.set(null);
                const f = reserva.fechaHora;
                this.mensajeAccion.set(
                    `Cancelaste el turno del ${f.slice(8, 10)}/${f.slice(5, 7)} a las ${f.slice(11, 16)}.`,
                );
                this.cargar();
            },
            error: (e) => {
                this.idCancelando.set(null);
                this.idPorConfirmar.set(null);
                this.errorAccion.set(mensajeDeError(e));
                this.cargar();
            },
        });
    }

    protected cargar(): void {
        this.reservas.update((a) => cargando(a.datos));
        this.reservasService.listar().subscribe({
            next: (lista) => this.reservas.set(cargado(lista)),
            error: (e) => this.reservas.set(fallido([], mensajeDeError(e))),
        });
    }
}