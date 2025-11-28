import React, { useState } from 'react';
import Modal from 'react-modal';
import { FiX, FiEdit2, FiTrash2, FiPlus, FiPackage } from 'react-icons/fi';

Modal.setAppElement('#root');

const ModalGestionUnidades = ({ 
  isOpen, 
  onRequestClose, 
  unidades, 
  cargando,
  onNuevaUnidad,
  onEditarUnidad,
  onEliminarUnidad 
}) => {
  const [filtro, setFiltro] = useState('');

  // Ordenar por ID y luego filtrar
  const unidadesFiltradas = unidades
    .sort((a, b) => a.id - b.id)
    .filter(unidad =>
      unidad.nombre.toLowerCase().includes(filtro.toLowerCase())
    );

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className="w-[95vw] max-w-[700px] mx-auto mt-8 bg-white rounded-xl shadow-2xl outline-none max-h-[90vh] overflow-hidden flex flex-col"
      overlayClassName="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-start justify-center p-4 z-50"
      contentLabel="Gestión de Unidades de Medida"
      shouldCloseOnOverlayClick={!cargando}
      shouldCloseOnEsc={!cargando}
    >
      <div className="flex flex-col h-full max-h-[85vh]">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <FiPackage className="text-green-600 text-xl" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-800">
                  Unidades de Medida
                </h2>
                <p className="text-sm text-gray-600">
                  Gestiona las unidades de medida del sistema
                </p>
              </div>
            </div>
            <button
              onClick={onRequestClose}
              disabled={cargando}
              className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
            >
              <FiX className="text-2xl" />
            </button>
          </div>

          {/* Buscador y botón */}
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Buscar unidad..."
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
            />
            <button
              onClick={onNuevaUnidad}
              disabled={cargando}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              <FiPlus />
              Nueva
            </button>
          </div>
        </div>

        {/* Contenido */}
        <div className="flex-1 overflow-y-auto p-6">
          {unidadesFiltradas.length === 0 ? (
            <div className="text-center py-12">
              <FiPackage className="text-4xl text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">
                {filtro ? 'No se encontraron unidades' : 'No hay unidades registradas'}
              </p>
              {!filtro && (
                <button
                  onClick={onNuevaUnidad}
                  className="mt-4 text-green-600 hover:text-green-700 font-medium text-sm"
                >
                  Crear primera unidad
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              {unidadesFiltradas.map((unidad) => (
                <div
                  key={unidad.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <span className="text-green-600 font-bold text-sm">
                        {unidad.id}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{unidad.nombre}</p>
                      <p className="text-xs text-gray-500">ID: {unidad.id}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => onEditarUnidad(unidad)}
                      disabled={cargando}
                      className="text-blue-600 hover:text-blue-700 p-2 rounded-lg hover:bg-blue-50 transition-colors disabled:opacity-50"
                      title="Editar"
                    >
                      <FiEdit2 className="text-lg" />
                    </button>
                    <button
                      onClick={() => onEliminarUnidad(unidad)}
                      disabled={cargando}
                      className="text-red-600 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50"
                      title="Eliminar"
                    >
                      <FiTrash2 className="text-lg" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {unidadesFiltradas.length > 0 && (
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <p className="text-sm text-gray-600 text-center">
              Mostrando {unidadesFiltradas.length} de {unidades.length} unidades
            </p>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default ModalGestionUnidades;