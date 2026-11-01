import { Pipe, PipeTransform } from '@angular/core';
import { formatearFecha, formatearFechaHora } from '../../core/utils/fechas';

// {{ reserva.fechaHora | fechaHoraTurno }}        ->  mar 03/11/2026 · 10:00
// {{ '2026-11-03' | fechaHoraTurno }}              ->  mar 03/11/2026
@Pipe({ name: 'fechaHoraTurno' })
export class FechaHoraTurnoPipe implements PipeTransform {
    transform(valor: string): string {
        return valor.length > 10 ? formatearFechaHora(valor) : formatearFecha(valor);
    }
}
