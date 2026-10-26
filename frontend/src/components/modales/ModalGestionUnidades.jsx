import React, { useState } from 'react';
import Modal from "./ModalBase";
import { FiX, FiEdit2, FiTrash2, FiPlus, FiPackage } from 'react-icons/fi';

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
  const unidadesFiltradas = [...unidades]
    .sort((a, b) => a.id - b.id)
    .filter(unidad =>
      unidad.nombre.toLowerCase().includes(filtro.toLowerCase())
    );

  return (
    <Modal size="lg"
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className="overflow-hidden [&_>_div]:max-h-[calc(100dvh_-_58px)] max-[650.001px]:[&_>_div]:max-h-[calc(100dvh_-_30px)]"

      contentLabel="Gestión de Unidades de Medida"
      shouldCloseOnOverlayClick={!cargando}
      shouldCloseOnEsc={!cargando}
    >
      <div className="flex flex-col h-full max-h-[85vh]">
        {/* Header */}
        <div className="
          block items-center justify-between gap-[14px] pt-6 pr-6 pb-6 pl-6
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
              className="
                flex items-center justify-center self-start shrink-0 w-8 h-8 [&&]:[background:#ffffff15] [&&]:text-white
                pt-[6px] pr-[6px] pb-[6px] pl-[6px] rounded-[10px] ml-auto border border-solid [&&]:border-[#bdd7ff55]
                [&&:hover]:[background:#ffffff2b] [&&:hover]:text-white [&&:hover]:border-[#d0e4ff99] [&_>_svg]:w-[17px]
                [&_>_svg]:h-[17px] [&_>_svg]:text-inherit
              " aria-label="Cerrar unidades de medida"
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
              className="
                [.am-dialog_&]:inline-flex [.am-dialog_&]:items-center [.am-dialog_&]:justify-center [.am-dialog_&]:gap-[7px]
                [.am-dialog_&]:min-h-10 [.am-dialog_&]:pt-[9px] [.am-dialog_&]:pr-[15px] [.am-dialog_&]:pb-[9px]
                [.am-dialog_&]:pl-[15px] [.am-dialog_&]:rounded-[10px] [.am-dialog_&]:text-[length:13px]
                [.am-dialog_&]:font-semibold [.am-dialog_&]:leading-[1.5] [.am-dialog_&]:no-underline
                max-[650.001px]:[.am-dialog_&]:[padding-inline:12px] [&&]:[background:#1859d5] text-white
                [&&]:[box-shadow:0_4px_12px_#1859d533] border border-solid [&&]:border-[#1859d5]
                [&&:hover:not(:disabled)]:[background:#1348b0] [&&:hover:not(:disabled)]:border-[#1348b0]
              "
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
          <div className="
            pt-[18px] pr-6 pb-[18px] pl-6 [&&]:[background:#edf3fc] [border-top-width:1px] [border-top-style:solid]
            shrink-0 [&&]:border-[#cddbef] max-[650.001px]:pt-4 max-[650.001px]:pr-5 max-[650.001px]:pb-4
            max-[650.001px]:pl-5
          ">
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
