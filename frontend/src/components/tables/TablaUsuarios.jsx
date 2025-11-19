import React from 'react';
import { FaUserCircle, FaEdit, FaTrash } from 'react-icons/fa';
import useAuth from '../../hooks/useAuth';

const TablaUsuarios = ({ 
  usuariosFiltrados, 
  onEditarUsuario, 
  onEliminarUsuario,
  obtenerColorIcono,
  obtenerImagenUsuario
}) => {
  const { auth } = useAuth();

  // Función para obtener el texto y estilos del rol
  const obtenerRolInfo = (rol) => {
    switch (rol) {
      case 'superadmin':
        return {
          texto: 'Super Admin',
          estilos: 'bg-purple-100 text-purple-800'
        };
      case 'admin':
        return {
          texto: 'Administrador',
          estilos: 'bg-red-100 text-red-800'
        };
      case 'user':
      default:
        return {
          texto: 'Usuario',
          estilos: 'bg-blue-100 text-blue-800'
        };
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200">
            <th className="text-left py-3 px-6 font-semibold text-gray-700">Usuario</th>
            <th className="text-left py-3 px-6 font-semibold text-gray-700">Rol</th>
            <th className="text-left py-3 px-6 font-semibold text-gray-700">Área</th>
            <th className="text-left py-3 px-6 font-semibold text-gray-700">Estado</th>
            <th className="text-center py-3 px-6 font-semibold text-gray-700">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuariosFiltrados.length === 0 ? (
            <tr>
              <td colSpan="5" className="text-center py-8 text-gray-500">
                No se encontraron usuarios
              </td>
            </tr>
          ) : (
            usuariosFiltrados.map((usuario) => {
              const rolInfo = obtenerRolInfo(usuario.rol);
              
              return (
                <tr key={usuario.id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center">
                      {obtenerImagenUsuario(usuario.imagenPerfil) ? (
                        <img
                          src={obtenerImagenUsuario(usuario.imagenPerfil)}
                          alt="Perfil"
                          className="w-10 h-10 rounded-full object-cover mr-3"
                        />
                      ) : (
                        <FaUserCircle className={`w-10 h-10 mr-3 ${obtenerColorIcono(usuario.colorPerfil)}`} />
                      )}
                      <div>
                        <p className="font-semibold text-gray-900">{usuario.user}</p>
                        <p className="text-sm text-gray-600">ID: {usuario.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${rolInfo.estilos}`}>
                      {rolInfo.texto}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <p className="text-gray-900">{usuario.area}</p>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      usuario.confirmado
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {usuario.confirmado ? 'Activo' : 'Pendiente'}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex justify-center space-x-2">
                      <button
                        onClick={() => onEditarUsuario(usuario)}
                        className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                        title="Editar usuario"
                      >
                        <FaEdit />
                      </button>
                      {usuario.id !== auth.id && (
                        <button
                          onClick={() => onEliminarUsuario(usuario)}
                          className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                          title="Eliminar usuario"
                        >
                          <FaTrash />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TablaUsuarios;