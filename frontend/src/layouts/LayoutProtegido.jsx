import React, { useState } from "react";
import { Outlet, NavLink, Navigate } from "react-router-dom";
import { FiHome, FiFileText, FiList, FiUsers, FiBox } from "react-icons/fi";
import { RiMenuFoldLine, RiMenuUnfoldLine } from "react-icons/ri";
import { FaUserCircle } from "react-icons/fa";
import useAuth from "../hooks/useAuth";
import ModalPerfil from "../components/modales/ModalPerfil"

const baseUrl = import.meta.env.VITE_BACKEND_URL || "";

const LayoutProtegido = () => {
  const [expandido, setExpandido] = useState(true);
  const [mostrarModal, setMostrarModal] = useState(false);
  
  const { auth, cargando } = useAuth();

  if (cargando) return "Cargando...";

  const imagenSidebar = auth.imagenPerfil
    ? typeof auth.imagenPerfil === "string"
      ? `${baseUrl}/${auth.imagenPerfil.replace(/\\/g, "/")}`
      : auth.imagenPerfil.url
    : null;

  // Usar el color del auth, con fallback a gris
  const colorIcono = auth.colorPerfil || 'text-gray-400';

  return (
    <>
      {auth.id ? (
        <div className="flex h-screen bg-gray-50">
          {/* ASIDE */}
          <aside className={`bg-white border-r border-gray-200 flex flex-col transition-all duration-300 ${
            expandido ? "w-64" : "w-20"
          }`}>
            {/* Header */}
            {expandido && (
              <div className="p-4 border-b border-gray-200 flex justify-center flex-col items-center">
                <img src="/img/logo_real.png" alt="" width={160}/>
                <p className="text-sm text-gray-500">Sistema de solicitudes de almacén</p>
              </div>
            )}

            {/* Nav */}
            <nav className={`flex-1 ${expandido ? "mt-6" : "mt-8 px-2"}`}>
              <ul className="space-y-1">
                <li>
                  <NavLink
                    to="/dashboard"
                    className={({ isActive }) =>
                      `flex items-center ${expandido ? "px-5" : "px-3"} py-2.5 rounded-lg transition-colors duration-200 ${
                        isActive
                          ? "bg-blue-50 text-blue-600 font-semibold"
                          : "text-gray-600 hover:bg-gray-100"
                      }`
                    }
                  >
                    <FiHome className="text-lg" />
                    {expandido && <span className="ml-3">Dashboard</span>}
                  </NavLink>
                </li>

                <li>
                  <NavLink
                    to="/solicitudes"
                    className={({ isActive }) =>
                      `flex items-center ${expandido ? "px-5" : "px-3"} py-2.5 rounded-lg transition-colors duration-200 ${
                        isActive
                          ? "bg-blue-50 text-blue-600 font-semibold"
                          : "text-gray-600 hover:bg-gray-100"
                        }`
                    }
                  >
                    <FiFileText className="text-lg" />
                    {expandido && <span className="ml-3">Mis Solicitudes</span>}
                  </NavLink>
                </li>

                {/* Rutas para admin y superadmin */}
                {["admin", "superadmin"].includes(auth.rol) && (
                  <li>
                    <NavLink
                      to="/todas-solicitudes"
                      className={({ isActive }) =>
                        `flex items-center ${expandido ? "px-5" : "px-3"} py-2.5 rounded-lg transition-colors duration-200 ${
                          isActive
                            ? "bg-blue-50 text-blue-600 font-semibold"
                            : "text-gray-600 hover:bg-gray-100"
                        }`
                      }
                    >
                      <FiList className="text-lg" />
                      {expandido && <span className="ml-3">Todas las Solicitudes</span>}
                    </NavLink>
                  </li>
                )}

                {/* Rutas exclusivas para superadmin */}
                {auth.rol === "superadmin" && (
                  <>
                    <li>
                      <NavLink
                        to="/cuentas-usuario"
                        className={({ isActive }) =>
                          `flex items-center ${expandido ? "px-5" : "px-3"} py-2.5 rounded-lg transition-colors duration-200 ${
                            isActive
                              ? "bg-blue-50 text-blue-600 font-semibold"
                              : "text-gray-600 hover:bg-gray-100"
                          }`
                        }
                      >
                        <FiUsers className="text-lg" />
                        {expandido && <span className="ml-3">Cuentas de Usuario</span>}
                      </NavLink>
                    </li>

                    <li>
                      <NavLink
                        to="/productos"
                        className={({ isActive }) =>
                          `flex items-center ${expandido ? "px-5" : "px-3"} py-2.5 rounded-lg transition-colors duration-200 ${
                            isActive
                              ? "bg-blue-50 text-blue-600 font-semibold"
                              : "text-gray-600 hover:bg-gray-100"
                          }`
                        }
                      >
                        <FiBox className="text-lg" />
                        {expandido && <span className="ml-3">Productos</span>}
                      </NavLink>
                    </li>
                  </>
                )}
              </ul>
            </nav>

            {/* Footer - Sección de perfil */}
            {expandido ? (
              <div
                className="flex items-center justify-between p-4 border-t border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors duration-200"
                onClick={() => setMostrarModal(true)}
              >
                <div className="flex items-center">
                  {imagenSidebar ? (
                    <img
                      src={imagenSidebar}
                      alt="Perfil"
                      className="w-10 h-10 rounded-full object-cover mr-3"
                    />
                  ) : (
                    <FaUserCircle className={`w-10 h-10 mr-3 ${colorIcono}`} />
                  )}
                  <div>
                    <div className="font-semibold text-gray-800 text-sm">
                      {auth.user}
                    </div>
                    <div className="text-xs text-gray-500">{auth.area}</div>
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setExpandido(false);
                  }}
                  aria-label="Contraer menú"
                  title="Contraer menú"
                  className="p-2 rounded-full hover:bg-gray-200 transition-colors duration-200"
                >
                  <RiMenuFoldLine className="text-lg text-gray-600" />
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-center p-4 border-t border-gray-200">
                <button
                  onClick={() => setExpandido(true)}
                  aria-label="Expandir menú"
                  title="Expandir menú"
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
                >
                  <RiMenuUnfoldLine className="text-lg text-gray-600" />
                </button>
              </div>
            )}
          </aside>

          {/* MAIN */}
          <main className="flex-1 p-6 overflow-y-auto">
            <Outlet />
          </main>

          {/* Modal del Perfil */}
          <ModalPerfil
            isOpen={mostrarModal}
            onRequestClose={() => setMostrarModal(false)}
            auth={auth}
            imagenSidebar={imagenSidebar}
          />
        </div>
      ) : (
        <Navigate to="/" />
      )}
    </>
  );
};

export default LayoutProtegido;