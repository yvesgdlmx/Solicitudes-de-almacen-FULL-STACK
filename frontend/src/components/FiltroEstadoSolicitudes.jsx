import { FiActivity, FiCheckCircle, FiClock, FiFilter, FiLayers, FiPackage, FiXCircle } from 'react-icons/fi';

const estados = [
  { valor: 'Todos', nombre: 'Todas', icono: FiLayers, tono: 'slate' },
  { valor: 'pendiente surtido', nombre: 'Pendientes', icono: FiClock, tono: 'blue' },
  { valor: 'en proceso', nombre: 'En proceso', icono: FiActivity, tono: 'indigo' },
  { valor: 'entrega parcial', nombre: 'Parciales', icono: FiPackage, tono: 'amber' },
  { valor: 'surtido', nombre: 'Surtidas', icono: FiCheckCircle, tono: 'green' },
  { valor: 'rechazada', nombre: 'Rechazadas', icono: FiXCircle, tono: 'red' },
];

export default function FiltroEstadoSolicitudes({ estadoActivo, onCambiarEstado, datos = [], titulo = 'Encuentra lo que necesitas', className = '', accionDerecha = null }) {
  return <section className={`
    bg-white rounded-[17px] pt-[21px] pr-[23px] pb-[21px] pl-[23px] mb-[21px] [&&]:[box-shadow:var(--app-shadow)]
    border border-solid [&&]:border-[var(--app-line)] max-[650.001px]:pt-[18px] max-[650.001px]:pr-[18px]
    max-[650.001px]:pb-[18px] max-[650.001px]:pl-[18px]
  ${className}  `} aria-label={titulo}>
    <div className="
      flex items-center justify-between gap-[14px] mb-[18px] [&_>_div:first-child]:flex
      [&_>_div:first-child]:items-center [&_>_div:first-child]:gap-[11px] [&_h2]:text-[length:14px] [&_h2]:font-[650]
      [&_h2]:text-[#526e92] [&_h2]:leading-[1.4] max-[650.001px]:[&_h2]:text-[length:13px] [&_p]:text-[#6e7f96]
      [&_p]:text-[length:12px] [&_p]:mt-1 max-[650.001px]:[&_p]:text-[length:11px]
    "><div><span className="
      flex items-center justify-center w-[33px] h-[33px] [&&]:[background:#e0ebfd] [&&]:text-[#245fc1] rounded-[10px]
      shrink-0 text-[length:16px] max-[650.001px]:w-[29px] max-[650.001px]:h-[30px]
      max-[650.001px]:text-[length:14px]
    "><FiFilter /></span><div><h2>{titulo}</h2><p>Elige una etapa para enfocar el listado.</p></div></div>{accionDerecha}</div>
    <div className="flex flex-wrap gap-[9px] max-[950.001px]:gap-[7px]">{estados.map(estado => {
      const Icono = estado.icono;
      const cantidad = estado.valor === 'Todos' ? datos.length : datos.filter(s => s.status === estado.valor).length;
      return <button key={estado.valor} onClick={() => onCambiarEstado(estado.valor)} aria-pressed={estadoActivo === estado.valor}
        className={`
          [--rq-chip:#8b9db7] [--rq-chip-bg:#f4f7fb] flex items-center gap-[7px] pt-[9px] pr-3 pb-[9px] pl-3
          rounded-[10px] [&&]:text-[#425d80] bg-white text-[length:12px] border border-solid [&&]:border-[#ccd9ec]
          max-[950.001px]:pt-2 max-[950.001px]:pr-[10px] max-[950.001px]:pb-2 max-[950.001px]:pl-[10px]
          max-[650.001px]:gap-[5px] max-[650.001px]:pt-2 max-[650.001px]:pr-[10px] max-[650.001px]:pb-2
          max-[650.001px]:pl-[10px] max-[650.001px]:text-[length:12px]
          [&_>_svg]:text-[color-mix(in_srgb,_var(--rq-chip)_55%,_#183454)] [&_>_svg]:text-[length:14px] [&_>_strong]:flex
          [&_>_strong]:items-center [&_>_strong]:justify-center [&_>_strong]:min-w-[23px] [&_>_strong]:h-[21px]
          [&_>_strong]:pt-0 [&_>_strong]:pr-[5px] [&_>_strong]:pb-0 [&_>_strong]:pl-[5px] [&_>_strong]:rounded-[5px]
          [&_>_strong]:text-[#657c9c] [&_>_strong]:[background:#f4f7fc] [&_>_strong]:text-[length:11px]
          [&_>_strong]:font-semibold max-[650.001px]:[&_>_strong]:min-w-[21px] hover:[background:#f8fbff]
          hover:border-[#bdd1ef] [&.is-active]:text-[color-mix(in_srgb,_var(--rq-chip)_55%,_#183454)]
          [&.is-active]:[background:var(--rq-chip-bg)] [&&.is-active]:[box-shadow:0_3px_8px_#17376612]
          [&&.is-active]:border-[var(--rq-chip)]
          [&.is-active_>_strong]:text-[color-mix(in_srgb,_var(--rq-chip)_55%,_#183454)]
          [&.is-active_>_strong]:[background:#ffffffd9]
        ${{
  "blue": "rq-chip-blue [&.rq-chip-blue]:[--rq-chip:#2563db] [&.rq-chip-blue]:[--rq-chip-bg:#deebff]",
  "indigo": "rq-chip-indigo [&.rq-chip-indigo]:[--rq-chip:#7543ce] [&.rq-chip-indigo]:[--rq-chip-bg:#eee3ff]",
  "amber": "rq-chip-amber [&.rq-chip-amber]:[--rq-chip:#b86c08] [&.rq-chip-amber]:[--rq-chip-bg:#fff0cc]",
  "green": "rq-chip-green [&.rq-chip-green]:[--rq-chip:#078065] [&.rq-chip-green]:[--rq-chip-bg:#d7f4e8]",
  "red": "rq-chip-red [&.rq-chip-red]:[--rq-chip:#c43b50] [&.rq-chip-red]:[--rq-chip-bg:#ffe1e6]"
}[estado.tono] || ""}  ${estadoActivo === estado.valor ? " is-active" : ""}  `}><Icono /><span>{estado.nombre}</span><strong>{cantidad}</strong></button>;
    })}</div>
  </section>;
}