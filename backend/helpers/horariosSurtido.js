import { puedeOmitirHorario } from './roles.js';
// Zona operativa del almacén: Ciudad de México (UTC-06:00).
export const ZONA = 'America/Mexico_City';
export const HORARIOS = [
    ['Nocturno', '01:00', '01:30'], ['Nocturno', '03:30', '04:00'],
    ['Matutino', '07:00', '07:30'], ['Matutino', '09:30', '10:00'],
    ['Matutino', '12:00', '12:30'], ['Vespertino', '15:00', '15:30'],
    ['Vespertino', '17:30', '18:00'], ['Vespertino', '20:00', '20:30'],
    ['Nocturno', '22:30', '23:00'],
];
export const fechaLocal = (fecha) => new Intl.DateTimeFormat('en-CA', {
    timeZone: ZONA, year: 'numeric', month: '2-digit', day: '2-digit',
}).format(new Date(fecha));

export function ventanaSurtido(fecha) {
    const instante = new Date(fecha);
    if (!Number.isFinite(instante.getTime())) throw new Error('Fecha inválida');
    const dia = fechaLocal(instante);
    for (let offset = 0; offset < 2; offset++) {
        const base = new Date(`${dia}T12:00:00-06:00`);
        base.setUTCDate(base.getUTCDate() + offset);
        const siguienteDia = fechaLocal(base);
        for (const [turno, desde, hasta] of HORARIOS) {
            const inicio = new Date(`${siguienteDia}T${desde}:00-06:00`);
            const limite = new Date(`${siguienteDia}T${hasta}:00-06:00`);
            // El final es exclusivo: 07:30 ya corresponde al siguiente rango.
            if (instante < limite) return { turno, inicio, limite };
        }
    }
}

export function validarEntrega(fecha, inicioAsignado, rol) {
    const ahora = new Date(fecha);
    const ventana = ventanaSurtido(ahora);
    if (ahora < ventana.inicio || ahora < new Date(inicioAsignado)) {
        if (puedeOmitirHorario(rol)) return true;
        const error = new Error(`Solo se permiten entregas en los horarios de surtido. Próximo rango: ${ventana.inicio.toLocaleString('es-MX', { timeZone: ZONA })} (${ZONA}).`);
        error.status = 409;
        throw error;
    }
    return false;
}
