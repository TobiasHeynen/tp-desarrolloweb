import { ValueTransformer } from 'typeorm';

function aTextoLocal(fecha: Date): string {
    const dos = (n: number): string => String(n).padStart(2, '0');
    // Getters LOCALES a propósito: el driver pg arma el Date interpretando el
    // timestamp sin zona como hora local, así que los getters locales devuelven
    // exactamente lo que está guardado en la base.
    return `${fecha.getFullYear()}-${dos(fecha.getMonth() + 1)}-${dos(fecha.getDate())}` +
        `T${dos(fecha.getHours())}:${dos(fecha.getMinutes())}:${dos(fecha.getSeconds())}`;
}

// En la entidad la fecha es un string 'YYYY-MM-DDTHH:mm:ss' (hora de Argentina), nunca un Date.
// Así no hay conversiones de zona horaria ni toISOString() de por medio.
export const fechaLocalTransformer: ValueTransformer = {
    to: (valor?: string | null): string | null | undefined => valor,
    from: (valor?: Date | string | null): string | null | undefined => {
        if (valor instanceof Date) return aTextoLocal(valor);
        if (typeof valor === 'string') return valor.replace(' ', 'T').slice(0, 19);
        return valor;
    },
};
