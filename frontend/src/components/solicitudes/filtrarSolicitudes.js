export function filtrarSolicitudes(datos, { busqueda = '', prioridad = '', area = '' } = {}) {
  const normalizar = valor => String(valor ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('es-MX');
  const consulta = normalizar(busqueda.trim());
  return datos.filter(s => (!prioridad || s.prioridad === prioridad) && (!area || s.area === area)
    && (!consulta || [s.folio, s.area, s.solicitante, s.status, s.prioridad].some(v => normalizar(v).includes(consulta))));
}
