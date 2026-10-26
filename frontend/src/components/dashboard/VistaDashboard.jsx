import { Link } from 'react-router-dom';
import { Line, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from 'chart.js';
import { FiActivity, FiArrowRight, FiArrowUpRight, FiBarChart2, FiBox, FiCalendar, FiCheckCircle, FiChevronRight, FiClipboard, FiClock, FiGrid, FiInfo, FiLayers, FiMapPin, FiPackage, FiRefreshCw, FiTrendingUp, FiAlertCircle } from 'react-icons/fi';

ChartJS.register(ArcElement, CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip, Legend);
const numero = valor => Number(valor || 0);
const formatoNumero = valor => new Intl.NumberFormat('es-MX', { maximumFractionDigits: 2 }).format(numero(valor));
const zona = 'America/Mexico_City';
const ilustracion = '/img/dashboard-analytics-v1.png';
const prioridadesInfo = { 'muy alto': { nombre: 'Muy alta', color: '#7543ce' }, alto: { nombre: 'Alta', color: '#2563db' }, moderado: { nombre: 'Moderada', color: '#078065' } };
const estadosInfo = {
  'pendiente surtido': { nombre: 'Pendiente de surtido', color: '#2563db' },
  'en proceso': { nombre: 'En proceso', color: '#263f83' },
  'entrega parcial': { nombre: 'Entrega parcial', color: '#ce8b18' },
  surtido: { nombre: 'Surtido', color: '#078065' },
  rechazada: { nombre: 'Rechazada', color: '#c43b50' },
};
const fechaCorta = valor => new Date(valor).toLocaleString('es-MX', { timeZone: zona, day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' });

function TituloPanel({ icono, titulo, descripcion, extra }) {
  const Icono = icono;
  return <div className="
    flex items-center justify-between gap-3 pt-[22px] pr-[22px] pb-[18px] pl-[22px]
    [&&]:[background:linear-gradient(110deg,_#f0f5fd,_#fff)] max-[1250.001px]:pt-5 max-[1250.001px]:pr-[18px]
    max-[1250.001px]:pb-[17px] max-[1250.001px]:pl-[18px] max-[650.001px]:gap-2 max-[650.001px]:pt-5
    max-[650.001px]:pr-[18px] max-[650.001px]:pb-[17px] max-[650.001px]:pl-[18px] [&&_h2]:text-[#243f64]
    [&_h2]:text-[length:14px] [&_h2]:font-[650] [&_h2]:tracking-[-.015em] [&_h2]:leading-[1.4]
    max-[650.001px]:[&_h2]:text-[length:14px] [&&_p]:text-[#5b6e87] [&_p]:text-[length:12px] [&_p]:mt-[3px]
    [&_p]:leading-[1.5] max-[650.001px]:[&_p]:text-[length:12px]
  "><div className="flex items-center gap-[10px] min-w-0"><span className="
    flex items-center justify-center w-[33px] h-[33px] [&&]:[background:#e0ebfd] rounded-[10px] [&&]:text-[#245fc1]
    shrink-0 text-[length:16px] max-[650.001px]:w-[29px] max-[650.001px]:h-[30px]
    max-[650.001px]:text-[length:14px]
  "><Icono /></span><div><h2>{titulo}</h2>{descripcion && <p>{descripcion}</p>}</div></div>{extra}</div>;
}

function SinDatos({ texto, detalle, icono = FiPackage }) {
  const Icono = icono;
  return <div className="
    min-h-[230px] flex flex-col justify-center items-center text-center pt-[25px] pr-[25px] pb-[25px] pl-[25px]
    [&_>_span]:flex [&_>_span]:items-center [&_>_span]:justify-center [&_>_span]:h-13 [&_>_span]:w-13
    [&_>_span]:rounded-[16px] [&_>_span]:text-[#a0b8df] [&_>_span]:[background:#f3f7fd]
    [&_>_span]:text-[length:25px] [&_>_span]:mb-[15px] [&_h3]:text-[length:13px] [&_h3]:font-semibold
    [&_h3]:text-[#8da1bc] [&_p]:text-[length:12px] [&_p]:text-[#acb8ca] [&_p]:leading-[1.75] [&_p]:mt-2
    [&_p]:max-w-75
  "><span><Icono /></span><h3>{texto}</h3><p>{detalle}</p></div>;
}

function ResumenSolicitudes({ estados, total, activas }) {
  const completadas = estados.find(e => e.status === 'surtido')?.cantidad || 0;
  const indicadores = [
    { titulo: 'Solicitudes registradas', valor: total, detalle: 'Todas las que has creado, incluidas las rechazadas.', icono: FiClipboard, tono: 'blue' },
    { titulo: 'Por completar', valor: activas, detalle: 'Pendientes, en preparación o con entrega parcial.', icono: FiClock, tono: 'amber' },
    { titulo: 'Completadas', valor: completadas, detalle: 'Solicitudes con la entrega totalmente surtida.', icono: FiCheckCircle, tono: 'green' },
  ];
  return <section className="mt-[26px] min-w-0" aria-labelledby="db-summary-title">
    <div className="
      flex items-center justify-between gap-4 mb-4 max-[650.001px]:items-start max-[650.001px]:gap-[10px]
      max-[650.001px]:flex-wrap [&_h2]:text-[length:16px] [&_h2]:font-bold [&_h2]:tracking-[-.02em]
      [&_h2]:text-[#243f64] [&_p]:mt-1 [&_p]:text-[length:12px] [&_p]:leading-[1.6] [&_p]:text-[#50647f]
    ">
      <div><h2 id="db-summary-title">Resumen de mis solicitudes</h2><p>Todo tu historial, en tres cifras.</p></div>
      <Link to="/solicitudes" className="inline-flex items-center gap-2 text-[length:12px] font-semibold text-[#245fc1] no-underline shrink-0 hover:text-[#163d80] hover:underline">Ver solicitudes <FiArrowRight /></Link>
    </div>
    <dl className="
      grid grid-cols-[repeat(3,_minmax(0,_1fr))] gap-[18px] mt-0 mr-0 mb-0 ml-0 max-[1000.001px]:gap-3
      max-[650.001px]:grid-cols-[minmax(0,_1fr)] max-[650.001px]:gap-3
    ">{indicadores.map(indicador => {
        const Icono = indicador.icono;
        return <div key={indicador.tono} className={`
          [--summary-accent:#2563db] [--summary-tint:#edf3ff] relative min-w-0 overflow-hidden rounded-[16px] pt-[22px]
          pr-6 pb-[22px] pl-6 [background:linear-gradient(135deg,_#fff_65%,_var(--summary-tint))]
          [box-shadow:var(--app-shadow,_0_4px_14px_#223d6408)] border border-solid border-[var(--db-line)]
          max-[1000.001px]:pt-[18px] max-[1000.001px]:pr-[18px] max-[1000.001px]:pb-[18px] max-[1000.001px]:pl-[18px]
          before:[content:''] before:absolute before:top-0 before:right-auto before:bottom-0 before:left-0 before:w-1
          before:[background:var(--summary-accent)] [&_dt]:flex [&_dt]:items-center [&_dt]:justify-between [&_dt]:gap-3
          [&_dt]:text-[#425977] [&_dt]:text-[length:13px] [&_dt]:font-semibold max-[1000.001px]:[&_dt]:items-start
          max-[1000.001px]:[&_dt]:flex-col-reverse max-[650.001px]:[&_dt]:items-center max-[650.001px]:[&_dt]:flex-row
          [&_dd]:mt-3 [&_dd]:mr-0 [&_dd]:mb-0 [&_dd]:ml-0 max-[650.001px]:[&_dd]:mt-[6px] [&_dd_strong]:block
          [&_dd_strong]:text-[#183454] [&_dd_strong]:text-[length:clamp(32px,_3vw,_42px)] [&_dd_strong]:font-[750]
          [&_dd_strong]:tracking-[-.045em] [&_dd_strong]:leading-[1.15] [&_dd_strong]:[overflow-wrap:anywhere]
          [&_dd_>_span]:block [&_dd_>_span]:mt-[14px] [&_dd_>_span]:pt-3 [&_dd_>_span]:[border-top-width:1px]
          [&_dd_>_span]:[border-top-style:solid] [&_dd_>_span]:[border-top-color:var(--db-line)]
          [&_dd_>_span]:text-[#50647f] [&_dd_>_span]:text-[length:12px] [&_dd_>_span]:leading-[1.65]
        ${{
  "amber": "db-summary-amber [&.db-summary-amber]:[--summary-accent:#ad740e] [&.db-summary-amber]:[--summary-tint:#fff7e8]",
  "green": "db-summary-green [&.db-summary-green]:[--summary-accent:#078065] [&.db-summary-green]:[--summary-tint:#eaf7f1]"
}[indicador.tono] || ""}  `}>
          <dt><span>{indicador.titulo}</span><span className="
            inline-flex items-center justify-center w-[38px] h-[38px] rounded-[11px] text-[var(--summary-accent)]
            [background:var(--summary-tint)] shrink-0 text-[length:18px] border border-solid
            border-[color-mix(in_srgb,_var(--summary-accent)_15%,_#fff)]
          " aria-hidden="true"><Icono /></span></dt>
          <dd><strong>{formatoNumero(indicador.valor)}</strong><span>{indicador.detalle}</span></dd>
        </div>;
      })}</dl>
  </section>;
}

function GraficaMensual({ mesesData }) {
  const datos = {
    labels: mesesData.map(item => {
      const [anio, mes] = item.mes.split('-');
      return new Date(Date.UTC(Number(anio), Number(mes) - 1, 15)).toLocaleDateString('es-MX', { timeZone: zona, month: 'short', year: '2-digit' });
    }),
    datasets: [{ label: 'Solicitudes', data: mesesData.map(item => numero(item.cantidad)), borderColor: '#4b85e5', borderWidth: 2.5,
      backgroundColor: context => {
        const { ctx, chartArea } = context.chart;
        if (!chartArea) return 'rgba(75,133,229,.08)';
        const gradiente = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
        gradiente.addColorStop(0, 'rgba(75,133,229,.2)'); gradiente.addColorStop(1, 'rgba(75,133,229,.005)');
        return gradiente;
      },
      pointBackgroundColor: '#4b85e5', pointBorderColor: '#fff', pointBorderWidth: 3, pointRadius: 4, pointHoverRadius: 6, tension: .35, fill: true,
    }],
  };
  const opciones = {
    responsive: true, maintainAspectRatio: false, resizeDelay: 80,
    plugins: { legend: { display: false }, tooltip: { backgroundColor: '#203c67', cornerRadius: 9, padding: 12, displayColors: false } },
    scales: {
      y: { beginAtZero: true, border: { display: false }, ticks: { color: '#526782', precision: 0, maxTicksLimit: 5, padding: 10, font: { size: 12 } }, grid: { color: '#e1e9f4', drawTicks: false } },
      x: { border: { display: false }, ticks: { color: '#526782', maxRotation: 0, padding: 10, font: { size: 12 } }, grid: { display: false } },
    },
  };
  const totalPeriodo = mesesData.reduce((suma, mes) => suma + numero(mes.cantidad), 0);
  return <section className="db-monthly-panel min-w-0 overflow-hidden bg-white rounded-[18px] [&&]:[box-shadow:var(--app-shadow)] border border-solid [&&]:border-[var(--app-line)]">
    <TituloPanel icono={FiTrendingUp} titulo="El ritmo de tus solicitudes" descripcion="Actividad registrada por mes" extra={<span className="
      inline-flex items-center gap-[6px] whitespace-nowrap text-[#8a9db8] text-[length:11px] max-[1250.001px]:hidden
      [&_i]:w-[6px] [&_i]:h-[6px] [&_i]:[background:#6c9ae3] [&_i]:rounded-[50%]
    "><i />Solicitudes</span>} />
    {mesesData.length ? <><div className="
      flex items-baseline gap-[9px] mt-0 mr-[25px] mb-[13px] ml-[25px] [&_strong]:text-[length:27px]
      [&_strong]:font-bold [&_strong]:text-[#35577e] [&_strong]:tracking-[-.035em] [&_span]:text-[length:12px]
      [&_span]:text-[#a0aec1]
    "><strong>{formatoNumero(totalPeriodo)}</strong><span>en el periodo mostrado</span></div><div className="h-[245px] mt-0 mr-[19px] mb-[18px] ml-3 min-w-0 relative max-[1000.001px]:h-[255px]"><Line data={datos} options={opciones} role="img" aria-label={`Solicitudes por mes: ${mesesData.map(m => `${m.mes}: ${m.cantidad}`).join(', ')}`} /></div></>
      : <SinDatos texto="Tu actividad comienza aquí" detalle="Cuando registres solicitudes, podrás seguir su evolución mes a mes." icono={FiBarChart2} />}
  </section>;
}

function PanelEstados({ estados, total, activas }) {
  return <section className="db-state-panel min-w-0 overflow-hidden bg-white rounded-[18px] [&&]:[box-shadow:var(--app-shadow)] border border-solid [&&]:border-[var(--app-line)]">
    <TituloPanel icono={FiActivity} titulo="En qué etapa van" descripcion="Distribución de tus solicitudes" />
    <div className="
      db-state-overview flex items-baseline gap-2 pt-0 pr-6 pb-0 pl-6 [&_>_strong]:text-[length:29px]
      [&_>_strong]:font-bold [&_>_strong]:text-[#36577e] [&_>_strong]:tracking-[-.035em] [&_>_span]:text-[#94a4ba]
      [&_>_span]:text-[length:12px]
    "><strong>{formatoNumero(activas)}</strong><span>solicitudes activas</span><span className="
      [.db-state-overview_&]:w-[6px] [.db-state-overview_&]:h-[6px] [.db-state-overview_&]:rounded-[50%]
      [.db-state-overview_&]:[background:#98b6e1] [.db-state-overview_&]:self-center [.db-state-overview_&]:ml-auto
    " /></div>
    <div className="flex h-2 mt-4 mr-6 mb-2 ml-6 [background:#f0f4fa] rounded-[20px] overflow-hidden gap-[2px] [&_>_span]:h-full [&_>_span]:shrink [&_>_span]:[transition:width_.3s]" aria-hidden="true">{estados.map(item => <span key={item.status} style={{ width: `${total ? numero(item.cantidad) / total * 100 : 0}%`, background: estadosInfo[item.status]?.color || '#bac7db' }} />)}</div>
    <div className="
      pt-0 pr-6 pb-[13px] pl-6 [&_>_div]:flex [&_>_div]:items-center [&_>_div]:justify-between [&_>_div]:gap-[10px]
      [&_>_div]:[border-bottom-width:1px] [&_>_div]:[border-bottom-style:solid]
      [&_>_div]:[border-bottom-color:#f0f3f8] [&_>_div]:pt-3 [&_>_div]:pr-0 [&_>_div]:pb-3 [&_>_div]:pl-0
      [&_>_div:last-child]:[border-bottom-width:0] [&_>_div:last-child]:[border-bottom-style:solid]
      [&_>_div:last-child]:[border-bottom-color:currentColor] [&_>_div_>_span:last-child]:flex
      [&_>_div_>_span:last-child]:items-center [&_>_div_>_span:last-child]:gap-[10px] [&_strong]:text-[#557294]
      [&_strong]:text-[length:13px] [&_strong]:font-semibold [&_small]:text-[length:11px] [&_small]:text-[#a6b2c3]
      [&_small]:min-w-[31px] [&_small]:text-right
    ">{estados.map(item => <div key={item.status}><span className="inline-flex items-center gap-[9px] text-[#7d91ad] text-[length:12px] [&_i]:w-[6px] [&_i]:h-[6px] [&_i]:rounded-[50%] [&_i]:shrink-0"><i style={{ background: estadosInfo[item.status]?.color || '#bac7db' }} />{estadosInfo[item.status]?.nombre || item.status}</span><span><strong>{formatoNumero(item.cantidad)}</strong><small>{total ? Math.round(numero(item.cantidad) / total * 100) : 0}%</small></span></div>)}</div>
  </section>;
}

function PanelPrioridades({ prioridades, alta }) {
  const tieneDatos = prioridades.some(p => numero(p.cantidad) > 0);
  const datos = { labels: prioridades.map(p => prioridadesInfo[p.prioridad]?.nombre || p.prioridad), datasets: [{ data: prioridades.map(p => numero(p.cantidad)), backgroundColor: prioridades.map(p => prioridadesInfo[p.prioridad]?.color || '#cad5e6'), borderColor: '#fff', borderWidth: 5, hoverOffset: 4, borderRadius: 4 }] };
  return <section className="db-priority-panel min-w-0 overflow-hidden bg-white rounded-[18px] [&&]:[box-shadow:var(--app-shadow)] border border-solid [&&]:border-[var(--app-line)]">
    <TituloPanel icono={FiLayers} titulo="Lo que necesita atención" descripcion="Tus solicitudes por prioridad" />
    {tieneDatos ? <><div className="relative w-[min(100%_-_40px,_204px)] h-[190px] mt-[5px] mr-auto mb-5 ml-auto"><Doughnut data={datos} options={{ responsive: true, maintainAspectRatio: false, cutout: '77%', plugins: { legend: { display: false }, tooltip: { backgroundColor: '#203c67', padding: 10, displayColors: false } } }} role="img" aria-label="Distribución de solicitudes por prioridad; cantidades detalladas debajo" /><div className="
      absolute top-0 right-0 bottom-0 left-0 flex items-center justify-center flex-col pointer-events-none
      [&_strong]:text-[length:30px] [&_strong]:font-bold [&_strong]:tracking-[-.035em] [&_strong]:text-[#4c668c]
      [&_span]:text-[length:11px] [&_span]:text-[#a3aec0]
    "><strong>{formatoNumero(alta)}</strong><span>alta y muy alta</span></div></div><div className="
      pt-0 pr-[25px] pb-[22px] pl-[25px] [&_>_div]:flex [&_>_div]:justify-between [&_>_div]:items-center
      [&_>_div]:gap-[10px] [&_>_div]:pt-[10px] [&_>_div]:pr-0 [&_>_div]:pb-[10px] [&_>_div]:pl-0
      [&_>_div]:[border-bottom-width:1px] [&_>_div]:[border-bottom-style:solid]
      [&_>_div]:[border-bottom-color:#f0f3f8] [&_>_div:last-child]:[border-bottom-width:0]
      [&_>_div:last-child]:[border-bottom-style:solid] [&_>_div:last-child]:[border-bottom-color:currentColor]
      [&_>_div_>_span]:inline-flex [&_>_div_>_span]:items-center [&_>_div_>_span]:gap-2
      [&_>_div_>_span]:text-[length:12px] [&_>_div_>_span]:text-[#8191aa] [&_i]:w-[7px] [&_i]:h-[7px]
      [&_i]:rounded-[50%] [&_strong]:text-[length:13px] [&_strong]:text-[#6b80a0] [&_strong]:font-semibold
    ">{prioridades.map(p => <div key={p.prioridad}><span><i style={{ background: prioridadesInfo[p.prioridad]?.color || '#cad5e6' }} />{prioridadesInfo[p.prioridad]?.nombre || p.prioridad}</span><strong>{formatoNumero(p.cantidad)}</strong></div>)}</div></>
      : <SinDatos texto="Cada prioridad, en su lugar" detalle="Aquí verás cómo se distribuyen tus solicitudes cuando empieces a registrarlas." icono={FiLayers} />}
  </section>;
}

function PanelRecientes({ recientes }) {
  return <section className="
    min-w-0 overflow-hidden bg-white rounded-[18px] [&&]:[box-shadow:var(--app-shadow)] border border-solid
    [&&]:border-[var(--app-line)] max-[1250.001px]:[grid-column:1_/_-1] max-[1250.001px]:[grid-row:2]
    max-[650.001px]:[grid-column:auto] max-[650.001px]:[grid-row:auto]
  ">
    <TituloPanel icono={FiClock} titulo="Tus últimos movimientos" descripcion="Solicitudes registradas recientemente" extra={<Link className="
      inline-flex items-center gap-[5px] text-[#7599ce] text-[length:11px] font-[550] no-underline whitespace-nowrap
      max-[650.001px]:text-[length:11px] hover:text-[#386bc1]
    " to="/solicitudes">Ver todas <FiArrowRight /></Link>} />
    {recientes.length ? <ol className="
      db-recent-list pt-0 pr-[22px] pb-[7px] pl-[22px] [&_>_li]:relative [&_>_li]:flex [&_>_li]:gap-[11px]
      [&_>_li]:pt-0 [&_>_li]:pr-0 [&_>_li]:pb-[17px] [&_>_li]:pl-0 [&_>_li:not(:last-child)::before]:[content:'']
      [&_>_li:not(:last-child)::before]:absolute [&_>_li:not(:last-child)::before]:w-[1px]
      [&_>_li:not(:last-child)::before]:[background:#eaf0fa] [&_>_li:not(:last-child)::before]:top-[31px]
      [&_>_li:not(:last-child)::before]:bottom-0 [&_>_li:not(:last-child)::before]:left-[14px]
    ">{recientes.slice(0, 5).map(solicitud => <li key={solicitud.id}><span className="relative flex items-center justify-center [&&]:[background:#e0ebfd] rounded-[9px] w-[30px] h-8 [&&]:text-[#245fc1] shrink-0 text-[length:14px]"><FiClipboard /></span><div className="
      flex-1 min-w-0 [border-bottom-width:1px] [border-bottom-style:solid] [border-bottom-color:#f0f3f8] pb-3
      [.db-recent-list_>_li:last-child_&]:[border-bottom-width:0]
      [.db-recent-list_>_li:last-child_&]:[border-bottom-style:solid]
      [.db-recent-list_>_li:last-child_&]:[border-bottom-color:currentColor] [&_>_div]:flex [&_>_div]:flex-wrap
      [&_>_div]:items-baseline [&_>_div]:justify-between [&_>_div]:gap-[4px_8px] [&_strong]:text-[#6681a6]
      [&_strong]:text-[length:12px] [&_strong]:font-[650] [&_strong]:[overflow-wrap:anywhere] [&_time]:text-[#a2afc1]
      [&_time]:text-[length:11px] [&_time]:whitespace-nowrap [&_>_p]:text-[#a5b1c3] [&_>_p]:text-[length:11px]
      [&_>_p]:mt-1 [&_>_p]:mr-0 [&_>_p]:mb-[7px] [&_>_p]:ml-0 [&_>_p]:[overflow-wrap:anywhere]
    "><div><strong>{solicitud.folio}</strong><time dateTime={solicitud.fechaHora}>{fechaCorta(solicitud.fechaHora)}</time></div><p>{solicitud.area}</p><span className="
      inline-flex items-center gap-[5px] text-[var(--db-status-color)]
      [background:color-mix(in_srgb,_var(--db-status-color)_9%,_#fff)] pt-1 pr-[7px] pb-1 pl-[7px] rounded-[5px]
      text-[length:11px] [&_>_i]:w-1 [&_>_i]:h-1 [&_>_i]:rounded-[50%] [&_>_i]:[background:currentColor]
    " style={{ '--db-status-color': estadosInfo[solicitud.status]?.color || '#8399b8' }}><i />{estadosInfo[solicitud.status]?.nombre || solicitud.status}</span></div></li>)}</ol>
      : <SinDatos texto="Todavía no hay movimientos" detalle="Tu próxima solicitud aparecerá aquí con su estado y fecha de registro." icono={FiClipboard} />}
  </section>;
}

function PanelProductos({ productos }) {
  const maximo = Math.max(...productos.map(p => numero(p.totalSolicitado)), 1);
  return <section className="db-products-panel min-w-0 overflow-hidden bg-white rounded-[18px] [&&]:[box-shadow:var(--app-shadow)] border border-solid [&&]:border-[var(--app-line)]"><TituloPanel icono={FiPackage} titulo="Los más solicitados" descripcion="Productos frecuentes en tus solicitudes" />
    {productos.length ? <><ol className="pt-[6px] pr-[22px] pb-[5px] pl-[22px] [&_>_li]:flex [&_>_li]:items-center [&_>_li]:gap-[10px] [&_>_li]:pt-0 [&_>_li]:pr-0 [&_>_li]:pb-[23px] [&_>_li]:pl-0">{productos.slice(0, 5).map((producto, i) => <li key={producto.nombre}><span className={` flex items-center justify-center w-[33px] h-[35px] rounded-[10px] [background:#edf4ff] text-[#7c9fd6] text-[length:16px] shrink-0  ${{
  "1": "db-product-tone-1 [&.db-product-tone-1]:[background:#f4effb] [&.db-product-tone-1]:text-[#a28ac5]",
  "2": "db-product-tone-2 [&.db-product-tone-2]:[background:#fdf5e8] [&.db-product-tone-2]:text-[#caab74]"
}[i % 3] || ""}  `}><FiBox /></span><div className="
  min-w-0 flex-1 [&_>_div:first-child]:flex [&_>_div:first-child]:justify-between
  [&_>_div:first-child]:items-baseline [&_>_div:first-child]:gap-[10px] [&_>_div:first-child]:mb-[9px]
  [&_>_div:first-child_>_span]:text-[length:12px] [&_>_div:first-child_>_span]:text-[#7e94b0]
  [&_>_div:first-child_>_span]:overflow-hidden [&_>_div:first-child_>_span]:whitespace-nowrap
  [&_>_div:first-child_>_span]:text-ellipsis [&_strong]:text-[length:12px] [&_strong]:font-[650]
  [&_strong]:text-[#6f89af]
"><div><span title={producto.nombre}>{producto.nombre}</span><strong>{formatoNumero(producto.totalSolicitado)}</strong></div><div className="
  h-[5px] [background:#eff3fa] rounded-[10px] overflow-hidden [&_>_span]:block [&_>_span]:h-full
  [&_>_span]:rounded-[inherit] [&_>_span]:[background:#93b3e6] [&_>_span]:[transition:width_.4s]
" aria-hidden="true"><span style={{ width: `${numero(producto.totalSolicitado) / maximo * 100}%` }} /></div></div></li>)}</ol><p className="pt-0 pr-[23px] pb-[22px] pl-[23px] text-[#a4b1c4] text-[length:11px] leading-[1.7]">Cantidad acumulada solicitada. Las barras se comparan con el producto de mayor cantidad.</p></>
      : <SinDatos texto="Tus productos frecuentes, aquí" detalle="Con cada solicitud conocerás mejor los materiales que más utilizas." icono={FiBox} />}
  </section>;
}

export default function VistaDashboard({ datos, auth, cargando, error, actualizar }) {
  const metricas = datos?.metricas || {};
  const estadosRecibidos = datos?.estadoSolicitudes || [];
  const estados = Object.keys(estadosInfo).map(status => ({ status, cantidad: numero(estadosRecibidos.find(e => e.status === status)?.cantidad) }));
  const prioridades = Object.keys(prioridadesInfo).map(prioridad => ({ prioridad, cantidad: numero(datos?.solicitudesPorPrioridad?.find(p => p.prioridad === prioridad)?.cantidad) }));
  const total = numero(metricas.totalSolicitudes ?? estados.reduce((suma, e) => suma + e.cantidad, 0));
  const activas = numero(metricas.solicitudesActivas ?? estados.filter(e => ['pendiente surtido', 'en proceso', 'entrega parcial'].includes(e.status)).reduce((suma, e) => suma + e.cantidad, 0));
  const alta = numero(metricas.solicitudesPrioridadAlta ?? prioridades.filter(p => p.prioridad !== 'moderado').reduce((suma, p) => suma + p.cantidad, 0));
  const puedeVerCumplimiento = auth?.rol === 'superadmin';
  return <div className="
    [--db-ink:#183454] [--db-muted:#7d8da4] [&&]:[--db-line:var(--app-line)] [&&]:text-[var(--app-ink)]
    [&&]:[background:radial-gradient(ellipse_at_100%_0,_#dbe8fb_0,_transparent_45%),_#edf2f8] mt-0 mr-[-24px]
    mb-[-24px] ml-[-24px] pt-[26px] pr-[clamp(18px,_2.6vw,_40px)] pb-[30px] pl-[clamp(18px,_2.6vw,_40px)]
    min-h-full text-[length:14px] [&&]:[--rq-line:var(--app-line)] [&&]:[--ad-line:var(--app-line)]
    [&&]:[--cs-line:var(--app-line)] min-[1600px]:pr-[max(32px,_calc((100%_-_1500px)_/_2))]
    min-[1600px]:pl-[max(32px,_calc((100%_-_1500px)_/_2))] max-[650.001px]:pt-5 max-[650.001px]:pr-4
    max-[650.001px]:pb-7 max-[650.001px]:pl-4
    [&_button]:[transition:color_.2s,_background_.2s,_border-color_.2s,_transform_.2s,_box-shadow_.2s]
    [&_button]:cursor-pointer
    [&_a]:[transition:color_.2s,_background_.2s,_border-color_.2s,_transform_.2s,_box-shadow_.2s]
    [&_button:disabled]:cursor-default [&_button:disabled]:opacity-[.5]
    [&_button:focus-visible]:[outline:3px_solid_#97bdff] [&_button:focus-visible]:[outline-offset:3px]
    [&_a:focus-visible]:[outline:3px_solid_#97bdff] [&_a:focus-visible]:[outline-offset:3px]
    [@media(prefers-reduced-motion:_reduce)]:[&_*]:animate-none!
    [@media(prefers-reduced-motion:_reduce)]:[&_*]:[transition:none]!
  ">
    <div className="flex items-center justify-between gap-[14px] mb-[22px] max-[650.001px]:mb-4"><div className="
      flex items-center [&&]:text-[#5b6f89] gap-[10px] text-[length:13px] max-[650.001px]:gap-[7px]
      max-[650.001px]:text-[length:12px] [&_>_svg:first-child]:text-[length:18px]
      [&_>_svg:first-child]:text-[#6286bc] [&_strong]:text-[#566d8e] [&_strong]:font-[550]
    "><FiGrid /><span>Almacén</span><FiChevronRight /><strong>Dashboard</strong></div><button className="
      flex items-center gap-2 bg-white rounded-[10px] pt-[10px] pr-[15px] pb-[10px] pl-[15px] text-[length:13px]
      font-semibold [&&]:text-[#25569c] [&&]:[box-shadow:0_3px_8px_#1737660b] border border-solid
      [&&]:border-[#c0d1eb] max-[650.001px]:pt-[9px] max-[650.001px]:pr-[11px] max-[650.001px]:pb-[9px]
      max-[650.001px]:pl-[11px] max-[650.001px]:text-[length:12px] hover:[background:#eff5ff] hover:border-[#bad0ef]
    " onClick={actualizar} disabled={cargando}><FiRefreshCw className={cargando ? "animate-db-spin" : ""} />{cargando ? 'Actualizando…' : 'Actualizar datos'}</button></div>
    <header className="
      db-hero grid grid-cols-[1.15fr_1fr] items-center gap-4 relative isolate overflow-hidden rounded-[24px]
      [&&&]:[background:radial-gradient(ellipse_at_88%_30%,_#176aab80,_transparent_58%),_linear-gradient(115deg,_#102d59,_#1c468b_68%,_#15588e)]
      [&&&]:pt-[22px] [&&&]:pr-8 [&&&]:pb-[22px] [&&&]:pl-8 [&&&]:min-h-60
      [&&&]:[box-shadow:0_16px_34px_#15396826,_inset_0_1px_#ffffff24] border border-solid [&&&]:border-[#275899]
      max-[1250.001px]:[&&&]:pt-[22px] max-[1250.001px]:[&&&]:pr-8 max-[1250.001px]:[&&&]:pb-[22px]
      max-[1250.001px]:[&&&]:pl-8 max-[650.001px]:grid-cols-[1fr] max-[650.001px]:[&&&]:pt-5
      max-[650.001px]:[&&&]:pr-5 max-[650.001px]:[&&&]:pb-5 max-[650.001px]:[&&&]:pl-5
      max-[650.001px]:[&&&]:min-h-auto after:[content:''] after:absolute after:w-95 after:h-95 after:rounded-[50%]
      after:top-[-200px] after:right-[-60px] after:[box-shadow:0_0_0_50px_#ffffff1a,_0_0_0_100px_#ffffff12]
      after:z-[-1] after:border after:border-solid after:border-[#ffffff70]
      [&_h1]:text-[length:clamp(28px,_2.7vw,_39px)] [&_h1]:font-[750] [&_h1]:leading-[1.15] [&_h1]:tracking-[-.035em]
      [&_h1]:mt-2 [&&_h1]:text-white max-[1000.001px]:[&_h1]:text-[length:30px]
      max-[650.001px]:[&_h1]:text-[length:29px] [&&_h1_>_span]:text-[#4be0ed]
    "><div className="max-[650.001px]:relative max-[650.001px]:z-[1]"><span className="
      inline-flex items-center gap-2 text-[#597aa8] font-[650] text-[length:11px] tracking-[.12em] uppercase
      [&_>_span]:w-[6px] [&_>_span]:h-[6px] [&_>_span]:rounded-[50%] [&&_>_span]:[background:#44daeb]
      [&&_>_span]:[box-shadow:0_0_0_4px_#44daeb20] [.db-hero_&&]:text-[#a9edfa] [.rq-hero_&&]:text-[#a9edfa]
      [.ad-hero_&&]:text-[#a9edfa] [.cs-hero_&&]:text-[#a9edfa]
    "><span />Tu espacio de trabajo</span><p className="mt-4 text-[length:14px] [&&]:text-[#d7e6fc] [overflow-wrap:anywhere] [&_strong]:font-semibold">Hola, <strong>{auth?.user || 'bienvenido'}</strong></p><h1>Tu actividad en<br />almacén, a la vista<span>.</span></h1><p className="
      mt-[13px] [&&]:text-[#d7e6fc] text-[length:14px] leading-[1.7] max-[1000.001px]:text-[length:13px]
      max-[650.001px]:text-[length:13px] max-[650.001px]:max-w-[85%]
    ">Sigue tus solicitudes, identifica prioridades<br className="max-[1000.001px]:hidden" /> y mantén cada entrega en perspectiva.</p><div className="flex flex-wrap items-center gap-[18px] [&&]:mt-4 max-[1000.001px]:gap-3 max-[650.001px]:gap-[14px]"><Link to="/solicitudes" className="
      inline-flex items-center justify-center gap-[15px] [&&]:[background:linear-gradient(115deg,_#1967ed,_#164fc7)]
      [&&]:text-white rounded-[10px] pt-[11px] pr-4 pb-[11px] pl-4 text-[length:12px] font-semibold
      [&&]:[box-shadow:0_5px_12px_#0729602b,_inset_0_1px_#ffffff30] no-underline [&&:hover]:[background:#124bbd]
      hover:[transform:translateY(-1px)]
    ">Mis solicitudes <FiArrowRight /></Link>{puedeVerCumplimiento && <Link to="/cumplimiento-surtido" className="inline-flex items-center gap-[5px] text-[length:12px] [&&]:text-[#bcf1ff] font-[550] no-underline max-[1000.001px]:text-[length:11px] [&&:hover]:text-white">Ver cumplimiento <FiArrowUpRight /></Link>}</div></div><div className="
      flex items-center justify-center self-stretch relative min-w-0 max-[650.001px]:absolute max-[650.001px]:w-[50%]
      max-[650.001px]:right-[-40px] max-[650.001px]:bottom-[12px] max-[650.001px]:opacity-[.3] max-[650.001px]:z-[-1]
      [&_>_img]:relative [&&_>_img]:w-[min(100%,_360px)] [&_>_img]:max-w-none [&_>_img]:h-auto
      [&&_>_img]:[filter:drop-shadow(0_20px_16px_#061b4152)] [&_>_img]:animate-db-appear [&&_>_img]:max-h-[210px]
      [&&_>_img]:object-contain max-[1000.001px]:[&&_>_img]:w-[min(100%,_360px)]
    " aria-hidden="true"><div className="absolute w-[85%] [aspect-ratio:1] rounded-[50%] [&&]:[background:radial-gradient(circle,_#65c8fb45,_transparent_70%)]" /><img src={ilustracion} alt="" width="1536" height="1024" fetchPriority="high" /><span className="
      absolute right-[4px] bottom-0 flex items-center gap-[10px] pt-[10px] pr-[15px] pb-[10px] pl-[15px]
      rounded-[12px] [background:#ffffffed] [box-shadow:0_8px_22px_#254b7e0b] [backdrop-filter:blur(8px)] border
      border-solid border-[#ffffffd9] max-[1000.001px]:right-[-7px] max-[1000.001px]:pt-2 max-[1000.001px]:pr-[10px]
      max-[1000.001px]:pb-2 max-[1000.001px]:pl-[10px] max-[650.001px]:right-[-7px] max-[650.001px]:hidden
      max-[650.001px]:pt-2 max-[650.001px]:pr-[10px] max-[650.001px]:pb-2 max-[650.001px]:pl-[10px] [&_>_span]:flex
      [&_>_span]:items-center [&_>_span]:justify-center [&_>_span]:w-8 [&_>_span]:h-8 [&_>_span]:[background:#edf4ff]
      [&_>_span]:rounded-[9px] [&_>_span]:text-[#7198d4] [&_>_span]:text-[length:16px] [&_strong]:block
      [&_strong]:text-[length:20px] [&_strong]:font-bold [&_strong]:tracking-[-.03em] [&_strong]:leading-[1.2]
      [&_strong]:text-[#315a8e] [&_small]:text-[#8eA1bc] [&_small]:text-[length:11px]
      max-[1000.001px]:[&_small]:text-[length:11px]
    "><span><FiCalendar /></span><div><strong>{formatoNumero(metricas.solicitudesDelMes)}</strong><small>solicitudes este mes</small></div></span></div></header>
    <div className="
      flex items-center justify-between flex-wrap gap-[10px] pt-[17px] pr-[3px] pb-0 pl-[3px] text-[length:12px]
      text-[#8d9bb0] max-[1000.001px]:text-[length:11px] max-[650.001px]:gap-2 max-[650.001px]:text-[length:11px]
      [&_>_span]:inline-flex [&_>_span]:items-center [&_>_span]:gap-[7px] max-[650.001px]:[&_>_span]:flex-wrap
      [&_time]:inline-flex [&_time]:items-center [&_time]:gap-[7px] [&_>_span_>_i]:w-[3px] [&_>_span_>_i]:h-[3px]
      [&_>_span_>_i]:[background:#c4cedd] [&_>_span_>_i]:rounded-[50%] [&_>_span_>_i]:mt-0 [&_>_span_>_i]:mr-1
      [&_>_span_>_i]:mb-0 [&_>_span_>_i]:ml-1 [&_svg]:text-[#93a9c7] [&_svg]:text-[length:13px] [&_svg]:shrink-0
    "><span><FiMapPin />{auth?.area || 'Mi área'}<i />Vista personal de solicitudes</span><time dateTime={new Date().toISOString()}><FiCalendar />{new Date().toLocaleDateString('es-MX', { timeZone: zona, weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</time></div>
    {error && <div role="alert" className="
      flex items-center gap-[10px] text-[#bf747e] [background:#fff1f2] rounded-[12px] pt-[14px] pr-[18px] pb-[14px]
      pl-[18px] mt-5 text-[length:13px] border border-solid border-[#f2dfe2] [&_>_svg]:shrink-0 [&_button]:ml-auto
      [&_button]:font-semibold [&_button]:whitespace-nowrap
    "><FiAlertCircle /><p>{error}</p><button onClick={actualizar} disabled={cargando}>Reintentar</button></div>}
    <div className={cargando ? "flex flex-col gap-[22px] [transition:opacity_.2s] opacity-[.5] pointer-events-none" : "flex flex-col gap-[22px] [transition:opacity_.2s]"} aria-busy={cargando}>
      {datos && <ResumenSolicitudes estados={estados} total={total} activas={activas} />}
      <div className="
        grid grid-cols-[minmax(0,_1.75fr)_minmax(290px,_1fr)] gap-5
        max-[1250.001px]:grid-cols-[minmax(0,_1.4fr)_minmax(260px,_1fr)] max-[1000.001px]:grid-cols-[minmax(0,_1fr)]
      "><GraficaMensual mesesData={datos?.solicitudesPorMes || []} /><PanelEstados estados={estados} total={total} activas={activas} /></div>
      <div className="
        grid grid-cols-[minmax(0,_.95fr)_minmax(0,_1.15fr)_minmax(0,_1fr)] gap-5 items-stretch
        max-[1250.001px]:grid-cols-[repeat(2,_minmax(0,_1fr))] max-[650.001px]:grid-cols-[minmax(0,_1fr)]
      "><PanelPrioridades prioridades={prioridades} alta={alta} /><PanelRecientes recientes={datos?.ultimasSolicitudes || []} /><PanelProductos productos={datos?.productosMasSolicitados || []} /></div>
      <aside className="
        flex items-center gap-[15px] [background:linear-gradient(110deg,_#edf3ff,_#f0f5fc)] rounded-[16px] pt-[21px]
        pr-[25px] pb-[21px] pl-[25px] border border-solid border-[#e1eafa] max-[1000.001px]:flex-wrap
        max-[650.001px]:gap-3 max-[650.001px]:pt-[18px] max-[650.001px]:pr-[18px] max-[650.001px]:pb-[18px]
        max-[650.001px]:pl-[18px] max-[650.001px]:flex-wrap [&_h2]:text-[length:14px] [&_h2]:font-[650]
        [&_h2]:text-[#5e7da6] max-[650.001px]:[&_h2]:text-[length:13px] [&_p]:text-[length:12px] [&_p]:text-[#92a7c3]
        [&_p]:mt-[5px] [&_p]:leading-[1.6] [&_>_a]:ml-auto [&_>_a]:inline-flex [&_>_a]:items-center [&_>_a]:gap-3
        [&_>_a]:text-[#6087bf] [&_>_a]:text-[length:12px] [&_>_a]:font-semibold [&_>_a]:no-underline
        [&_>_a]:whitespace-nowrap max-[1000.001px]:[&_>_a]:ml-[59px] max-[650.001px]:[&_>_a]:ml-14
        [&_>_a:hover]:text-[#3468b9] [&_>_a:hover]:[transform:translateX(2px)] max-[650.001px]:[&_>_div]:flex-1
        max-[650.001px]:[&_>_div]:min-w-40
      "><span className="flex items-center justify-center w-11 h-11 rounded-[13px] bg-white text-[#759ad3] text-[length:21px] shrink-0"><FiPackage /></span><div><h2>{puedeVerCumplimiento ? 'De la información a la acción' : 'Cada solicitud tiene su siguiente paso'}</h2><p>{puedeVerCumplimiento ? 'Revisa horarios, responsables y entregas en el panel de cumplimiento.' : 'Consulta el detalle y el estado de todas tus solicitudes en un mismo lugar.'}</p></div><Link to={puedeVerCumplimiento ? '/cumplimiento-surtido' : '/solicitudes'}>{puedeVerCumplimiento ? 'Ir a cumplimiento' : 'Ver mis solicitudes'}<FiArrowRight /></Link></aside>
      <footer className="
        flex flex-wrap justify-between gap-[10px] pt-0 pr-[2px] pb-0 pl-[2px] text-[#a6b2c4] text-[length:11px]
        [&_>_span:first-child]:inline-flex [&_>_span:first-child]:items-center [&_>_span:first-child]:gap-[6px]
      "><span><FiClock />Fechas en horario de Ciudad de México</span><span>Indicadores de las solicitudes de tu cuenta</span></footer>
    </div>
    {cargando && <p className="absolute w-[1px] h-[1px] pt-0 pr-0 pb-0 pl-0 overflow-hidden [clip:rect(0,_0,_0,_0)] whitespace-nowrap [border-width:0] border-solid border-[currentColor]" role="status">Actualizando tu dashboard…</p>}
  </div>;
}
