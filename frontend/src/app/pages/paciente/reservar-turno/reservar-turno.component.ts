import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { EstadoCarga, cargado, cargando, fallido } from '../../../core/models/estado-carga';
import { Medico } from '../../../core/models/medico.interface';
import { Reserva } from '../../../core/models/reserva.interface';
import { MedicosService } from '../../../core/services/medicos.service';
import { ReservasService } from '../../../core/services/reservas.service';
import { mensajeDeError } from '../../../core/utils/errores';
import {
    DIAS_MAXIMOS_ANTICIPACION, armarFechaHora, esFinDeSemana, hoyArgentina, sumarDias,
} from '../../../core/utils/fechas';
import { FechaHoraTurnoPipe } from '../../../shared/pipes/fecha-hora-turno.pipe';
import { PrecioPipe } from '../../../shared/pipes/precio.pipe';

// Pasos: 1) elegir médico  2) elegir fecha  3) elegir horario  4) confirmar (con el precio a la vista)
@Component({
    selector: 'app-reservar-turno',
    imports: [RouterLink, PrecioPipe, FechaHoraTurnoPipe],
    templateUrl: './reservar-turno.component.html',
})
export class ReservarTurnoComponent implements OnInit {
    private readonly medicosService = inject(MedicosService);
    private readonly reservasService = inject(ReservasService);

    protected readonly diasMaximos: number = DIAS_MAXIMOS_ANTICIPACION;

    // La fecha se limita a hoy..hoy+30 días (en hora de Argentina). El backend vuelve a validar.
    protected readonly fechaMinima: string = hoyArgentina();
    protected readonly fechaMaxima: string = sumarDias(hoyArgentina(), DIAS_MAXIMOS_ANTICIPACION);

    protected readonly medicos = signal<EstadoCarga<Medico[]>>(cargando([]));
    protected readonly horarios = signal<EstadoCarga<string[]>>(cargado([]));

    protected readonly medicoElegido = signal<Medico | null>(null);
    protected readonly fechaElegida = signal<string>('');
    protected readonly horaElegida = signal<string | null>(null);

    protected readonly confirmando = signal<boolean>(false);
    protected readonly errorReserva = signal<string | null>(null);
    protected readonly reservaCreada = signal<Reserva | null>(null);

    protected readonly esFinDeSemana = computed<boolean>(() => {
        const fecha = this.fechaElegida();
        return fecha !== '' && esFinDeSemana(fecha);
    });
    protected readonly fechaFueraDeRango = computed<boolean>(() => {
        const fecha = this.fechaElegida();
        return fecha !== '' && (fecha < this.fechaMinima || fecha > this.fechaMaxima);
    });
    protected readonly puedeConfirmar = computed<boolean>(
        () => this.medicoElegido() !== null && this.fechaElegida() !== '' && this.horaElegida() !== null && !this.confirmando(),
    );

    ngOnInit(): void {
        this.medicosService.listar().subscribe({
            next: (lista) => this.medicos.set(cargado(lista)),
            error: (error: unknown) => this.medicos.set(fallido([], mensajeDeError(error))),
        });
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
        if (!medico || !hora || !this.puedeConfirmar()) return;

        this.confirmando.set(true);
        this.errorReserva.set(null);
        this.reservasService.crear({ idMedico: medico.id, fechaHora: armarFechaHora(this.fechaElegida(), hora) }).subscribe({
            next: (reserva) => {
                this.reservaCreada.set(reserva);
                this.confirmando.set(false);
                this.horaElegida.set(null);
                this.cargarHorarios(); // el horario recién reservado ya no está libre
            },
            error: (error: unknown) => {
                this.errorReserva.set(mensajeDeError(error));
                this.confirmando.set(false);
                this.cargarHorarios(); // por si alguien tomó ese horario justo antes
            },
        });
    }

    // Trae los horarios libres cuando ya están elegidos el médico y una fecha válida.
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
                // Si mientras tanto eligió otro médico o fecha, se descarta esta respuesta.
                if (this.medicoElegido()?.id === medico.id && this.fechaElegida() === fecha) {
                    this.horarios.set(cargado(lista));
                }
            },
            error: (error: unknown) => this.horarios.set(fallido([], mensajeDeError(error))),
        });
    }
}
