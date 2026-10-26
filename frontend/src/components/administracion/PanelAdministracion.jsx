import { FiBox, FiCheckCircle, FiChevronRight, FiClock, FiLayers, FiPlus, FiRefreshCw, FiShield, FiUsers } from 'react-icons/fi';

export default function PanelAdministracion({ tipo, cargando, ocupado = false, actualizar, crear, unidades, tarjetas, children }) {
  const personas = tipo === 'usuarios';
  const Icono = personas ? FiUsers : FiBox;
  const titulo = personas ? 'Cuentas de usuario' : 'Gestión de productos';
  return <div className={`
    [--ad-ink:#284665] [&&]:[--ad-line:var(--app-line)] [&&]:text-[var(--app-ink)]
    [&&]:[background:radial-gradient(ellipse_at_100%_0,_#dbe8fb_0,_transparent_45%),_#edf2f8] mt-0 mr-[-24px]
    mb-[-24px] ml-[-24px] pt-[26px] pr-[clamp(18px,_2.6vw,_40px)] pb-[30px] pl-[clamp(18px,_2.6vw,_40px)]
    min-h-full text-[length:14px] [&&]:[--db-line:var(--app-line)] [&&]:[--rq-line:var(--app-line)]
    [&&]:[--cs-line:var(--app-line)] min-[1600px]:pr-[max(32px,calc((100%_-_1500px)_/_2))]
    min-[1600px]:pl-[max(32px,calc((100%_-_1500px)_/_2))] max-[650.001px]:pt-5 max-[650.001px]:pr-4
    max-[650.001px]:pb-7 max-[650.001px]:pl-4
    [&_button]:[transition:background_.2s,_border-color_.2s,_box-shadow_.2s,_color_.2s,_transform_.2s]
    [&_button]:cursor-pointer
    [&_a]:[transition:background_.2s,_border-color_.2s,_box-shadow_.2s,_color_.2s,_transform_.2s]
    [&_input]:[transition:background_.2s,_border-color_.2s,_box-shadow_.2s,_color_.2s,_transform_.2s]
    [&_select]:[transition:background_.2s,_border-color_.2s,_box-shadow_.2s,_color_.2s,_transform_.2s]
    [&_button:disabled]:cursor-default [&_button:disabled]:opacity-[.45]
    [&_button:focus-visible]:[outline:3px_solid_#a4c6ff] [&_button:focus-visible]:[outline-offset:3px]
    [&_a:focus-visible]:[outline:3px_solid_#a4c6ff] [&_a:focus-visible]:[outline-offset:3px]
    [&_input:focus-visible]:[outline:3px_solid_#a4c6ff] [&_input:focus-visible]:[outline-offset:3px]
    [&_select:focus-visible]:[outline:3px_solid_#a4c6ff] [&_select:focus-visible]:[outline-offset:3px]
    [@media(prefers-reduced-motion:_reduce)]:[&_*]:animate-none!
    [@media(prefers-reduced-motion:_reduce)]:[&_*]:[transition:none]!
  ${{
  "usuarios": "ad-usuarios"
}[tipo] || ""}  `}>
    <div className="flex justify-between items-center gap-[14px] mb-[22px] max-[650.001px]:mb-4"><div className="
      flex items-center gap-[10px] [&&]:text-[#5b6f89] text-[length:13px] max-[650.001px]:gap-[6px]
      max-[650.001px]:text-[length:12px] [&_>_svg:first-child]:text-[#6889b5]
      [&_>_svg:first-child]:text-[length:18px] [&_strong]:text-[#546d8f] [&_strong]:font-[550]
      max-[650.001px]:[&_>_span]:hidden
    "><Icono /><span>Administración</span><FiChevronRight /><strong>{personas ? 'Usuarios' : 'Productos'}</strong></div><button className="
      inline-flex items-center justify-center gap-2 bg-white [&&]:text-[#25569c] pt-[10px] pr-[15px] pb-[10px]
      pl-[15px] rounded-[10px] text-[length:13px] font-semibold [&&]:[box-shadow:0_3px_8px_#1737660b] border
      border-solid [&&]:border-[#c0d1eb] max-[650.001px]:pt-[9px] max-[650.001px]:pr-[11px] max-[650.001px]:pb-[9px]
      max-[650.001px]:pl-[11px] max-[650.001px]:text-[length:12px] hover:[background:#eef5ff] hover:border-[#b9cfef]
    " onClick={actualizar} disabled={cargando || ocupado}><FiRefreshCw className={cargando ? "animate-ad-spin" : ""} />{cargando ? 'Actualizando…' : 'Actualizar'}</button></div>
    <header className="
      ad-hero relative isolate grid grid-cols-[1.2fr_1fr] items-center [&&&]:min-h-60 [&&&]:pt-[22px] [&&&]:pr-8
      [&&&]:pb-[22px] [&&&]:pl-8 gap-[18px] rounded-[24px]
      [&&&]:[background:radial-gradient(ellipse_at_88%_30%,_#176aab80,_transparent_58%),_linear-gradient(115deg,_#102d59,_#1c468b_68%,_#15588e)]
      overflow-hidden [&&&]:[box-shadow:0_16px_34px_#15396826,_inset_0_1px_#ffffff24] border border-solid
      [&&&]:border-[#275899] max-[1100.001px]:[&&&]:pt-[22px] max-[1100.001px]:[&&&]:pr-8
      max-[1100.001px]:[&&&]:pb-[22px] max-[1100.001px]:[&&&]:pl-8 max-[650.001px]:grid-cols-[1fr]
      max-[650.001px]:[&&&]:min-h-auto max-[650.001px]:[&&&]:pt-5 max-[650.001px]:[&&&]:pr-5
      max-[650.001px]:[&&&]:pb-5 max-[650.001px]:[&&&]:pl-5
      [.ad-usuarios_&&&]:[background:radial-gradient(ellipse_at_90%_30%,_#5566d677,_transparent_60%),_linear-gradient(115deg,_#172e5a,_#303f85)]
      after:[content:''] after:absolute after:w-[370px] after:h-[370px] after:top-[-200px] after:right-[-45px]
      after:rounded-[50%] after:[box-shadow:0_0_0_50px_#ffffff1a,0_0_0_100px_#ffffff12] after:z-[-1] after:border
      after:border-solid after:border-[#ffffff70] [&_h1]:text-[length:clamp(30px,2.8vw,40px)] [&_h1]:font-[750]
      [&&_h1]:text-white [&_h1]:tracking-[-.035em] [&_h1]:leading-[1.14] [&_h1]:max-w-110 [&_h1]:mt-[14px]
      max-[1100.001px]:[&_h1]:text-[length:32px] max-[650.001px]:[&_h1]:text-[length:30px]
      [&&_h1_>_span]:text-[#4be0ed]
    "><div className="
      [&_>_p]:text-[length:14px] [&_>_p]:leading-[1.75] [&&_>_p]:text-[#d7e6fc] [&_>_p]:max-w-100 [&_>_p]:mt-[14px]
      max-[1100.001px]:[&_>_p]:text-[length:13px] max-[650.001px]:relative max-[650.001px]:z-[1]
    "><span className="
      inline-flex items-center gap-2 text-[length:11px] uppercase tracking-[.12em] font-[650] text-[#60799f]
      [&_>_span]:w-[6px] [&_>_span]:h-[6px] [&&_>_span]:[background:#44daeb] [&_>_span]:rounded-[50%]
      [&&_>_span]:[box-shadow:0_0_0_4px_#44daeb20] [.db-hero_&&]:text-[#a9edfa] [.rq-hero_&&]:text-[#a9edfa]
      [.ad-hero_&&]:text-[#a9edfa] [.cs-hero_&&]:text-[#a9edfa]
    "><span />{personas ? 'Personas y accesos' : 'El catálogo de tu almacén'}</span><h1>{titulo}<span>.</span></h1><p>{personas ? 'Un equipo bien organizado empieza por sus accesos. Administra cuentas, roles y áreas en un mismo lugar.' : 'Un catálogo claro, solicitudes más precisas. Organiza tus productos y mantén sus unidades de medida al día.'}</p><div className="flex flex-wrap items-center gap-3 [&&]:mt-4"><button className="
      inline-flex items-center justify-center gap-2 pt-[11px] pr-[15px] pb-[11px] pl-[15px] rounded-[10px]
      text-[length:13px] font-semibold [&&]:[background:linear-gradient(115deg,_#1967ed,_#164fc7)] [&&]:text-white
      [&&]:[box-shadow:0_5px_12px_#0729602b,_inset_0_1px_#ffffff30] [&&:hover]:[background:#124bbd]
      hover:[transform:translateY(-1px)]
    " onClick={crear} disabled={cargando || ocupado}><FiPlus />{personas ? 'Nuevo usuario' : 'Nuevo producto'}</button>{!personas && <button className="
      inline-flex items-center justify-center gap-2 pt-[11px] pr-[15px] pb-[11px] pl-[15px] rounded-[10px]
      text-[length:13px] font-semibold text-[#587aa7] [background:#ffffff80] border border-solid border-[#ccdcef]
      hover:bg-white [.ad-hero_&&]:text-[#e7f4ff] [.ad-hero_&&]:[background:#ffffff12]
      [.ad-hero_&&]:border-[#b3d2ff66] [.ad-hero_&&:hover]:[background:#ffffff24]
    " onClick={unidades} disabled={cargando || ocupado}><FiLayers />Unidades de medida</button>}</div></div><div className="
      relative flex items-center justify-center min-w-0 self-stretch max-[650.001px]:absolute max-[650.001px]:w-[50%]
      max-[650.001px]:right-[-30px] max-[650.001px]:bottom-[12px] max-[650.001px]:opacity-[.3] max-[650.001px]:z-[-1]
      [&_>_img]:relative [&&_>_img]:w-[min(100%,_360px)] [&_>_img]:h-auto [&_>_img]:max-w-none
      [&&_>_img]:[filter:drop-shadow(0_20px_16px_#061b4152)] [&_>_img]:animate-ad-appear [&&_>_img]:max-h-[210px]
      [&&_>_img]:object-contain max-[1100.001px]:[&&_>_img]:w-[min(100%,_360px)]
    " aria-hidden="true"><div className="absolute w-[90%] [aspect-ratio:1] max-h-[270px] [&&]:[background:radial-gradient(circle,_#65c8fb45,_transparent_70%)] rounded-[50%]" /><img src={personas ? '/img/cuentas-usuarios-v1.png' : '/img/catalogo-productos-v1.png'} alt="" width="1536" height="1024" fetchPriority="high" /><span className="
      absolute bottom-[-5px] right-[5px] inline-flex items-center gap-[7px] rounded-[10px] [background:#ffffffe8]
      [box-shadow:0_5px_20px_#3358830b] pt-[9px] pr-3 pb-[9px] pl-3 text-[length:11px] text-[#627b9c]
      [backdrop-filter:blur(8px)] border border-solid border-[#ffffffd9] max-[1100.001px]:right-[-8px]
      max-[1100.001px]:pt-2 max-[1100.001px]:pr-2 max-[1100.001px]:pb-2 max-[1100.001px]:pl-2
      max-[1100.001px]:text-[length:11px] max-[650.001px]:right-[-8px] max-[650.001px]:hidden max-[650.001px]:pt-2
      max-[650.001px]:pr-2 max-[650.001px]:pb-2 max-[650.001px]:pl-2 [&_>_svg]:text-[#7595c5]
      [&_>_svg]:text-[length:15px]
    ">{personas ? <FiShield /> : <FiCheckCircle />}{personas ? 'El equipo detrás de cada entrega' : 'Cada producto, bien identificado'}</span></div></header>
    <div className="
      flex items-center justify-between gap-3 mt-[27px] mr-0 mb-4 ml-0 max-[650.001px]:items-start
      [&_h2]:text-[length:16px] [&_h2]:font-[650] [&_h2]:text-[#365474] [&_h2]:tracking-[-.02em]
      max-[650.001px]:[&_h2]:text-[length:14px] [&_>_span]:text-[length:12px] [&_>_span]:text-[#71839b]
      max-[650.001px]:[&_>_span]:text-[length:11px] max-[650.001px]:[&_>_span]:max-w-[130px]
      max-[650.001px]:[&_>_span]:text-right
    "><h2>{personas ? 'Así se organiza tu equipo' : 'Tu catálogo, de un vistazo'}</h2><span>{personas ? 'Resumen de las cuentas registradas' : 'Productos y unidades registrados'}</span></div>
    <section className={` grid gap-[15px] mb-[23px] max-[650.001px]:gap-[10px]  ${{
  "4": "ad-stats-4 [&.ad-stats-4]:grid-cols-[repeat(4,minmax(0,1fr))] max-[1100.001px]:[&.ad-stats-4]:grid-cols-[repeat(2,minmax(0,1fr))]",
  "3": "ad-stats-3 [&.ad-stats-3]:grid-cols-[repeat(3,minmax(0,1fr))] max-[650.001px]:[&.ad-stats-3]:grid-cols-[repeat(2,minmax(0,1fr))] max-[650.001px]:[&.ad-stats-3_>_:last-child]:[grid-column:1_/_-1]"
}[tarjetas.length] || ""}  `} aria-label={personas ? 'Resumen de usuarios' : 'Resumen del catálogo'}>{tarjetas.map(t => {
      const IconoTarjeta = t.icono;
      return <article key={t.titulo} className={`
        [&&]:[--ad-tone:#2563db] [&&]:[--ad-tint:#deebff] relative overflow-hidden
        [&&]:[background:linear-gradient(145deg,_#fff_58%,_#edf3fc)] rounded-[17px] pt-[18px] pr-5 pb-4 pl-5
        [&&]:[box-shadow:var(--app-shadow)] [transition:transform_.2s,box-shadow_.2s] border border-solid
        [&&]:border-[#cddbef] max-[1100.001px]:pt-[17px] max-[1100.001px]:pr-[15px] max-[1100.001px]:pb-[17px]
        max-[1100.001px]:pl-[15px] before:[content:''] before:absolute before:top-0 before:right-0 before:bottom-auto
        before:left-0 [&&::before]:h-1 before:[background:var(--ad-tone)] [&&::before]:opacity-[1]
        hover:[transform:translateY(-3px)] [&&:hover]:[box-shadow:0_13px_28px_#1737661c]
        [@media(prefers-reduced-motion:_reduce)]:[&&:hover]:[transform:none] [&_>_div]:flex [&_>_div]:items-center
        [&_>_div]:gap-[9px] max-[650.001px]:[&_>_div]:items-start [&_>_div_>_span]:flex [&_>_div_>_span]:items-center
        [&_>_div_>_span]:justify-center [&_>_div_>_span]:w-8 [&_>_div_>_span]:h-8 [&_>_div_>_span]:rounded-[10px]
        [&_>_div_>_span]:text-[var(--ad-tone)] [&_>_div_>_span]:[background:var(--ad-tint)]
        [&_>_div_>_span]:text-[length:16px] [&_>_div_>_span]:shrink-0 max-[650.001px]:[&_>_div_>_span]:w-7
        max-[650.001px]:[&_>_div_>_span]:h-7 max-[650.001px]:[&_>_div_>_span]:text-[length:14px]
        [&_h2]:text-[length:12px] [&&_h2]:font-semibold [&&_h2]:text-[#425977] [&_h2]:leading-[1.5] [&_>_strong]:block
        [&_>_strong]:text-[length:31px] [&_>_strong]:leading-[1.2] [&_>_strong]:font-[750]
        [&_>_strong]:tracking-[-.035em] [&&_>_strong]:text-[#142e53] [&_>_strong]:mt-[14px]
        max-[650.001px]:[&_>_strong]:text-[length:29px] [&_>_p]:text-[length:12px] [&&_>_p]:text-[#5b6d84] [&_>_p]:mt-2
        [&_>_p]:leading-[1.5] max-[650.001px]:[&_>_p]:text-[length:11px]
      ${{
  "green": "ad-tone-green [&.ad-tone-green]:[--ad-tone:#078065] [&.ad-tone-green]:[--ad-tint:#d7f4e8]",
  "purple": "ad-tone-purple [&.ad-tone-purple]:[--ad-tone:#7543ce] [&.ad-tone-purple]:[--ad-tint:#eee3ff]",
  "amber": "ad-tone-amber [&.ad-tone-amber]:[--ad-tone:#b86c08] [&.ad-tone-amber]:[--ad-tint:#fff0cc]"
}[t.tono || 'blue'] || ""}  `}><div><span><IconoTarjeta /></span><h2>{t.titulo}</h2></div><strong>{cargando ? '—' : new Intl.NumberFormat('es-MX').format(t.valor)}</strong><p>{t.nota}</p></article>;
    })}</section>
    {cargando ? <div className="
      flex items-center justify-center gap-[10px] pt-[55px] pr-5 pb-[55px] pl-5 rounded-[17px] text-[#6984a8]
      bg-white text-[length:13px] border border-solid border-[var(--ad-line)]
    " role="status"><FiRefreshCw className="animate-ad-spin" />{personas ? 'Preparando las cuentas…' : 'Preparando el catálogo…'}</div> : children}
    <footer className="
      flex flex-wrap justify-between gap-[10px] mt-[22px] mr-[2px] mb-0 ml-[2px] text-[#74869f] text-[length:11px]
      [&_>_span:first-child]:inline-flex [&_>_span:first-child]:items-center [&_>_span:first-child]:gap-[6px]
    "><span><FiClock />{personas ? 'La disponibilidad de acciones depende del rol de tu cuenta.' : 'Un catálogo actualizado facilita la captura de solicitudes.'}</span><span>{personas ? 'Administración de usuarios' : 'Administración del catálogo'}</span></footer>
  </div>;
}
