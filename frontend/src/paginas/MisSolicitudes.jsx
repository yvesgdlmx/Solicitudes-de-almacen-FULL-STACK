import { useEffect, useState } from 'react';
import TablaSolicitudes from '../components/tables/TablaSolicitudes';
import ModalNuevaSolicitud from '../components/modales/ModalNuevaSolicitud';
import ModalDetalleSolicitud from '../components/modales/ModalDetalleSolicitud';
import FiltroEstadoSolicitudes from '../components/FiltroEstadoSolicitudes';
import PanelSolicitudes from '../components/solicitudes/PanelSolicitudes';
import useSolicitud from '../hooks/useSolicitud';
import useFormularioSolicitud from '../hooks/useFormularioSolicitud';
import useUnidadMedida from '../hooks/useUnidadMedida';

export default function MisSolicitudes() {
  const { datos, cargandoDatos, cargando, obtenerSolicitudesUsuario, handleGuardarSolicitud,
    cargarSolicitudParaEditar, handleActualizarSolicitud, handleEliminarSOlicitud, obtenerSolicitud } = useSolicitud();
  const { unidades } = useUnidadMedida();
  const { abrirModal, cerrarModal, modo } = useFormularioSolicitud();
  const [modalDetalleAbierto, setModalDetalleAbierto] = useState(false);
  const [solicitudDetalle, setSolicitudDetalle] = useState(null);
  const [filtroEstado, setFiltroEstado] = useState('Todos');
  const [solicitudIdEditando, setSolicitudIdEditando] = useState(null);
  useEffect(() => { obtenerSolicitudesUsuario(); }, []);
  const datosFiltrados = filtroEstado === 'Todos' ? datos : datos.filter(s => s.status === filtroEstado);
  const abrirModalCrear = () => { if (cargando) return; setSolicitudIdEditando(null); abrirModal(); };
  const cerrarDetalle = () => { setModalDetalleAbierto(false); setSolicitudDetalle(null); };
  const guardar = async formulario => {
    const respuesta = modo === 'editar' && solicitudIdEditando
      ? await handleActualizarSolicitud(solicitudIdEditando, formulario)
      : await handleGuardarSolicitud(formulario);
    if (respuesta) cerrarModal();
  };
  const editar = async solicitud => {
    const formulario = await cargarSolicitudParaEditar(solicitud.id);
    if (formulario) { setSolicitudIdEditando(solicitud.id); abrirModal(formulario, 'editar'); }
  };
  const verDetalle = async solicitud => {
    setSolicitudDetalle(null);
    setModalDetalleAbierto(true);
    const detalle = await obtenerSolicitud(solicitud.id);
    if (detalle) setSolicitudDetalle(detalle); else setModalDetalleAbierto(false);
  };
  return <>
    <PanelSolicitudes datos={datos} cargando={cargandoDatos} actualizar={obtenerSolicitudesUsuario} nuevaSolicitud={abrirModalCrear}>
      <FiltroEstadoSolicitudes estadoActivo={filtroEstado} onCambiarEstado={setFiltroEstado} datos={datos} titulo="Sigue cada etapa de tu solicitud" />
      <TablaSolicitudes datos={datosFiltrados} titulo="Tu historial de solicitudes" showAcciones onEditar={editar}
        onEliminar={solicitud => handleEliminarSOlicitud(solicitud.id, solicitud.folio)} onVerDetalle={verDetalle}
        onCrearSolicitud={abrirModalCrear} ocupado={cargando} imagenVacia="/img/mis-solicitudes-v1.png" />
    </PanelSolicitudes>
    <ModalNuevaSolicitud onGuardar={guardar} cargando={cargando} unidadesDisponibles={unidades} />
    <ModalDetalleSolicitud isOpen={modalDetalleAbierto} onRequestClose={cerrarDetalle} solicitud={solicitudDetalle} cargando={cargando} />
  </>;
}