import { Component, OnInit, inject, signal } from '@angular/core';
import {
    EstadoCarga,
    cargado,
    cargando,
    fallido
} from '../../core/models/estado-carga';
import { EstadosReservas } from '../../core/models/estados-reservas.enum';
import { Reserva } from '../../core/models/reserva.interface';
import { ReservasService } from '../../core/services/reservas.service';
import { mensajeDeError } from '../../core/utils/errores';
import { hoyArgentina } from '../../core/utils/fechas';
import { FechaHoraTurnoPipe } from '../../shared/pipes/fecha-hora-turno.pipe';

type AccionMedico =
    | EstadosReservas.ATENDIDO
    | EstadosReservas.AUSENTE;

@Component({
    selector: 'app-agenda',
    imports: [FechaHoraTurnoPipe],
    templateUrl: './agenda.component.html',
})
export class AgendaComponent implements OnInit {

    private readonly reservasService = inject(ReservasService);
    protected readonly estados = EstadosReservas;
    protected readonly fechaSeleccionada = signal<string>(hoyArgentina());
    protected readonly reservas = signal<EstadoCarga<Reserva[]>>(cargando([]));
    protected readonly idMarcando = signal<number | null>(null);
    protected readonly errorAccion = signal<string | null>(null);
    protected readonly mensajeAccion = signal<string | null>(null);
    ngOnInit(): void {
        this.cargar();
    }
  
    protected cambiarFecha(nuevaFecha: string): void {
        if (!nuevaFecha) return;

        if (nuevaFecha === this.fechaSeleccionada()) return;

        this.fechaSeleccionada.set(nuevaFecha);

        this.errorAccion.set(null);
        this.mensajeAccion.set(null);

        this.cargar();
    }


    protected cargar(): void {

        this.reservas.update((actual) => cargando(actual.datos));

        this.reservasService.listar({
            fecha: this.fechaSeleccionada(),
        }).subscribe({

            // La consulta terminó correctamente.
            next: (lista) => {
                this.reservas.set(cargado(lista));
            },

            // La consulta devolvió un error.
            error: (error: unknown) => {
                this.reservas.set(
                    fallido([], mensajeDeError(error))
                );
            },
        });
    }


    // Marca una reserva como atendida o ausente.
    protected marcar(reserva: Reserva, estado: AccionMedico): void {

        // Solamente se pueden modificar reservas activas.
        if (reserva.estado !== EstadosReservas.ACTIVO) return;

        // Evita iniciar otra modificación mientras hay una en curso.
        if (this.idMarcando() !== null) return;

        this.idMarcando.set(reserva.id);

        // Limpia los mensajes de operaciones anteriores.
        this.errorAccion.set(null);
        this.mensajeAccion.set(null);

        this.reservasService.cambiarEstado(reserva.id, estado).subscribe({

            // La modificación se realizó correctamente.
            next: () => {
                this.idMarcando.set(null);

                const hora = reserva.fechaHora.slice(11, 16);

                const texto = estado === EstadosReservas.ATENDIDO
                    ? 'atendido'
                    : 'ausente';

                this.mensajeAccion.set(
                    `Marcaste como ${texto} el turno de las ${hora}.`
                );

                // Actualiza la agenda con los datos del backend.
                this.cargar();
            },

            // La modificación devolvió un error.
            error: (error: unknown) => {
                this.idMarcando.set(null);

                this.errorAccion.set(mensajeDeError(error));

                // Vuelve a consultar para mantener sincronizada la agenda.
                this.cargar();
            },
        });
    }
}
