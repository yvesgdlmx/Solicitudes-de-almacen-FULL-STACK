import React from "react";
import Modal from "react-modal";
import FormularioProductos from "../formularios/FormularioProductos";
import useFormularioSolicitud from "../../hooks/useFormularioSolicitud";

Modal.setAppElement('#root');

const ModalNuevaSolicitud = ({ onGuardar, cargando = false, unidadesDisponibles = [] }) => {
    const {
        formulario,
        errores,
        isOpen,
        modo,
        handleInputChange,
        validarFormulario,
        cerrarModal
    } = useFormularioSolicitud();

    const prioridades = ['muy alto', 'alto', 'moderado'];

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validarFormulario()) onGuardar(formulario);
    };

    const esEdicion = modo === 'editar';

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={cerrarModal}
            className="w-[95vw] max-w-[800px] mx-auto mt-8 bg-white rounded-xl shadow-2xl outline-none max-h-[90vh] overflow-auto"
            overlayClassName="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-start justify-center p-4 z-50"
            contentLabel={esEdicion ? "Editar Solicitud" : "Nueva Solicitud"}
            shouldCloseOnOverlayClick={!cargando}
            shouldCloseOnEsc={!cargando}
            ariaHideApp={false}
        >
            <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-gray-800">
                        {esEdicion ? "Editar Solicitud" : "Nueva Solicitud"}
                    </h2>
                    <button
                        onClick={cerrarModal}
                        disabled={cargando}
                        className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {cargando && (
                    <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center gap-3">
                        <svg className="animate-spin w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span className="text-blue-700 text-sm font-medium">
                            {esEdicion ? "Actualizando solicitud..." : "Creando solicitud..."}
                        </span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Prioridad
                        </label>
                        <select
                            value={formulario.prioridad}
                            onChange={(e) => handleInputChange('prioridad', e.target.value)}
                            disabled={cargando}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {prioridades.map(prioridad => (
                                <option key={prioridad} value={prioridad}>{prioridad}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Comentario *
                        </label>
                        <textarea
                            value={formulario.comentario}
                            onChange={(e) => handleInputChange('comentario', e.target.value)}
                            placeholder="Describe el motivo de la solicitud..."
                            rows={3}
                            disabled={cargando}
                            className={`w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400 resize-none disabled:opacity-50 disabled:cursor-not-allowed ${
                                errores.comentario ? 'border-red-300' : 'border-gray-300'
                            }`}
                        />
                        {errores.comentario && <p className="text-red-500 text-xs mt-1">{errores.comentario}</p>}
                    </div>

                    <FormularioProductos 
                        cargando={cargando} 
                        unidadesDisponibles={unidadesDisponibles}
                    />

                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={cerrarModal}
                            disabled={cargando}
                            className="px-4 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={cargando}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {cargando && (
                                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            )}
                            {cargando ? (esEdicion ? 'Actualizando...' : 'Creando...') : (esEdicion ? 'Actualizar Solicitud' : 'Crear Solicitud')}
                        </button>
                    </div>
                </form>
            </div>
        </Modal>
    );
};

export default ModalNuevaSolicitud;