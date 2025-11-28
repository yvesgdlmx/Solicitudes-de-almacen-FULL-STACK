import { useState, useEffect, createContext } from 'react';
import clienteAxios from '../config/clienteAxios';
import Swal from 'sweetalert2';

const UnidadMedidaContext = createContext();

const UnidadMedidaProvider = ({ children }) => {
    const [unidades, setUnidades] = useState([]);
    const [cargando, setCargando] = useState(false);
    const [cargandoDatos, setCargandoDatos] = useState(true);

    useEffect(() => {
        obtenerUnidadesMedida();
    }, []);

    const obtenerUnidadesMedida = async () => {
        try {
            setCargandoDatos(true);
            const token = localStorage.getItem('token');
            if (!token) return;

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            };

            const { data } = await clienteAxios.get('/unidades-medida', config);
            setUnidades(data.unidades);
        } catch (error) {
            console.error('Error al obtener unidades de medida:', error);
            setUnidades([]);
        } finally {
            setCargandoDatos(false);
        }
    };

    const crearUnidadMedida = async (datosUnidad) => {
        try {
            setCargando(true);
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            };

            const { data } = await clienteAxios.post('/unidades-medida', datosUnidad, config);
            
            setUnidades([...unidades, data.unidad]);

            Swal.fire({
                icon: 'success',
                title: '¡Éxito!',
                text: data.msg || 'Unidad de medida creada correctamente',
                confirmButtonColor: '#16a34a'
            });

            return true;
        } catch (error) {
            const mensaje = error.response?.data?.msg || 'Error al crear la unidad de medida';
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: mensaje,
                confirmButtonColor: '#dc2626'
            });
            return false;
        } finally {
            setCargando(false);
        }
    };

    const actualizarUnidadMedida = async (id, datosUnidad) => {
        try {
            setCargando(true);
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            };

            const { data } = await clienteAxios.put(`/unidades-medida/${id}`, datosUnidad, config);
            
            setUnidades(unidades.map(unidad => 
                unidad.id === id ? data.unidad : unidad
            ));

            Swal.fire({
                icon: 'success',
                title: '¡Éxito!',
                text: data.msg || 'Unidad de medida actualizada correctamente',
                confirmButtonColor: '#16a34a'
            });

            return true;
        } catch (error) {
            const mensaje = error.response?.data?.msg || 'Error al actualizar la unidad de medida';
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: mensaje,
                confirmButtonColor: '#dc2626'
            });
            return false;
        } finally {
            setCargando(false);
        }
    };

    const eliminarUnidadMedida = async (id, nombre) => {
        try {
            const result = await Swal.fire({
                title: '¿Estás seguro?',
                text: `Se eliminará la unidad de medida "${nombre}"`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#dc2626',
                cancelButtonColor: '#6b7280',
                confirmButtonText: 'Sí, eliminar',
                cancelButtonText: 'Cancelar'
            });

            if (!result.isConfirmed) return false;

            setCargando(true);
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            };

            const { data } = await clienteAxios.delete(`/unidades-medida/${id}`, config);
            
            setUnidades(unidades.filter(unidad => unidad.id !== id));

            Swal.fire({
                icon: 'success',
                title: '¡Eliminado!',
                text: data.msg || 'Unidad de medida eliminada correctamente',
                confirmButtonColor: '#16a34a'
            });

            return true;
        } catch (error) {
            const mensaje = error.response?.data?.msg || 'Error al eliminar la unidad de medida';
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: mensaje,
                confirmButtonColor: '#dc2626'
            });
            return false;
        } finally {
            setCargando(false);
        }
    };

    return (
        <UnidadMedidaContext.Provider
            value={{
                unidades,
                cargando,
                cargandoDatos,
                obtenerUnidadesMedida,
                crearUnidadMedida,
                actualizarUnidadMedida,
                eliminarUnidadMedida
            }}
        >
            {children}
        </UnidadMedidaContext.Provider>
    );
};

export { UnidadMedidaProvider };
export default UnidadMedidaContext;