import React, { useState, useEffect } from 'react';
import Modal from "./ModalBase";
import { FiX, FiLogOut } from 'react-icons/fi';
import { FaUserCircle } from 'react-icons/fa';
import useAuth from '../../hooks/useAuth';

// Configurar el elemento de la app para react-modal


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
    <Modal size="sm"
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className="am-kind-perfil"

      contentLabel="Modal de Perfil"

    >
      <div className="p-6">
        {/* Header del modal */}
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
          <h2 className="text-xl font-semibold text-gray-800">Mi Perfil</h2>
          <button
            onClick={onRequestClose}
            className="
              flex items-center justify-center self-start shrink-0 w-8 h-8 [&&]:[background:#ffffff15] [&&]:text-white
              pt-[6px] pr-[6px] pb-[6px] pl-[6px] rounded-[10px] ml-auto border border-solid [&&]:border-[#bdd7ff55]
              [&&:hover]:[background:#ffffff2b] [&&:hover]:text-white [&&:hover]:border-[#d0e4ff99] [&_>_svg]:w-[17px]
              [&_>_svg]:h-[17px] [&_>_svg]:text-inherit
            " aria-label="Cerrar perfil"
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
              <FaUserCircle className={` w-20 h-20  ${colorIcono}  `} />
            )}
          </div>

          {/* Información del usuario */}
          <h3 className="text-lg font-semibold text-gray-800 mb-1">{auth.user}</h3>
          <p className="text-sm text-gray-600 mb-4">{auth.area}</p>
          <p className="
            [.am-kind-perfil_&]:inline-flex [.am-kind-perfil_&]:items-center [.am-kind-perfil_&]:rounded-[7px]
            [.am-kind-perfil_&]:pt-1 [.am-kind-perfil_&]:pr-[9px] [.am-kind-perfil_&]:pb-1 [.am-kind-perfil_&]:pl-[9px]
            [.am-kind-perfil_&]:text-[#6d7fac] [.am-kind-perfil_&]:[background:#f1f3fc]
            [.am-kind-perfil_&]:text-[length:12px] [.am-kind-perfil_&]:mt-0 [.am-kind-perfil_&]:mr-0
            [.am-kind-perfil_&]:mb-[15px] [.am-kind-perfil_&]:ml-0
          ">{({ user: 'Usuario', admin: 'Administrador', superadmin: 'Super admin', desarrollo: 'Desarrollo' })[auth.rol] || auth.rol}</p>

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
                    className={` p-2 rounded-lg border-2 transition-all duration-200  ${colorIcono === item.color ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300"}   ${actualizandoColor ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}  `}
                    title={item.nombre}
                  >
                    <FaUserCircle className={` w-6 h-6 mx-auto  ${item.color}  `} />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Botón cerrar sesión */}
          <button
            onClick={handleCerrarSesion}
            className="
              [.am-dialog_&]:inline-flex [.am-dialog_&]:items-center [.am-dialog_&]:justify-center [.am-dialog_&]:gap-[7px]
              [.am-dialog_&]:min-h-10 [.am-dialog_&]:pt-[9px] [.am-dialog_&]:pr-[15px] [.am-dialog_&]:pb-[9px]
              [.am-dialog_&]:pl-[15px] [.am-dialog_&]:rounded-[10px] [.am-dialog_&]:text-[length:13px]
              [.am-dialog_&]:font-semibold [.am-dialog_&]:leading-[1.5] [.am-dialog_&]:no-underline
              max-[650.001px]:[.am-dialog_&]:[padding-inline:12px] [&&]:[background:#ffe5eb] [&&]:text-[#a22e49] border
              border-solid [&&]:border-[#edb9c7] [&:hover:not(:disabled)]:[background:#fbe6ed]
              [&:hover:not(:disabled)]:border-[#e8bcc8] [.am-kind-perfil_&]:w-full
            "
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
