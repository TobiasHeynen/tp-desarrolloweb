import { Pipe, PipeTransform } from '@angular/core';

const formato = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 });

// {{ 25000 | precio }}  ->  $ 25.000
@Pipe({ name: 'precio' })
export class PrecioPipe implements PipeTransform {
    transform(valor: number): string {
        return formato.format(valor);
    }
}
