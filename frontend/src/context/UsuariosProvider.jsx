import { useState, createContext } from "react";
import clienteAxios from "../config/clienteAxios";
import Swal from 'sweetalert2';

const UsuariosContext = createContext();

const UsuariosProvider = ({ children }) => {
    const [usuarios, setUsuarios] = useState([]);
    const [cargandoUsuarios, setCargandoUsuarios] = useState(false);

    const obtenerUsuarios = async () => {
        setCargandoUsuarios(true);
        try {
            const token = localStorage.getItem('token');
            if(!token) {
                throw new Error('No hay token de autenticación');
            }

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            };

            const { data } = await clienteAxios.get('/usuarios/usuarios', config);
            setUsuarios(data);
            return { success: true, usuarios: data};
        } catch (error) {
            console.error('Error al obtener los usuarios:', error);
            return { 
                success: false,
                msg: error.response?.data?.msg || 'Error al obtener los usuarios'
            };
        } finally {
            setCargandoUsuarios(false);
        }
    }

    const crearUsuario = async (datosUsuario) => {
        try {
            const token = localStorage.getItem('token');
            if(!token) {
                throw new Error('No hay token de autenticación');
            }

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }; 

            const { data } = await clienteAxios.post('/usuarios/registro', datosUsuario, config);

            setUsuarios(prev => [...prev, data.usuario]);

            // Mostrar alerta de éxito
            await Swal.fire({
                title: '¡Usuario creado!',
                text: `El usuario "${datosUsuario.user}" ha sido creado correctamente`,
                icon: 'success',
                confirmButtonText: 'Entendido',
                confirmButtonColor: '#3B82F6',
                timer: 3000,
                timerProgressBar: true
            });

            return { success: true, usuario: data.usuario, msg: data.msg};
        } catch (error) {
            console.error('Error al crear el usuario:', error);
            
            // Manejar diferentes tipos de errores con alertas específicas
            if (error.response?.status === 400 && error.response?.data?.msg?.includes('ya está registrado')) {
                // Usuario duplicado
                await Swal.fire({
                    title: '¡Usuario duplicado!',
                    text: `El usuario "${datosUsuario.user}" ya existe en el sistema. Por favor, elige otro nombre de usuario.`,
                    icon: 'warning',
                    confirmButtonText: 'Entendido',
                    confirmButtonColor: '#F59E0B'
                });
                return { 
                    success: false,
                    isDuplicate: true,
                    error: error.response?.data?.msg
                };
            } else if (error.response?.status === 403) {
                // Sin permisos
                await Swal.fire({
                    title: '¡Sin permisos!',
                    text: 'No tienes permisos para crear usuarios',
                    icon: 'error',
                    confirmButtonText: 'Entendido',
                    confirmButtonColor: '#EF4444'
                });
                return { 
                    success: false,
                    isPermissionError: true,
                    error: error.response?.data?.msg
                };
            } else {
                // Otros errores - mostrar en el formulario
                return { 
                    success: false,
                    error: error.response?.data?.msg || 'Error al crear el usuario'
                };
            }
        }
    }

    const editarUsuario = async (datosUsuario) => {
        try {
            const token = localStorage.getItem('token')
            if(!token) {
                throw new Error('No hay token de autenticación');
            }

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }

            const { data } = await clienteAxios.put('/usuarios/editar.usuario', datosUsuario, config);

            setUsuarios(prev => prev.map(usuario => usuario.id === datosUsuario.id ? data.usuario : usuario))

            await Swal.fire({ title: '¡Usuario actualizado!', icon: 'success', confirmButtonText: 'Entendido', confirmButtonColor: '#3B82F6', timer: 3000, timerProgressBar: true,
                text: `El usuario "${datosUsuario.user}" ha sido actualizado correctamente`,
            })

            return { success: true, usuario: data.usuario, msg: data.msg};
        } catch (error) {
            console.error('Error al editar el usuario:', error);
            if(error.response?.status === 400 && error.responde?.data?.msg?.includes('ya esta en uso')) {
                await Swal.fire({ title: '¡Usuario duplicado!', icon: 'warning', confirmButtonText: 'Entendido', confirmButtonColor: '#F59E0B',
                    text: `El usuario "${datosUsuario.user}" ya existe en el sistema. Por favor, elige otro nombre de usuario.`,
                });
                return {
                    success: false,
                    isDuplicate: true,
                    error: error.response?.data?.msg
                }
            } else if (error.response?.status === 403) {
                await Swal.fire({ title: '¡Sin permisos!', icon: 'error', confirmButtonText: 'Entendido', confirmButtonColor: '#EF4444',
                    text: 'No tienes permisos para editar usuarios',
                });
                return {
                    success: false,
                    isPermissionError: true,
                    error: error.response?.data?.msg
                }
            } else if (error.response?.status === 404) {
                await Swal.fire({title: '¡Usuario no encontrado!', icon: 'error', confirmButtonText: 'Entendido', confirmButtonColor: '#EF4444',
                    text: 'El usuario que intentas editar no existe',
                });
                return {
                    success: false,
                    isNotFoundError: true,
                    error: error.response?.data?.msg
                }
            } else {
                return {
                    success: false,
                    error: error.response?.data?.msg || 'Error al editar el usuario'
                }
            }
        }
    }

    const eliminarUsuario = async (usuarioId, nombreUsuario) => {
        try {
            // Mostrar confirmación antes de eliminar
            const resultado = await Swal.fire({
                title: '¿Estás seguro?',
                text: `¿Deseas eliminar al usuario "${nombreUsuario}"? Esta acción no se puede deshacer.`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#EF4444',
                cancelButtonColor: '#6B7280',
                confirmButtonText: 'Sí, eliminar',
                cancelButtonText: 'Cancelar',
                reverseButtons: true
            });

            if (!resultado.isConfirmed) {
                return { success: false, cancelled: true };
            }

            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No hay token de autenticación');
            }

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            };

            await clienteAxios.delete(`/usuarios/eliminar-usuario/${usuarioId}`, config);

            // Remover el usuario de la lista
            setUsuarios(prev => prev.filter(usuario => usuario.id !== usuarioId));

            // Mostrar alerta de éxito
            await Swal.fire({
                title: '¡Usuario eliminado!',
                text: `El usuario "${nombreUsuario}" ha sido eliminado correctamente`,
                icon: 'success',
                confirmButtonText: 'Entendido',
                confirmButtonColor: '#3B82F6',
                timer: 3000,
                timerProgressBar: true
            });

            return { success: true };
        } catch (error) {
            console.error('Error al eliminar el usuario:', error);
            
            if (error.response?.status === 403) {
                await Swal.fire({
                    title: '¡Sin permisos!',
                    text: 'No tienes permisos para eliminar usuarios',
                    icon: 'error',
                    confirmButtonText: 'Entendido',
                    confirmButtonColor: '#EF4444'
                });
                return {
                    success: false,
                    isPermissionError: true,
                    error: error.response?.data?.msg
                };
            } else if (error.response?.status === 404) {
                await Swal.fire({
                    title: '¡Usuario no encontrado!',
                    text: 'El usuario que intentas eliminar no existe',
                    icon: 'error',
                    confirmButtonText: 'Entendido',
                    confirmButtonColor: '#EF4444'
                });
                return {
                    success: false,
                    isNotFound: true,
                    error: error.response?.data?.msg
                };
            } else if (error.response?.status === 400) {
                await Swal.fire({
                    title: '¡Operación no permitida!',
                    text: error.response?.data?.msg || 'No se puede eliminar este usuario',
                    icon: 'error',
                    confirmButtonText: 'Entendido',
                    confirmButtonColor: '#EF4444'
                });
                return {
                    success: false,
                    isInvalidOperation: true,
                    error: error.response?.data?.msg
                };
            } else {
                await Swal.fire({
                    title: '¡Error!',
                    text: 'Ocurrió un error al eliminar el usuario',
                    icon: 'error',
                    confirmButtonText: 'Entendido',
                    confirmButtonColor: '#EF4444'
                });
                return {
                    success: false,
                    error: error.response?.data?.msg || 'Error al eliminar el usuario'
                };
            }
        }
    }

    return (
        <UsuariosContext.Provider 
            value={{
                usuarios,
                cargandoUsuarios,
                obtenerUsuarios,
                crearUsuario,
                editarUsuario,
                eliminarUsuario,
                setUsuarios
            }}
        >
            {children}
        </UsuariosContext.Provider>
    );
};

export { UsuariosProvider };
export default UsuariosContext;