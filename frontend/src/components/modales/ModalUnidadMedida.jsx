import React, { useState, useEffect } from 'react';
import Modal from "./ModalBase";
import { FiPackage } from 'react-icons/fi';

const ModalUnidadMedida = ({ isOpen, onRequestClose, onGuardar, cargando, modo, unidadParaEditar }) => {
  const [nombre, setNombre] = useState('');
  const [errores, setErrores] = useState({});

  useEffect(() => {
    if (modo === 'editar' && unidadParaEditar) {
      setNombre(unidadParaEditar.nombre);
    } else {
      setNombre('');
    }
    setErrores({});
  }, [modo, unidadParaEditar, isOpen]);

  const handleInputChange = (valor) => {
    setNombre(valor);
    if (errores.nombre) {
      setErrores({});
    }
  };

  const validarFormulario = () => {
    const nuevosErrores = {};

    if (!nombre.trim()) {
      nuevosErrores.nombre = 'El nombre de la unidad es requerido';
    } else if (nombre.trim().length < 2) {
      nuevosErrores.nombre = 'El nombre debe tener al menos 2 caracteres';
    } else if (nombre.trim().length > 50) {
      nuevosErrores.nombre = 'El nombre no puede exceder 50 caracteres';
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validarFormulario()) {
      onGuardar({ nombre: nombre.trim() });
    }
  };

  const handleClose = () => {
    if (!cargando) {
      onRequestClose();
    }
  };

  const esEdicion = modo === 'editar';

  return (
    <Modal size="sm"
      isOpen={isOpen}
      onRequestClose={handleClose}
      className="am-kind-unidad"

      contentLabel={esEdicion ? "Editar Unidad de Medida" : "Nueva Unidad de Medida"}
      shouldCloseOnOverlayClick={!cargando}
      shouldCloseOnEsc={!cargando}

    >
      <div className="p-6">
        {/* Header */}
        <div className="
          flex items-center justify-between gap-[14px] pt-6 pr-6 pb-6 pl-6
          [&&]:[background:linear-gradient(115deg,_#143363,_#245196)] [border-bottom-width:1px]
          [border-bottom-style:solid] [&&]:[border-bottom-color:#315e9d] [&&]:text-[#e1eeff] mt-[-24px] mr-[-24px]
          mb-[23px] ml-[-24px] max-[650.001px]:gap-[10px] max-[650.001px]:pt-5 max-[650.001px]:pr-5 max-[650.001px]:pb-5
          max-[650.001px]:pl-5 max-[650.001px]:mt-[-24px] max-[650.001px]:mr-[-24px] max-[650.001px]:mb-[21px]
          max-[650.001px]:ml-[-24px] [&_>_div:only-child]:w-full [&_h2]:text-[length:21px] [&_h2]:font-[650]
          [&_h2]:leading-[1.3] [&_h2]:tracking-[-.025em] [&&_h2]:text-white max-[650.001px]:[&_h2]:text-[length:19px]
          [&_h3]:text-[length:18px] [&_h3]:font-[650] [&&_h3]:text-white [&_p]:text-[length:13px] [&&_p]:text-[#d4e5fc]
          [&_p]:leading-[1.65] [&_p]:mt-[5px] max-[650.001px]:[&_p]:text-[length:12px]
          [&&_[class*='bg-blue-100']]:[background:#ffffff1c] [&&_[class*='bg-blue-100']]:text-[#bceeff]
          [&_[class*='bg-blue-100']]:rounded-[12px] [&_[class*='bg-blue-100']]:pt-[11px]
          [&_[class*='bg-blue-100']]:pr-[11px] [&_[class*='bg-blue-100']]:pb-[11px] [&_[class*='bg-blue-100']]:pl-[11px]
          [&&_[class*='bg-green-100']]:[background:#ffffff1c] [&&_[class*='bg-green-100']]:text-[#bceeff]
          [&_[class*='bg-green-100']]:rounded-[12px] [&_[class*='bg-green-100']]:pt-[11px]
          [&_[class*='bg-green-100']]:pr-[11px] [&_[class*='bg-green-100']]:pb-[11px]
          [&_[class*='bg-green-100']]:pl-[11px] [&&_.text-green-600]:text-[#bceeff] [&&_.text-blue-600]:text-[#bceeff]
        ">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <FiPackage className="text-green-600 text-xl" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                {esEdicion ? "Editar Unidad de Medida" : "Nueva Unidad de Medida"}
              </h2>
              <p className="text-sm text-gray-600">
                {esEdicion ? "Modifica la unidad de medida" : "Agrega una nueva unidad de medida"}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            disabled={cargando}
            className="
              flex items-center justify-center self-start shrink-0 w-8 h-8 [&&]:[background:#ffffff15] [&&]:text-white
              pt-[6px] pr-[6px] pb-[6px] pl-[6px] rounded-[10px] ml-auto border border-solid [&&]:border-[#bdd7ff55]
              [&&:hover]:[background:#ffffff2b] [&&:hover]:text-white [&&:hover]:border-[#d0e4ff99] [&_>_svg]:w-[17px]
              [&_>_svg]:h-[17px] [&_>_svg]:text-inherit
            " aria-label="Cerrar unidad de medida"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Loading indicator */}
        {cargando && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
            <svg className="animate-spin w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className="text-green-700 text-sm font-medium">
              {esEdicion ? "Actualizando unidad..." : "Creando unidad..."}
            </span>
          </div>
        )}

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Campo Nombre */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre de la Unidad *
            </label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => handleInputChange(e.target.value)}
              placeholder="Ej: Kilogramo, Litro, Pieza, Metro"
              disabled={cargando}
              className={` w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-green-400 disabled:opacity-50 disabled:cursor-not-allowed  ${errores.nombre ? "border-red-300 bg-red-50" : "border-gray-300"}  `}
            />
            {errores.nombre && (
              <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {errores.nombre}
              </p>
            )}
          </div>

          {/* Botones */}
          <div className="flex items-center justify-end flex-wrap gap-[10px] pt-[21px] [border-top-width:1px] [border-top-style:solid] mt-[22px] [&&]:border-[#cddbef]">
            <button
              type="button"
              onClick={handleClose}
              disabled={cargando}
              className="
                [.am-dialog_&]:inline-flex [.am-dialog_&]:items-center [.am-dialog_&]:justify-center [.am-dialog_&]:gap-[7px]
                [.am-dialog_&]:min-h-10 [.am-dialog_&]:pt-[9px] [.am-dialog_&]:pr-[15px] [.am-dialog_&]:pb-[9px]
                [.am-dialog_&]:pl-[15px] [.am-dialog_&]:rounded-[10px] [.am-dialog_&]:text-[length:13px]
                [.am-dialog_&]:font-semibold [.am-dialog_&]:leading-[1.5] [.am-dialog_&]:no-underline
                max-[650.001px]:[.am-dialog_&]:[padding-inline:12px] [&&]:[background:#edf3fc] [&&]:text-[#355886] border
                border-solid [&&]:border-[#bdcee8] [&:hover:not(:disabled)]:[background:#eef5ff]
                [&:hover:not(:disabled)]:border-[#bdd1ef]
              "
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={cargando || !nombre.trim()}
              className="
                px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors
                disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2
              "
            >
              {cargando && (
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              {cargando
                ? (esEdicion ? 'Actualizando...' : 'Creando...')
                : (esEdicion ? 'Actualizar Unidad' : 'Crear Unidad')
              }
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default ModalUnidadMedida;
