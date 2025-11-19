import React, {useState, useEffect} from "react";
import Modal from "react-modal";
import { formatearTextoEstado, formatearFecha } from "../../functions/Index";
import { FaTimes, FaFileAlt, FaUser, FaExclamationTriangle, FaList, FaComment, FaSave, FaCalendarAlt, FaClock, FaUserShield, FaFilePdf } from "react-icons/fa";
import { PDFDownloadLink } from "@react-pdf/renderer";
import SolicitudPDF from "../herramientasPDF/SolicitudPDF";
import useSolicitud from "../../hooks/useSolicitud";
import useAuth from "../../hooks/useAuth";

const ModalDetalleSolicitud = ({ isOpen, onRequestClose, solicitud, cargando }) => {
  const [statusSeleccionado, setStatusSeleccionado] = useState('');
  const [comentarioAdmin, setComentarioAdmin] = useState('');
  const [comentarioInicialAdmin, setComentarioInicialAdmin] = useState('');
  const [cambiandoStatus, setCambiandoStatus] = useState(false);
  const { cambiarStatusSolicitud } = useSolicitud();
  const { auth } = useAuth();

  useEffect(() => {
    if (solicitud && isOpen) {
      // Status
      if (solicitud.status) {
        const statusNormalizado = solicitud.status.trim().toLowerCase();
        setStatusSeleccionado(statusNormalizado);
      } else {
        setStatusSeleccionado('pendiente autorizacion');
      }
      
      // Comentario admin - almacenar tanto el valor inicial como el actual
      const comentarioInicial = solicitud.comentarioAdmin || '';
      setComentarioAdmin(comentarioInicial);
      setComentarioInicialAdmin(comentarioInicial);
    }
  }, [solicitud, isOpen]);

  useEffect(() => {
    if (!isOpen) {
      setStatusSeleccionado('');
      setComentarioAdmin('');
      setComentarioInicialAdmin('');
      setCambiandoStatus(false);
    }
  }, [isOpen]);

  if (!solicitud && !cargando) return null;

  const { fecha, hora } = solicitud ? formatearFecha(solicitud.fechaHora) : { fecha: "", hora: "" };

  const statusOptions = [
    { value: 'pendiente autorizacion', label: 'Pendiente Autorización' },
    { value: 'autorizada', label: 'Autorizada' },
    { value: 'rechazada', label: 'Rechazada' },
    { value: 'entrega parcial', label: 'Entrega Parcial' },
    { value: 'surtido', label: 'Surtido' },
  ];

  const esAdmin = ['admin', 'superadmin'].includes(auth?.rol);

  const hayCambiosPendientes = () => {
    if (!solicitud || !statusSeleccionado) return false;
    
    const statusActualNormalizado = solicitud.status ? solicitud.status.trim().toLowerCase() : '';
    const statusSeleccionadoNormalizado = statusSeleccionado.trim().toLowerCase();
    
    // Comparar con el comentario inicial en lugar del comentario actual de la solicitud
    const comentarioActual = comentarioInicialAdmin;
    const comentarioNuevo = comentarioAdmin.trim();
    
    // Hay cambios si el status cambió O si el comentario cambió
    return statusActualNormalizado !== statusSeleccionadoNormalizado || comentarioActual !== comentarioNuevo;
  };

  const handleCerrarModal = async () => {
    if (esAdmin && hayCambiosPendientes()) {
      setCambiandoStatus(true);
      const resultado = await cambiarStatusSolicitud(solicitud.id, statusSeleccionado, comentarioAdmin);
      setCambiandoStatus(false);
      
      if (resultado.success) {
        // Actualizar la solicitud con los nuevos valores
        solicitud.status = statusSeleccionado;
        solicitud.comentarioAdmin = comentarioAdmin.trim();
        
        // Actualizar el comentario inicial para la próxima vez que se abra
        setComentarioInicialAdmin(comentarioAdmin.trim());
      }
    }
    
    onRequestClose();
  };

  const getBotonCerrarProps = () => {
    if (cambiandoStatus) {
      return {
        texto: 'Guardando...',
        className: 'bg-blue-600 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 cursor-not-allowed opacity-75',
        disabled: true
      };
    }
    
    if (esAdmin && hayCambiosPendientes()) {
      return {
        texto: 'Guardar y Cerrar',
        className: 'bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2',
        disabled: false
      };
    }
    
    return {
      texto: 'Cerrar',
      className: 'bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg font-medium transition-colors',
      disabled: false
    };
  };

  const botonProps = getBotonCerrarProps();

  // Función para obtener el color del status
  const getStatusColor = (status) => {
    switch (status) {
      case "pendiente autorizacion":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "autorizada":
        return "bg-purple-100 text-purple-700 border-purple-200";
      case "rechazada":
        return "bg-red-100 text-red-700 border-red-200";
      case "entrega parcial":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "surtido":
        return "bg-green-100 text-green-700 border-green-200";
      default:
        return "bg-gray-100 text-gray-600 border-gray-200";
    }
  };

  // Función para obtener el color de prioridad
  const getPrioridadColor = (prioridad) => {
    switch (prioridad) {
      case 'muy alto':
        return "bg-red-100 text-red-700 border-red-200";
      case 'alto':
        return "bg-orange-100 text-orange-700 border-orange-200";
      case 'moderado':
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      default:
        return "bg-green-100 text-green-700 border-green-200";
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={!cambiandoStatus ? handleCerrarModal : undefined}
      className="w-[95vw] max-w-[900px] mx-auto mt-8 bg-white rounded-xl shadow-2xl outline-none max-h-[90vh] overflow-hidden"
      overlayClassName="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-start justify-center p-4 z-50"
      ariaHideApp={false}
      shouldCloseOnOverlayClick={!cambiandoStatus}
      shouldCloseOnEsc={!cambiandoStatus}
    >
      <div className="flex flex-col h-full max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 flex-shrink-0">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <FaFileAlt className="text-2xl" />
              <div>
                <h2 className="text-xl font-bold">Detalle de Solicitud</h2>
                {solicitud && (
                  <p className="text-blue-100 text-sm mt-1">
                    Folio: {solicitud.folio}
                  </p>
                )}
              </div>
            </div>
            <button
              onClick={handleCerrarModal}
              disabled={cambiandoStatus}
              className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FaTimes className="text-lg" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {cargando ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-gray-600">Cargando detalles...</span>
            </div>
          ) : solicitud ? (
            <div className="space-y-6">
              {/* Información básica en tarjetas */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Fecha y hora */}
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-2 mb-2">
                    <FaCalendarAlt className="text-blue-600" />
                    <span className="font-medium text-gray-700">Fecha</span>
                  </div>
                  <p className="text-gray-900 font-semibold">{fecha}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <FaClock className="text-blue-600" />
                    <span className="text-gray-600">{hora}</span>
                  </div>
                </div>

                {/* Solicitante */}
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-2 mb-2">
                    <FaUser className="text-blue-600" />
                    <span className="font-medium text-gray-700">Solicitante</span>
                  </div>
                  <p className="text-gray-900 font-semibold">{solicitud.usuario?.user || solicitud.solicitante}</p>
                  <p className="text-gray-600 text-sm mt-1">Área: {solicitud.area}</p>
                </div>

                {/* Prioridad */}
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-2 mb-2">
                    <FaExclamationTriangle className="text-blue-600" />
                    <span className="font-medium text-gray-700">Prioridad</span>
                  </div>
                  <span className={`inline-block px-3 py-1 text-sm font-semibold rounded-full border ${getPrioridadColor(solicitud.prioridad)}`}>
                    {solicitud.prioridad?.charAt(0).toUpperCase() + solicitud.prioridad?.slice(1)}
                  </span>
                </div>
              </div>

              {/* Estado */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  Estado de la Solicitud
                </h3>
                
                {esAdmin ? (
                  <div className="space-y-3">
                    <select
                      value={statusSeleccionado}
                      onChange={(e) => setStatusSeleccionado(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                      disabled={cambiandoStatus}
                    >
                      {statusOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Comentario administrativo (opcional)
                      </label>
                      <textarea
                        value={comentarioAdmin}
                        onChange={(e) => setComentarioAdmin(e.target.value)}
                        placeholder="Agregar comentario sobre el cambio de estado..."
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                        rows="3"
                        disabled={cambiandoStatus}
                      />
                      {comentarioInicialAdmin && (
                        <p className="text-xs text-gray-500 mt-1">
                          💡 Puedes editar o borrar el comentario existente
                        </p>
                      )}
                    </div>
                    {hayCambiosPendientes() && (
                      <div className="flex items-center gap-2 text-blue-600 text-sm">
                        <FaSave className="text-xs" />
                        <span>Los cambios se guardarán al cerrar el modal</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <span className={`inline-block px-4 py-2 text-sm font-semibold rounded-full border ${getStatusColor(solicitud.status)}`}>
                    {formatearTextoEstado(solicitud.status)}
                  </span>
                )}
              </div>

              {/* Comentarios del usuario */}
              {solicitud.comentarioUser && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <FaComment className="text-blue-600" />
                    Comentarios del Solicitante
                  </h3>
                  <div className="bg-white p-4 rounded-lg border border-blue-200">
                    <p className="text-gray-700 leading-relaxed">{solicitud.comentarioUser}</p>
                  </div>
                </div>
              )}

              {/* Comentarios del administrador - Solo mostrar si existe */}
              {solicitud.comentarioAdmin && (
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <FaUserShield className="text-orange-600" />
                    Comentarios del Administrador
                  </h3>
                  <div className="bg-white p-4 rounded-lg border border-orange-200">
                    <p className="text-gray-700 leading-relaxed">{solicitud.comentarioAdmin}</p>
                  </div>
                </div>
              )}

              {/* Productos solicitados */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <FaList className="text-blue-600" />
                  Productos Solicitados
                  <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-medium">
                    {solicitud.suministros?.length || 0} productos
                  </span>
                </h3>
                
                {solicitud.suministros && solicitud.suministros.length > 0 ? (
                  <div className="space-y-3">
                    {solicitud.suministros.map((suministro, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 mb-1">{suministro.nombre}</h4>
                        </div>
                        <div className="flex items-center gap-4 text-sm">
                          <div className="text-center">
                            <span className="block text-gray-500">Cantidad</span>
                            <span className="text-blue-700 px-3 py-1 rounded-full font-semibold">
                              {suministro.cantidad}
                            </span>
                          </div>
                          <div className="text-center">
                            <span className="block text-gray-500">Unidad</span>
                            <span className="text-gray-700 px-3 py-1 rounded-full font-medium">
                              {suministro.unidad}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <FaList className="text-3xl mx-auto mb-3 opacity-50" />
                    <p>No hay productos registrados en esta solicitud</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No se pudieron cargar los detalles de la solicitud</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex-shrink-0">
          <div className="flex justify-between items-center">
            {/* Botón PDF */}
            {solicitud && (
              <PDFDownloadLink
                document={<SolicitudPDF solicitud={solicitud} />}
                fileName={`solicitud_${solicitud?.folio || "sin_folio"}.pdf`}
              >
                {({ loading }) => (
                  <button 
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 disabled:opacity-50"
                    disabled={loading}
                  >
                    <FaFilePdf />
                    {loading ? "Generando PDF..." : "Descargar PDF"}
                  </button>
                )}
              </PDFDownloadLink>
            )}

            {/* Botón Cerrar */}
            <button
              onClick={handleCerrarModal}
              disabled={botonProps.disabled}
              className={botonProps.className}
            >
              {cambiandoStatus && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              )}
              {esAdmin && hayCambiosPendientes() && !cambiandoStatus && (
                <FaSave />
              )}
              {botonProps.texto}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ModalDetalleSolicitud;