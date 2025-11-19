import React, { useState, useEffect } from 'react';
import { FaUserCircle, FaPlus, FaSearch } from 'react-icons/fa';
import { FiUsers } from 'react-icons/fi';
import useAuth from '../hooks/useAuth';
import useUsuarios from '../hooks/useUsuarios';
import ModalUsuario from '../components/modales/ModalUsuario';
import TablaUsuarios from '../components/tables/TablaUsuarios';

const baseUrl = import.meta.env.VITE_BACKEND_URL || "";

const CuentasDeUsuario = () => {
  const [usuariosFiltrados, setUsuariosFiltrados] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [filtroRol, setFiltroRol] = useState('todos');
  const [mostrarModalNuevo, setMostrarModalNuevo] = useState(false);
  const [mostrarModalEditar, setMostrarModalEditar] = useState(false);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
  
  const { auth } = useAuth();
  const { usuarios, cargandoUsuarios, obtenerUsuarios, eliminarUsuario } = useUsuarios();

  useEffect(() => {
    obtenerUsuarios();
  }, []);

  useEffect(() => {
    filtrarUsuarios();
  }, [usuarios, busqueda, filtroRol]);

  const filtrarUsuarios = () => {
    let usuariosFiltrados = usuarios;

    // Filtrar por búsqueda
    if (busqueda) {
      usuariosFiltrados = usuariosFiltrados.filter(usuario =>
        usuario.user.toLowerCase().includes(busqueda.toLowerCase()) ||
        usuario.area.toLowerCase().includes(busqueda.toLowerCase())
      );
    }

    // Filtrar por rol
    if (filtroRol !== 'todos') {
      usuariosFiltrados = usuariosFiltrados.filter(usuario => usuario.rol === filtroRol);
    }

    setUsuariosFiltrados(usuariosFiltrados);
  };

  const handleEditarUsuario = (usuario) => {
    setUsuarioSeleccionado(usuario);
    setMostrarModalEditar(true);
  };

  const handleEliminarUsuario = async (usuario) => {
    const resultado = await eliminarUsuario(usuario.id, usuario.user);
  };

  const cerrarModalEditar = () => {
    setMostrarModalEditar(false);
    setUsuarioSeleccionado(null);
  };

  const obtenerColorIcono = (colorPerfil) => {
    return colorPerfil || 'text-gray-400';
  };

  const obtenerImagenUsuario = (imagenPerfil) => {
    if (!imagenPerfil) return null;
    
    return typeof imagenPerfil === "string"
      ? `${baseUrl}/${imagenPerfil.replace(/\\/g, "/")}`
      : imagenPerfil.url;
  };

  if (cargandoUsuarios) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <FiUsers className="text-2xl text-blue-600 mr-3" />
            <div>
              <h1 className="text-2xl font-bold text-gray-600">Cuentas de Usuario</h1>
              <p className="text-gray-600">Administra las cuentas de usuario del sistema</p>
            </div>
          </div>
          <button 
            onClick={() => setMostrarModalNuevo(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
          >
            <FaPlus className="mr-2" />
            Nuevo Usuario
          </button>
        </div>

        {/* Filtros y búsqueda */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por usuario o área..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={filtroRol}
            onChange={(e) => setFiltroRol(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="todos">Todos los roles</option>
            <option value="admin">Administrador</option>
            <option value="user">Usuario</option>
          </select>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="p-6 bg-gray-50 border-b border-gray-200">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg border border-gray-300">
            <div className="flex items-center">
              <div className="bg-blue-100 p-2 rounded-lg mr-3">
                <FiUsers className="text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Usuarios</p>
                <p className="text-2xl font-bold text-gray-900">{usuariosFiltrados.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-300">
            <div className="flex items-center">
              <div className="bg-blue-100 p-2 rounded-lg mr-3">
                <FaUserCircle className="text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Administradores</p>
                <p className="text-2xl font-bold text-gray-900">
                  {usuariosFiltrados.filter(u => u.rol === 'admin').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-300">
            <div className="flex items-center">
              <div className="bg-blue-100 p-2 rounded-lg mr-3">
                <FaUserCircle className="text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Usuarios</p>
                <p className="text-2xl font-bold text-gray-900">
                  {usuariosFiltrados.filter(u => u.rol === 'usuario').length}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabla - Ahora como componente separado */}
      <TablaUsuarios 
        usuariosFiltrados={usuariosFiltrados}
        onEditarUsuario={handleEditarUsuario}
        onEliminarUsuario={handleEliminarUsuario}
        obtenerColorIcono={obtenerColorIcono}
        obtenerImagenUsuario={obtenerImagenUsuario}
      />

      {/* Footer con información adicional */}
      <div className="p-4 bg-gray-50 border-t border-gray-200">
        <p className="text-sm text-gray-600 text-center">
          Mostrando {usuariosFiltrados.length} de {usuarios.length} usuarios
        </p>
      </div>

      {/* Modal Nuevo Usuario */}
      <ModalUsuario
        isOpen={mostrarModalNuevo}
        onRequestClose={() => setMostrarModalNuevo(false)}
      />

      {/* Modal Editar Usuario */}
      <ModalUsuario
        isOpen={mostrarModalEditar}
        onRequestClose={cerrarModalEditar}
        usuarioEditar={usuarioSeleccionado}
      />
    </div>
  );
};

export default CuentasDeUsuario;