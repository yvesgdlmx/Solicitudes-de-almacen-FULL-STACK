import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { FiX, FiUser, FiLock, FiUsers, FiBriefcase } from 'react-icons/fi';
import useUsuarios from '../../hooks/useUsuarios';

Modal.setAppElement('#root');

const ModalUsuario = ({ isOpen, onRequestClose, usuarioEditar = null }) => {
  const [formData, setFormData] = useState({
    user: '',
    password: '',
    rol: 'user',
    area: ''
  });
  const [procesandoUsuario, setProcesandoUsuario] = useState(false);
  const [error, setError] = useState('');

  const { crearUsuario, editarUsuario } = useUsuarios();
  
  // Determinar si es modo edición
  const esEdicion = usuarioEditar !== null;

  // Limpiar/cargar formulario cuando se abre el modal
  useEffect(() => {
    if (isOpen) {
      if (esEdicion) {
        // Cargar datos del usuario a editar
        setFormData({
          user: usuarioEditar.user || '',
          password: '', // La contraseña siempre empieza vacía en edición
          rol: usuarioEditar.rol || 'user',
          area: usuarioEditar.area || ''
        });
      } else {
        // Limpiar formulario para creación
        setFormData({
          user: '',
          password: '',
          rol: 'user',
          area: ''
        });
      }
      setError('');
      setProcesandoUsuario(false);
    }
  }, [isOpen, usuarioEditar, esEdicion]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validaciones
    if (!formData.user.trim() || !formData.area.trim()) {
      setError('El nombre de usuario y el área son obligatorios');
      return;
    }

    // Validar contraseña solo si es creación o si se está cambiando en edición
    if (!esEdicion && !formData.password.trim()) {
      setError('La contraseña es obligatoria');
      return;
    }

    if (formData.password.trim() && formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setProcesandoUsuario(true);
    setError('');

    let resultado;
    
    if (esEdicion) {
      // Editar usuario existente
      resultado = await editarUsuario({
        id: usuarioEditar.id,
        ...formData
      });
    } else {
      // Crear nuevo usuario
      resultado = await crearUsuario(formData);
    }

    if (resultado.success) {
      // Limpiar y cerrar - las alertas ya se manejan en el contexto
      setFormData({
        user: '',
        password: '',
        rol: 'user',
        area: ''
      });
      onRequestClose();
    } else {
      // Solo manejar errores que NO tienen alertas automáticas
      if (!resultado.isDuplicate && !resultado.isPermissionError && !resultado.isNotFound) {
        setError(resultado.error);
      }
    }

    setProcesandoUsuario(false);
  };

  const handleClose = () => {
    setFormData({
      user: '',
      password: '',
      rol: 'user',
      area: ''
    });
    setError('');
    setProcesandoUsuario(false);
    onRequestClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={handleClose}
      // CAMBIAR A ESTAS CLASES (igual que los otros modales):
      className="w-[95vw] max-w-[500px] mx-auto mt-8 bg-white rounded-xl shadow-2xl outline-none max-h-[90vh] overflow-visible"
      overlayClassName="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-start justify-center p-4 z-50"
      contentLabel={`Modal ${esEdicion ? 'Editar' : 'Nuevo'} Usuario`}
      ariaHideApp={false}
    >
      <div>
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">
            {esEdicion ? 'Editar Usuario' : 'Crear Nuevo Usuario'}
          </h2>
          <button
            onClick={handleClose}
            className="p-1 rounded-full hover:bg-gray-100 transition-colors duration-200"
          >
            <FiX className="text-xl text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          {/* Usuario */}
          <div className="mb-4">
            <label htmlFor="user" className="block text-sm font-medium text-gray-700 mb-2">
              Nombre de Usuario
            </label>
            <div className="relative">
              <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                id="user"
                name="user"
                value={formData.user}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ingrese el nombre de usuario"
                disabled={procesandoUsuario}
              />
            </div>
          </div>

          {/* Contraseña */}
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              {esEdicion ? 'Nueva Contraseña (opcional)' : 'Contraseña'}
            </label>
            <div className="relative">
              <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder={esEdicion ? "Dejar vacío para mantener la actual" : "Ingrese la contraseña"}
                disabled={procesandoUsuario}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {esEdicion ? 'Dejar vacío para mantener la contraseña actual' : 'Mínimo 6 caracteres'}
            </p>
          </div>

          {/* Rol */}
          <div className="mb-4">
            <label htmlFor="rol" className="block text-sm font-medium text-gray-700 mb-2">
              Rol
            </label>
            <div className="relative">
              <FiUsers className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <select
                id="rol"
                name="rol"
                value={formData.rol}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={procesandoUsuario}
              >
                <option value="user">Usuario</option>
                <option value="admin">Administrador</option>
              </select>
            </div>
          </div>

          {/* Área */}
          <div className="mb-6">
            <label htmlFor="area" className="block text-sm font-medium text-gray-700 mb-2">
              Área
            </label>
            <div className="relative">
              <FiBriefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                id="area"
                name="area"
                value={formData.area}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ej: Recursos Humanos, IT, Ventas"
                disabled={procesandoUsuario}
              />
            </div>
          </div>

          {/* Botones */}
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              disabled={procesandoUsuario}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={procesandoUsuario}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {procesandoUsuario ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {esEdicion ? 'Actualizando...' : 'Creando...'}
                </>
              ) : (
                esEdicion ? 'Actualizar Usuario' : 'Crear Usuario'
              )}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default ModalUsuario;