import { Link } from 'react-router-dom';
import { FiActivity, FiArrowUpRight, FiCheckCircle, FiChevronRight, FiClock, FiFileText, FiInfo, FiLayers, FiPackage, FiPlus, FiRefreshCw, FiUsers } from 'react-icons/fi';
import LeyendaHorarios from '../LeyendaHorarios';
import useAuth from '../../hooks/useAuth';

export default function PanelSolicitudes({ equipo = false, datos = [], cargando = false, actualizar, nuevaSolicitud, children }) {
  const { auth } = useAuth();
  const titulo = equipo ? 'Todas las solicitudes' : 'Mis solicitudes';
  const imagen = equipo ? '/img/todas-solicitudes-v1.png' : '/img/mis-solicitudes-v1.png';
  const contar = estado => datos.filter(s => s.status === estado).length;
  const tarjetas = [
    { titulo: equipo ? 'Solicitudes del equipo' : 'Solicitudes registradas', valor: datos.length, icono: FiLayers, tono: 'blue', nota: equipo ? 'Vista general del almacén' : 'Tu historial de solicitudes' },
    { titulo: 'Pendientes de surtido', valor: contar('pendiente surtido'), icono: FiClock, tono: 'purple', nota: 'En espera de atención' },
    { titulo: 'En seguimiento', valor: contar('en proceso') + contar('entrega parcial'), icono: FiActivity, tono: 'amber', nota: 'En proceso y entregas parciales' },
    { titulo: 'Solicitudes surtidas', valor: contar('surtido'), icono: FiCheckCircle, tono: 'green', nota: 'Marcadas como surtidas' },
  ];
  const Icono = equipo ? FiUsers : FiFileText;
  return <div className={`
    [--rq-ink:#183454] [&&]:[--rq-line:var(--app-line)] [&&]:text-[var(--app-ink)]
    [&&]:[background:radial-gradient(ellipse_at_100%_0,_#dbe8fb_0,_transparent_45%),_#edf2f8] mt-0 mr-[-24px]
    mb-[-24px] ml-[-24px] pt-[26px] pr-[clamp(18px,_2.6vw,_40px)] pb-[30px] pl-[clamp(18px,_2.6vw,_40px)]
    min-h-full text-[length:14px] [&&]:[--db-line:var(--app-line)] [&&]:[--ad-line:var(--app-line)]
    [&&]:[--cs-line:var(--app-line)] min-[1600px]:pr-[max(32px,_calc((100%_-_1500px)_/_2))]
    min-[1600px]:pl-[max(32px,_calc((100%_-_1500px)_/_2))] max-[650.001px]:pt-5 max-[650.001px]:pr-4
    max-[650.001px]:pb-7 max-[650.001px]:pl-4
    [&_button]:[transition:color_.2s,_background_.2s,_border-color_.2s,_box-shadow_.2s,_transform_.2s]
    [&_button]:cursor-pointer
    [&_a]:[transition:color_.2s,_background_.2s,_border-color_.2s,_box-shadow_.2s,_transform_.2s]
    [&_input]:[transition:color_.2s,_background_.2s,_border-color_.2s,_box-shadow_.2s,_transform_.2s]
    [&_select]:[transition:color_.2s,_background_.2s,_border-color_.2s,_box-shadow_.2s,_transform_.2s]
    [&_button:disabled]:cursor-default [&_button:disabled]:opacity-[.45]
    [&_button:focus-visible]:[outline:3px_solid_#9fc2ff] [&_button:focus-visible]:[outline-offset:3px]
    [&_a:focus-visible]:[outline:3px_solid_#9fc2ff] [&_a:focus-visible]:[outline-offset:3px]
    [&_input:focus-visible]:[outline:3px_solid_#9fc2ff] [&_input:focus-visible]:[outline-offset:3px]
    [&_select:focus-visible]:[outline:3px_solid_#9fc2ff] [&_select:focus-visible]:[outline-offset:3px]
    [@media(prefers-reduced-motion:_reduce)]:[&_*]:animate-none!
    [@media(prefers-reduced-motion:_reduce)]:[&_*]:[transition:none]!
  ${equipo ? "rq-team" : "rq-personal"}  `}>
    <div className="flex items-center justify-between gap-[14px] mb-[22px] max-[650.001px]:mb-4"><div className="
      flex items-center gap-[10px] [&&]:text-[#5b6f89] text-[length:13px] max-[650.001px]:gap-[6px]
      max-[650.001px]:text-[length:12px] [&_>_svg:first-child]:text-[length:18px]
      [&_>_svg:first-child]:text-[#6d8fbe] [&_strong]:font-[550] [&_strong]:text-[#627b9d]
      max-[650.001px]:[&_>_span]:hidden
    "><Icono /><span>{equipo ? 'Administración' : 'Almacén'}</span><FiChevronRight /><strong>{titulo}</strong></div><button className="
      inline-flex items-center justify-center gap-2 bg-white rounded-[10px] pt-[10px] pr-[15px] pb-[10px] pl-[15px]
      [&&]:text-[#25569c] text-[length:13px] font-semibold [&&]:[box-shadow:0_3px_8px_#1737660b] border border-solid
      [&&]:border-[#c0d1eb] max-[650.001px]:pt-[9px] max-[650.001px]:pr-[11px] max-[650.001px]:pb-[9px]
      max-[650.001px]:pl-[11px] max-[650.001px]:text-[length:12px] hover:[background:#edf4ff] hover:border-[#b7cfef]
    " disabled={cargando} onClick={actualizar}><FiRefreshCw className={cargando ? "animate-rq-spin" : ""} />{cargando ? 'Actualizando…' : 'Actualizar'}</button></div>
    <header className="
      rq-hero grid grid-cols-[1.2fr_1fr] items-center gap-[18px] [&&&]:min-h-60 [&&&]:pt-[22px] [&&&]:pr-8
      [&&&]:pb-[22px] [&&&]:pl-8 rounded-[24px]
      [&&&]:[background:radial-gradient(ellipse_at_88%_30%,_#176aab80,_transparent_58%),_linear-gradient(115deg,_#102d59,_#1c468b_68%,_#15588e)]
      overflow-hidden relative isolate [&&&]:[box-shadow:0_16px_34px_#15396826,_inset_0_1px_#ffffff24] border
      border-solid [&&&]:border-[#275899] max-[1250.001px]:[&&&]:pt-[22px] max-[1250.001px]:[&&&]:pr-8
      max-[1250.001px]:[&&&]:pb-[22px] max-[1250.001px]:[&&&]:pl-8 max-[650.001px]:grid-cols-[1fr]
      max-[650.001px]:[&&&]:min-h-auto max-[650.001px]:[&&&]:pt-5 max-[650.001px]:[&&&]:pr-5
      max-[650.001px]:[&&&]:pb-5 max-[650.001px]:[&&&]:pl-5 after:[content:''] after:absolute after:w-[370px]
      after:h-[370px] after:top-[-200px] after:right-[-45px] after:rounded-[50%]
      after:[box-shadow:0_0_0_50px_#ffffff1b,_0_0_0_100px_#ffffff12] after:z-[-1] after:border after:border-solid
      after:border-[#ffffff7a] [&_h1]:text-[length:clamp(30px,_2.8vw,_40px)] [&_h1]:leading-[1.14] [&_h1]:font-[750]
      [&_h1]:tracking-[-.035em] [&&_h1]:text-white [&_h1]:mt-[14px] max-[950.001px]:[&_h1]:text-[length:32px]
      max-[650.001px]:[&_h1]:text-[length:30px] [&&_h1_>_span]:text-[#4be0ed]
    "><div className="
      [&&_>_p]:text-[#d7e6fc] [&_>_p]:text-[length:14px] [&_>_p]:leading-[1.75] [&_>_p]:max-w-100 [&_>_p]:mt-[14px]
      max-[950.001px]:[&_>_p]:text-[length:13px] max-[650.001px]:[&_>_p]:text-[length:13px]
      max-[650.001px]:[&_>_p]:max-w-[90%] max-[650.001px]:relative max-[650.001px]:z-[1]
    "><span className="
      inline-flex items-center gap-2 text-[#5d7096] text-[length:11px] font-[650] tracking-[.12em] uppercase
      [&_>_span]:w-[6px] [&_>_span]:h-[6px] [&&_>_span]:[background:#44daeb] [&_>_span]:rounded-[50%]
      [&&_>_span]:[box-shadow:0_0_0_4px_#44daeb20] [.rq-team_&]:text-[#526f96] [.db-hero_&&]:text-[#a9edfa]
      [.rq-hero_&&]:text-[#a9edfa] [.ad-hero_&&]:text-[#a9edfa] [.cs-hero_&&]:text-[#a9edfa]
    "><span />{equipo ? 'Coordinación del almacén' : 'Tu espacio de solicitudes'}</span><h1>{equipo ? <>Todas las<br />solicitudes<span>.</span></> : <>Mis solicitudes<span>.</span></>}</h1><p>{equipo ? 'Cada solicitud, un equipo detrás. Organiza la atención y acompaña cada entrega.' : 'Lo que necesitas, en un mismo lugar. Crea tus solicitudes y sigue cada paso de su atención.'}</p><div className="flex flex-wrap items-center gap-3 [&&]:mt-4 max-[950.001px]:gap-[9px]">{equipo ? auth?.rol === 'superadmin' && <Link to="/cumplimiento-surtido" className="
      inline-flex items-center justify-center gap-[9px] [&&]:[background:linear-gradient(115deg,_#1967ed,_#164fc7)]
      [&&]:text-white rounded-[10px] pt-[11px] pr-[15px] pb-[11px] pl-[15px] text-[length:13px] font-semibold
      [&&]:[box-shadow:0_5px_12px_#0729602b,_inset_0_1px_#ffffff30] no-underline max-[950.001px]:text-[length:12px]
      [&&:hover]:[background:#124bbd] hover:[transform:translateY(-1px)]
    ">Ver cumplimiento <FiArrowUpRight /></Link> : <button className="
      inline-flex items-center justify-center gap-[9px] [&&]:[background:linear-gradient(115deg,_#1967ed,_#164fc7)]
      [&&]:text-white rounded-[10px] pt-[11px] pr-[15px] pb-[11px] pl-[15px] text-[length:13px] font-semibold
      [&&]:[box-shadow:0_5px_12px_#0729602b,_inset_0_1px_#ffffff30] no-underline max-[950.001px]:text-[length:12px]
      [&&:hover]:[background:#124bbd] hover:[transform:translateY(-1px)]
    " onClick={nuevaSolicitud}><FiPlus />Nueva solicitud</button>}<div className="
      [&&_>_button]:[background:#ffffff12] [&_>_button]:rounded-[10px] [&&_>_button]:text-[#e7f4ff] [&_>_button]:h-10
      [&_>_button]:pt-[9px] [&_>_button]:pr-[13px] [&_>_button]:pb-[9px] [&_>_button]:pl-[13px]
      [&_>_button]:text-[length:12px] [&_>_button]:font-[550] [&_>_button]:border [&_>_button]:border-solid
      [&&_>_button]:border-[#b3d2ff66] [&&_>_button:hover]:[background:#ffffff24] [&_>_button:hover]:border-[#b4c9ed]
    "><LeyendaHorarios /></div></div></div><div className="
      relative self-stretch flex items-center justify-center min-w-0 max-[650.001px]:absolute max-[650.001px]:w-[50%]
      max-[650.001px]:right-[-30px] max-[650.001px]:bottom-[12px] max-[650.001px]:opacity-[.3] max-[650.001px]:z-[-1]
      [&_>_img]:relative [&&_>_img]:w-[min(100%,_360px)] [&_>_img]:max-w-none [&_>_img]:h-auto
      [&&_>_img]:[filter:drop-shadow(0_20px_16px_#061b4152)] [&_>_img]:animate-rq-appear [&&_>_img]:max-h-[210px]
      [&&_>_img]:object-contain max-[950.001px]:[&&_>_img]:w-[min(100%,_360px)]
    " aria-hidden="true"><div className="absolute w-[90%] [aspect-ratio:1] max-h-[270px] [&&]:[background:radial-gradient(circle,_#65c8fb45,_transparent_70%)] rounded-[50%]" /><img src={imagen} alt="" width="1536" height="1024" fetchPriority="high" /><span className="
      absolute bottom-[-5px] right-[5px] inline-flex items-center gap-[7px] [background:#ffffffe8] rounded-[10px]
      pt-[9px] pr-3 pb-[9px] pl-3 text-[#627b9c] text-[length:11px] [box-shadow:0_5px_20px_#3358830b]
      [backdrop-filter:blur(8px)] border border-solid border-[#ffffffd9] max-[950.001px]:right-[-8px]
      max-[950.001px]:pt-2 max-[950.001px]:pr-2 max-[950.001px]:pb-2 max-[950.001px]:pl-2
      max-[950.001px]:text-[length:11px] max-[650.001px]:right-[-8px] max-[650.001px]:hidden max-[650.001px]:pt-2
      max-[650.001px]:pr-2 max-[650.001px]:pb-2 max-[650.001px]:pl-2 [&_>_svg]:text-[#809ed2]
      [&_>_svg]:text-[length:15px]
    "><FiPackage />{equipo ? 'Atención que conecta al equipo' : 'Cada solicitud cuenta'}</span></div></header>
    <div className="
      flex items-center justify-between gap-3 mt-[27px] mr-0 mb-4 ml-0 max-[650.001px]:items-start
      [&_h2]:text-[#365474] [&_h2]:text-[length:16px] [&_h2]:font-[650] [&_h2]:tracking-[-.02em]
      max-[650.001px]:[&_h2]:text-[length:14px] [&_>_span]:inline-flex [&_>_span]:items-center [&_>_span]:gap-[6px]
      [&_>_span]:text-[#6e7f96] [&_>_span]:text-[length:12px] max-[950.001px]:[&_>_span]:items-start
      max-[950.001px]:[&_>_span]:max-w-[210px] max-[950.001px]:[&_>_span]:text-right
      max-[950.001px]:[&_>_span]:leading-[1.5] max-[650.001px]:[&_>_span]:items-start
      max-[650.001px]:[&_>_span]:text-[length:11px] max-[650.001px]:[&_>_span]:max-w-[145px]
      max-[650.001px]:[&_>_span]:text-right max-[650.001px]:[&_>_span]:leading-[1.5]
      max-[950.001px]:[&_>_span_svg]:shrink-0 max-[950.001px]:[&_>_span_svg]:mt-[3px]
    "><h2>{equipo ? 'El panorama de tus solicitudes' : 'Así van tus solicitudes'}</h2><span><FiInfo />Resumen de todos los registros de esta sección</span></div>
    <section className="
      grid grid-cols-[repeat(4,_minmax(0,_1fr))] gap-[15px] mb-[23px]
      max-[950.001px]:grid-cols-[repeat(2,_minmax(0,_1fr))] max-[650.001px]:grid-cols-[repeat(2,_minmax(0,_1fr))]
      max-[650.001px]:gap-[10px]
    " aria-label="Resumen de solicitudes">{tarjetas.map(tarjeta => {
      const IconoTarjeta = tarjeta.icono;
      return <article key={tarjeta.titulo} className={`
        [&&]:[--rq-tone:#2563db] [&&]:[--rq-tint:#deebff] relative overflow-hidden
        [&&]:[background:linear-gradient(145deg,_#fff_58%,_#edf3fc)] rounded-[17px] pt-[18px] pr-5 pb-4 pl-5
        [&&]:[box-shadow:var(--app-shadow)] [transition:transform_.2s,_box-shadow_.2s] border border-solid
        [&&]:border-[#cddbef] max-[1250.001px]:pt-[17px] max-[1250.001px]:pr-[15px] max-[1250.001px]:pb-[17px]
        max-[1250.001px]:pl-[15px] before:[content:''] before:absolute before:top-0 before:right-0 before:bottom-auto
        before:left-0 [&&::before]:h-1 before:[background:var(--rq-tone)] [&&::before]:opacity-[1]
        hover:[transform:translateY(-3px)] [&&:hover]:[box-shadow:0_13px_28px_#1737661c]
        [@media(prefers-reduced-motion:_reduce)]:[&&:hover]:[transform:none] [&_>_div]:flex [&_>_div]:items-center
        [&_>_div]:gap-[9px] max-[650.001px]:[&_>_div]:items-start max-[650.001px]:[&_>_div]:gap-[7px]
        [&_h2]:text-[length:12px] [&&_h2]:font-semibold [&&_h2]:text-[#425977] [&_h2]:leading-[1.5]
        max-[1250.001px]:[&_h2]:text-[length:12px] [&_>_strong]:block [&_>_strong]:text-[length:31px]
        [&_>_strong]:leading-[1.2] [&_>_strong]:font-[750] [&_>_strong]:tracking-[-.035em] [&&_>_strong]:text-[#142e53]
        [&_>_strong]:mt-[14px] max-[650.001px]:[&_>_strong]:text-[length:29px] [&&_>_p]:text-[#5b6d84]
        [&_>_p]:text-[length:12px] [&_>_p]:mt-2 [&_>_p]:leading-[1.5] max-[650.001px]:[&_>_p]:text-[length:11px]
      ${{
  "purple": "rq-tone-purple [&.rq-tone-purple]:[--rq-tone:#7543ce] [&.rq-tone-purple]:[--rq-tint:#eee3ff]",
  "amber": "rq-tone-amber [&.rq-tone-amber]:[--rq-tone:#b86c08] [&.rq-tone-amber]:[--rq-tint:#fff0cc]",
  "green": "rq-tone-green [&.rq-tone-green]:[--rq-tone:#078065] [&.rq-tone-green]:[--rq-tint:#d7f4e8]"
}[tarjeta.tono] || ""}  `}><div><span className="
  flex items-center justify-center w-8 h-8 text-[var(--rq-tone)] [background:var(--rq-tint)] rounded-[10px]
  text-[length:16px] shrink-0 max-[650.001px]:w-7 max-[650.001px]:h-7 max-[650.001px]:text-[length:14px]
"><IconoTarjeta /></span><h2>{tarjeta.titulo}</h2></div><strong>{cargando ? '—' : new Intl.NumberFormat('es-MX').format(tarjeta.valor)}</strong><p>{tarjeta.nota}</p></article>;
    })}</section>
    {cargando ? <div className="
      flex items-center justify-center gap-[10px] pt-[55px] pr-5 pb-[55px] pl-5 text-[#6b86ac] text-[length:13px]
      bg-white rounded-[17px] border border-solid border-[var(--rq-line)]
    " role="status"><FiRefreshCw className="animate-rq-spin" /><span>Preparando las solicitudes…</span></div> : children}
    <footer className="
      flex flex-wrap justify-between gap-[10px] mt-[22px] mr-[2px] mb-0 ml-[2px] text-[#74859d] text-[length:11px]
      [&_>_span:first-child]:inline-flex [&_>_span:first-child]:items-center [&_>_span:first-child]:gap-[6px]
    "><span><FiClock />Las solicitudes fuera de horario se atienden en el siguiente rango permitido.</span><span>{equipo ? 'Seguimiento del equipo' : 'Seguimiento personal'}</span></footer>
  </div>;
}
