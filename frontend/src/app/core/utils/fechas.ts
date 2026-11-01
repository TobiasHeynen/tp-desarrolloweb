// Las fechas del sistema son SIEMPRE hora de Argentina y viajan como texto,
// 'YYYY-MM-DD' o 'YYYY-MM-DDTHH:mm:ss'. Nunca se usa toISOString() ni new Date('texto'),
// porque convierten a UTC y el turno de las 10:00 se corre de hora o de día.

const ZONA_ARGENTINA = 'America/Argentina/Buenos_Aires';
const NOMBRES_DIAS: readonly string[] = ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'];

export const DIAS_MAXIMOS_ANTICIPACION = 30;

// Fecha de hoy en Argentina ('YYYY-MM-DD'), aunque el navegador esté en otra zona.
export function hoyArgentina(): string {
    // 'en-CA' formatea como YYYY-MM-DD
    return new Intl.DateTimeFormat('en-CA', {
        timeZone: ZONA_ARGENTINA, year: 'numeric', month: '2-digit', day: '2-digit',
    }).format(new Date());
}

// Suma días a un 'YYYY-MM-DD' sin pasar por zonas horarias.
export function sumarDias(fecha: string, dias: number): string {
    const [anio, mes, dia] = fecha.split('-').map(Number);
    const resultado = new Date(Date.UTC(anio, mes - 1, dia + dias));
    const dos = (n: number): string => String(n).padStart(2, '0');
    return `${resultado.getUTCFullYear()}-${dos(resultado.getUTCMonth() + 1)}-${dos(resultado.getUTCDate())}`;
}

// 0 = domingo ... 6 = sábado
export function diaSemana(fecha: string): number {
    const [anio, mes, dia] = fecha.split('-').map(Number);
    return new Date(Date.UTC(anio, mes - 1, dia)).getUTCDay();
}

export function esFinDeSemana(fecha: string): boolean {
    const dia = diaSemana(fecha);
    return dia === 0 || dia === 6;
}

// '2026-11-03' -> 'mar 03/11/2026'
export function formatearFecha(fecha: string): string {
    const [anio, mes, dia] = fecha.slice(0, 10).split('-');
    return `${NOMBRES_DIAS[diaSemana(fecha.slice(0, 10))]} ${dia}/${mes}/${anio}`;
}

// '2026-11-03T10:00:00' -> 'mar 03/11/2026 · 10:00'
export function formatearFechaHora(fechaHora: string): string {
    return `${formatearFecha(fechaHora)} · ${fechaHora.slice(11, 16)}`;
}

// '2026-11-03T10:00:00' -> '2026-11-03'
export function soloFecha(fechaHora: string): string {
    return fechaHora.slice(0, 10);
}

// '2026-11-03' + '10:00' -> '2026-11-03T10:00:00' (lo que espera POST /reservas)
export function armarFechaHora(fecha: string, hora: string): string {
    return `${fecha}T${hora}:00`;
}
