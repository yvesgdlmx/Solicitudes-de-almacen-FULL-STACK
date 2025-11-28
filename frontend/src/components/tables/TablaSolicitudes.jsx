import React, { useState } from "react";
import { formatearTextoEstado, formatearFecha } from "../../functions/Index";
import { FaTrash, FaPencilAlt, FaLock } from "react-icons/fa";
import Swal from 'sweetalert2';

const TablaSolicitudes = ({ datos = [], titulo = "", onCrearSolicitud, showAcciones = false, onEditar, onEliminar, onVerDetalle }) => {
  const [busqueda, setBusqueda] = useState("");
  const [entradas, setEntradas] = useState(10);
  const [pagina, setPagina] = useState(1);

  // Función para verificar si se puede editar/eliminar
  const puedeEditarEliminar = (status) => {
    return status === "pendiente surtido";
  };

  // Función para mostrar alerta cuando no se puede editar
  const mostrarAlertaNoEditable = (accion) => {
    Swal.fire({
      icon: 'warning',
      title: `No se puede ${accion}`,
      text: 'Esta solicitud ya no puede ser modificada porque su estado ha cambiado.',
      confirmButtonText: 'Entendido',
      confirmButtonColor: '#3B82F6'
    });
  };

  // Manejador de edición con validación
  const handleEditar = (elemento) => {
    if (puedeEditarEliminar(elemento.status)) {
      onEditar && onEditar(elemento);
    } else {
      mostrarAlertaNoEditable('editar');
    }
  };

  // Manejador de eliminación con validación
  const handleEliminar = (elemento) => {
    if (puedeEditarEliminar(elemento.status)) {
      onEliminar && onEliminar(elemento);
    } else {
      mostrarAlertaNoEditable('eliminar');
    }
  };

  // Filtro y paginación
  const q = busqueda.toLowerCase();
  const datosFiltrados = datos.filter((e) => {
    const folio = (e.folio ?? "").toString().toLowerCase();
    const area = (e.area ?? "").toString().toLowerCase();
    const solicitante = (e.solicitante ?? "").toString().toLowerCase();
    const status = (e.status ?? "").toString().toLowerCase();
    return (
      folio.includes(q) ||
      area.includes(q) ||
      solicitante.includes(q) ||
      status.includes(q)
    );
  });

  const totalPaginas = Math.max(1, Math.ceil(datosFiltrados.length / entradas));
  const indiceInicio = (pagina - 1) * entradas;
  const datosActuales = datosFiltrados.slice(indiceInicio, indiceInicio + entradas);

  const cambiarPagina = (nuevaPagina) => {
    if (nuevaPagina >= 1 && nuevaPagina <= totalPaginas) setPagina(nuevaPagina);
  };

  const mostrandoInicio = datosFiltrados.length === 0 ? 0 : indiceInicio + 1;
  const mostrandoFin = Math.min(indiceInicio + entradas, datosFiltrados.length);

  return (
    <div className="p-6 bg-white rounded-2xl shadow-xs border border-gray-100">
      {/* Título y acciones */}
      <div className="flex justify-between items-center mb-4">
        {titulo && <h2 className="text-xl font-semibold text-gray-600">{titulo}</h2>}
      </div>

      {/* Encabezado de controles */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span>Mostrar</span>
          <select
            value={entradas}
            onChange={(e) => {
              setEntradas(Number(e.target.value));
              setPagina(1);
            }}
            className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={15}>15</option>
          </select>
          <span>entradas</span>
        </div>

        <div className="flex gap-4">
          <div className="flex gap-2">
            {onCrearSolicitud && (
              <button
                onClick={onCrearSolicitud}
                className="bg-blue-600 hover:bg-blue-700 text-white px-[34px] py-2 rounded-lg text-sm font-medium transition-colors duration-150 flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Crear Solicitud
              </button>
            )}
          </div>
          <input
            type="text"
            placeholder="Buscar..."
            value={busqueda}
            onChange={(e) => {
              setBusqueda(e.target.value);
              setPagina(1);
            }}
            className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
          />
        </div>
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto rounded-lg border border-gray-100">
        <table className="w-full text-sm text-gray-700">
          <thead className="bg-blue-500 text-white text-sm font-medium">
            <tr>
              <th className="py-3 px-4 text-left">Folio</th>
              <th className="py-3 px-4 text-left">Área</th>
              <th className="py-3 px-4 text-left">Fecha y Hora</th>
              <th className="py-3 px-4 text-left">Solicitante</th>
              <th className="py-3 px-4 text-left">Prioridad</th>
              <th className="py-3 px-4 text-left">Estatus</th>
              {showAcciones && <th className="py-3 px-4 text-left">Acciones</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {datosActuales.length === 0 ? (
              <tr>
                <td colSpan={showAcciones ? 7 : 6} className="py-6 px-4 text-center text-gray-500">
                  No hay registros para mostrar
                </td>
              </tr>
            ) : (
              datosActuales.map((elemento, indice) => {
                const { fecha, hora } = formatearFecha(elemento.fechaHora);
                const esEditable = puedeEditarEliminar(elemento.status);
                
                return (
                  <tr
                    key={`${elemento.id ?? elemento.folio ?? indice}-${indice}`}
                    className={`
                      transition-colors duration-150 hover:bg-blue-100 cursor-pointer
                      ${indice % 2 === 0 ? "bg-blue-50" : "bg-white"}
                    `}
                    onClick={() => onVerDetalle && onVerDetalle(elemento)}
                    title="Click para ver detalles"
                  >
                    <td className="py-3 px-4">{elemento.folio}</td>
                    <td className="py-3 px-4">{elemento.area}</td>
                    <td className="py-3 px-4">
                      <div className="flex flex-col items-start">
                        <span className="text-gray-700">{fecha}</span>
                        <span className="text-gray-500 text-xs w-full">{hora}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">{elemento.solicitante}</td>
                    <td className="py-3 px-4">{elemento.prioridad}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-3 py-1 text-xs font-semibold rounded-full ${
                          elemento.status === "pendiente surtido"
                            ? "bg-blue-100 text-blue-700"
                            : elemento.status === "en proceso"
                            ? "bg-purple-100 text-purple-700"
                            : elemento.status === "rechazada"
                            ? "bg-red-100 text-red-700"
                            : elemento.status === "entrega parcial"
                            ? "bg-yellow-100 text-yellow-700"
                            : elemento.status === "surtido"
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {formatearTextoEstado(elemento.status)}
                      </span>
                    </td>
                    {showAcciones && (
                      <td 
                        className="py-3 px-4"
                        onClick={(e) => e.stopPropagation()} // Evita que el click se propague a la fila
                      >
                        <div className="flex items-center gap-3">
                          {esEditable ? (
                            <>
                              <button
                                className="text-gray-400 hover:text-blue-500 transition-colors cursor-pointer"
                                title="Editar"
                                onClick={() => handleEditar(elemento)}
                              >
                                <FaPencilAlt className="w-4 h-4" />
                              </button>
                              <button
                                className="text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                                title="Eliminar"
                                onClick={() => handleEliminar(elemento)}
                              >
                                <FaTrash className="w-4 h-4" />
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                className="text-gray-300 cursor-not-allowed"
                                title="No se puede editar - Estado cambiado"
                                onClick={() => handleEditar(elemento)}
                              >
                                <FaLock className="w-4 h-4" />
                              </button>
                              <button
                                className="text-gray-300 cursor-not-allowed"
                                title="No se puede eliminar - Estado cambiado"
                                onClick={() => handleEliminar(elemento)}
                              >
                                <FaLock className="w-4 h-4" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Paginador y contador de registros */}
      <div className="flex justify-between items-center mt-5 text-sm">
        <div className="text-gray-600">
          Mostrando {mostrandoInicio} a {mostrandoFin} de {datosFiltrados.length} registros
          {busqueda && (
            <span className="text-gray-500"> (filtrado de {datos.length} registros totales)</span>
          )}
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => cambiarPagina(pagina - 1)}
            className={`px-3 py-1.5 rounded-md border ${
              pagina === 1
                ? "text-gray-400 border-gray-100 bg-gray-50 cursor-not-allowed"
                : "hover:bg-gray-100 border-gray-200 text-gray-700"
            }`}
            disabled={pagina === 1}
          >
            ‹
          </button>

          {Array.from({ length: totalPaginas }, (_, i) => (
            <button
              key={i}
              onClick={() => cambiarPagina(i + 1)}
              className={`px-3 py-1.5 rounded-md border text-sm ${
                pagina === i + 1
                  ? "bg-blue-500 text-white border-blue-500"
                  : "border-gray-200 text-gray-700 hover:bg-gray-100"
              }`}
            >
              {i + 1}
            </button>
          ))}

          <button
            onClick={() => cambiarPagina(pagina + 1)}
            className={`px-3 py-1.5 rounded-md border ${
              pagina === totalPaginas
                ? "text-gray-400 border-gray-100 bg-gray-50 cursor-not-allowed"
                : "hover:bg-gray-100 border-gray-200 text-gray-700"
            }`}
            disabled={pagina === totalPaginas}
          >
            ›
          </button>
        </div>
      </div>
    </div>
  );
};

export default TablaSolicitudes;