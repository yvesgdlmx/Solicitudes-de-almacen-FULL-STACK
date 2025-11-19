import { useEffect, useState } from "react"
import useSolicitud from "../hooks/useSolicitud"
import TablaSolicitudes from "../components/tables/TablaSolicitudes"
import FiltroEstadoSolicitudes from "../components/FiltroEstadoSolicitudes"
import Spinner from "../components/spinners/Spinner"
import ModalDetalleSolicitud from "../components/modales/ModalDetalleSolicitud"

const TodasSolicitudes = () => {
  const { datos, cargandoDatos, cargando, obtenerTodasSolicitudes, obtenerSolicitud } = useSolicitud();
  const [filtroEstado, setFiltroEstado] = useState('Todos');
  const [modalDetalleAbierto, setModalDetalleAbierto] = useState(false);
  const [solicitudDetalle, setSolicitudDetalle] = useState(null);

  useEffect(() => {
    obtenerTodasSolicitudes();
  }, []);

  const datosFiltrados = filtroEstado === 'Todos'
    ? datos
    : datos.filter(item => item.status === filtroEstado);

  const cerrarModalDetalle = () => {
    setModalDetalleAbierto(false);
    setSolicitudDetalle(null);
  }

  const onVerDetalle = async (solicitud) => {
    setModalDetalleAbierto(true);
    const detalle = await obtenerSolicitud(solicitud.id);
    if (detalle) {
      setSolicitudDetalle(detalle);
    }
  }

  if (cargandoDatos) { return <Spinner /> }
  
  return (
    <div>
      <FiltroEstadoSolicitudes 
        estadoActivo={filtroEstado}
        onCambiarEstado={setFiltroEstado}
        datos={datos}
        titulo="Filtrar todas las solicitudes"
      />
      <TablaSolicitudes 
        datos={datosFiltrados}
        titulo="Todas las solicitudes"
        showAcciones={false}
        onVerDetalle={onVerDetalle}
      />
      <ModalDetalleSolicitud
        isOpen={modalDetalleAbierto}
        onRequestClose={cerrarModalDetalle}
        solicitud={solicitudDetalle}
        cargando={cargando}
      />
    </div>
  )
}

export default TodasSolicitudes
