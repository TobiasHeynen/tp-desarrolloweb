import { Component, OnInit, inject, signal } from '@angular/core';
import { EstadoCarga, cargado, cargando, fallido } from '../../../core/models/estado-carga';
import { Medico } from '../../../core/models/medico.interface';
import { MedicosService } from '../../../core/services/medicos.service';
import { mensajeDeError } from '../../../core/utils/errores';
import { PrecioPipe } from '../../../shared/pipes/precio.pipe';

@Component({
    selector: 'app-medicosadmin',
    imports: [PrecioPipe],
    templateUrl: './medicosadmin.component.html',
})
export class MedicosComponent implements OnInit {
    private readonly medicosService = inject(MedicosService);

    protected readonly medicos = signal<EstadoCarga<Medico[]>>(cargando([]));
    protected readonly idEditando = signal<number | null>(null);
    protected readonly nuevoValor = signal<number>(0);
    protected readonly guardando = signal<boolean>(false);

    protected readonly errorAccion = signal<string | null>(null);
    protected readonly mensajeAccion = signal<string | null>(null);

    ngOnInit(): void {
        this.cargar();
    }

    protected cargar(): void {
        this.medicos.update((actual) => cargando(actual.datos));
        this.medicosService.listar().subscribe({
            next: (lista) => this.medicos.set(cargado(lista)),
            error: (e) => this.medicos.set(fallido([], mensajeDeError(e))),
        });
    }

    protected editar(medico: Medico): void {
        this.idEditando.set(medico.id);
        this.nuevoValor.set(medico.valorConsulta);
        this.errorAccion.set(null);
        this.mensajeAccion.set(null);
    }

    protected cancelarEdicion(): void {
        this.idEditando.set(null);
        this.errorAccion.set(null);
    }

    protected guardar(medico: Medico): void {
        const valor = this.nuevoValor();
        // El backend exige un entero mayor a 0.
        if (!Number.isInteger(valor) || valor <= 0) {
            this.errorAccion.set('El valor debe ser un número entero mayor a 0.');
            return;
        }
        if (this.guardando()) return;

        this.guardando.set(true);
        this.errorAccion.set(null);

        this.medicosService.actualizarValorConsulta(medico.id, valor).subscribe({
            next: () => {
                this.guardando.set(false);
                this.idEditando.set(null);
                this.mensajeAccion.set(`Valor actualizado Dr/a. ${medico.apellidos}.`);
                // Actualización local de la fila
                this.medicos.update((actual) => {
                    if (actual.cargando || actual.error) return actual;
                    return cargado(
                        actual.datos.map((m) =>
                            m.id === medico.id ? { ...m, valorConsulta: valor } : m,
                        ),
                    );
                });
            },
            error: (e) => {
                this.guardando.set(false);
                this.errorAccion.set(mensajeDeError(e));
            },
        });
    }
}