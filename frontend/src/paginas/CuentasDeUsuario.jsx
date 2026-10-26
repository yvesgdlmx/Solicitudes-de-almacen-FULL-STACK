import { useEffect, useState } from 'react';
import { FiBriefcase, FiCheckCircle, FiFilter, FiSearch, FiShield, FiUsers, FiX } from 'react-icons/fi';
import useUsuarios from '../hooks/useUsuarios';
import ModalUsuario from '../components/modales/ModalUsuario';
import TablaUsuarios from '../components/tables/TablaUsuarios';
import PanelAdministracion from '../components/administracion/PanelAdministracion';

const baseUrl = import.meta.env.VITE_BACKEND_URL || '';
const roles = { desarrollo: 'Desarrollo', superadmin: 'Super admin', admin: 'Administrador', user: 'Usuario' };
const normalizar = valor => String(valor || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

export default function CuentasDeUsuario() {
  const [busqueda, setBusqueda] = useState('');
  const [filtroRol, setFiltroRol] = useState('todos');
  const [mostrarModalNuevo, setMostrarModalNuevo] = useState(false);
  const [mostrarModalEditar, setMostrarModalEditar] = useState(false);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
  const { usuarios, cargandoUsuarios, obtenerUsuarios, eliminarUsuario, verPasswordUsuario } = useUsuarios();
  useEffect(() => { obtenerUsuarios(); }, []);
  const usuariosFiltrados = usuarios.filter(u => (filtroRol === 'todos' || u.rol === filtroRol)
    && (!busqueda.trim() || [u.user, u.area].some(valor => normalizar(valor).includes(normalizar(busqueda.trim())))));
  const editar = usuario => { setUsuarioSeleccionado(usuario); setMostrarModalEditar(true); };
  const cerrarEditar = () => { setMostrarModalEditar(false); setUsuarioSeleccionado(null); };
  const obtenerImagen = imagen => !imagen ? null : typeof imagen === 'string' ? `${baseUrl}/${imagen.replace(/\\/g, '/')}` : imagen.url;
  const tarjetas = [
    { titulo: 'Cuentas registradas', valor: usuarios.length, nota: 'El directorio de tu equipo', icono: FiUsers, tono: 'blue' },
    { titulo: 'Cuentas activas', valor: usuarios.filter(u => u.confirmado).length, nota: 'Usuarios confirmados', icono: FiCheckCircle, tono: 'green' },
    { titulo: 'Acceso administrativo', valor: usuarios.filter(u => ['admin','superadmin','desarrollo'].includes(u.rol)).length, nota: 'Administración y desarrollo', icono: FiShield, tono: 'purple' },
    { titulo: 'Áreas representadas', valor: new Set(usuarios.map(u => u.area).filter(Boolean)).size, nota: 'Áreas con cuentas registradas', icono: FiBriefcase, tono: 'amber' },
  ];
  return <>
    <PanelAdministracion tipo="usuarios" cargando={cargandoUsuarios} actualizar={obtenerUsuarios} crear={() => setMostrarModalNuevo(true)} tarjetas={tarjetas}>
      <section className="bg-white rounded-[18px] [&&]:[box-shadow:var(--app-shadow)] overflow-hidden border border-solid [&&]:border-[var(--app-line)]"><div className="
        flex justify-between items-center gap-3 pt-[22px] pr-[23px] pb-[18px] pl-[23px]
        [&&]:[background:linear-gradient(110deg,_#f0f5fd,_#fff)] max-[650.001px]:items-start max-[650.001px]:pt-[19px]
        max-[650.001px]:pr-[18px] max-[650.001px]:pb-[19px] max-[650.001px]:pl-[18px] [&_>_div]:flex
        [&_>_div]:items-center [&_>_div]:gap-[11px] [&_h2]:text-[length:14px] [&_h2]:font-[650] [&&_h2]:text-[#243f64]
        max-[650.001px]:[&_h2]:text-[length:13px] [&_p]:text-[length:12px] [&&_p]:text-[#5b6e87] [&_p]:mt-1
        max-[650.001px]:[&_p]:text-[length:11px]
      "><div><span className="flex items-center justify-center w-[33px] h-[33px] rounded-[10px] [&&]:[background:#e0ebfd] [&&]:text-[#245fc1] text-[length:16px] shrink-0"><FiUsers /></span><div><h2>El directorio de tu equipo</h2><p>Consulta cuentas, roles y áreas de trabajo.</p></div></div><span className="text-[#617b9b] text-[length:11px] pt-[5px] pr-2 pb-[5px] pl-2 rounded-[7px] [background:#f6f9fd] whitespace-nowrap border border-solid border-[#e8eef8]">{usuariosFiltrados.length} cuentas</span></div>
        <div className="
          flex flex-wrap items-center gap-3 pt-0 pr-[23px] pb-5 pl-[23px] max-[650.001px]:pt-0 max-[650.001px]:pr-[18px]
          max-[650.001px]:pb-[18px] max-[650.001px]:pl-[18px]
        "><label className="
          block relative flex-1 min-w-55 max-[650.001px]:min-w-0 max-[650.001px]:basis-full [&_>_svg]:absolute
          [&_>_svg]:left-[12px] [&_>_svg]:top-[13px] [&_>_svg]:w-[15px] [&_>_svg]:text-[#8aa1c2]
          [&_>_svg]:pointer-events-none [&_input]:w-full [&_input]:h-[41px] [&_input]:rounded-[9px]
          [&_input]:[background:#fafcff] [&_input]:pt-[9px] [&_input]:pr-3 [&_input]:pb-[9px] [&_input]:pl-[35px]
          [&_input]:[outline:none] [&_input]:text-[length:13px] [&_input]:text-[#526f96] [&_input]:border
          [&_input]:border-solid [&_input]:border-[#e1e9f6] [&_input::placeholder]:text-[#7c8da5]
          [&_input:focus]:bg-white [&_input:focus]:border-[#a5c0e9]
        "><FiSearch /><input type="search" value={busqueda} onChange={e => setBusqueda(e.target.value)} placeholder="Buscar por usuario o área…" aria-label="Buscar usuarios" /></label><label className="
          relative min-w-[190px] max-[650.001px]:flex-1 [&_>_svg]:absolute [&_>_svg]:top-[13px] [&_>_svg]:left-[11px]
          [&_>_svg]:text-[#869fbe] [&_>_svg]:text-[length:14px] [&_>_svg]:pointer-events-none [&_select]:h-[41px]
          [&_select]:w-full [&_select]:pt-2 [&_select]:pr-[13px] [&_select]:pb-2 [&_select]:pl-[33px]
          [&_select]:rounded-[9px] [&_select]:[background:#fafcff] [&_select]:text-[#607b9e]
          [&_select]:text-[length:12px] [&_select]:border [&_select]:border-solid [&_select]:border-[#e1e9f6]
        "><FiFilter /><select aria-label="Filtrar por rol" value={filtroRol} onChange={e => setFiltroRol(e.target.value)}><option value="todos">Todos los roles</option>{Object.entries(roles).map(([rol, nombre]) => <option key={rol} value={rol}>{nombre}</option>)}</select></label>{(busqueda || filtroRol !== 'todos') && <button className="inline-flex items-center gap-[5px] pt-[9px] pr-1 pb-[9px] pl-1 text-[length:12px] text-[#6783a6] hover:text-[#3f6cae]" onClick={() => { setBusqueda(''); setFiltroRol('todos'); }}><FiX />Limpiar</button>}</div>
        <TablaUsuarios usuariosFiltrados={usuariosFiltrados} onEditarUsuario={editar} onEliminarUsuario={u => eliminarUsuario(u.id, u.user)} onVerPasswordUsuario={verPasswordUsuario} obtenerColorIcono={color => color || 'text-gray-400'} obtenerImagenUsuario={obtenerImagen} />
        <div className="
          [border-top-width:1px] [border-top-style:solid] [border-top-color:#edf2f9] pt-[17px] pr-[23px] pb-[17px]
          pl-[23px] text-[#71849e] text-[length:12px] [&_strong]:font-semibold [&_strong]:text-[#547194]
        ">Mostrando <strong>{usuariosFiltrados.length}</strong> de {usuarios.length} cuentas</div>
      </section>
    </PanelAdministracion>
    <ModalUsuario isOpen={mostrarModalNuevo} onRequestClose={() => setMostrarModalNuevo(false)} />
    <ModalUsuario isOpen={mostrarModalEditar} onRequestClose={cerrarEditar} usuarioEditar={usuarioSeleccionado} />
  </>;
}