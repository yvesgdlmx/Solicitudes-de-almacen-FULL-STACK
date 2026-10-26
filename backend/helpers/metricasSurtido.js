export function evaluarSolicitud(solicitud, seguimiento, ahora = new Date()) {
    if (!seguimiento) return 'sin seguimiento';
    if (solicitud.status === 'rechazada') return 'rechazada';
    if (solicitud.status === 'surtido') {
        if (!seguimiento.completada) return 'sin seguimiento';
        return new Date(seguimiento.completada) < new Date(seguimiento.limite)
            && new Date(seguimiento.completada) >= new Date(seguimiento.inicio) ? 'a tiempo' : 'fuera de plazo';
    }
    return ahora >= new Date(seguimiento.limite) ? 'vencida' : 'en plazo';
}

export function resumirSurtido(filas, ahora = new Date()) {
    const evaluables = filas.filter(f => !['sin seguimiento', 'rechazada'].includes(f.cumplimiento));
    // Cohorte por vencimiento; incluye las pendientes vencidas en el denominador.
    const exigibles = evaluables.filter(f => new Date(f.limite) <= ahora);
    const contar = (estado) => filas.filter(f => f.cumplimiento === estado).length;
    const completas = evaluables.filter(f => f.status === 'surtido').length;
    return {
        total: filas.length, evaluables: evaluables.length, exigibles: exigibles.length,
        cumplimiento: exigibles.length ? Math.round(100 * exigibles.filter(f => f.cumplimiento === 'a tiempo').length / exigibles.length) : null,
        entregaCompleta: evaluables.length ? Math.round(100 * completas / evaluables.length) : null,
        completas, parciales: filas.filter(f => f.status === 'entrega parcial').length,
        vencidas: contar('vencida'), fueraDePlazo: contar('fuera de plazo'),
        sinSeguimiento: contar('sin seguimiento'), rechazadas: contar('rechazada'),
        atrasosOperativos: filas.filter(f => ['vencida', 'fuera de plazo'].includes(f.cumplimiento) && f.motivo === 'demora operativa').length,
        atrasosSinClasificar: filas.filter(f => ['vencida', 'fuera de plazo'].includes(f.cumplimiento) && !f.motivo).length,
    };
}
