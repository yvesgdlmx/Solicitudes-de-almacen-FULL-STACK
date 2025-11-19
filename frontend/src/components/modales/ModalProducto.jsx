import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import { FiBox } from "react-icons/fi";

// Configurar el elemento raíz para el modal
Modal.setAppElement('#root');

const ModalProducto = ({ 
    isOpen, 
    onRequestClose, 
    onGuardar, 
    cargando = false, 
    modo = 'crear', // 'crear' o 'editar'
    productoParaEditar = null 
}) => {
    const [formulario, setFormulario] = useState({
        nombre: '',
        unidad: ''
    });

    const [errores, setErrores] = useState({});

    // Lista de unidades predefinidas (basadas en tus productos existentes)
    const unidadesPredefinidas = [
        'PZA', 'CAJA', 'BIDON', 'PAQUETE', 'KG', 'BOLSA', 'PAR'
    ];

    useEffect(() => {
        if (modo === 'editar' && productoParaEditar) {
            setFormulario({
                nombre: productoParaEditar.nombre || '',
                unidad: productoParaEditar.unidad || ''
            });
        } else {
            // Resetear formulario para modo crear
            setFormulario({
                nombre: '',
                unidad: ''
            });
        }
        // Limpiar errores cuando cambie el modo o producto
        setErrores({});
    }, [modo, productoParaEditar, isOpen]);

    const handleInputChange = (campo, valor) => {
        setFormulario(prev => ({
            ...prev,
            [campo]: valor
        }));
        
        // Limpiar error del campo cuando el usuario empiece a escribir
        if (errores[campo]) {
            setErrores(prev => ({
                ...prev,
                [campo]: ''
            }));
        }
    };

    const validarFormulario = () => {
        const nuevosErrores = {};

        // Validar nombre
        if (!formulario.nombre.trim()) {
            nuevosErrores.nombre = 'El nombre del producto es requerido';
        } else if (formulario.nombre.trim().length < 3) {
            nuevosErrores.nombre = 'El nombre debe tener al menos 3 caracteres';
        } else if (formulario.nombre.trim().length > 255) {
            nuevosErrores.nombre = 'El nombre no puede exceder 255 caracteres';
        }

        // Validar unidad
        if (!formulario.unidad.trim()) {
            nuevosErrores.unidad = 'La unidad de medida es requerida';
        } else if (formulario.unidad.trim().length < 2) {
            nuevosErrores.unidad = 'La unidad debe tener al menos 2 caracteres';
        } else if (formulario.unidad.trim().length > 50) {
            nuevosErrores.unidad = 'La unidad no puede exceder 50 caracteres';
        }

        setErrores(nuevosErrores);
        return Object.keys(nuevosErrores).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (validarFormulario()) {
            const datosParaEnviar = {
                nombre: formulario.nombre.trim(),
                unidad: formulario.unidad.trim()
            };
            
            onGuardar(datosParaEnviar);
        }
    };

    const handleCerrarModal = () => {
        if (!cargando) {
            onRequestClose();
        }
    };

    const esEdicion = modo === 'editar';

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={handleCerrarModal}
            className="w-[95vw] max-w-[500px] mx-auto mt-8 bg-white rounded-xl shadow-2xl outline-none max-h-[90vh] overflow-auto"
            overlayClassName="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-start justify-center p-4 z-50"
            contentLabel={esEdicion ? "Editar Producto" : "Nuevo Producto"}
            shouldCloseOnOverlayClick={!cargando}
            shouldCloseOnEsc={!cargando}
            ariaHideApp={false}
        >
            <div className="p-6">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <FiBox className="text-blue-600 text-xl" />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-gray-800">
                                {esEdicion ? "Editar Producto" : "Nuevo Producto"}
                            </h2>
                            <p className="text-sm text-gray-600">
                                {esEdicion ? "Modifica la información del producto" : "Agrega un nuevo producto al catálogo"}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={handleCerrarModal}
                        disabled={cargando}
                        className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Loading indicator */}
                {cargando && (
                    <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center gap-3">
                        <svg className="animate-spin w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span className="text-blue-700 text-sm font-medium">
                            {esEdicion ? "Actualizando producto..." : "Creando producto..."}
                        </span>
                    </div>
                )}

                {/* Formulario */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Campo Nombre */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Nombre del Producto *
                        </label>
                        <input
                            type="text"
                            value={formulario.nombre}
                            onChange={(e) => handleInputChange('nombre', e.target.value)}
                            placeholder="Ej: ACETONA (20 LTS)"
                            disabled={cargando}
                            className={`w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400 disabled:opacity-50 disabled:cursor-not-allowed ${
                                errores.nombre ? 'border-red-300 bg-red-50' : 'border-gray-300'
                            }`}
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

                    {/* Campo Unidad */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Unidad de Medida *
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                value={formulario.unidad}
                                onChange={(e) => handleInputChange('unidad', e.target.value.toUpperCase())}
                                placeholder="Ej: BIDON, CAJA, PZA"
                                disabled={cargando}
                                className={`w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400 disabled:opacity-50 disabled:cursor-not-allowed ${
                                    errores.unidad ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                }`}
                                list="unidades"
                            />
                            <datalist id="unidades">
                                {unidadesPredefinidas.map(unidad => (
                                    <option key={unidad} value={unidad} />
                                ))}
                            </datalist>
                        </div>
                        {errores.unidad && (
                            <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                {errores.unidad}
                            </p>
                        )}
                        
                        {/* Unidades sugeridas */}
                        <div className="mt-2">
                            <p className="text-xs text-gray-500 mb-1">Unidades comunes:</p>
                            <div className="flex flex-wrap gap-1">
                                {unidadesPredefinidas.map(unidad => (
                                    <button
                                        key={unidad}
                                        type="button"
                                        onClick={() => handleInputChange('unidad', unidad)}
                                        disabled={cargando}
                                        className={`text-xs px-2 py-1 rounded border transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                                            formulario.unidad === unidad
                                                ? 'bg-blue-100 border-blue-300 text-blue-700'
                                                : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                                        }`}
                                    >
                                        {unidad}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Botones */}
                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={handleCerrarModal}
                            disabled={cargando}
                            className="px-4 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={cargando || !formulario.nombre.trim() || !formulario.unidad.trim()}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {cargando && (
                                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            )}
                            {cargando 
                                ? (esEdicion ? 'Actualizando...' : 'Creando...') 
                                : (esEdicion ? 'Actualizar Producto' : 'Crear Producto')
                            }
                        </button>
                    </div>
                </form>
            </div>
        </Modal>
    );
};

export default ModalProducto;