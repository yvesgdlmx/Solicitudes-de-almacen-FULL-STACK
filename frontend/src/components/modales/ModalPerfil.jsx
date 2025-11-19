import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { FiX, FiLogOut } from 'react-icons/fi';
import { FaUserCircle } from 'react-icons/fa';
import useAuth from '../../hooks/useAuth';

// Configurar el elemento de la app para react-modal
Modal.setAppElement('#root');

const ModalPerfil = ({ isOpen, onRequestClose, auth, imagenSidebar }) => {
  const { cerrarSesionAuth, actualizarColorPerfil } = useAuth();
  const [colorIcono, setColorIcono] = useState(auth.colorPerfil || 'text-gray-400');
  const [actualizandoColor, setActualizandoColor] = useState(false);
  
  const coloresDisponibles = [
    { color: "text-gray-400", nombre: "Gris" },
    { color: "text-blue-500", nombre: "Azul" },
    { color: "text-green-500", nombre: "Verde" },
    { color: "text-red-500", nombre: "Rojo" },
    { color: "text-purple-500", nombre: "Morado" },
    { color: "text-yellow-500", nombre: "Amarillo" },
    { color: "text-pink-500", nombre: "Rosa" },
    { color: "text-indigo-500", nombre: "Índigo" },
  ];

  // Sincronizar el color cuando cambie auth
  useEffect(() => {
    if (auth.colorPerfil) {
      setColorIcono(auth.colorPerfil);
    }
  }, [auth.colorPerfil]);

  const handleCambiarColor = async (nuevoColor) => {
    if (actualizandoColor || nuevoColor === colorIcono) return;

    setActualizandoColor(true);
    
    const resultado = await actualizarColorPerfil(nuevoColor);
    
    if (resultado.success) {
      setColorIcono(nuevoColor);
    } else {
      // Podrías mostrar un toast o alerta aquí
      console.error('Error al cambiar color:', resultado.error);
    }
    
    setActualizandoColor(false);
  };

  const handleCerrarSesion = () => {
    cerrarSesionAuth();
    onRequestClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      // CAMBIAR A ESTAS CLASES (igual que los otros modales):
      className="w-[95vw] max-w-[400px] mx-auto mt-8 bg-white rounded-xl shadow-2xl outline-none max-h-[90vh] overflow-visible"
      overlayClassName="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-start justify-center p-4 z-50"
      contentLabel="Modal de Perfil"
      ariaHideApp={false}
    >
      <div className="p-6">
        {/* Header del modal */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Mi Perfil</h2>
          <button
            onClick={onRequestClose}
            className="p-1 rounded-full hover:bg-gray-100 transition-colors duration-200"
          >
            <FiX className="text-xl text-gray-500" />
          </button>
        </div>

        {/* Contenido del modal */}
        <div className="text-center">
          {/* Icono de perfil */}
          <div className="flex justify-center mb-4">
            {imagenSidebar ? (
              <img
                src={imagenSidebar}
                alt="Perfil"
                className="w-20 h-20 rounded-full object-cover"
              />
            ) : (
              <FaUserCircle className={`w-20 h-20 ${colorIcono}`} />
            )}
          </div>

          {/* Información del usuario */}
          <h3 className="text-lg font-semibold text-gray-800 mb-1">{auth.user}</h3>
          <p className="text-sm text-gray-600 mb-4">{auth.area}</p>

          {/* Selector de color para el icono */}
          {!imagenSidebar && (
            <div className="mb-6">
              <p className="text-sm font-medium text-gray-700 mb-3">Color del ícono:</p>
              <div className="grid grid-cols-4 gap-2">
                {coloresDisponibles.map((item) => (
                  <button
                    key={item.color}
                    onClick={() => handleCambiarColor(item.color)}
                    disabled={actualizandoColor}
                    className={`p-2 rounded-lg border-2 transition-all duration-200 ${
                      colorIcono === item.color
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    } ${actualizandoColor ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                    title={item.nombre}
                  >
                    <FaUserCircle className={`w-6 h-6 mx-auto ${item.color}`} />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Botón cerrar sesión */}
          <button
            onClick={handleCerrarSesion}
            className="w-full flex items-center justify-center px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200"
          >
            <FiLogOut className="mr-2" />
            Cerrar Sesión
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ModalPerfil;