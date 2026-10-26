

export default function MarcaAlmacen({ compacta = false, acceso = false }) {
  return (
    <div className={` flex items-center gap-0 w-full max-w-62 text-[#00b5dd] ${compacta ? " marca-almacen--compacta [&.marca-almacen--compacta]:w-16" : ""}  ${acceso ? " marca-almacen--acceso [&.marca-almacen--acceso]:max-w-[330px]" : ""}  `}>
      <img className="block flex-1 min-w-0 w-0 h-auto object-contain" src="/img/logo_real.png" alt="Laboratorio OPTIMEX" />
    </div>
  );
}
