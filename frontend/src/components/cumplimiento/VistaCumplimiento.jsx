import {
    FiArrowRight, FiBox, FiCalendar, FiCheckCircle, FiChevronLeft, FiChevronRight,
    FiClock, FiCode, FiFilter, FiInfo, FiPackage, FiRefreshCw, FiUsers,
    FiAlertCircle, FiSun, FiMoon,
} from 'react-icons/fi';


const zona = 'America/Mexico_City';
const ilustracion = '/img/cumplimiento-warehouse-v1.png';
const porcentaje = valor => valor == null ? '—' : `${valor}%`;
const fecha = valor => valor ? new Date(valor).toLocaleString('es-MX', { timeZone: zona, dateStyle: 'short', timeStyle: 'short' }) : 'Sin registro';
const hora = valor => new Date(valor).toLocaleTimeString('es-MX', { timeZone: zona, hour: '2-digit', minute: '2-digit', hourCycle: 'h23' });
const prioridades = { 'muy alto': 'Muy alta', alto: 'Alta', moderado: 'Moderada' };
const resultados = ['a tiempo', 'en plazo', 'vencida', 'fuera de plazo', 'rechazada', 'sin seguimiento'];
const tonoResultado = valor => ({ 'a tiempo': 'green', 'en plazo': 'blue', vencida: 'red', 'fuera de plazo': 'amber' }[valor] || 'slate');
const iniciales = nombre => nombre.split(/[\s_]+/).filter(Boolean).slice(0, 2).map(p => p[0]).join('').toUpperCase();

