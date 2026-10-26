import React, {useState, useEffect} from "react";
import Modal from "./ModalBase";
import { formatearTextoEstado, formatearFecha } from "../../functions/Index";
import { FaTimes, FaFileAlt, FaUser, FaExclamationTriangle, FaList, FaComment, FaSave, FaCalendarAlt, FaClock, FaUserShield, FaFilePdf, FaBoxOpen, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { PDFDownloadLink } from "@react-pdf/renderer";
import SolicitudPDF from "../herramientasPDF/SolicitudPDF";
import useSolicitud from "../../hooks/useSolicitud";
import useSuministroParcial from "../../hooks/useSuministroParcial";
import useUnidadMedida from "../../hooks/useUnidadMedida";
import useAuth from "../../hooks/useAuth";
import Swal from 'sweetalert2';

const ModalDetalleSolicitud = ({ isOpen, onRequestClose, solicitud, cargando }) => {
  const [statusSeleccionado, setStatusSeleccionado] = useState('');
  const [comentarioAdmin, setComentarioAdmin] = useState('');
  const [comentarioInicialAdmin, setComentarioInicialAdmin] = useState('');
  const [cambiandoStatus, setCambiandoStatus] = useState(false);
  const [suministrosParciales, setSuministrosParciales] = useState([]);

  const { cambiarStatusSolicitud } = useSolicitud();
  const { registrarSuministrosParciales, obtenerSuministrosParciales, suministrosParciales: suministrosParcialesContext } = useSuministroParcial();
  const { unidades } = useUnidadMedida();
  const { auth } = useAuth();

  useEffect(() => {
    if (solicitud && isOpen) {
      // Status
      if (solicitud.status) {
        const statusNormalizado = solicitud.status.trim().toLowerCase();
        setStatusSeleccionado(statusNormalizado);
      } else {
        setStatusSeleccionado('pendiente surtido');
      }

      // Comentario admin
      const comentarioInicial = solicitud.comentarioAdmin || '';
      setComentarioAdmin(comentarioInicial);
      setComentarioInicialAdmin(comentarioInicial);

      // Inicializar suministros parciales
      if (solicitud.suministros) {
        setSuministrosParciales(
          solicitud.suministros.map(s => ({
            seleccionado: false,
            nombre: s.nombre,
            unidad: s.unidad,
            cantidadSolicitada: s.cantidad,
            cantidadEntregada: s.cantidad,
            unidadEntregada: s.unidad
          }))
        );
      }

      // Obtener suministros parciales si existen
      if (solicitud.id) {
        obtenerSuministrosParciales(solicitud.id);
      }
    }
  }, [solicitud, isOpen]);

  useEffect(() => {
    if (!isOpen) {
      setStatusSeleccionado('');
      setComentarioAdmin('');
      setComentarioInicialAdmin('');
      setCambiandoStatus(false);
      setSuministrosParciales([]);
    }
  }, [isOpen]);

  if (!solicitud && !cargando) return null;

  const { fecha, hora } = solicitud ? formatearFecha(solicitud.fechaHora) : { fecha: "", hora: "" };

  const statusOptions = [
    { value: 'pendiente surtido', label: 'Pendiente Surtido' },
    { value: 'en proceso', label: 'En proceso' },
    { value: 'rechazada', label: 'Rechazada' },
    { value: 'entrega parcial', label: 'Entrega Parcial' },
    { value: 'surtido', label: 'Surtido' },
  ];

  const esAdmin = ['admin', 'superadmin', 'desarrollo'].includes(auth?.rol);

  const hayCambiosPendientes = () => {
    if (!solicitud || !statusSeleccionado) return false;

    const statusActualNormalizado = solicitud.status ? solicitud.status.trim().toLowerCase() : '';
    const statusSeleccionadoNormalizado = statusSeleccionado.trim().toLowerCase();

    const comentarioActual = comentarioInicialAdmin;
    const comentarioNuevo = comentarioAdmin.trim();

    return statusActualNormalizado !== statusSeleccionadoNormalizado || comentarioActual !== comentarioNuevo;
  };

  const handleCheckboxChange = (index) => {
    setSuministrosParciales(prev => {
      const nuevos = [...prev];
      nuevos[index] = {
        ...nuevos[index],
        seleccionado: !nuevos[index].seleccionado
      };
      return nuevos;
    });
  };

  const handleCantidadParcialChange = (index, valor) => {
    setSuministrosParciales(prev => {
      const nuevos = [...prev];
      nuevos[index] = {
        ...nuevos[index],
        cantidadEntregada: valor === '' ? '' : parseInt(valor) || 0
      };
      return nuevos;
    });
  };

  const handleUnidadParcialChange = (index, unidad) => {
    setSuministrosParciales(prev => {
      const nuevos = [...prev];
      nuevos[index] = {
        ...nuevos[index],
        unidadEntregada: unidad
      };
      return nuevos;
    });
  };

  const handleCerrarModal = async () => {
    if (esAdmin && hayCambiosPendientes()) {
      setCambiandoStatus(true);

      if (statusSeleccionado === 'entrega parcial') {
        // Ahora enviamos TODOS los productos seleccionados (incluso con cantidad 0)
        const suministrosParaEnviar = suministrosParciales
          .filter(s => s.seleccionado) // Solo los marcados
          .map(s => ({
            nombre: s.nombre,
            unidad: s.unidadEntregada,
            cantidad: s.cantidadEntregada || 0 // Si está vacío, enviar 0
          }));

        if (suministrosParaEnviar.length > 0) {
          const resultado = await registrarSuministrosParciales(solicitud.id, suministrosParaEnviar);
          if (!resultado.success) {
            setCambiandoStatus(false);
            await Swal.fire({ icon: 'error', title: 'No se pudo registrar la entrega', text: resultado.error || 'Error al registrar la entrega parcial' });
            return;
          }
        }
      }

      const resultado = await cambiarStatusSolicitud(solicitud.id, statusSeleccionado, comentarioAdmin);
      setCambiandoStatus(false);
      if (!resultado.success) return;

      if (resultado.success) {
        solicitud.status = statusSeleccionado;
        solicitud.comentarioAdmin = comentarioAdmin.trim();
        setComentarioInicialAdmin(comentarioAdmin.trim());
      }
    }

    onRequestClose();
  };

  const getBotonCerrarProps = () => {
    if (cambiandoStatus) {
      return {
        texto: 'Guardando...',
        className: "[.am-dialog_&]:inline-flex [.am-dialog_&]:items-center [.am-dialog_&]:justify-center [.am-dialog_&]:gap-[7px] [.am-dialog_&]:min-h-10 [.am-dialog_&]:pt-[9px] [.am-dialog_&]:pr-[15px] [.am-dialog_&]:pb-[9px] [.am-dialog_&]:pl-[15px] [.am-dialog_&]:rounded-[10px] [.am-dialog_&]:text-[length:13px] [.am-dialog_&]:font-semibold [.am-dialog_&]:leading-[1.5] [.am-dialog_&]:no-underline max-[650.001px]:[.am-dialog_&]:[padding-inline:12px] [&&]:[background:#1859d5] text-white [&&]:[box-shadow:0_4px_12px_#1859d533] border border-solid [&&]:border-[#1859d5] [&&:hover:not(:disabled)]:[background:#1348b0] [&&:hover:not(:disabled)]:border-[#1348b0]",
        disabled: true
      };
    }

    if (esAdmin && hayCambiosPendientes()) {
      return {
        texto: 'Guardar y Cerrar',
        className: "[.am-dialog_&]:inline-flex [.am-dialog_&]:items-center [.am-dialog_&]:justify-center [.am-dialog_&]:gap-[7px] [.am-dialog_&]:min-h-10 [.am-dialog_&]:pt-[9px] [.am-dialog_&]:pr-[15px] [.am-dialog_&]:pb-[9px] [.am-dialog_&]:pl-[15px] [.am-dialog_&]:rounded-[10px] [.am-dialog_&]:text-[length:13px] [.am-dialog_&]:font-semibold [.am-dialog_&]:leading-[1.5] [.am-dialog_&]:no-underline max-[650.001px]:[.am-dialog_&]:[padding-inline:12px] [&&]:[background:#1859d5] text-white [&&]:[box-shadow:0_4px_12px_#1859d533] border border-solid [&&]:border-[#1859d5] [&&:hover:not(:disabled)]:[background:#1348b0] [&&:hover:not(:disabled)]:border-[#1348b0]",
        disabled: false
      };
    }

    return {
      texto: 'Cerrar',
      className: "[.am-dialog_&]:inline-flex [.am-dialog_&]:items-center [.am-dialog_&]:justify-center [.am-dialog_&]:gap-[7px] [.am-dialog_&]:min-h-10 [.am-dialog_&]:pt-[9px] [.am-dialog_&]:pr-[15px] [.am-dialog_&]:pb-[9px] [.am-dialog_&]:pl-[15px] [.am-dialog_&]:rounded-[10px] [.am-dialog_&]:text-[length:13px] [.am-dialog_&]:font-semibold [.am-dialog_&]:leading-[1.5] [.am-dialog_&]:no-underline max-[650.001px]:[.am-dialog_&]:[padding-inline:12px] [&&]:[background:#edf3fc] [&&]:text-[#355886] border border-solid [&&]:border-[#bdcee8] [&:hover:not(:disabled)]:[background:#eef5ff] [&:hover:not(:disabled)]:border-[#bdd1ef]",
      disabled: false
    };
  };

  const botonProps = getBotonCerrarProps();

  const getStatusColor = (status) => {
    switch (status) {
      case "pendiente surtido":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "en proceso":
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
    <Modal size="xl"
      isOpen={isOpen}
      contentLabel={solicitud ? `Detalle de solicitud ${solicitud.folio}` : 'Detalle de solicitud'}
      onRequestClose={!cambiandoStatus ? handleCerrarModal : undefined}
      className="overflow-hidden [&_>_div]:max-h-[calc(100dvh_-_58px)] max-[650.001px]:[&_>_div]:max-h-[calc(100dvh_-_30px)]"


      shouldCloseOnOverlayClick={!cambiandoStatus}
      shouldCloseOnEsc={!cambiandoStatus}
    >
      <div className="flex flex-col h-full max-h-[90vh]">
        {/* Header */}
        <div className="
          flex items-center justify-between gap-[14px] pt-6 pr-6 pb-6 pl-6
          [&&]:[background:linear-gradient(115deg,_#143363,_#245196)] [border-bottom-width:1px]
          [border-bottom-style:solid] [&&]:[border-bottom-color:#315e9d] [&&]:text-[#e1eeff] max-[650.001px]:gap-[10px]
          max-[650.001px]:pt-5 max-[650.001px]:pr-5 max-[650.001px]:pb-5 max-[650.001px]:pl-5 [&_>_div:only-child]:w-full
          [&_h2]:text-[length:21px] [&_h2]:font-[650] [&_h2]:leading-[1.3] [&_h2]:tracking-[-.025em] [&&_h2]:text-white
          max-[650.001px]:[&_h2]:text-[length:19px] [&_h3]:text-[length:18px] [&_h3]:font-[650] [&&_h3]:text-white
          [&_p]:text-[length:13px] [&&_p]:text-[#d4e5fc] [&_p]:leading-[1.65] [&_p]:mt-[5px]
          max-[650.001px]:[&_p]:text-[length:12px] [&&_[class*='bg-blue-100']]:[background:#ffffff1c]
          [&&_[class*='bg-blue-100']]:text-[#bceeff] [&_[class*='bg-blue-100']]:rounded-[12px]
          [&_[class*='bg-blue-100']]:pt-[11px] [&_[class*='bg-blue-100']]:pr-[11px] [&_[class*='bg-blue-100']]:pb-[11px]
          [&_[class*='bg-blue-100']]:pl-[11px] [&&_[class*='bg-green-100']]:[background:#ffffff1c]
          [&&_[class*='bg-green-100']]:text-[#bceeff] [&_[class*='bg-green-100']]:rounded-[12px]
          [&_[class*='bg-green-100']]:pt-[11px] [&_[class*='bg-green-100']]:pr-[11px]
          [&_[class*='bg-green-100']]:pb-[11px] [&_[class*='bg-green-100']]:pl-[11px] [&&_.text-green-600]:text-[#bceeff]
          [&&_.text-blue-600]:text-[#bceeff]
        ">
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
              className="
                flex items-center justify-center self-start shrink-0 w-8 h-8 [&&]:[background:#ffffff15] [&&]:text-white
                pt-[6px] pr-[6px] pb-[6px] pl-[6px] rounded-[10px] ml-auto border border-solid [&&]:border-[#bdd7ff55]
                [&&:hover]:[background:#ffffff2b] [&&:hover]:text-white [&&:hover]:border-[#d0e4ff99] [&_>_svg]:w-[17px]
                [&_>_svg]:h-[17px] [&_>_svg]:text-inherit
              " aria-label="Cerrar detalle de solicitud"
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
                  <span className={` inline-block px-3 py-1 text-sm font-semibold rounded-full border  ${getPrioridadColor(solicitud.prioridad)}  `}>
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
                    {auth?.rol === 'desarrollo' && <p className="rounded-lg bg-amber-50 p-3 text-sm text-amber-800">Desarrollo: puedes registrar entregas completas y parciales fuera de horario. La excepción se guardará en el historial con la hora real.</p>}
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

                    {/* Mostrar productos para entrega parcial */}
                    {statusSeleccionado === 'entrega parcial' && (
                      <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <h4 className="font-medium text-gray-800 mb-3 flex items-center gap-2">
                          <FaBoxOpen className="text-yellow-600" />
                          Seleccionar Productos y Cantidades Entregadas
                        </h4>
                        <div className="space-y-3">
                          {suministrosParciales.map((suministro, index) => (
                            <div
                              key={index}
                              className={` bg-white p-4 rounded-lg border-2 transition-all  ${suministro.seleccionado ? "border-yellow-400 bg-yellow-50" : "border-gray-200"}  `}
                            >
                              {/* Checkbox y nombre del producto */}
                              <div className="flex items-start gap-3 mb-3">
                                <input
                                  type="checkbox"
                                  checked={suministro.seleccionado}
                                  onChange={() => handleCheckboxChange(index)}
                                  className="mt-1 w-5 h-5 text-yellow-600 border-gray-300 rounded focus:ring-yellow-500 cursor-pointer"
                                  disabled={cambiandoStatus}
                                />
                                <div className="flex-1">
                                  <span className="font-medium text-gray-900 block">{suministro.nombre}</span>
                                  <span className="text-xs text-gray-500">
                                    Cantidad solicitada: <span className="font-semibold">{suministro.cantidadSolicitada}</span> {suministro.unidad}
                                  </span>
                                </div>
                              </div>

                              {/* Inputs solo si está seleccionado */}
                              {suministro.seleccionado && (
                                <div className="grid grid-cols-2 gap-3 pl-8">
                                  {/* Cantidad Entregada */}
                                  <div>
                                    <label className="text-xs font-medium text-gray-700 block mb-1">
                                      Cantidad entregada:
                                    </label>
                                    <input
                                      type="number"
                                      min="0"
                                      max={suministro.cantidadSolicitada}
                                      value={suministro.cantidadEntregada}
                                      onChange={(e) => handleCantidadParcialChange(index, e.target.value)}
                                      onFocus={(e) => e.target.select()}
                                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-sm"
                                      disabled={cambiandoStatus}
                                    />
                                  </div>

                                  {/* Unidad de Medida */}
                                  <div>
                                    <label className="text-xs font-medium text-gray-700 block mb-1">
                                      Unidad de medida:
                                    </label>
                                    <select
                                      value={suministro.unidadEntregada}
                                      onChange={(e) => handleUnidadParcialChange(index, e.target.value)}
                                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-sm bg-white"
                                      disabled={cambiandoStatus}
                                    >
                                      {unidades.map(unidad => (
                                        <option key={unidad.id} value={unidad.nombre}>
                                          {unidad.nombre}
                                        </option>
                                      ))}
                                    </select>
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                        <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                          <p className="text-xs text-amber-800 flex items-start gap-2">
                            <span className="text-base">💡</span>
                            <span>
                              <strong>Importante:</strong> Marca los productos procesados y ajusta las cantidades:
                              <br />• Si entregaste una cantidad, ingresa el número correspondiente
                              <br />• Si NO entregaste el producto, marca la casilla y pon cantidad en <strong>0</strong>
                            </span>
                          </p>
                        </div>
                      </div>
                    )}

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
                  <span className={` inline-block px-4 py-2 text-sm font-semibold rounded-full border  ${getStatusColor(solicitud.status)}  `}>
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

              {/* Comentarios del administrador */}
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

              {/* Productos solicitados y entregas parciales */}
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
                    {solicitud.suministros.map((suministro, index) => {
                      // Filtrar entregas parciales de este producto
                      const entregasParciales = suministrosParcialesContext.filter(
                        parcial => parcial.nombre.toLowerCase() === suministro.nombre.toLowerCase()
                      );

                      return (
                        <div key={index} className="bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
                          {/* Producto solicitado */}
                          <div className="flex items-center justify-between p-4 hover:bg-gray-100 transition-colors">
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-900 mb-1">{suministro.nombre}</h4>
                              <span className="text-xs text-gray-500">Solicitado</span>
                            </div>
                            <div className="flex items-center gap-4 text-sm">
                              <div className="text-center">
                                <span className="block text-gray-500 text-xs">Cantidad</span>
                                <span className="text-blue-700 px-3 py-1 rounded-full font-semibold">
                                  {suministro.cantidad}
                                </span>
                              </div>
                              <div className="text-center">
                                <span className="block text-gray-500 text-xs">Unidad</span>
                                <span className="text-gray-700 px-3 py-1 rounded-full font-medium">
                                  {suministro.unidad}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Productos parciales entregados/no entregados */}
                          {entregasParciales.length > 0 && (
                            <div className="border-t border-gray-500 border-dashed">
                              {entregasParciales.map((parcial, idx) => {
                                // Determinar si fue entregado o no
                                const fueEntregado = parcial.cantidad > 0;
                                const colorClase = fueEntregado ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200';
                                const iconoColor = fueEntregado ? 'text-green-600' : 'text-red-600';
                                const textoColor = fueEntregado ? 'text-green-700' : 'text-red-700';
                                const badgeColor = fueEntregado ? 'bg-green-100' : 'bg-red-100';
                                const etiqueta = fueEntregado ? 'Entregado' : 'No entregado';

                                return (
                                  <div key={idx} className={` flex items-center justify-between p-3 px-4  ${colorClase}   ${idx > 0 ? "border-t" : ""}  `}>
                                    <div className="flex items-center gap-2 flex-1">
                                      {fueEntregado ? (
                                        <FaCheckCircle className={`  ${iconoColor}  text-sm `} />
                                      ) : (
                                        <FaTimesCircle className={`  ${iconoColor}  text-sm `} />
                                      )}
                                      <div>
                                        <span className={` text-sm font-medium  ${textoColor}  `}>
                                          {fueEntregado ? `Entrega Parcial #${idx + 1}` : 'Sin entrega'}
                                        </span>
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-4 text-sm">
                                      <div className="text-center">
                                        <span className={` block  ${textoColor}  text-xs mb-1 `}>{etiqueta}</span>
                                        <span className={`  ${textoColor}  px-3 py-1 rounded-full font-semibold  ${badgeColor}  `}>
                                          {parcial.cantidad}
                                        </span>
                                      </div>
                                      <div className="text-center">
                                        <span className={` block  ${textoColor}  text-xs mb-1 `}>Unidad</span>
                                        <span className={`  ${textoColor}  px-3 py-1 rounded-full font-medium  ${badgeColor}  `}>
                                          {parcial.unidad}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}
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
        <div className="
          pt-[18px] pr-6 pb-[18px] pl-6 [&&]:[background:#edf3fc] [border-top-width:1px] [border-top-style:solid]
          shrink-0 [&&]:border-[#cddbef] max-[650.001px]:pt-4 max-[650.001px]:pr-5 max-[650.001px]:pb-4
          max-[650.001px]:pl-5
        ">
          <div className="flex flex-wrap items-center justify-between gap-3 max-[650.001px]:gap-[10px] max-[650.001px]:[&_>_a]:flex-1">
            {/* Botón PDF */}
            {solicitud && (
              <PDFDownloadLink
                document={<SolicitudPDF solicitud={solicitud} />}
                fileName={`solicitud_${solicitud?.folio || "sin_folio"}.pdf`}
              >
                {({ loading }) => (
                  <button
                    className="
                      [.am-dialog_&]:inline-flex [.am-dialog_&]:items-center [.am-dialog_&]:justify-center [.am-dialog_&]:gap-[7px]
                      [.am-dialog_&]:min-h-10 [.am-dialog_&]:pt-[9px] [.am-dialog_&]:pr-[15px] [.am-dialog_&]:pb-[9px]
                      [.am-dialog_&]:pl-[15px] [.am-dialog_&]:rounded-[10px] [.am-dialog_&]:text-[length:13px]
                      [.am-dialog_&]:font-semibold [.am-dialog_&]:leading-[1.5] [.am-dialog_&]:no-underline
                      max-[650.001px]:[.am-dialog_&]:[padding-inline:12px] [&&]:[background:#edf3fc] [&&]:text-[#355886] border
                      border-solid [&&]:border-[#bdcee8] [&:hover:not(:disabled)]:[background:#eef5ff]
                      [&:hover:not(:disabled)]:border-[#bdd1ef]
                    "
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
