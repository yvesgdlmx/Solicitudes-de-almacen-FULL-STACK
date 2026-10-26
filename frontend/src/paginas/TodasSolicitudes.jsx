import { useEffect, useState } from 'react';
import useSolicitud from '../hooks/useSolicitud';
import TablaSolicitudes from '../components/tables/TablaSolicitudes';
import FiltroEstadoSolicitudes from '../components/FiltroEstadoSolicitudes';
import ModalDetalleSolicitud from '../components/modales/ModalDetalleSolicitud';
import PanelSolicitudes from '../components/solicitudes/PanelSolicitudes';

export default function TodasSolicitudes() {
  const { datos, cargandoDatos, cargando, obtenerTodasSolicitudes, obtenerSolicitud } = useSolicitud();
  const [filtroEstado, setFiltroEstado] = useState('Todos');
  const [modalDetalleAbierto, setModalDetalleAbierto] = useState(false);
  const [solicitudDetalle, setSolicitudDetalle] = useState(null);
  useEffect(() => { obtenerTodasSolicitudes(); }, []);
  const datosFiltrados = filtroEstado === 'Todos' ? datos : datos.filter(s => s.status === filtroEstado);
  const cerrarDetalle = () => { setModalDetalleAbierto(false); setSolicitudDetalle(null); };
  const verDetalle = async solicitud => {
    setSolicitudDetalle(null);
    setModalDetalleAbierto(true);
    const detalle = await obtenerSolicitud(solicitud.id);
    if (detalle) setSolicitudDetalle(detalle); else setModalDetalleAbierto(false);
  };
  return <>
    <PanelSolicitudes equipo datos={datos} cargando={cargandoDatos} actualizar={obtenerTodasSolicitudes}>
      <FiltroEstadoSolicitudes estadoActivo={filtroEstado} onCambiarEstado={setFiltroEstado} datos={datos} titulo="Organiza la atención por estado" />
      <TablaSolicitudes datos={datosFiltrados} titulo="Solicitudes del equipo" onVerDetalle={verDetalle}
        ocupado={cargando} imagenVacia="/img/todas-solicitudes-v1.png" />
    </PanelSolicitudes>
    <ModalDetalleSolicitud isOpen={modalDetalleAbierto} onRequestClose={cerrarDetalle} solicitud={solicitudDetalle} cargando={cargando} />
  </>;
}