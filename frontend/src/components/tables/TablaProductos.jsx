import { FiBox, FiEdit2, FiPlus, FiTrash2 } from 'react-icons/fi';

export default function TablaProductos({ productosFiltrados, productos, filtroTexto, cargando, onEditar, onEliminar, onNuevoProducto }) {
  return <>
    <div className="overflow-x-auto [scrollbar-width:thin] [scrollbar-color:#cbd9ef_#f8fafd]"><table className="
      w-full min-w-185 border-collapse text-left text-[length:13px] [&&_th]:[background:#e4edf9]
      [&&_th]:text-[#284e7c] [&_th]:[border-block:1px_solid_#edf2f9] [&_th]:pt-[14px] [&_th]:pr-[21px]
      [&_th]:pb-[14px] [&_th]:pl-[21px] [&_th]:text-[length:12px] [&&_th]:font-[650] [&_th]:whitespace-nowrap
      [&&_th]:border-[#cedcef] [&_td]:pt-[18px] [&_td]:pr-[21px] [&_td]:pb-[18px] [&_td]:pl-[21px]
      [&_td]:[border-bottom-width:1px] [&_td]:[border-bottom-style:solid] [&&_td]:[border-bottom-color:#e0e8f3]
      [&&_td]:text-[#435c7b] [&_td]:align-middle [&_tbody_tr:last-child_td]:[border-bottom-width:0]
      [&_tbody_tr:last-child_td]:[border-bottom-style:solid]
      [&_tbody_tr:last-child_td]:[border-bottom-color:currentColor] [&&_tbody_tr:hover]:[background:#eaf2ff]
      [&&_tbody_tr:nth-child(even)]:[background:#f7faff]
    "><thead><tr>{['ID', 'Código', 'Producto', 'Unidad de medida', 'Acciones'].map(t => <th key={t} scope="col">{t}</th>)}</tr></thead><tbody>
      {!productosFiltrados.length ? <tr><td colSpan={5}><div className="
        min-h-[230px] pt-[35px] pr-5 pb-[35px] pl-5 text-center flex items-center justify-center flex-col
        [&_>_span]:w-[54px] [&_>_span]:h-[54px] [&_>_span]:rounded-[17px] [&_>_span]:[background:#f0f6fe]
        [&_>_span]:text-[#92add3] [&_>_span]:flex [&_>_span]:items-center [&_>_span]:justify-center
        [&_>_span]:text-[length:25px] [&_>_span]:mb-4 [&_h3]:text-[length:14px] [&_h3]:text-[#647e9f]
        [&_h3]:font-semibold [&_p]:text-[length:12px] [&_p]:text-[#75869f] [&_p]:leading-[1.7] [&_p]:mt-2
        [&_p]:max-w-90 [&_>_button]:mt-[18px]
      "><span><FiBox /></span><h3>{filtroTexto ? 'No encontramos productos con ese filtro' : 'Tu catálogo empieza aquí'}</h3><p>{filtroTexto ? 'Prueba otro nombre o unidad de medida.' : 'Registra tu primer producto para tenerlo disponible al crear solicitudes.'}</p>{!filtroTexto && <button className="
        inline-flex items-center justify-center gap-2 pt-[11px] pr-[15px] pb-[11px] pl-[15px] rounded-[10px]
        text-[length:13px] font-semibold [&&]:[background:linear-gradient(115deg,_#1967ed,_#164fc7)] [&&]:text-white
        [&&]:[box-shadow:0_5px_12px_#0729602b,_inset_0_1px_#ffffff30] [&&:hover]:[background:#124bbd]
        hover:[transform:translateY(-1px)]
      " onClick={onNuevoProducto} disabled={cargando}><FiPlus />Agregar primer producto</button>}</div></td></tr>
        : productosFiltrados.map(producto => <tr key={producto.id}><td><span className="text-[#778aa5] text-[length:12px]">#{producto.id}</span></td><td><span className="[font-family:ui-monospace,SFMono-Regular,monospace] text-[length:12px] [background:#f5f8fd] text-[#667f9f] pt-[5px] pr-2 pb-[5px] pl-2 rounded-[5px]">{producto.codigo || 'Sin código'}</span></td><td><div className="
          flex items-center gap-[10px] [&_>_span]:flex [&_>_span]:items-center [&_>_span]:justify-center
          [&_>_span]:w-[33px] [&_>_span]:h-[35px] [&_>_span]:rounded-[10px] [&_>_span]:[background:#f1f6fe]
          [&_>_span]:text-[#7a9bc9] [&_>_span]:text-[length:17px] [&_>_span]:shrink-0 [&_>_span]:border
          [&_>_span]:border-solid [&_>_span]:border-[#e7eef9] [&_strong]:text-[length:13px] [&_strong]:font-semibold
          [&_strong]:text-[#516e94] [&_strong]:max-w-95 [&_strong]:[overflow-wrap:anywhere]
        "><span><FiBox /></span><strong title={producto.nombre}>{producto.nombre}</strong></div></td><td><span className="
          ad-badge-blue inline-flex items-center gap-[5px] rounded-[6px] pt-[5px] pr-2 pb-[5px] pl-2 text-[length:12px]
          whitespace-nowrap [&_>_i]:w-1 [&_>_i]:h-1 [&_>_i]:rounded-[50%] [&_>_i]:[background:currentColor]
          [&.ad-badge-blue]:text-[#2055b0] [&.ad-badge-blue]:[background:#deebff]
        ">{producto.unidad}</span></td><td><div className="
          ad-row-actions flex items-center gap-[7px] [&_button]:inline-flex [&_button]:items-center
          [&_button]:justify-center [&_button]:w-[30px] [&_button]:h-[30px] [&_button]:rounded-[8px]
          [&_button]:text-[#6b87ad] [&_button]:bg-white [&_button]:text-[length:14px] [&_button]:border
          [&_button]:border-solid [&_button]:border-[#e4ecf7] [&_button:hover:not(:disabled)]:[background:#f0f6ff]
          [&_button:hover:not(:disabled)]:text-[#426fad] [&_button:hover:not(:disabled)]:border-[#c8daf4]
        "><button onClick={() => onEditar(producto)} disabled={cargando} title="Editar producto" aria-label={`Editar producto ${producto.nombre}`}><FiEdit2 /></button><button className="[.ad-row-actions_&:hover]:text-[#a96875] [.ad-row-actions_&:hover]:[background:#fff5f7] [.ad-row-actions_&:hover]:border-[#efd9df]" onClick={() => onEliminar(producto)} disabled={cargando} title="Eliminar producto" aria-label={`Eliminar producto ${producto.nombre}`}><FiTrash2 /></button></div></td></tr>)}
    </tbody></table></div>
    <div className="
      [border-top-width:1px] [border-top-style:solid] [border-top-color:#edf2f9] pt-[17px] pr-[23px] pb-[17px]
      pl-[23px] text-[#71849e] text-[length:12px] [&_strong]:font-semibold [&_strong]:text-[#547194]
    ">Mostrando <strong>{productosFiltrados.length}</strong> de {productos.length} productos</div>
  </>;
}