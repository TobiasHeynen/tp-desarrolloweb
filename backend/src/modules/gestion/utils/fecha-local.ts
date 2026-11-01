// Fecha y hora "de pared" de Argentina, SIN zona horaria.
//
// La columna fecha_hora es `timestamp` (sin zona), así que en la base siempre se guarda
// la hora local de Argentina. Para no mezclar zonas NUNCA se usa toISOString():
// internamente se usa Date.UTC solo como "calendario" para sumar y comparar,
// y siempre se imprime con los getters UTC.

export enum DiasSemana {
    DOMINGO,
    LUNES,
    MARTES,
    MIERCOLES,
    JUEVES,
    VIERNES,
    SABADO,
}

// Argentina no tiene horario de verano: es UTC-3 todo el año.
const OFFSET_ARGENTINA_EN_HORAS = -3;
const MS_POR_HORA = 60 * 60 * 1000;
const MS_POR_DIA = 24 * MS_POR_HORA;

const REGEX_FECHA = /^(\d{4})-(\d{2})-(\d{2})$/;
// Sin 'Z' ni offset: la hora que se manda ES la hora de Argentina.
const REGEX_FECHA_HORA = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2})(?:\.\d+)?)?$/;

function dosDigitos(numero: number): string {
    return String(numero).padStart(2, '0');
}

export class FechaLocal {
    private constructor(private readonly ms: number) {}

    // Ahora mismo, en hora de Argentina (sin importar la zona del servidor).
    static ahora(): FechaLocal {
        return new FechaLocal(Date.now() + OFFSET_ARGENTINA_EN_HORAS * MS_POR_HORA);
    }

    static desdePartes(anio: number, mes: number, dia: number, hora = 0, minutos = 0, segundos = 0): FechaLocal | null {
        const ms = Date.UTC(anio, mes - 1, dia, hora, minutos, segundos);
        const fecha = new FechaLocal(ms);
        // Si el día no existe (ej: 31 de febrero) JS lo "corrige" y las partes ya no coinciden.
        const coincide =
            fecha.anio === anio && fecha.mes === mes && fecha.dia === dia &&
            fecha.hora === hora && fecha.minutos === minutos && fecha.segundos === segundos;
        return coincide ? fecha : null;
    }

    // 'YYYY-MM-DD' -> medianoche de ese día. Devuelve null si el texto no es una fecha válida.
    static desdeTextoFecha(texto: string): FechaLocal | null {
        const partes = REGEX_FECHA.exec(texto);
        if (!partes) return null;
        return FechaLocal.desdePartes(Number(partes[1]), Number(partes[2]), Number(partes[3]));
    }

    // 'YYYY-MM-DDTHH:mm[:ss]' (sin zona horaria). Devuelve null si no es válido.
    static desdeTextoFechaHora(texto: string): FechaLocal | null {
        const partes = REGEX_FECHA_HORA.exec(texto);
        if (!partes) return null;
        return FechaLocal.desdePartes(
            Number(partes[1]), Number(partes[2]), Number(partes[3]),
            Number(partes[4]), Number(partes[5]), Number(partes[6] ?? 0),
        );
    }

    get anio(): number { return new Date(this.ms).getUTCFullYear(); }
    get mes(): number { return new Date(this.ms).getUTCMonth() + 1; }
    get dia(): number { return new Date(this.ms).getUTCDate(); }
    get hora(): number { return new Date(this.ms).getUTCHours(); }
    get minutos(): number { return new Date(this.ms).getUTCMinutes(); }
    get segundos(): number { return new Date(this.ms).getUTCSeconds(); }
    get diaSemana(): DiasSemana { return new Date(this.ms).getUTCDay() as DiasSemana; }

    get esFinDeSemana(): boolean {
        return this.diaSemana === DiasSemana.SABADO || this.diaSemana === DiasSemana.DOMINGO;
    }

    inicioDelDia(): FechaLocal {
        return new FechaLocal(Math.floor(this.ms / MS_POR_DIA) * MS_POR_DIA);
    }

    sumarDias(dias: number): FechaLocal {
        return new FechaLocal(this.ms + dias * MS_POR_DIA);
    }

    conHora(hora: number): FechaLocal {
        return new FechaLocal(this.inicioDelDia().ms + hora * MS_POR_HORA);
    }

    esAnteriorA(otra: FechaLocal): boolean { return this.ms < otra.ms; }
    esPosteriorA(otra: FechaLocal): boolean { return this.ms > otra.ms; }

    // 'YYYY-MM-DD'
    aTextoFecha(): string {
        return `${this.anio}-${dosDigitos(this.mes)}-${dosDigitos(this.dia)}`;
    }

    // 'HH:mm'
    aTextoHora(): string {
        return `${dosDigitos(this.hora)}:${dosDigitos(this.minutos)}`;
    }

    // 'YYYY-MM-DDTHH:mm:ss' (es lo que se guarda en la base y lo que se devuelve al front)
    aTexto(): string {
        return `${this.aTextoFecha()}T${this.aTextoHora()}:${dosDigitos(this.segundos)}`;
    }
}
