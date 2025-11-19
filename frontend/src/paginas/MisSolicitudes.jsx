import { useState, useEffect } from "react"
import TablaSolicitudes from "../components/tables/TablaSolicitudes"
import ModalNuevaSolicitud from "../components/modales/ModalNuevaSolicitud"
import ModalDetalleSolicitud from "../components/modales/ModalDetalleSolicitud"
import FiltroEstadoSolicitudes from "../components/FiltroEstadoSolicitudes"
import LeyendaHorarios from "../components/LeyendaHorarios"
import useSolicitud from "../hooks/useSolicitud"
import useFormularioSolicitud from "../hooks/useFormularioSolicitud"
import Spinner from "../components/spinners/Spinner"

const MisSolicitudes = () => {
  const {
    datos,
    cargandoDatos,
    cargando,
    obtenerSolicitudesUsuario,
    handleGuardarSolicitud,
    cargarSolicitudParaEditar,
    handleActualizarSolicitud,
    handleEliminarSOlicitud,
    obtenerSolicitud
  } = useSolicitud();

  // AGREGAR cerrarModal aquí:
  const { abrirModal, cerrarModal, modo } = useFormularioSolicitud();
  const [modalDetalleAbierto, setModalDetalleAbierto] = useState(false);
  const [solicitudDetalle, setSolicitudDetalle] = useState(null);
  const [filtroEstado, setFiltroEstado] = useState("Todos");
  const [solicitudIdEditando, setSolicitudIdEditando] = useState(null);

  useEffect(() => {
    obtenerSolicitudesUsuario()
  }, []);

  const datosFiltrados = filtroEstado === "Todos" ? datos : datos.filter((item) => item.status === filtroEstado);
  
  const abrirModalCrear = () => {
    setSolicitudIdEditando(null);
    abrirModal();
  };
  
  const cerrarModalDetalle = () => {
    setModalDetalleAbierto(false);
    setSolicitudDetalle(null);
  }

  const handleFiltroEstado = (estado) => setFiltroEstado(estado);

  // AQUÍ ESTÁ EL CAMBIO IMPORTANTE:
  const onGuardar = async (formulario) => {
    let resp;
    
    if (modo === 'editar' && solicitudIdEditando) {
      resp = await handleActualizarSolicitud(solicitudIdEditando, formulario);
    } else {
      resp = await handleGuardarSolicitud(formulario);
    }
    
    // Si fue exitoso, cerrar el modal
    if (resp) {
      cerrarModal();
    }
  };

  const onEditar = async (row) => {
    const form = await cargarSolicitudParaEditar(row.id);
    if (form) {
      setSolicitudIdEditando(row.id);
      abrirModal(form, 'editar');
    }
  };

  const onEliminar = async (solicitud) => {
    await handleEliminarSOlicitud(solicitud.id, solicitud.folio);
  };

  const onVerDetalle = async (solicitud) => {
    setModalDetalleAbierto(true);
    const detalle = await obtenerSolicitud(solicitud.id);
    if(detalle) {
      setSolicitudDetalle(detalle);
    }
  }

  if (cargandoDatos) {
    return <Spinner/>;
  }

  return (
    <div className="space-y-6">
      <FiltroEstadoSolicitudes
        estadoActivo={filtroEstado}
        onCambiarEstado={handleFiltroEstado}
        datos={datos}
        titulo="Filtrar Mis Solicitudes"
      />

      <LeyendaHorarios />

      <TablaSolicitudes
        datos={datosFiltrados}
        onCrearSolicitud={abrirModalCrear}
        showAcciones={true}
        onEditar={onEditar}
        onEliminar={onEliminar}
        onVerDetalle={onVerDetalle}
        titulo="Mis Solicitudes"
      />

      <ModalNuevaSolicitud
        onGuardar={onGuardar}
        cargando={cargando}
      />

      <ModalDetalleSolicitud 
        isOpen={modalDetalleAbierto}
        onRequestClose={cerrarModalDetalle}
        solicitud={solicitudDetalle}
        cargando={cargando}
      />
    </div>
  );
}

export default MisSolicitudes