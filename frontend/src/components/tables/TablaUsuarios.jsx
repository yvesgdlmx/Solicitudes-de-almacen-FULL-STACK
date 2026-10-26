import { FaUserCircle } from 'react-icons/fa';
import { FiEdit3, FiEye, FiLock, FiTrash2, FiUsers } from 'react-icons/fi';
import useAuth from '../../hooks/useAuth';

const roles = { desarrollo: { nombre: 'Desarrollo', tono: 'amber' }, superadmin: { nombre: 'Super admin', tono: 'purple' }, admin: { nombre: 'Administrador', tono: 'blue' }, user: { nombre: 'Usuario', tono: 'slate' } };
export default function TablaUsuarios({ usuariosFiltrados, onEditarUsuario, onEliminarUsuario, onVerPasswordUsuario, obtenerColorIcono, obtenerImagenUsuario }) {
  const { auth } = useAuth();
  return <div className="overflow-x-auto [scrollbar-width:thin] [scrollbar-color:#cbd9ef_#f8fafd]"><table className="
    w-full min-w-185 border-collapse text-left text-[length:13px] [&&_th]:[background:#e4edf9]
    [&&_th]:text-[#284e7c] [&_th]:[border-block:1px_solid_#edf2f9] [&_th]:pt-[14px] [&_th]:pr-[21px]
    [&_th]:pb-[14px] [&_th]:pl-[21px] [&_th]:text-[length:12px] [&&_th]:font-[650] [&_th]:whitespace-nowrap
    [&&_th]:border-[#cedcef] [&_td]:pt-[18px] [&_td]:pr-[21px] [&_td]:pb-[18px] [&_td]:pl-[21px]
    [&_td]:[border-bottom-width:1px] [&_td]:[border-bottom-style:solid] [&&_td]:[border-bottom-color:#e0e8f3]
    [&&_td]:text-[#435c7b] [&_td]:align-middle [&_tbody_tr:last-child_td]:[border-bottom-width:0]
    [&_tbody_tr:last-child_td]:[border-bottom-style:solid]
    [&_tbody_tr:last-child_td]:[border-bottom-color:currentColor] [&&_tbody_tr:hover]:[background:#eaf2ff]
    [&&_tbody_tr:nth-child(even)]:[background:#f7faff]
  "><thead><tr>{['Usuario', 'Rol y acceso', 'Área de trabajo', 'Estado', 'Acciones'].map(t => <th key={t} scope="col">{t}</th>)}</tr></thead><tbody>
    {!usuariosFiltrados.length ? <tr><td colSpan={5}><div className="
      min-h-[230px] pt-[35px] pr-5 pb-[35px] pl-5 text-center flex items-center justify-center flex-col
      [&_>_span]:w-[54px] [&_>_span]:h-[54px] [&_>_span]:rounded-[17px] [&_>_span]:[background:#f0f6fe]
      [&_>_span]:text-[#92add3] [&_>_span]:flex [&_>_span]:items-center [&_>_span]:justify-center
      [&_>_span]:text-[length:25px] [&_>_span]:mb-4 [&_h3]:text-[length:14px] [&_h3]:text-[#647e9f]
      [&_h3]:font-semibold [&_p]:text-[length:12px] [&_p]:text-[#75869f] [&_p]:leading-[1.7] [&_p]:mt-2
      [&_p]:max-w-90 [&_>_button]:mt-[18px]
    "><span><FiUsers /></span><h3>No encontramos cuentas con estos filtros</h3><p>Prueba otro nombre, área o rol para ajustar los resultados.</p></div></td></tr> : usuariosFiltrados.map(usuario => {
      const rol = roles[usuario.rol] || { nombre: usuario.rol || 'Usuario', tono: 'slate' };
      const imagen = obtenerImagenUsuario(usuario.imagenPerfil);
      const protegido = usuario.rol === 'desarrollo' && auth.rol !== 'desarrollo';
      return <tr key={usuario.id}><td><div className="
        flex items-center gap-[11px] [&_>_img]:flex [&_>_img]:items-center [&_>_img]:justify-center [&_>_img]:w-[38px]
        [&_>_img]:h-[38px] [&_>_img]:rounded-[50%] [&_>_img]:object-cover [&_>_img]:shrink-0
        [&_>_img]:[background:#f4f7fc] [&_>_img]:[border-width:3px] [&_>_img]:border-solid [&_>_img]:border-[#f0f5fc]
        [&_strong]:text-[#486b96] [&_strong]:text-[length:13px] [&_strong]:font-semibold
        [&_strong]:[overflow-wrap:anywhere] [&_p]:flex [&_p]:items-center [&_p]:gap-[7px] [&_p]:text-[#75869f]
        [&_p]:text-[length:11px] [&_p]:mt-1
      ">{imagen ? <img src={imagen} alt="" width="38" height="38" /> : <span className="
        flex items-center justify-center w-[38px] h-[38px] rounded-[50%] object-cover shrink-0 [background:#f4f7fc]
        [border-width:3px] border-solid border-[#f0f5fc] [&_>_svg]:w-full [&_>_svg]:h-full
      "><FaUserCircle className={obtenerColorIcono(usuario.colorPerfil)} /></span>}<div><strong>{usuario.user}</strong><p>Cuenta #{usuario.id}{usuario.id === auth.id && <span className="pt-[1px] pr-[5px] pb-[1px] pl-[5px] [background:#edf4ff] text-[#6c8dbf] rounded-[4px] text-[length:10px]">Tú</span>}</p></div></div></td><td><span className={`
        inline-flex items-center gap-[5px] rounded-[6px] pt-[5px] pr-2 pb-[5px] pl-2 text-[length:12px]
        whitespace-nowrap [&_>_i]:w-1 [&_>_i]:h-1 [&_>_i]:rounded-[50%] [&_>_i]:[background:currentColor]
      ${{
  "blue": "ad-badge-blue [&.ad-badge-blue]:text-[#2055b0] [&.ad-badge-blue]:[background:#deebff]",
  "purple": "ad-badge-purple [&.ad-badge-purple]:text-[#6436a5] [&.ad-badge-purple]:[background:#eee3ff]",
  "amber": "ad-badge-amber [&.ad-badge-amber]:text-[#8a570b] [&.ad-badge-amber]:[background:#fff0cc]",
  "green": "ad-badge-green [&.ad-badge-green]:text-[#086b51] [&.ad-badge-green]:[background:#d7f4e8]",
  "slate": "ad-badge-slate [&.ad-badge-slate]:text-[#50617b] [&.ad-badge-slate]:[background:#e8edf5]"
}[rol.tono] || ""}  `}><i />{rol.nombre}</span></td><td>{usuario.area || 'Sin área'}</td><td><span className={`
  inline-flex items-center gap-[5px] rounded-[6px] pt-[5px] pr-2 pb-[5px] pl-2 text-[length:12px]
  whitespace-nowrap [&_>_i]:w-1 [&_>_i]:h-1 [&_>_i]:rounded-[50%] [&_>_i]:[background:currentColor]
${{
  "blue": "ad-badge-blue [&.ad-badge-blue]:text-[#2055b0] [&.ad-badge-blue]:[background:#deebff]",
  "purple": "ad-badge-purple [&.ad-badge-purple]:text-[#6436a5] [&.ad-badge-purple]:[background:#eee3ff]",
  "amber": "ad-badge-amber [&.ad-badge-amber]:text-[#8a570b] [&.ad-badge-amber]:[background:#fff0cc]",
  "green": "ad-badge-green [&.ad-badge-green]:text-[#086b51] [&.ad-badge-green]:[background:#d7f4e8]",
  "slate": "ad-badge-slate [&.ad-badge-slate]:text-[#50617b] [&.ad-badge-slate]:[background:#e8edf5]"
}[usuario.confirmado ? 'green' : 'amber'] || ""}  `}><i />{usuario.confirmado ? 'Activo' : 'Pendiente'}</span></td><td><div className="
  ad-row-actions flex items-center gap-[7px] [&_button]:inline-flex [&_button]:items-center
  [&_button]:justify-center [&_button]:w-[30px] [&_button]:h-[30px] [&_button]:rounded-[8px]
  [&_button]:text-[#6b87ad] [&_button]:bg-white [&_button]:text-[length:14px] [&_button]:border
  [&_button]:border-solid [&_button]:border-[#e4ecf7] [&_button:hover:not(:disabled)]:[background:#f0f6ff]
  [&_button:hover:not(:disabled)]:text-[#426fad] [&_button:hover:not(:disabled)]:border-[#c8daf4]
">{usuario.rol === 'user' && <button onClick={() => onVerPasswordUsuario(usuario)} title="Ver contraseña" aria-label={`Ver contraseña de ${usuario.user}`}><FiEye /></button>}<button onClick={() => onEditarUsuario(usuario)} disabled={protegido} title={protegido ? 'Solo desarrollo puede editar esta cuenta' : 'Editar usuario'} aria-label={`Editar cuenta ${usuario.user}`}>{protegido ? <FiLock /> : <FiEdit3 />}</button>{usuario.id !== auth.id && !protegido && <button className="[.ad-row-actions_&:hover]:text-[#a96875] [.ad-row-actions_&:hover]:[background:#fff5f7] [.ad-row-actions_&:hover]:border-[#efd9df]" onClick={() => onEliminarUsuario(usuario)} title="Eliminar usuario" aria-label={`Eliminar cuenta ${usuario.user}`}><FiTrash2 /></button>}</div></td></tr>;
    })}
  </tbody></table></div>;
}