function EncabezadoPanel({ icono, titulo, descripcion, extra }) {
    const Icono = icono;
    return <div className="
      flex items-center justify-between gap-3 pt-[21px] pr-[23px] pb-[21px] pl-[23px]
      [&&]:[background:linear-gradient(110deg,_#f0f5fd,_#fff)] max-[900.001px]:pt-[18px] max-[900.001px]:pr-[18px]
      max-[900.001px]:pb-[18px] max-[900.001px]:pl-[18px] max-[600.001px]:items-start max-[600.001px]:pt-[18px]
      max-[600.001px]:pr-[18px] max-[600.001px]:pb-[18px] max-[600.001px]:pl-[18px] [&_h2]:text-[length:14px]
      [&_h2]:font-bold [&_h2]:tracking-[-.01em] [&&_h2]:text-[#243f64] max-[600.001px]:[&_h2]:text-[length:14px]
      [&&_p]:text-[#5b6e87] [&_p]:text-[length:12px] [&_p]:mt-[3px]
    ">
        <div className="flex items-center gap-[11px]"><span className="flex items-center justify-center w-8 h-8 [&&]:[background:#e0ebfd] rounded-[10px] [&&]:text-[#245fc1] shrink-0 text-[length:16px] max-[600.001px]:hidden"><Icono /></span><div><h2>{titulo}</h2>{descripcion && <p>{descripcion}</p>}</div></div>
        {extra}
    </div>;
}

function TarjetaMetrica({ titulo, valor, icono, tono }) {
    const Icono = icono;
    return <article className={`
      [--cs-tone:#3b82f6] [--cs-tint:#eff5ff] relative flex flex-col
      [&&]:[background:linear-gradient(145deg,_#fff_58%,_#edf3fc)] rounded-[17px] pt-[19px] pr-[19px] pb-[17px]
      pl-[19px] [&&]:[box-shadow:var(--app-shadow)] [transition:transform_.2s,_box-shadow_.2s] overflow-hidden border
      border-solid [&&]:border-[#cddbef] max-[1200.001px]:pt-[17px] max-[1200.001px]:pr-[14px]
      max-[1200.001px]:pb-[15px] max-[1200.001px]:pl-[14px] before:[content:''] before:absolute before:top-0
      before:right-0 before:bottom-auto before:left-0 [&&::before]:h-1 before:[background:var(--cs-tone)]
      [&&::before]:opacity-[1] hover:[transform:translateY(-3px)] [&&:hover]:[box-shadow:0_13px_28px_#1737661c]
      [@media(prefers-reduced-motion:_reduce)]:[&&:hover]:[transform:none]
    ${{
  "green": "cs-tone-green [&.cs-tone-green]:[--cs-tone:#078065] [&.cs-tone-green]:[--cs-tint:#d7f4e8]",
  "blue": "cs-tone-blue [&.cs-tone-blue]:[--cs-tone:#2563db] [&.cs-tone-blue]:[--cs-tint:#deebff]",
  "red": "cs-tone-red [&.cs-tone-red]:[--cs-tone:#c43b50] [&.cs-tone-red]:[--cs-tint:#ffe1e6]",
  "amber": "cs-tone-amber [&.cs-tone-amber]:[--cs-tone:#b86c08] [&.cs-tone-amber]:[--cs-tint:#fff0cc]"
}[tono] || ""}  `}>
        <div className="flex gap-[9px] items-center max-[600.001px]:gap-[7px] max-[600.001px]:items-start"><span className="
          flex items-center justify-center shrink-0 w-8 h-8 [background:var(--cs-tint)] text-[var(--cs-tone)]
          rounded-[10px] text-[length:16px] max-[600.001px]:w-[26px] max-[600.001px]:h-[26px]
          max-[600.001px]:rounded-[8px] max-[600.001px]:text-[length:14px]
        "><Icono /></span><span className="[&&]:text-[#425977] text-[length:12px] [&&]:font-semibold leading-[1.5] max-[600.001px]:text-[length:12px]">{titulo}</span></div>
        <p className="
          text-[length:33px] font-[750] tracking-[-.045em] leading-[1.1] mt-4 mr-0 mb-[13px] ml-0 [&&]:text-[#142e53]
          max-[600.001px]:text-[length:30px] max-[600.001px]:mt-[13px]
        ">{valor}</p>
    </article>;
}

function Vacio({ titulo = 'No hay solicitudes con estos filtros', detalle = 'Amplía las fechas o elige otro responsable para explorar los resultados.' }) {
    return <div className="
      flex flex-col items-center justify-center text-center pt-[26px] pr-5 pb-[35px] pl-5 [&_>_img]:h-25
      [&_>_img]:w-[150px] [&_>_img]:object-contain [&_>_img]:mb-[13px] [&_h3]:text-[#7084a2] [&_h3]:font-semibold
      [&_h3]:text-[length:14px] [&_p]:text-[#a0adbf] [&_p]:text-[length:13px] [&_p]:mt-[7px] [&_p]:max-w-[350px]
      [&_p]:leading-[1.7]
    "><img src={ilustracion} alt="" loading="lazy" width="150" height="100" /><h3>{titulo}</h3><p>{detalle}</p></div>;
}

function AtencionAlmacen({ datos, setEstado, setPagina, setSeleccionada }) {
    const atrasadas = datos.filas.filter(f => f.cumplimiento === 'vencida')
        .sort((a, b) => new Date(a.limite) - new Date(b.limite) || a.id - b.id);
    const pendientes = datos.filas.filter(f => ['en plazo', 'vencida'].includes(f.cumplimiento)).length;
    const verPendientes = () => { setEstado('vencida'); setPagina(1); };
    return <section className="
      cs-attention [&.cs-attention]:grid [&.cs-attention]:grid-cols-[minmax(240px,_.85fr)_minmax(0,_1.55fr)]
      [&.cs-attention]:rounded-[20px] [&.cs-attention]:overflow-hidden [&.cs-attention]:bg-white
      [&.cs-attention]:[box-shadow:0_8px_24px_#17376612] [&.cs-attention]:border [&.cs-attention]:border-solid
      [&.cs-attention]:border-[#c4d5ed] max-[1000.001px]:[&.cs-attention]:grid-cols-[1fr]
    " aria-labelledby="cs-attention-title">
        <div className="
          pt-7 pr-7 pb-7 pl-7
          [background:radial-gradient(ellipse_at_100%_0,_#18759066,_transparent_70%),_linear-gradient(140deg,_#142e58,_#1a427e)]
          text-white flex flex-col items-start max-[1000.001px]:pt-6 max-[1000.001px]:pr-6 max-[1000.001px]:pb-6
          max-[1000.001px]:pl-6 [&_h2]:text-white [&_h2]:text-[length:24px] [&_h2]:font-[650] [&_h2]:leading-[1.3]
          [&_h2]:tracking-[-.025em] [&_h2]:mt-4 [&_h2]:mr-0 [&_h2]:mb-3 [&_h2]:ml-0 [&_h2]:max-w-75
          max-[1000.001px]:[&_h2]:max-w-none max-[600.001px]:[&_h2]:text-[length:22px] max-[600.001px]:[&_h2]:max-w-none
          [&_>_p]:text-[#d4e2f7] [&_>_p]:text-[length:13px] [&_>_p]:leading-[1.8] [&_>_p]:mb-6
        ">
            <span className="inline-flex items-center gap-2 text-[#9fe4f2] text-[length:11px] uppercase tracking-[.1em] font-[650]"><FiPackage />Atención del almacén</span>
            <h2 id="cs-attention-title">{atrasadas.length ? 'Cada pendiente tiene un siguiente paso.' : 'Las entregas, bajo control.'}</h2>
            <p>{atrasadas.length ? 'Estas solicitudes necesitan completar su entrega. Empieza por las que llevan más tiempo esperando.' : pendientes ? 'Hay solicitudes en preparación y todavía están dentro de su horario.' : 'No hay solicitudes con seguimiento pendientes de completar en esta selección.'}</p>
            <a className="
              inline-flex items-center justify-between gap-[14px] mt-auto [background:#ffffff13] text-white rounded-[9px]
              text-[length:12px] font-semibold pt-[11px] pr-[13px] pb-[11px] pl-[13px] no-underline border border-solid
              border-[#9bbde566] hover:[background:#ffffff25]
            " href="#solicitudes-surtido" onClick={verPendientes}>Ver solicitudes atrasadas <FiArrowRight /></a>
        </div>
        <div className="min-w-0 pt-6 pr-6 pb-6 pl-6 max-[600.001px]:pt-[18px] max-[600.001px]:pr-[18px] max-[600.001px]:pb-[18px] max-[600.001px]:pl-[18px]">
            <div className="
              flex justify-between items-center flex-wrap gap-[10px] mb-[15px] [&_h3]:text-[#2d4667]
              [&_h3]:text-[length:14px] [&_h3]:font-[650] [&_>_span]:text-[#8b3950] [&_>_span]:[background:#fff0f3]
              [&_>_span]:rounded-[6px] [&_>_span]:text-[length:11px] [&_>_span]:pt-1 [&_>_span]:pr-2 [&_>_span]:pb-1
              [&_>_span]:pl-2 [&_>_span]:border [&_>_span]:border-solid [&_>_span]:border-[#f0cdd6]
            "><h3>{atrasadas.length ? 'Las que llevan más tiempo esperando' : 'Sin entregas atrasadas'}</h3><span>{atrasadas.length} {atrasadas.length === 1 ? 'solicitud' : 'solicitudes'}</span></div>
            {atrasadas.length ? <ol className="
              list-none pt-0 pr-0 pb-0 pl-0 mt-0 mr-0 mb-0 ml-0 [&_>_li]:flex [&_>_li]:items-center [&_>_li]:gap-3
              [&_>_li]:pt-[17px] [&_>_li]:pr-0 [&_>_li]:pb-[17px] [&_>_li]:pl-0 [&_>_li]:[border-top-width:1px]
              [&_>_li]:[border-top-style:solid] [&_>_li]:[border-top-color:#e3ebf6] max-[600.001px]:[&_>_li]:gap-2
              [&_button]:inline-flex [&_button]:items-center [&_button]:gap-[7px] [&_button]:shrink-0
              [&_button]:text-[#2459a5] [&_button]:[background:#edf3fc] [&_button]:rounded-[8px] [&_button]:pt-2
              [&_button]:pr-[10px] [&_button]:pb-2 [&_button]:pl-[10px] [&_button]:text-[length:12px]
              [&_button]:font-semibold [&_button]:border [&_button]:border-solid [&_button]:border-[#ccdcf3]
              [&_button:hover]:[background:#dae8fc] [&_button:hover]:border-[#a9c4e9]
            ">{atrasadas.slice(0, 3).map(f => <li key={f.id}>
                <span className="
                  flex items-center justify-center shrink-0 w-9 h-[38px] rounded-[10px] [background:#edf3fc] text-[#3264a7]
                  text-[length:17px] border border-solid border-[#d5e2f6] max-[600.001px]:hidden
                "><FiBox /></span>
                <div className="
                  min-w-0 flex-1 [&_strong]:flex [&_strong]:flex-wrap [&_strong]:gap-[4px_12px] [&_strong]:text-[#243f64]
                  [&_strong]:text-[length:13px] [&_strong]:font-[650] [&_strong]:[overflow-wrap:anywhere]
                  [&_strong_>_span]:text-[length:12px] [&_strong_>_span]:font-medium [&_strong_>_span]:text-[#5a6d87]
                  [&_p]:text-[length:12px] [&_p]:leading-[1.6] [&_p]:text-[#60728c] [&_p]:mt-1
                "><strong>{f.folio}<span>{f.area}</span></strong><p>Entrega prevista: {fecha(f.limite)}</p></div>
                <button type="button" onClick={() => setSeleccionada(f)} aria-label={`Revisar solicitud ${f.folio}`}>Revisar <FiArrowRight /></button>
            </li>)}</ol> : <div className="
              flex flex-col items-center justify-center text-center min-h-[190px] pt-[22px] pr-[22px] pb-[22px] pl-[22px]
              [&_>_svg]:text-[#078065] [&_>_svg]:w-[35px] [&_>_svg]:h-[35px] [&_>_svg]:mb-3 [&_strong]:text-[#24496a]
              [&_strong]:text-[length:16px] [&_p]:max-w-80 [&_p]:text-[#60728c] [&_p]:text-[length:13px] [&_p]:leading-[1.7]
              [&_p]:mt-2
            "><FiCheckCircle /><strong>Todo al día</strong><p>Ninguna solicitud con seguimiento ha rebasado su horario sin completar la entrega.</p></div>}
            {atrasadas.length > 3 && <p className="[border-top-width:1px] [border-top-style:solid] [border-top-color:#e3ebf6] pt-3 text-[length:12px] text-[#60728c] leading-[1.6]">Mostrando las 3 más antiguas de {atrasadas.length} pendientes con atraso.</p>}
        </div>
    </section>;
}

function ProximoRango({ datos }) {
    const enCurso = new Date(datos.actualizado) >= new Date(datos.proxima.inicio) && new Date(datos.actualizado) < new Date(datos.proxima.limite);
    return <section className="
      flex items-center gap-3 rounded-[12px] [&&]:[background:#dfeafb] pt-[14px] pr-[18px] pb-[14px] pl-[18px]
      [&&]:text-[#224e88] [&&]:[box-shadow:0_3px_9px_#17376608] border border-solid [&&]:border-[#b7cdec]
      [&_>_svg]:shrink-0 [&_>_svg]:w-[19px] [&_>_svg]:h-[19px] [&_p]:flex [&_p]:flex-wrap [&_p]:items-baseline
      [&_p]:gap-[5px_16px] [&_p]:mt-0 [&_p]:mr-0 [&_p]:mb-0 [&_p]:ml-0 [&_p]:text-[length:13px] [&_p]:leading-[1.6]
      [&_strong]:font-semibold [&_span]:text-[#52637a]
    " aria-label="Horario de surtido">
        <FiClock aria-hidden="true" />
        <p><strong>{enCurso ? 'Horario de surtido en curso' : 'Próximo horario de surtido'}: {hora(datos.proxima.inicio)}–{hora(datos.proxima.limite)}</strong><span>{datos.proxima.turno} · {new Date(datos.proxima.inicio).toLocaleDateString('es-MX', { timeZone: zona, day: 'numeric', month: 'long' })}</span></p>
    </section>;
}

function TablaResponsables({ datos }) {
    return <section className="bg-white rounded-[18px] [&&]:[box-shadow:var(--app-shadow)] overflow-hidden border border-solid [&&]:border-[var(--app-line)]">
        <EncabezadoPanel icono={FiUsers} titulo="El equipo detrás de cada entrega" descripcion="Carga de trabajo y resultados por responsable" extra={<span className="
          [background:#f3f6fb] rounded-[7px] pt-[5px] pr-2 pb-[5px] pl-2 text-[#7c8fa9] text-[length:12px]
          whitespace-nowrap border border-solid border-[#ebf0f7] max-[600.001px]:pt-1 max-[600.001px]:pr-[6px]
          max-[600.001px]:pb-1 max-[600.001px]:pl-[6px] max-[600.001px]:text-[length:12px]
        ">{datos.grupos.length} responsables</span>} />
        {!datos.grupos.length ? <Vacio titulo="Tu equipo aparecerá aquí" /> : <div className="w-full overflow-x-auto [scrollbar-width:thin] [scrollbar-color:#c9d7ec_#f5f7fb]"><table className="
          cs-table cs-team-table w-full border-collapse text-left text-[length:13px] [&_th]:pt-3 [&_th]:pr-[19px]
          [&_th]:pb-3 [&_th]:pl-[19px] [&&_th]:[background:#e4edf9] [&_th]:[border-top-width:1px]
          [&_th]:[border-top-style:solid] [&_th]:[border-bottom-width:1px] [&_th]:[border-bottom-style:solid]
          [&_th]:text-[length:12px] [&&_th]:font-[650] [&_th]:whitespace-nowrap [&&_th]:text-[#284e7c]
          [&&_th]:border-[#cedcef] [&_td]:pt-4 [&_td]:pr-[19px] [&_td]:pb-4 [&_td]:pl-[19px]
          [&_td]:[border-bottom-width:1px] [&_td]:[border-bottom-style:solid] [&&_td]:[border-bottom-color:#e0e8f3]
          [&&_td]:text-[#435c7b] [&_td]:whitespace-nowrap [&_tbody_tr:last-child_td]:[border-bottom-width:0]
          [&_tbody_tr:last-child_td]:[border-bottom-style:solid]
          [&_tbody_tr:last-child_td]:[border-bottom-color:currentColor] [&_tbody_tr]:[transition:background_.2s]
          [&&_tbody_tr:hover]:[background:#eaf2ff] [&&_tbody_tr:nth-child(even)]:[background:#f7faff]
        ">
            <thead><tr>{['Responsable', 'Asignadas', 'Completas', 'Parciales', 'Vencidas', 'A tiempo', 'Completadas con atraso'].map(t => <th key={t} scope="col">{t}</th>)}</tr></thead>
            <tbody>{datos.grupos.map((g, i) => <tr key={g.id || 'sin'}>
                <td><div className="flex items-center gap-[10px] font-semibold text-[#4b6386]"><span className={`
                  flex items-center justify-center [background:#edf3fe] rounded-[50%] w-[33px] h-[33px] text-[#658acd]
                  text-[length:12px] shrink-0 [border-width:3px] border-solid border-[#f6f9ff]
                ${{
  "1": "cs-avatar-1 [&.cs-avatar-1]:text-[#9a82bc] [&.cs-avatar-1]:[background:#f4eefb] [&.cs-avatar-1]:border-[#faf7fd]",
  "2": "cs-avatar-2 [&.cs-avatar-2]:text-[#699e90] [&.cs-avatar-2]:[background:#eaf6f0] [&.cs-avatar-2]:border-[#f4fbf7]"
}[i % 3] || ""}  `}>{g.id ? iniciales(g.nombre) : <FiUsers />}</span><span>{g.nombre}</span></div></td>
                <td className="[.cs-table_&]:font-bold [.cs-table_&]:text-[#38557d]">{g.total}</td><td><span className="cs-number-green [&.cs-number-green]:text-[#42a38b] [&.cs-number-green]:font-[650]">{g.completas}</span></td><td>{g.parciales}</td>
                <td><span className={g.vencidas ? "text-[#cb797d] [background:#fff1f1] rounded-[6px] pt-1 pr-2 pb-1 pl-2 font-[650]" : ""}>{g.vencidas}</span></td>
                <td><div className="cs-table-progress flex flex-col gap-[6px] min-w-[66px] [&_strong]:text-[#5b779e] [&_strong]:text-[length:12px] [&_strong]:font-[650]"><strong>{porcentaje(g.cumplimiento)}</strong><div className="
                  h-[5px] rounded-[100px] [background:#edf1f7] overflow-hidden [&_>_span]:block [&_>_span]:h-full
                  [&_>_span]:rounded-[inherit] [&_>_span]:[background:var(--cs-tone,_#4386ef)]
                  [&_>_span]:[transition:width_.5s_ease] [.cs-table-progress_&]:h-1 [.cs-table-progress_&]:w-[62px]
                  [.cs-table-progress_&_>_span]:[background:#6d9be2]
                " aria-hidden="true"><span style={{ width: `${g.cumplimiento || 0}%` }} /></div></div></td>
                <td>{g.fueraDePlazo}</td>
            </tr>)}</tbody>
        </table></div>}
        <div className="
          flex items-start gap-[7px] pt-[14px] pr-[23px] pb-[14px] pl-[23px] [&&]:text-[#5b6f89] text-[length:12px]
          leading-[1.6] [border-top-width:1px] [border-top-style:solid] [border-top-color:#f0f3f8] [background:#fefeff]
          [&_>_svg]:shrink-0 [&_>_svg]:mt-[2px]
        "><FiInfo /><p>La carga corresponde al responsable actual. Las reasignaciones conservan su historial.</p></div>
    </section>;
}

function TablaSolicitudes({ filas, estado, setEstado, paginaActual, paginas, setPagina, setSeleccionada }) {
    return <section id="solicitudes-surtido" className="bg-white rounded-[18px] [&&]:[box-shadow:var(--app-shadow)] overflow-hidden [scroll-margin-top:20px] border border-solid [&&]:border-[var(--app-line)]">
        <EncabezadoPanel icono={FiBox} titulo="Explora las solicitudes" descripcion="Ordenadas por prioridad y antigüedad" extra={<span className="
          [background:#f3f6fb] rounded-[7px] pt-[5px] pr-2 pb-[5px] pl-2 text-[#7c8fa9] text-[length:12px]
          whitespace-nowrap border border-solid border-[#ebf0f7] max-[600.001px]:pt-1 max-[600.001px]:pr-[6px]
          max-[600.001px]:pb-1 max-[600.001px]:pl-[6px] max-[600.001px]:text-[length:12px]
        ">{filas.length} solicitudes</span>} />
        <div className="
          [&_select]:w-auto [&_select]:min-w-0 [&_select]:[background:#fbfcfe] [&_select]:rounded-[8px]
          [&_select]:pt-[6px] [&_select]:pr-[10px] [&_select]:pb-[6px] [&_select]:pl-[10px] [&_select]:text-[#425675]
          [&_select]:text-[length:12px] [&_select]:font-medium [&_select]:mt-0 [&_select]:h-[33px] [&_select]:max-w-full
          [&_select]:mr-0 [&_select]:mb-0 [&_select]:ml-0 [&_select]:border [&_select]:border-solid
          [&_select]:border-[#e3eaf3] flex flex-wrap items-center gap-[10px] pt-0 pr-[23px] pb-[19px] pl-[23px]
          max-[600.001px]:pt-0 max-[600.001px]:pr-[18px] max-[600.001px]:pb-[15px] max-[600.001px]:pl-[18px]
          [&_>_label]:inline-flex [&_>_label]:items-center [&_>_label]:gap-[6px] [&_>_label]:text-[length:12px]
          [&_>_label]:text-[#7a8da8] [&_>_span]:ml-auto [&&_>_span]:text-[#5b6f89] [&_>_span]:text-[length:12px]
          max-[600.001px]:[&_>_span]:ml-0 max-[600.001px]:[&_>_span]:w-full
        "><label htmlFor="cs-resultado"><FiFilter />Resultado</label><select id="cs-resultado" value={estado} onChange={e => { setEstado(e.target.value); setPagina(1); }}><option value="">Todos los resultados</option>{resultados.map(e => <option key={e} value={e}>{e.charAt(0).toUpperCase() + e.slice(1)}</option>)}</select><span>Este filtro aplica solo al detalle.</span></div>
        {!filas.length ? <Vacio /> : <div className="w-full overflow-x-auto [scrollbar-width:thin] [scrollbar-color:#c9d7ec_#f5f7fb]"><table className="
          cs-table cs-requests-table w-full border-collapse text-left text-[length:13px] [&_th]:pt-3 [&_th]:pr-[19px]
          [&_th]:pb-3 [&_th]:pl-[19px] [&&_th]:[background:#e4edf9] [&_th]:[border-top-width:1px]
          [&_th]:[border-top-style:solid] [&_th]:[border-bottom-width:1px] [&_th]:[border-bottom-style:solid]
          [&_th]:text-[length:12px] [&&_th]:font-[650] [&_th]:whitespace-nowrap [&&_th]:text-[#284e7c]
          [&&_th]:border-[#cedcef] [&_td]:pt-4 [&_td]:pr-[19px] [&_td]:pb-4 [&_td]:pl-[19px]
          [&_td]:[border-bottom-width:1px] [&_td]:[border-bottom-style:solid] [&&_td]:[border-bottom-color:#e0e8f3]
          [&&_td]:text-[#435c7b] [&_td]:whitespace-nowrap [&_tbody_tr:last-child_td]:[border-bottom-width:0]
          [&_tbody_tr:last-child_td]:[border-bottom-style:solid]
          [&_tbody_tr:last-child_td]:[border-bottom-color:currentColor] [&_tbody_tr]:[transition:background_.2s]
          [&&_tbody_tr:hover]:[background:#eaf2ff] [&&_tbody_tr:nth-child(even)]:[background:#f7faff]
        ">
            <thead><tr>{['Solicitud / área', 'Prioridad', 'Responsable', 'Rango asignado', 'Estado', 'Cumplimiento', 'Atraso', 'Detalle'].map(t => <th key={t} scope="col">{t}</th>)}</tr></thead>
            <tbody>{filas.slice((paginaActual - 1) * 25, paginaActual * 25).map(f => <tr key={f.id}>
                <td><div className="
                  flex items-center gap-[9px] [&_strong]:text-[#476184] [&_strong]:text-[length:12px] [&_strong]:font-[650]
                  [&_strong]:whitespace-normal [&_strong]:[overflow-wrap:anywhere] [&_strong]:block [&_strong]:min-w-[110px]
                  [&_strong]:max-w-[175px] [&_p]:text-[#9ca8ba] [&_p]:text-[length:12px] [&_p]:mt-[3px] [&_p]:whitespace-normal
                  [&_p]:max-w-[170px]
                "><span className="flex items-center justify-center w-[30px] h-[33px] [&&]:text-[#245fc1] [&&]:[background:#e0ebfd] rounded-[9px] text-[length:15px] shrink-0"><FiPackage /></span><div><strong>{f.folio}</strong><p>{f.area}</p></div></div></td>
                <td><span className={`
                  inline-flex items-center gap-[5px] rounded-[6px] pt-1 pr-[7px] pb-1 pl-[7px] text-[length:12px] font-[550]
                  [&_i]:w-1 [&_i]:h-1 [&_i]:rounded-[50%] [&_i]:[background:currentColor] [&_i]:shrink-0
                ${{
  "high": "cs-priority-badge-high [&.cs-priority-badge-high]:text-[#6436a5] [&.cs-priority-badge-high]:[background:#eee3ff]",
  "medium": "cs-priority-badge-medium [&.cs-priority-badge-medium]:text-[#2055b0] [&.cs-priority-badge-medium]:[background:#deebff]",
  "low": "cs-priority-badge-low [&.cs-priority-badge-low]:text-[#086b51] [&.cs-priority-badge-low]:[background:#d7f4e8]"
}[f.prioridad === 'muy alto' ? 'high' : f.prioridad === 'alto' ? 'medium' : 'low'] || ""}  `}><i />{prioridades[f.prioridad] || f.prioridad}</span></td>
                <td><span className={f.responsableId ? "" : "[&&]:text-[#5b6f89] text-[length:12px]"}>{f.responsable}</span></td>
                <td><div className="
                  flex flex-col gap-[2px] text-[length:12px] text-[#9aa8bb] [&_>_strong]:text-[#7184a1] [&_>_strong]:font-[550]
                  [&_>_strong]:text-[length:12px] [&_>_strong]:mb-[2px]
                "><strong>{f.turno}</strong><span>{fecha(f.inicio)}</span><span>Hasta {fecha(f.limite)}</span></div></td>
                <td><span className="[&&]:text-[#5b6f89] text-[length:12px]">{f.status}</span></td>
                <td><span className={`
                  [&_i]:w-1 [&_i]:h-1 [&_i]:rounded-[50%] [&_i]:[background:currentColor] [&_i]:shrink-0 inline-flex items-center
                  gap-[5px] pt-[5px] pr-2 pb-[5px] pl-2 rounded-[6px] text-[length:12px] whitespace-nowrap
                ${{
  "green": "cs-result-green [&.cs-result-green]:[background:#d7f4e8] [&.cs-result-green]:text-[#086b51]",
  "blue": "cs-result-blue [&.cs-result-blue]:[background:#deebff] [&.cs-result-blue]:text-[#2055b0]",
  "red": "cs-result-red [&.cs-result-red]:[background:#ffe1e6] [&.cs-result-red]:text-[#ab2940]",
  "amber": "cs-result-amber [&.cs-result-amber]:[background:#fff0cc] [&.cs-result-amber]:text-[#8a570b]",
  "slate": "cs-result-slate [&.cs-result-slate]:[background:#e8edf5] [&.cs-result-slate]:text-[#50617b]"
}[tonoResultado(f.cumplimiento)] || ""}  `}><i />{f.cumplimiento}</span></td>
                <td><span className={['vencida', 'fuera de plazo'].includes(f.cumplimiento) ? "text-[#c68c80] text-[length:12px]" : "[&&]:text-[#5b6f89] text-[length:12px]"}>{['vencida', 'fuera de plazo'].includes(f.cumplimiento) ? `${f.minutosAtraso} min` : '—'}</span></td>
                <td><button className="
                  flex items-center justify-center w-7 h-7 text-[#6d97d3] [background:#f9fbff] rounded-[8px] border border-solid
                  border-[#e6edf8] hover:text-white hover:[background:#3b7de0] hover:[transform:translateX(2px)]
                  hover:border-[#3b7de0]
                " onClick={() => setSeleccionada(f)} aria-label={`Ver y gestionar solicitud ${f.folio}`}><FiArrowRight /></button></td>
            </tr>)}</tbody>
        </table></div>}
        <div className="
          flex items-center justify-between pt-[15px] pr-[23px] pb-[15px] pl-[23px] [border-top-width:1px]
          [border-top-style:solid] [border-top-color:#edf1f7] text-[#96a3b7] text-[length:12px] max-[600.001px]:pt-[13px]
          max-[600.001px]:pr-[13px] max-[600.001px]:pb-[13px] max-[600.001px]:pl-[13px]
          max-[600.001px]:text-[length:12px] max-[600.001px]:gap-2 [&_>_div]:flex [&_>_div]:items-center [&_>_div]:gap-3
          max-[600.001px]:[&_>_div]:gap-[7px] [&_button]:flex [&_button]:items-center [&_button]:justify-center
          [&_button]:w-[26px] [&_button]:h-[26px] [&_button]:rounded-[7px] [&_button]:bg-white [&_button]:text-[#7293c4]
          [&_button]:border [&_button]:border-solid [&_button]:border-[#e5ecf6]
          [&_button:hover:not(:disabled)]:[background:#eef4ff]
        "><span>{filas.length ? `${(paginaActual - 1) * 25 + 1}–${Math.min(paginaActual * 25, filas.length)} de ${filas.length}` : '0 solicitudes'}</span><div><button aria-label="Página anterior" disabled={paginaActual <= 1} onClick={() => setPagina(paginaActual - 1)}><FiChevronLeft /></button><span>Página {paginaActual} de {paginas}</span><button aria-label="Página siguiente" disabled={paginaActual >= paginas} onClick={() => setPagina(paginaActual + 1)}><FiChevronRight /></button></div></div>
    </section>;
}

function Reglas({ datos }) {
    return <details className="
      cs-rules bg-white rounded-[13px] border border-solid border-[var(--cs-line)] [&_summary]:flex
      [&_summary]:items-center [&_summary]:justify-between [&_summary]:gap-[10px] [&_summary]:pt-[17px]
      [&_summary]:pr-[22px] [&_summary]:pb-[17px] [&_summary]:pl-[22px] [&_summary]:cursor-pointer
      [&_summary]:list-none [&_summary]:text-[length:13px] [&_summary]:text-[#6e83a2]
      [&_summary::-webkit-details-marker]:hidden [&_summary_>_span]:inline-flex [&_summary_>_span]:items-center
      [&_summary_>_span]:gap-[9px]
    "><summary><span><FiClock />Horarios y reglas de medición</span><span className="text-[#9baac0] text-[length:12px] max-[600.001px]:hidden! [.cs-rules[open]_&_svg]:[transform:rotate(90deg)]">Consultar <FiChevronRight /></span></summary>
        <div className="pt-0 pr-[23px] pb-[22px] pl-[23px] text-[length:13px] text-[#8091aa] leading-[1.8] [&_>_p]:mt-[13px]"><div className="
          grid grid-cols-[repeat(3,_minmax(0,_1fr))] gap-[15px] pt-[7px] max-[600.001px]:grid-cols-[1fr]
          [&_>_div]:rounded-[10px] [&_>_div]:[background:#f7f9fd] [&_>_div]:pt-[13px] [&_>_div]:pr-4 [&_>_div]:pb-[13px]
          [&_>_div]:pl-4 [&_h3]:flex [&_h3]:items-center [&_h3]:gap-[7px] [&_h3]:font-[650] [&_h3]:text-[#6982a6]
          [&_h3]:mb-[6px] [&_p_>_span]:text-[#c2cbd9] [&_p_>_span]:mt-0 [&_p_>_span]:mr-[5px] [&_p_>_span]:mb-0
          [&_p_>_span]:ml-[5px]
        ">{['Matutino', 'Vespertino', 'Nocturno'].map(t => <div key={t}><h3>{t === 'Nocturno' ? <FiMoon /> : <FiSun />}{t}</h3>{datos.horarios.filter(h => h[0] === t).map(h => <p key={h[1]}>{h[1]} <span>—</span> {h[2]}</p>)}</div>)}</div>
            <p>Fuera de horario se asigna el siguiente rango, incluso al día siguiente. Dentro del rango se asigna el actual, sin minutos de corte. El inicio está incluido y el final es exclusivo. Todas las prioridades respetan los mismos horarios, todos los días, en Ciudad de México.</p>
            <p>Se permite preparar fuera de horario; las entregas completas y parciales se registran en rangos permitidos. El rol desarrollo puede registrar excepciones, que quedan en el historial con su hora real. Una entrega en un rango posterior conserva su atraso, expresado en minutos naturales.</p>
            <p>El periodo se filtra por fecha límite. El cumplimiento incluye pendientes vencidas y excluye rechazadas y solicitudes sin seguimiento. Las {datos.metricas.sinSeguimiento} solicitudes sin seguimiento y {datos.metricas.rechazadas} rechazadas de esta selección quedan fuera de la evaluación.</p>
            <p>Las solicitudes antiguas activas comienzan su seguimiento al asignarlas o atenderlas, conservando el límite calculado desde su creación. La entrega completa compara completas con todas las evaluables del periodo, aunque su límite todavía no venza.</p>
        </div>
    </details>;
}

export default function VistaCumplimiento({ datos, auth, filtros, cambiar, cargar, cargando, error, filas, estado, setEstado, paginaActual, paginas, setPagina, setSeleccionada, children }) {
    const metricas = datos?.metricas;
    const aTiempo = datos?.filas.filter(f => f.cumplimiento === 'a tiempo').length || 0;
    const otrasSolicitudes = datos ? [
        [datos.filas.filter(f => f.cumplimiento === 'en plazo').length, 'pendientes dentro de su plazo'],
        [metricas.rechazadas, 'rechazadas'],
        [metricas.sinSeguimiento, 'sin seguimiento registrado'],
    ].filter(([cantidad]) => cantidad > 0).map(([cantidad, texto]) => `${cantidad} ${texto}`).join(' · ') : '';
    return <div className="
      [--cs-ink:#152b4b] [--cs-blue:#2563eb] [--cs-muted:#718096] [&&]:[--cs-line:var(--app-line)]
      [&&]:text-[var(--app-ink)]
      [&&]:[background:radial-gradient(ellipse_at_100%_0,_#dbe8fb_0,_transparent_45%),_#edf2f8] mt-0 mr-[-24px]
      mb-[-24px] ml-[-24px] pt-[26px] pr-[clamp(18px,_2.6vw,_40px)] pb-[30px] pl-[clamp(18px,_2.6vw,_40px)]
      min-h-full text-[length:14px] [&&]:[--db-line:var(--app-line)] [&&]:[--rq-line:var(--app-line)]
      [&&]:[--ad-line:var(--app-line)] min-[1600px]:pr-[max(32px,_calc((100%_-_1500px)_/_2))]
      min-[1600px]:pl-[max(32px,_calc((100%_-_1500px)_/_2))] max-[600.001px]:pt-5 max-[600.001px]:pr-4
      max-[600.001px]:pb-7 max-[600.001px]:pl-4
      [&_button]:[transition:background_.2s,_border-color_.2s,_box-shadow_.2s,_transform_.2s]
      [&_button]:cursor-pointer [&_a]:[transition:background_.2s,_border-color_.2s,_box-shadow_.2s,_transform_.2s]
      [&_select]:[transition:background_.2s,_border-color_.2s,_box-shadow_.2s,_transform_.2s]
      [&_input]:[transition:background_.2s,_border-color_.2s,_box-shadow_.2s,_transform_.2s]
      [&_button:disabled]:opacity-[.45] [&_button:disabled]:cursor-default
      [&_button:focus-visible]:[outline:3px_solid_#93baff] [&_button:focus-visible]:[outline-offset:3px]
      [&_a:focus-visible]:[outline:3px_solid_#93baff] [&_a:focus-visible]:[outline-offset:3px]
      [&_select:focus-visible]:[outline:3px_solid_#93baff] [&_select:focus-visible]:[outline-offset:3px]
      [&_input:focus-visible]:[outline:3px_solid_#93baff] [&_input:focus-visible]:[outline-offset:3px]
      [@media(prefers-reduced-motion:_reduce)]:[&_*]:animate-none!
      [@media(prefers-reduced-motion:_reduce)]:[&_*]:[transition:none]!
      [@media(prefers-reduced-motion:_reduce)]:[&_*]:[scroll-behavior:auto]!
      [@media(prefers-reduced-motion:_reduce)]:[&_*::after]:animate-none!
      [@media(prefers-reduced-motion:_reduce)]:[&_*::after]:[transition:none]!
      [@media(prefers-reduced-motion:_reduce)]:[&_*::after]:[scroll-behavior:auto]!
    ">
        <div className="flex items-center justify-between gap-4 mb-[22px] max-[600.001px]:gap-2 max-[600.001px]:mb-[15px]"><div className="
          flex items-center gap-[10px] text-[length:14px] [&&]:text-[#5b6f89] max-[600.001px]:gap-[6px]
          max-[600.001px]:text-[length:12px] [&_>_svg:first-child]:text-[length:18px]
          [&_>_svg:first-child]:text-[#5478b1] [&_strong]:text-[#52647e] [&_strong]:font-medium
          max-[600.001px]:[&_>_span]:hidden
        "><FiPackage /><span>Almacén</span><FiChevronRight /><strong>Seguimiento de entregas</strong></div><button className="
          inline-flex items-center justify-center gap-2 bg-white rounded-[10px] [&&]:text-[#25569c] pt-[9px] pr-[14px]
          pb-[9px] pl-[14px] font-semibold text-[length:14px] [&&]:[box-shadow:0_3px_8px_#1737660b] border border-solid
          [&&]:border-[#c0d1eb] max-[600.001px]:pt-2 max-[600.001px]:pr-[10px] max-[600.001px]:pb-2
          max-[600.001px]:pl-[10px] max-[600.001px]:text-[length:12px] hover:[background:#edf4ff] hover:border-[#afc9f0]
        " disabled={cargando} onClick={() => cargar()}><FiRefreshCw className={cargando ? "animate-cs-spin" : ""} />{cargando ? 'Actualizando…' : 'Actualizar'}</button></div>
        <header className="
          cs-hero relative grid grid-cols-[1.1fr_1fr] items-center [&&&]:min-h-60 [&&&]:pt-[22px] [&&&]:pr-8
          [&&&]:pb-[22px] [&&&]:pl-8
          [&&&]:[background:radial-gradient(ellipse_at_88%_30%,_#176aab80,_transparent_58%),_linear-gradient(115deg,_#102d59,_#1c468b_68%,_#15588e)]
          rounded-[24px] overflow-hidden isolate [&&&]:[box-shadow:0_16px_34px_#15396826,_inset_0_1px_#ffffff24] border
          border-solid [&&&]:border-[#275899] max-[1200.001px]:[&&&]:pt-[22px] max-[1200.001px]:[&&&]:pr-8
          max-[1200.001px]:[&&&]:pb-[22px] max-[1200.001px]:[&&&]:pl-8 max-[900.001px]:grid-cols-[1.15fr_1fr]
          max-[900.001px]:[&&&]:min-h-60 max-[900.001px]:gap-2 max-[600.001px]:grid-cols-[1fr]
          max-[600.001px]:[&&&]:min-h-auto max-[600.001px]:[&&&]:pt-5 max-[600.001px]:[&&&]:pr-5
          max-[600.001px]:[&&&]:pb-5 max-[600.001px]:[&&&]:pl-5 max-[600.001px]:gap-2
          max-[650.001px]:grid-cols-[1.15fr_1fr] max-[650.001px]:[&&&]:min-h-auto max-[650.001px]:[&&&]:pt-5
          max-[650.001px]:[&&&]:pr-5 max-[650.001px]:[&&&]:pb-5 max-[650.001px]:[&&&]:pl-5 max-[650.001px]:gap-2
          after:[content:''] after:absolute after:w-[390px] after:h-[390px] after:rounded-[50%] after:right-[-58px]
          after:top-[-185px] after:z-[-1] after:[box-shadow:0_0_0_55px_#ffffff1a,_0_0_0_110px_#ffffff12] after:border
          after:border-solid after:border-[#ffffff6b] [&_h1]:mt-3 [&_h1]:mr-0 [&_h1]:mb-3 [&_h1]:ml-0
          [&_h1]:text-[length:clamp(28px,_2.8vw,_39px)] [&_h1]:font-[750] [&_h1]:leading-[1.13] [&_h1]:tracking-[-.035em]
          [&&_h1]:text-white max-[900.001px]:[&_h1]:text-[length:29px] max-[600.001px]:[&_h1]:text-[length:30px]
          [&&_h1_>_span]:text-[#4be0ed]
        ">
            <div className="[&&_>_p]:text-[#d7e6fc] [&_>_p]:text-[length:14px] [&_>_p]:leading-[1.75] max-[900.001px]:[&_>_p]:text-[length:14px] max-[600.001px]:max-w-[82%]"><span className="
              inline-flex items-center gap-[7px] text-[#42669a] text-[length:12px] font-bold tracking-[.14em] uppercase
              [&_>_span]:w-[6px] [&_>_span]:h-[6px] [&&_>_span]:[background:#44daeb] [&_>_span]:rounded-[50%]
              [&&_>_span]:[box-shadow:0_0_0_4px_#44daeb20] [.db-hero_&&]:text-[#a9edfa] [.rq-hero_&&]:text-[#a9edfa]
              [.ad-hero_&&]:text-[#a9edfa] [.cs-hero_&&]:text-[#a9edfa]
            "><span />Operación de almacén</span><h1>Cumplimiento<br />de surtido<span>.</span></h1><p>Tus entregas, tu equipo y cada horario.<br className="max-[900.001px]:hidden" /> Todo en un mismo lugar.</p><a href="#solicitudes-surtido" className="inline-flex gap-[13px] items-center [&&]:text-[#bcf1ff] font-[650] text-[length:14px] [&&]:mt-[14px] no-underline hover:gap-[18px] [&&:hover]:text-white">Explorar solicitudes <FiArrowRight /></a></div>
            <div className="
              relative self-stretch flex items-center justify-center min-w-0 max-[600.001px]:absolute max-[600.001px]:w-[53%]
              max-[600.001px]:right-[-30px] max-[600.001px]:bottom-[-5px] max-[600.001px]:opacity-[.48]
              max-[600.001px]:z-[-1] [&_>_img]:relative [&&_>_img]:w-[min(100%,_360px)] [&_>_img]:max-w-none [&_>_img]:h-auto
              [&&_>_img]:object-contain [&_>_img]:z-[1] [&&_>_img]:[filter:drop-shadow(0_20px_16px_#061b4152)]
              [&_>_img]:animate-cs-art-in [&&_>_img]:max-h-[210px] max-[900.001px]:[&&_>_img]:w-[min(100%,_360px)]
            " aria-hidden="true"><div className="absolute w-[78%] [aspect-ratio:1] max-h-60 rounded-[50%] [&&]:[background:radial-gradient(circle,_#65c8fb45,_transparent_70%)]" /><img src={ilustracion} alt="" width="1536" height="1024" fetchPriority="high" /><span className="
              absolute bottom-[-6px] right-[12px] z-[2] inline-flex items-center gap-[7px] rounded-[9px]
              [background:#ffffffde] pt-[9px] pr-3 pb-[9px] pl-3 [box-shadow:0_6px_20px_#2e548b0b] text-[length:12px]
              text-[#48658b] [backdrop-filter:blur(8px)] border border-solid border-[#ffffffd9] max-[900.001px]:bottom-0
              max-[900.001px]:right-[-10px] max-[900.001px]:pt-[7px] max-[900.001px]:pr-[7px] max-[900.001px]:pb-[7px]
              max-[900.001px]:pl-[7px] max-[900.001px]:text-[length:12px] max-[600.001px]:bottom-0
              max-[600.001px]:right-[-10px] max-[600.001px]:hidden max-[600.001px]:pt-[7px] max-[600.001px]:pr-[7px]
              max-[600.001px]:pb-[7px] max-[600.001px]:pl-[7px] [&_svg]:text-[#2d9c7d] [&_svg]:text-[length:14px]
            "><FiCheckCircle />Cada entrega cuenta</span></div>
        </header>
        {auth.rol === 'desarrollo' && <div className="
          flex items-center gap-[9px] text-[#947036] text-[length:13px] pt-3 pr-[3px] pb-0 pl-[3px]
          max-[600.001px]:text-[length:12px] max-[600.001px]:leading-[1.7] [&_>_svg]:shrink-0
          [&_>_svg]:text-[length:16px] [&_strong]:font-[650]
        "><FiCode /><p><strong>Desarrollo activo</strong><span> · Entregas fuera de horario habilitadas. Las excepciones conservan su hora real en el historial.</span></p></div>}
        <section className="
          bg-white rounded-[17px] pt-[18px] pr-[22px] pb-[14px] pl-[22px] mt-[23px] [&&]:[box-shadow:var(--app-shadow)]
          border border-solid [&&]:border-[var(--app-line)] max-[600.001px]:pt-4 max-[600.001px]:pr-4
          max-[600.001px]:pb-4 max-[600.001px]:pl-4
        " aria-label="Filtros de cumplimiento">
            <div className="
              flex justify-between items-center gap-3 mb-[17px] [&_>_span]:flex [&_>_span]:gap-2 [&_>_span]:items-center
              [&_>_span]:font-[650] [&_>_span]:text-[length:14px] [&_>_span]:text-[#415775] [&_>_span_svg]:text-[#4c7dc7]
              [&_small]:inline-flex [&_small]:items-center [&_small]:gap-[5px] [&_small]:text-[length:12px]
              [&&_small]:text-[#5b6f89] max-[600.001px]:[&_small]:hidden
            "><span><FiFilter />Tu vista de operación</span><small><FiClock />Actualización cada minuto</small></div>
            <div className="
              grid grid-cols-[repeat(2,_minmax(0,_1fr))_minmax(0,_1.3fr)_repeat(2,_minmax(0,_1fr))] gap-[14px]
              max-[1200.001px]:grid-cols-[repeat(3,_minmax(0,_1fr))] max-[600.001px]:grid-cols-[repeat(2,_minmax(0,_1fr))]
              max-[600.001px]:gap-[11px] [&_label]:block [&_label]:min-w-0 [&_label]:text-[#77869a]
              [&_label]:text-[length:12px] [&_label]:font-semibold [&_input]:w-full [&_input]:min-w-0
              [&&_input]:[background:#f8faff] [&_input]:rounded-[8px] [&_input]:pt-[10px] [&_input]:pr-[11px]
              [&_input]:pb-[10px] [&_input]:pl-[11px] [&&_input]:text-[#284564] [&_input]:text-[length:13px]
              [&_input]:font-medium [&_input]:mt-[6px] [&_input]:h-[39px] [&_input]:border [&_input]:border-solid
              [&&_input]:border-[#bfcee3] [&_select]:w-full [&_select]:min-w-0 [&&_select]:[background:#f8faff]
              [&_select]:rounded-[8px] [&_select]:pt-[10px] [&_select]:pr-[11px] [&_select]:pb-[10px] [&_select]:pl-[11px]
              [&&_select]:text-[#284564] [&_select]:text-[length:13px] [&_select]:font-medium [&_select]:mt-[6px]
              [&_select]:h-[39px] [&_select]:border [&_select]:border-solid [&&_select]:border-[#bfcee3]
              [&_input:hover]:border-[#abc7ed] [&_select:hover]:border-[#abc7ed]
              max-[600.001px]:[&_label:nth-child(3)]:[grid-column:1_/_-1]
            ">
                <label>Desde<div className="
                  relative [&_>_svg]:absolute [&_>_svg]:top-[18px] [&_>_svg]:left-[10px] [&_>_svg]:w-[13px]
                  [&_>_svg]:text-[#8a9db8] [&_>_svg]:pointer-events-none [&_input]:pl-[29px]
                "><FiCalendar /><input type="date" value={filtros.desde} onChange={e => cambiar('desde', e.target.value)} /></div></label>
                <label>Hasta<div className="
                  relative [&_>_svg]:absolute [&_>_svg]:top-[18px] [&_>_svg]:left-[10px] [&_>_svg]:w-[13px]
                  [&_>_svg]:text-[#8a9db8] [&_>_svg]:pointer-events-none [&_input]:pl-[29px]
                "><FiCalendar /><input type="date" value={filtros.hasta} onChange={e => cambiar('hasta', e.target.value)} /></div></label>
                <label>Responsable<select value={filtros.responsable} onChange={e => cambiar('responsable', e.target.value)}><option value="">Todo el equipo</option><option value="sin-asignar">Sin asignar</option>{datos?.responsables.map(r => <option key={r.id} value={r.id}>{r.user}</option>)}</select></label>
                <label>Prioridad<select value={filtros.prioridad} onChange={e => cambiar('prioridad', e.target.value)}><option value="">Todas las prioridades</option>{Object.entries(prioridades).map(([valor, texto]) => <option key={valor} value={valor}>{texto}</option>)}</select></label>
                <label>Turno<select value={filtros.turno} onChange={e => cambiar('turno', e.target.value)}><option value="">Todos los turnos</option>{['Matutino', 'Vespertino', 'Nocturno'].map(t => <option key={t}>{t}</option>)}</select></label>
            </div><p className="flex items-center gap-[5px] mt-3 text-[length:12px] [&&]:text-[#5b6f89]"><FiInfo />Las fechas corresponden al límite de surtido de cada solicitud.</p>
        </section>
        {error && <p role="alert" className="
          flex items-center gap-2 [background:#fff0f0] text-[#b65d64] pt-[14px] pr-[18px] pb-[14px] pl-[18px] mt-[18px]
          rounded-[12px] text-[length:14px] border border-solid border-[#f5dddd]
        "><FiAlertCircle />{error}</p>}
        {!datos && cargando && <div className="flex items-center justify-center gap-[9px] pt-[35px] pr-[35px] pb-[35px] pl-[35px] text-[#7e96b8] text-[length:14px]" role="status"><FiRefreshCw className="animate-cs-spin" />Preparando tu panorama de operación…</div>}
        {datos && <div className={` flex flex-col gap-[22px] [transition:opacity_.2s] ${cargando ? " cs-data-loading [&.cs-data-loading]:opacity-[.6]" : ""}  `} aria-busy={cargando}>
            <div className="
              flex justify-between items-center gap-3 mt-[25px] mb-[-6px] max-[600.001px]:items-start
              [&_h2]:text-[length:15px] [&_h2]:font-bold [&_h2]:tracking-[-.02em] [&_>_span]:text-[length:12px]
              [&_>_span]:text-[#8c9aaf] max-[600.001px]:[&_>_span]:text-[length:12px] max-[600.001px]:[&_>_span]:text-right
              max-[600.001px]:[&_>_span]:max-w-25
            "><h2>Resumen de solicitudes</h2><span>Según el periodo y los filtros seleccionados</span></div>
            <section aria-label="Indicadores de cumplimiento" className="
              grid grid-cols-[repeat(4,_minmax(0,_1fr))] gap-[15px] max-[900.001px]:grid-cols-[repeat(2,_minmax(0,_1fr))]
              max-[600.001px]:grid-cols-[repeat(2,_minmax(0,_1fr))] max-[600.001px]:gap-[10px]
            ">
                <TarjetaMetrica titulo="Solicitudes en total" valor={metricas.total} icono={FiBox} tono="blue" />
                <TarjetaMetrica titulo="Surtidas a tiempo" valor={aTiempo} icono={FiCheckCircle} tono="green" />
                <TarjetaMetrica titulo="Surtidas fuera de horario" valor={metricas.fueraDePlazo} icono={FiClock} tono="amber" />
                <TarjetaMetrica titulo="Pendientes con atraso" valor={metricas.vencidas} icono={FiAlertCircle} tono="red" />
            </section>
            {otrasSolicitudes && <p className="mt-0 mr-0 mb-0 ml-0 text-[#52637a] text-[length:13px] leading-[1.65]">También en el total: {otrasSolicitudes}.</p>}
            <ProximoRango datos={datos} />
            <AtencionAlmacen datos={datos} setEstado={setEstado} setPagina={setPagina} setSeleccionada={setSeleccionada} />
            <TablaResponsables datos={datos} />
            <TablaSolicitudes filas={filas} estado={estado} setEstado={setEstado} paginaActual={paginaActual} paginas={paginas} setPagina={setPagina} setSeleccionada={setSeleccionada} />
            <Reglas datos={datos} />
            <footer className="
              flex flex-wrap justify-between gap-[10px] text-[length:12px] text-[#a4afc0] pt-[1px] pr-[2px] pb-0 pl-[2px]
              [&_>_span:first-child]:inline-flex [&_>_span:first-child]:items-center [&_>_span:first-child]:gap-[5px]
            "><span><FiClock />Ciudad de México · America/Mexico_City</span><span>Última actualización: {fecha(datos.actualizado)}</span></footer>
        </div>}
        {children}
    </div>;
}
