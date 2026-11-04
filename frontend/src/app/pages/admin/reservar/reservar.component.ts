import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { EstadoCarga, cargado, cargando, fallido } from '../../../core/models/estado-carga';
import { Medico } from '../../../core/models/medico.interface';
import { UsuarioResumen } from '../../../core/models/usuario-resumen.interface';
import { Reserva } from '../../../core/models/reserva.interface';
import { MedicosService } from '../../../core/services/medicos.service';
import { ReservasService } from '../../../core/services/reservas.service';
import { PacientesService } from '../../../core/services/pacientes.service';
import { mensajeDeError } from '../../../core/utils/errores';
import {
    DIAS_MAXIMOS_ANTICIPACION,
    armarFechaHora,
    esFinDeSemana,
    hoyArgentina,
    sumarDias,
} from '../../../core/utils/fechas';
import { FechaHoraTurnoPipe } from '../../../shared/pipes/fecha-hora-turno.pipe';
import { PrecioPipe } from '../../../shared/pipes/precio.pipe';

@Component({
    selector: 'app-admin-reservar',
    imports: [PrecioPipe, FechaHoraTurnoPipe],
    templateUrl: './reservar.component.html',
})
export class ReservarComponent implements OnInit {
    private readonly medicosService = inject(MedicosService);
    private readonly reservasService = inject(ReservasService);
    private readonly pacientesService = inject(PacientesService);
    private readonly router = inject(Router);

    // Limitaciones de fechas//
    protected readonly diasMaximos = DIAS_MAXIMOS_ANTICIPACION;
    protected readonly fechaMinima = hoyArgentina();
    protected readonly fechaMaxima = sumarDias(hoyArgentina(), DIAS_MAXIMOS_ANTICIPACION);

    // Estado de carga//
    protected readonly medicos = signal<EstadoCarga<Medico[]>>(cargando([]));
    protected readonly pacientes = signal<EstadoCarga<UsuarioResumen[]>>(cargando([]));
    protected readonly horarios = signal<EstadoCarga<string[]>>(cargado([]));

    // Elecciones//
    protected readonly pacienteElegido = signal<number | null>(null);
    protected readonly medicoElegido = signal<Medico | null>(null);
    protected readonly fechaElegida = signal<string>('');
    protected readonly horaElegida = signal<string | null>(null);

    // Búsqueda//
    protected readonly filtroPaciente = signal<string>('');

    protected readonly pacientesFiltrados = computed<UsuarioResumen[]>(() => {
        const q = this.filtroPaciente().trim().toLowerCase();
        const lista = this.pacientes().datos;
        if (q === '') return lista;
        return lista.filter(
            (p) =>
                `${p.apellidos} ${p.nombres}`.toLowerCase().includes(q) ||
                p.documento.toLowerCase().includes(q),
        );
    });

    protected readonly pacienteNombre = computed<string | null>(() => {
        const id = this.pacienteElegido();
        if (id === null) return null;
        const p = this.pacientes().datos.find((x) => x.id === id);
        return p ? `${p.apellidos}, ${p.nombres}` : null;
    });

    // Estado de la operación//
    protected readonly confirmando = signal<boolean>(false);
    protected readonly errorReserva = signal<string | null>(null);
    protected readonly reservaCreada = signal<Reserva | null>(null);

    // Validaciones //
    protected readonly esFinDeSemana = computed<boolean>(() => {
        const fecha = this.fechaElegida();
        return fecha !== '' && esFinDeSemana(fecha);
    });

    protected readonly fechaFueraDeRango = computed<boolean>(() => {
        const fecha = this.fechaElegida();
        return fecha !== '' && (fecha < this.fechaMinima || fecha > this.fechaMaxima);
    });

    protected readonly puedeConfirmar = computed<boolean>(
        () =>
            this.pacienteElegido() !== null &&
            this.medicoElegido() !== null &&
            this.fechaElegida() !== '' &&
            this.horaElegida() !== null &&
            !this.esFinDeSemana() &&
            !this.fechaFueraDeRango() &&
            !this.confirmando(),
    );

    ngOnInit(): void {
        this.medicosService.listar().subscribe({
            next: (lista) => this.medicos.set(cargado(lista)),
            error: (e) => this.medicos.set(fallido([], mensajeDeError(e))),
        });
        this.pacientesService.listar().subscribe({
            next: (lista) => this.pacientes.set(cargado(lista)),
            error: (e) => this.pacientes.set(fallido([], mensajeDeError(e))),
        });
    }

    protected elegirPaciente(id: number): void {
        this.pacienteElegido.set(id);
        this.reservaCreada.set(null);
        this.errorReserva.set(null);
    }

    protected limpiarPaciente(): void {
        this.pacienteElegido.set(null);
        this.medicoElegido.set(null);
        this.fechaElegida.set('');
        this.horaElegida.set(null);
        this.horarios.set(cargado([]));
        this.reservaCreada.set(null);
        this.errorReserva.set(null);
    }

    protected elegirMedico(medico: Medico): void {
        this.medicoElegido.set(medico);
        this.reservaCreada.set(null);
        this.cargarHorarios();
    }

    protected elegirFecha(fecha: string): void {
        this.fechaElegida.set(fecha);
        this.reservaCreada.set(null);
        this.cargarHorarios();
    }

    protected elegirHora(hora: string): void {
        this.horaElegida.set(hora);
        this.errorReserva.set(null);
    }

    protected confirmar(): void {
        const medico = this.medicoElegido();
        const hora = this.horaElegida();
        const pacienteId = this.pacienteElegido();

        if (!medico || !hora || !pacienteId || !this.puedeConfirmar()) return;

        this.confirmando.set(true);
        this.errorReserva.set(null);

        this.reservasService
            .crear({
                idMedico: medico.id,
                fechaHora: armarFechaHora(this.fechaElegida(), hora),
                idPaciente: pacienteId,
            })
            .subscribe({
                next: (reserva) => {
                    this.reservaCreada.set(reserva);
                    this.confirmando.set(false);
                    this.horaElegida.set(null);
                    this.cargarHorarios();
                },
                error: (e) => {
                    this.errorReserva.set(mensajeDeError(e));
                    this.confirmando.set(false);
                    this.cargarHorarios();
                },
            });
    }

    protected resetFormulario(): void {
        this.pacienteElegido.set(null);
        this.medicoElegido.set(null);
        this.fechaElegida.set('');
        this.horaElegida.set(null);
        this.horarios.set(cargado([]));
        this.filtroPaciente.set('');
        this.errorReserva.set(null);
        this.reservaCreada.set(null);
    }

    protected irATurnos(): void {
        this.router.navigate(['/admin/turnos']);
    }

    private cargarHorarios(): void {
        const medico = this.medicoElegido();
        const fecha = this.fechaElegida();
        this.horaElegida.set(null);

        if (!medico || fecha === '' || this.esFinDeSemana() || this.fechaFueraDeRango()) {
            this.horarios.set(cargado([]));
            return;
        }

        this.horarios.set(cargando([]));
        this.medicosService.horariosDisponibles(medico.id, fecha).subscribe({
            next: (lista) => {
                if (this.medicoElegido()?.id === medico.id && this.fechaElegida() === fecha) {
                    this.horarios.set(cargado(lista));
                }
            },
            error: (e) => this.horarios.set(fallido([], mensajeDeError(e))),
        });
    }
}