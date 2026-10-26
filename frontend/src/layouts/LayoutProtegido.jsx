import { useState } from "react";
import { Outlet, NavLink, Navigate } from "react-router-dom";
import {
  FiBox,
  FiCheckSquare,
  FiChevronRight,
  FiFileText,
  FiHome,
  FiList,
  FiUsers,
} from "react-icons/fi";
import { RiMenuFoldLine, RiMenuUnfoldLine } from "react-icons/ri";
import { FaUserCircle } from "react-icons/fa";
import useAuth from "../hooks/useAuth";
import ModalPerfil from "../components/modales/ModalPerfil";
import MarcaAlmacen from "../components/MarcaAlmacen";

const baseUrl = import.meta.env.VITE_BACKEND_URL || "";

const AvatarFallback = ({ className = "", colorClass = "text-gray-400" }) => (
  <span className={` inline-flex items-center justify-center rounded-full bg-white  ${className}  `}>
    <FaUserCircle className={` h-full w-full  ${colorClass}  `} />
  </span>
);

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

  const colorAvatar = auth.colorPerfil || "text-gray-400";

  const navItems = [
    {
      section: "Menus",
      items: [
        { to: "/dashboard", label: "Dashboard", icon: FiHome },
        { to: "/solicitudes", label: "Mis Solicitudes", icon: FiFileText },
        ...( ["admin", "superadmin", "desarrollo"].includes(auth.rol)
          ? [{ to: "/todas-solicitudes", label: "Todas las Solicitudes", icon: FiList }]
          : []),
        ...(auth.rol === "superadmin"
          ? [{ to: "/cumplimiento-surtido", label: "Cumplimiento de surtido", icon: FiCheckSquare }]
          : []),
      ],
    },
    {
      section: "Administracion",
      items:
        ["superadmin", "desarrollo"].includes(auth.rol)
          ? [
              { to: "/cuentas-usuario", label: "Cuentas de Usuario", icon: FiUsers },
              { to: "/productos", label: "Productos", icon: FiBox },
            ]
          : [],
    },
  ].filter((group) => group.items.length > 0);

  const linkClass = ({ isActive }) =>
    `relative flex items-center rounded-xl px-3 py-2.5 text-[15px] transition-all duration-200 ${
      isActive
        ? "bg-[#3B82F6] text-white shadow-[0_12px_28px_rgba(59,130,246,0.26)]"
        : "text-white/85 hover:bg-white/10 hover:text-white"
    } ${expandido ? "justify-between" : "justify-center"}`;

  return (
    <>
      {auth.id ? (
        <div className="app-shell flex h-screen bg-white">
          <aside
            className={`
              flex flex-col bg-[#1E3A8A] text-white transition-all duration-300
              [&&]:[background:linear-gradient(165deg,_#183d80_0%,_#102952_65%,_#0b203e_100%)]
              [&&]:[box-shadow:5px_0_24px_#102b5426] [&&]:relative [&&]:z-[1] [&&]:shrink-0
              [&_nav_a[aria-current='page']]:[background:linear-gradient(110deg,_#2267e5,_#1654ca)]
              [&_nav_a[aria-current='page']]:[box-shadow:0_6px_16px_#06152f40,_inset_3px_0_#3cdef0]
              [&_nav_a:hover]:[background-color:#ffffff17]
            ${expandido ? "w-72" : "w-20"}  `}
          >
            <div className={` flex items-center border-b border-white/8  ${expandido ? "justify-center px-5 py-6" : "justify-center py-5"}  `}>
              <MarcaAlmacen compacta={!expandido} />
            </div>

            <nav className="flex-1 overflow-y-auto px-3 py-5">
              {navItems.map((group) => (
                <div key={group.section} className="mb-6">
                  {expandido && (
                    <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/60">
                      {group.section}
                    </p>
                  )}

                  <ul className="space-y-1.5">
                    {group.items.map((item) => {
                      const Icon = item.icon;

                      return (
                        <li key={item.to}>
                          <NavLink to={item.to} className={linkClass} title={!expandido ? item.label : undefined}>
                            {({ isActive }) => (
                              <>
                                <span className={` flex items-center  ${expandido ? "gap-3" : ""}  `}>
                                  <span
                                    className={` flex h-8 w-8 items-center justify-center rounded-lg  ${isActive ? "bg-white/14 text-white" : "text-white/82"}  `}
                                  >
                                    <Icon className="h-4 w-4" />
                                  </span>
                                  {expandido && <span className="truncate">{item.label}</span>}
                                </span>
                                {expandido && (
                                  <FiChevronRight className={` h-4 w-4  ${isActive ? "text-white/85" : "text-white/52"}  `} />
                                )}
                              </>
                            )}
                          </NavLink>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </nav>

            {expandido ? (
              <div
                className="m-3 flex cursor-pointer items-center justify-between rounded-3xl border border-white/8 bg-white/[0.06] p-3 transition hover:bg-white/[0.09]"
                onClick={() => setMostrarModal(true)}
              >
                <div className="flex min-w-0 items-center gap-3">
                  {imagenSidebar ? (
                    <img
                      src={imagenSidebar}
                      alt="Perfil"
                      className="h-10 w-10 rounded-full object-cover ring-2 ring-[#3B82F6]/40"
                    />
                  ) : (
                    <AvatarFallback className="h-10 w-10" colorClass={colorAvatar} />
                  )}
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-white">{auth.user}</p>
                    <p className="truncate text-xs text-white/68">{auth.area}</p>
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setExpandido(false);
                  }}
                  aria-label="Contraer menu"
                  title="Contraer menu"
                  className="ml-2 rounded-2xl p-2 text-white/75 transition hover:bg-white/10 hover:text-white"
                >
                  <RiMenuFoldLine className="text-lg" />
                </button>
              </div>
            ) : (
              <div className="flex justify-center border-t border-white/8 p-4">
                <button
                  onClick={() => setExpandido(true)}
                  aria-label="Expandir menu"
                  title="Expandir menu"
                  className="rounded-xl p-2 text-white/75 transition hover:bg-white/10 hover:text-white"
                >
                  <RiMenuUnfoldLine className="text-lg" />
                </button>
              </div>
            )}
          </aside>

          <div className="flex min-w-0 flex-1 flex-col">
            <main className="flex-1 overflow-y-auto px-6 pb-6 pt-0">
              <Outlet />
            </main>
          </div>

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
