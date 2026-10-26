import { useState } from 'react';
import { FiArrowRight, FiChevronLeft, FiChevronRight, FiEdit3, FiFileText, FiInfo, FiLock, FiPackage, FiPlus, FiSearch, FiTrash2, FiUsers, FiX } from 'react-icons/fi';
import { formatearFecha } from '../../functions/Index';
import { filtrarSolicitudes } from '../solicitudes/filtrarSolicitudes';

const estados = {
  'pendiente surtido': { nombre: 'Pendiente de surtido', tono: 'blue' },
  'en proceso': { nombre: 'En proceso', tono: 'indigo' },
  'entrega parcial': { nombre: 'Entrega parcial', tono: 'amber' },
  surtido: { nombre: 'Surtido', tono: 'green' },
  rechazada: { nombre: 'Rechazada', tono: 'red' },
};
const prioridades = { 'muy alto': { nombre: 'Muy alta', tono: 'purple' }, alto: { nombre: 'Alta', tono: 'blue' }, moderado: { nombre: 'Moderada', tono: 'teal' } };
const iniciales = nombre => String(nombre || '').split(/[\s_]+/).filter(Boolean).slice(0, 2).map(p => p[0]).join('').toUpperCase();

export default function TablaSolicitudes({ datos = [], titulo = 'Solicitudes', onCrearSolicitud, showAcciones = false, onEditar, onEliminar, onVerDetalle, className = '', ocupado = false, imagenVacia = '/img/mis-solicitudes-v1.png' }) {
  const [busqueda, setBusqueda] = useState('');
  const [prioridad, setPrioridad] = useState('');
  const [area, setArea] = useState('');
  const [pagina, setPagina] = useState(1);
  const entradas = 10;
  const filtrados = filtrarSolicitudes(datos, { busqueda, prioridad, area });
  const totalPaginas = Math.max(1, Math.ceil(filtrados.length / entradas));
  const paginaActual = Math.min(pagina, totalPaginas);
  const inicio = (paginaActual - 1) * entradas;
  const visibles = filtrados.slice(inicio, inicio + entradas);
  const areas = [...new Set(datos.map(s => s.area).filter(Boolean))].sort((a, b) => a.localeCompare(b, 'es'));
  const filtrosActivos = Boolean(busqueda || prioridad || area);
  const limpiar = () => { setBusqueda(''); setPrioridad(''); setArea(''); setPagina(1); };
  const abrir = solicitud => { if (!ocupado) onVerDetalle?.(solicitud); };
  const paginas = Array.from({ length: totalPaginas }, (_, i) => i + 1).filter(p => totalPaginas <= 7 || p === 1 || p === totalPaginas || Math.abs(p - paginaActual) <= 1);
  return <section className={` bg-white rounded-[18px] [&&]:[box-shadow:var(--app-shadow)] overflow-hidden border border-solid [&&]:border-[var(--app-line)]  ${className}  `}>
    <div className="
      [&_>_div]:flex [&_>_div]:items-center [&_>_div]:gap-[11px] [&_h2]:text-[length:14px] [&_h2]:font-[650]
      [&&_h2]:text-[#243f64] [&_h2]:leading-[1.4] max-[650.001px]:[&_h2]:text-[length:13px] [&&_p]:text-[#5b6e87]
      [&_p]:text-[length:12px] [&_p]:mt-1 flex items-center justify-between gap-3 pt-[22px] pr-[23px] pb-[18px]
      pl-[23px] [&&]:[background:linear-gradient(110deg,_#f0f5fd,_#fff)] max-[950.001px]:items-start
      max-[650.001px]:items-start max-[650.001px]:pt-[19px] max-[650.001px]:pr-[18px] max-[650.001px]:pb-[19px]
      max-[650.001px]:pl-[18px]
    "><div><span className="
      flex items-center justify-center w-[33px] h-[33px] [&&]:[background:#e0ebfd] [&&]:text-[#245fc1] rounded-[10px]
      shrink-0 text-[length:16px] max-[650.001px]:w-[29px] max-[650.001px]:h-[30px]
      max-[650.001px]:text-[length:14px]
    "><FiFileText /></span><div><h2>{titulo}</h2><p>{filtrados.length} {filtrados.length === 1 ? 'solicitud encontrada' : 'solicitudes encontradas'}</p></div></div><span className="
      inline-flex items-center gap-[6px] text-[#71839c] text-[length:11px] max-[1250.001px]:text-[length:11px]
      max-[1250.001px]:max-w-[205px] max-[650.001px]:hidden max-[650.001px]:max-w-[205px]
    "><FiInfo />Abre un folio para consultar su detalle</span></div>
    <div className="
      flex flex-wrap items-end gap-3 pt-0 pr-[23px] pb-5 pl-[23px] max-[650.001px]:gap-[10px] max-[650.001px]:pt-0
      max-[650.001px]:pr-[18px] max-[650.001px]:pb-[18px] max-[650.001px]:pl-[18px]
    "><label className="
      relative block flex-1 min-w-[230px] max-[950.001px]:basis-full max-[650.001px]:min-w-0
      max-[650.001px]:basis-full [&_>_svg]:absolute [&_>_svg]:left-[12px] [&_>_svg]:top-[13px]
      [&_>_svg]:text-[#9cb1d1] [&_>_svg]:w-[15px] [&_>_svg]:pointer-events-none [&_input]:h-[41px] [&_input]:w-full
      [&_input]:rounded-[9px] [&_input]:[background:#fafcff] [&_input]:pt-[9px] [&_input]:pr-3 [&_input]:pb-[9px]
      [&_input]:pl-[35px] [&_input]:text-[length:13px] [&_input]:text-[#526f96] [&_input]:[outline:none]
      [&_input]:border [&_input]:border-solid [&_input]:border-[#e2eaf6] max-[650.001px]:[&_input]:text-[length:12px]
      [&_input::placeholder]:text-[#74849b] [&_input:focus]:bg-white [&_input:focus]:border-[#a4c0ec]
    "><FiSearch /><input type="search" aria-label="Buscar solicitudes" placeholder="Buscar folio, área o solicitante…" value={busqueda} onChange={e => { setBusqueda(e.target.value); setPagina(1); }} /></label><label className="
      block min-w-40 max-w-[230px] max-[1250.001px]:min-w-[150px] max-[1250.001px]:max-w-50
      max-[950.001px]:min-w-[150px] max-[950.001px]:max-w-none max-[950.001px]:flex-1 max-[650.001px]:min-w-[135px]
      max-[650.001px]:max-w-none max-[650.001px]:flex-1 [&_>_span]:block [&_>_span]:text-[length:11px]
      [&_>_span]:text-[#6c809c] [&_>_span]:mb-[5px] [&_select]:h-[41px] [&_select]:w-full [&_select]:min-w-0
      [&_select]:rounded-[9px] [&_select]:[background:#fafcff] [&_select]:pt-2 [&_select]:pr-[10px] [&_select]:pb-2
      [&_select]:pl-[10px] [&_select]:text-[length:12px] [&_select]:text-[#617b9e] [&_select]:[outline:none]
      [&_select]:border [&_select]:border-solid [&_select]:border-[#e2eaf6] [&_select:hover]:border-[#b1c8ea]
    "><span>Prioridad</span><select aria-label="Filtrar por prioridad" value={prioridad} onChange={e => { setPrioridad(e.target.value); setPagina(1); }}><option value="">Todas las prioridades</option>{Object.entries(prioridades).map(([valor, p]) => <option key={valor} value={valor}>{p.nombre}</option>)}</select></label>{!showAcciones && <label className="
      block min-w-40 max-w-[230px] max-[1250.001px]:min-w-[150px] max-[1250.001px]:max-w-50
      max-[950.001px]:min-w-[150px] max-[950.001px]:max-w-none max-[950.001px]:flex-1 max-[650.001px]:min-w-[135px]
      max-[650.001px]:max-w-none max-[650.001px]:flex-1 [&_>_span]:block [&_>_span]:text-[length:11px]
      [&_>_span]:text-[#6c809c] [&_>_span]:mb-[5px] [&_select]:h-[41px] [&_select]:w-full [&_select]:min-w-0
      [&_select]:rounded-[9px] [&_select]:[background:#fafcff] [&_select]:pt-2 [&_select]:pr-[10px] [&_select]:pb-2
      [&_select]:pl-[10px] [&_select]:text-[length:12px] [&_select]:text-[#617b9e] [&_select]:[outline:none]
      [&_select]:border [&_select]:border-solid [&_select]:border-[#e2eaf6] [&_select:hover]:border-[#b1c8ea]
    "><span>Área</span><select aria-label="Filtrar por área" value={area} onChange={e => { setArea(e.target.value); setPagina(1); }}><option value="">Todas las áreas</option>{areas.map(a => <option key={a} value={a}>{a}</option>)}</select></label>}{filtrosActivos && <button className="h-[41px] inline-flex items-center justify-center gap-1 text-[#6c84a5] text-[length:11px] pt-0 pr-1 pb-0 pl-1 hover:text-[#5481c7]" onClick={limpiar}><FiX />Limpiar búsqueda</button>}</div>
    <div className="w-full overflow-x-auto [scrollbar-width:thin] [scrollbar-color:#cbd9ef_#f8fafd]"><table className="
      w-full min-w-225 text-left border-collapse text-[length:13px] [&&_th]:[background:#e4edf9]
      [&&_th]:text-[#284e7c] [&_th]:[border-top-width:1px] [&_th]:[border-top-style:solid]
      [&_th]:[border-bottom-width:1px] [&_th]:[border-bottom-style:solid] [&_th]:pt-[14px] [&_th]:pr-[21px]
      [&_th]:pb-[14px] [&_th]:pl-[21px] [&_th]:whitespace-nowrap [&_th]:text-[length:12px] [&&_th]:font-[650]
      [&&_th]:border-[#cedcef] [&_td]:pt-[18px] [&_td]:pr-[21px] [&_td]:pb-[18px] [&_td]:pl-[21px]
      [&_td]:[border-bottom-width:1px] [&_td]:[border-bottom-style:solid] [&&_td]:[border-bottom-color:#e0e8f3]
      [&&_td]:text-[#435c7b] [&_td]:align-middle [&_tbody_tr:last-child_td]:[border-bottom-width:0]
      [&_tbody_tr:last-child_td]:[border-bottom-style:solid]
      [&_tbody_tr:last-child_td]:[border-bottom-color:currentColor] [&_tbody_tr]:[transition:background_.2s]
      [&&_tbody_tr:nth-child(even)]:[background:#f7faff] [&&_tbody_tr:hover]:[background:#eaf2ff]
    "><thead><tr>{['Solicitud / área', 'Solicitante', 'Fecha de registro', 'Prioridad', 'Estado', showAcciones ? 'Acciones' : 'Detalle'].map(t => <th key={t} scope="col">{t}</th>)}</tr></thead><tbody>
      {!visibles.length ? <tr><td colSpan={6}><div className="
        flex flex-col items-center justify-center text-center pt-[26px] pr-[15px] pb-[35px] pl-[15px] min-h-[250px]
        [&_>_img]:w-40 [&_>_img]:h-[107px] [&_>_img]:object-contain [&_>_img]:mb-[14px] [&_h3]:text-[length:14px]
        [&_h3]:text-[#637d9f] [&_h3]:font-semibold [&_p]:text-[length:12px] [&_p]:leading-[1.8] [&_p]:text-[#75859c]
        [&_p]:max-w-90 [&_p]:mt-2 [&_>_button]:inline-flex [&_>_button]:items-center [&_>_button]:gap-[7px]
        [&_>_button]:text-[#5f83b8] [&_>_button]:text-[length:12px] [&_>_button]:font-[550] [&_>_button]:mt-4
      "><img src={imagenVacia} alt="" loading="lazy" width="160" height="107" /><h3>{filtrosActivos ? 'No encontramos coincidencias' : 'Todo comienza con una solicitud'}</h3><p>{filtrosActivos ? 'Prueba otro folio, prioridad o área para ajustar los resultados.' : 'No hay solicitudes en esta etapa. Elige otro estado o registra una nueva solicitud.'}</p>{filtrosActivos ? <button onClick={limpiar}>Limpiar búsqueda <FiArrowRight /></button> : onCrearSolicitud && <button onClick={onCrearSolicitud} disabled={ocupado}><FiPlus />Nueva solicitud</button>}</div></td></tr>
        : visibles.map(s => {
          const { fecha, hora } = formatearFecha(s.fechaHora);
          const estado = estados[s.status] || { nombre: s.status, tono: 'slate' };
          const nivel = prioridades[s.prioridad] || { nombre: s.prioridad, tono: 'slate' };
          const editable = s.status === 'pendiente surtido';
          return <tr key={s.id ?? s.folio} onClick={() => abrir(s)} className={ocupado ? "rq-row-busy [&.rq-row-busy]:opacity-[.65]" : "cursor-pointer hover:[background:#f8fbff]"}>
            <td><div className="flex items-center gap-[10px] [&_p]:text-[#70829b] [&_p]:text-[length:12px] [&_p]:mt-1 [&_p]:max-w-[185px] [&_p]:[overflow-wrap:anywhere]"><span className="
              flex items-center justify-center w-[33px] h-[35px] [background:#f2f7fe] text-[#8caad6] rounded-[10px]
              text-[length:17px] shrink-0 border border-solid border-[#eaf0fa]
            "><FiPackage /></span><div><button className="block text-left text-[#486b9b] text-[length:13px] font-semibold max-w-[185px] [overflow-wrap:anywhere] hover:text-[#3b71c5]" onClick={e => { e.stopPropagation(); abrir(s); }} disabled={ocupado} aria-label={`Ver detalle de la solicitud ${s.folio}`}>{s.folio}</button><p>{s.area}</p></div></div></td>
            <td><div className="flex items-center gap-2 text-[length:12px] min-w-[130px] [&_>_span:last-child]:max-w-[165px] [&_>_span:last-child]:[overflow-wrap:anywhere]"><span className="flex items-center justify-center w-[29px] h-[29px] rounded-[50%] [background:#f1f5fc] text-[#768fb3] text-[length:10px] shrink-0">{iniciales(s.solicitante) || <FiUsers />}</span><span>{s.solicitante || 'Sin registro'}</span></div></td>
            <td><div className="flex flex-col gap-[5px] min-w-[125px] text-[length:12px] [&_small]:text-[#74849a] [&_small]:text-[length:11px]"><span>{fecha}</span><small>{hora}</small></div></td>
            <td><span className={`
              inline-flex items-center gap-[5px] pt-[5px] pr-2 pb-[5px] pl-2 rounded-[6px] text-[length:12px]
              whitespace-nowrap font-medium [&_i]:w-1 [&_i]:h-1 [&_i]:rounded-[50%] [&_i]:[background:currentColor]
              [&_i]:shrink-0
            ${{
  "purple": "rq-priority-purple [&.rq-priority-purple]:text-[#6436a5] [&.rq-priority-purple]:[background:#eee3ff]",
  "blue": "rq-priority-blue [&.rq-priority-blue]:text-[#2055b0] [&.rq-priority-blue]:[background:#deebff]",
  "teal": "rq-priority-teal [&.rq-priority-teal]:text-[#086b51] [&.rq-priority-teal]:[background:#d7f4e8]",
  "slate": "rq-priority-slate [&.rq-priority-slate]:text-[#50617b] [&.rq-priority-slate]:[background:#e8edf5]"
}[nivel.tono] || ""}  `}><i />{nivel.nombre}</span></td>
            <td><span className={`
              inline-flex items-center gap-[5px] pt-[5px] pr-2 pb-[5px] pl-2 rounded-[6px] text-[length:12px]
              whitespace-nowrap font-medium [&_i]:w-1 [&_i]:h-1 [&_i]:rounded-[50%] [&_i]:[background:currentColor]
              [&_i]:shrink-0
            ${{
  "blue": "rq-state-blue [&.rq-state-blue]:text-[#2055b0] [&.rq-state-blue]:[background:#deebff]",
  "indigo": "rq-state-indigo [&.rq-state-indigo]:text-[#6436a5] [&.rq-state-indigo]:[background:#eee3ff]",
  "amber": "rq-state-amber [&.rq-state-amber]:text-[#8a570b] [&.rq-state-amber]:[background:#fff0cc]",
  "green": "rq-state-green [&.rq-state-green]:text-[#086b51] [&.rq-state-green]:[background:#d7f4e8]",
  "red": "rq-state-red [&.rq-state-red]:text-[#ab2940] [&.rq-state-red]:[background:#ffe1e6]",
  "slate": "rq-state-slate [&.rq-state-slate]:text-[#50617b] [&.rq-state-slate]:[background:#e8edf5]"
}[estado.tono] || ""}  `}><i />{estado.nombre}</span></td>
            <td onClick={e => e.stopPropagation()}><div className="
              rq-row-actions flex items-center gap-[6px] [&_>_button]:inline-flex [&_>_button]:items-center
              [&_>_button]:justify-center [&_>_button]:w-[29px] [&_>_button]:h-[29px] [&_>_button]:rounded-[8px]
              [&_>_button]:text-[#6a86ae] [&_>_button]:bg-white [&_>_button]:text-[length:14px] [&_>_button]:border
              [&_>_button]:border-solid [&_>_button]:border-[#e7eef8] [&_>_button:hover]:text-[#6491d3]
              [&_>_button:hover]:[background:#f0f6ff] [&_>_button:hover]:border-[#cbdcf5]
            "><button className="[.rq-row-actions_&]:text-[#6084b7] [.rq-row-actions_&]:[background:#f7faff]" onClick={() => abrir(s)} disabled={ocupado} title="Ver detalle" aria-label={`Ver detalle de ${s.folio}`}><FiArrowRight /></button>{showAcciones && (editable ? <><button onClick={() => onEditar?.(s)} disabled={ocupado} aria-label={`Editar solicitud ${s.folio}`} title="Editar solicitud"><FiEdit3 /></button><button className="[.rq-row-actions_&:hover]:text-[#c9828c] [.rq-row-actions_&:hover]:[background:#fff5f6] [.rq-row-actions_&:hover]:border-[#f1d9df]" onClick={() => onEliminar?.(s)} disabled={ocupado} aria-label={`Eliminar solicitud ${s.folio}`} title="Eliminar solicitud"><FiTrash2 /></button></> : <span className="
              inline-flex items-center justify-center w-[29px] h-[29px] rounded-[8px] text-[#6a86ae] bg-white
              text-[length:14px] border border-solid border-[#e7eef8] [.rq-row-actions_&]:text-[#c0cbdb]
              [.rq-row-actions_&]:[background:#f8fafd] [.rq-row-actions_&]:border-[transparent]
            " title="Esta solicitud ya fue atendida; su edición y eliminación están bloqueadas" role="img" aria-label="Edición y eliminación bloqueadas"><FiLock /></span>)}</div></td>
          </tr>;
        })}
    </tbody></table></div>
    <div className="
      flex items-center justify-between gap-[15px] pt-4 pr-[23px] pb-4 pl-[23px] [border-top-width:1px]
      [border-top-style:solid] [border-top-color:#edf2f9] text-[#6e819c] text-[length:12px] max-[950.001px]:flex-wrap
      max-[650.001px]:gap-3 max-[650.001px]:pt-[15px] max-[650.001px]:pr-[18px] max-[650.001px]:pb-[15px]
      max-[650.001px]:pl-[18px] max-[650.001px]:flex-wrap [&_p_strong]:text-[#607b9e] [&_p_strong]:font-semibold
      [&_p_>_span]:text-[#7b8ba1] [&_p_>_span]:text-[length:11px] [&_nav]:flex [&_nav]:items-center [&_nav]:gap-[5px]
      max-[650.001px]:[&_nav]:flex-wrap [&_nav_button]:flex [&_nav_button]:items-center [&_nav_button]:justify-center
      [&_nav_button]:h-7 [&_nav_button]:min-w-7 [&_nav_button]:pt-0 [&_nav_button]:pr-[5px] [&_nav_button]:pb-0
      [&_nav_button]:pl-[5px] [&_nav_button]:text-[#6a85ac] [&_nav_button]:bg-white [&_nav_button]:rounded-[7px]
      [&_nav_button]:text-[length:12px] [&_nav_button]:border [&_nav_button]:border-solid
      [&_nav_button]:border-[#e8eff9] [&_nav_button:hover]:text-[#648ac5] [&_nav_button:hover]:[background:#f1f7ff]
      [&_nav_.is-current]:text-white [&_nav_.is-current]:[background:#789fda] [&_nav_.is-current]:border-[#789fda]
      max-[650.001px]:[&_>_p_>_span]:hidden
    "><p>Mostrando <strong>{filtrados.length ? inicio + 1 : 0}–{Math.min(inicio + entradas, filtrados.length)}</strong> de {filtrados.length}<span> · 10 por página</span></p><nav aria-label="Páginas del listado"><button disabled={paginaActual <= 1} onClick={() => setPagina(paginaActual - 1)} aria-label="Página anterior"><FiChevronLeft /></button>{paginas.map((p, i) => <span className="inline-flex items-center gap-[5px]" key={p}>{i > 0 && p - paginas[i - 1] > 1 && <span className="text-[#8a9ab1] pt-0 pr-[3px] pb-0 pl-[3px]">…</span>}<button className={p === paginaActual ? "is-current" : ""} aria-current={p === paginaActual ? 'page' : undefined} onClick={() => setPagina(p)}>{p}</button></span>)}<button disabled={paginaActual >= totalPaginas} onClick={() => setPagina(paginaActual + 1)} aria-label="Página siguiente"><FiChevronRight /></button></nav></div>
  </section>;
}