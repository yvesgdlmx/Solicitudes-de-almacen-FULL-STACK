import { useState, useEffect, createContext } from "react";
import Swal from "sweetalert2";
import { mapSolicitudRow } from "../functions/Index";
import clienteAxios from "../config/clienteAxios";

const SolicitudContext = createContext();

const SolicitudProvider = ({ children }) => {
    const [cargando, setCargando] = useState(false);
    const [cargandoDatos, setCargandoDatos] = useState(true);
    const [datos, setDatos] = useState([])

    /* Obtener solicitudes del usuario autenticado */
    const obtenerSolicitudesUsuario = async () => {
        try {
            setCargandoDatos(true);
            const token = localStorage.getItem("token");
            if (!token) {
                Swal.fire({ icon: "error", title: "Error de autenticado", text: "No hay token de autenticación"})
                return; 
            }

            const config = {headers: { Authorization: `Bearer ${token}`}}
            const { data } = await clienteAxios.get("/solicitudes/usuario", config);
            setDatos(data.solicitudes.map(mapSolicitudRow));
        } catch (error) {
            console.log("Error al obtener solicitudes del usuario:", error);
            if(error.response) {
                const mensaje = error.response.data.msg || "Error al obetner las solicitudes";
                Swal.fire({ icon: "error", title: "Error de conexión", text: mensaje})
            } else if (error.request) {
                Swal.fire({ icon: "error", title: "Error de conexión", text: "verifique su conexión a internet" })
            } else {
                Swal.fire({ icon: "error", title: "Error", text: "Ocurrió un error inesperado" })
            }
        } finally {
            setCargandoDatos(false);
        }
    }

    /* Manejador de creacion de solicitudes */
    const handleGuardarSolicitud = async (nuevaSolicitud) => {
        try {
            setCargando(true);

            const datosParaEmviar = {
                prioridad: nuevaSolicitud.prioridad,
                comentarioUser: nuevaSolicitud.comentario,
                suministros: nuevaSolicitud.productos.map((producto) => ({
                    nombre: producto.producto,
                    cantidad: parseInt(producto.cantidad),
                    unidad: producto.unidad
                })),
            }; 

            const token = localStorage.getItem("token");
            const config = {
                headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
                },
            }; 

            const { data } = await clienteAxios.post("/solicitudes", datosParaEmviar, config);
            setDatos((prev) => [mapSolicitudRow(data.solicitud), ...prev]);
            Swal.fire({icon: "success", title: "¡Solicitud creada!", text: `La solicitud con folio ${data.solicitud.folio} ha sido creada exitosamente`, confirmButtonColor: "#3B82F6", timer: 3000, timerProgressBar: true});
            return data.solicitud;
        } catch (error) {
            console.error("Error al crear la solicitud:", error);
            if(error.response) {
                const mensaje = error.response.data.msg || "Error al obetner las solicitudes";
                Swal.fire({ icon: "error", title: "Error de conexión", text: mensaje})
            } else if (error.request) {
                Swal.fire({ icon: "error", title: "Error de conexión", text: "verifique su conexión a internet" })
            } else {
                Swal.fire({ icon: "error", title: "Error", text: "Ocurrió un error inesperado" })
            }
        } finally {
            setCargando(false);
        }
    };

    // Cargar una solicitud por id y devolverla en formato del formulario del modal
    const cargarSolicitudParaEditar = async (id) => {
        try {
            const token = localStorage.getItem("token");
            const config = {
                headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
                },
            };
            const { data } = await clienteAxios.get(`/solicitudes/${id}`, config);
            const { solicitud } = data;
            const formData = {
                prioridad: solicitud.prioridad || 'moderado',
                comentario: solicitud.comentarioUser || '',
                productos: (solicitud.suministros || []).map((s) => ({
                    producto: s.nombre || '',
                    cantidad: s.cantidad?.toString() ?? '',
                    unidad: s.unidad || ''
                }))
            };
            if (formData.productos.length === 0) {
                formData.productos = [{ producto: '', cantidad: '', unidad: '' }];
            }
            return formData;
        } catch (error) {
            console.error("Error al cargar la solicitud:", error);
            if(error.response) {
                const mensaje = error.response.data.msg || "No se pudo cargar la solicitud";
                Swal.fire({ icon: "error", title: "Error de conexión", text: mensaje})
            } else if (error.request) {
                Swal.fire({ icon: "error", title: "Error de conexión", text: "verifique su conexión a internet" })
            } else {
                Swal.fire({ icon: "error", title: "Error", text: "Ocurrió un error inesperado" })
            }
            return null;
        }
    };

    // Actualizar una solicitud
    const handleActualizarSolicitud = async (id, formulario) => {
        try {
            setCargando(true);
            const payload = {
                prioridad: formulario.prioridad,
                comentarioUser: formulario.comentario,
                suministros: formulario.productos.map((p) => ({
                    nombre: p.producto,
                    cantidad: parseInt(p.cantidad),
                    unidad: p.unidad
                }))
            };
            const token = localStorage.getItem("token");
            const config = {
                headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
                },
            };
            const { data } = await clienteAxios.put(`/solicitudes/${id}`, payload, config);
            // Actualizar fila en la tabla
            setDatos((prev) =>
                prev.map((row) =>
                    row.id === data.solicitud.id ? mapSolicitudRow(data.solicitud) : row
                )
            );
            Swal.fire({icon: "success", title: "¡Solicitud actualizada!", text: `La solicitud ${data.solicitud.folio} se actualizó correctamente`, confirmButtonColor: "#3B82F6", timer: 2500, timerProgressBar: true});
            return data.solicitud;
        } catch (error) {
            console.error("Error al actualizar la solicitud:", error);
            if(error.response) {
                const mensaje = error.response.data.msg || "Error al actualizar la solicitud";
                Swal.fire({ icon: "error", title: "Error de conexión", text: mensaje})
            } else if (error.request) {
                Swal.fire({ icon: "error", title: "Error de conexión", text: "verifique su conexión a internet" })
            } else {
                Swal.fire({ icon: "error", title: "Error", text: "Ocurrió un error inesperado" })
            }
        } finally {
            setCargando(false);
        }
    };

    /* Eliminar una solicitud solo usuarios user pueden eliminar sus propias solicitudes */
    const handleEliminarSOlicitud = async (id, folio) => {
        const resultado = await Swal.fire({
            titile: '¿Eliminar Solicitud?',
            text: `¿Está seguro de eliminar la solicitud con folio ${folio}? Esta acción no se puede deshacer.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        })
        if (!resultado.isConfirmed) return false;
        try {
            setCargando(true);
            const token = localStorage.getItem("token");
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            }
            await clienteAxios.delete(`/solicitudes/${id}`, config)
            setDatos(prev => prev.filter(solicitud => solicitud.id !== id))
            Swal.fire({
                icon: "success", title: "¡Solicitud eliminada!", text: `La solicitud con folio ${folio} ha sido eliminada exitosamente`, timer: 2000, showConfirmButton: false
            });
            return true;
        } catch (error) {
            console.error("Error al eliminar la solicitud", error);
            if(error.response) {
                const mensaje = error.response.data.msg || "Error al eliminar la solicitud";
                Swal.fire({ icon: "error", title: "Error de conexión", text: mensaje})
            } else if (error.request) {
                Swal.fire({ icon: "error", title: "Error de conexión", text: "verifique su conexión a internet" })
            } else {
                Swal.fire({ icon: "error", title: "Error", text: "Ocurrió un error inesperado" })
            }
            return false;
        } finally {
            setCargando(false);
        }
    }

    /* Obtener TODAS las solicitudes para usuarios ADMIN */
    const obtenerTodasSolicitudes = async  () => {
        try {
            setCargandoDatos(true);
            const token = localStorage.getItem("token");
            if(!token) {
                Swal.fire({ icon: "error", title: "Error de autenticación", text: "No hay token de autenticacion"})
                return;
            }
            const config = { headers: {Authorization: `Bearer ${token}`}}
            const { data } = await clienteAxios.get("/solicitudes", config);
            setDatos(data.solicitudes.map(mapSolicitudRow));
        } catch (error) {
            console.log("Error al obtener todas las solicitudes:", error);
            if(error.response) {
                const mensaje = error.response.data.msg || "Error al obetner las solicitudes";
                Swal.fire({ icon: "error", title: "Error de conexión", text: mensaje})
            } else if (error.request) {
                Swal.fire({ icon: "error", title: "Error de conexión", text: "verifique su conexión a internet" })
            } else {
                Swal.fire({ icon: "error", title: "Error", text: "Ocurrió un error inesperado" })
            }
        } finally {
            setCargandoDatos(false);
        }
    }

    /* Obtener una solicitud por id */
    const obtenerSolicitud = async (id) => {
        try {
            setCargando(true);
            const token = localStorage.getItem("token");
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
            }
            const { data } = await clienteAxios.get(`/solicitudes/${id}`, config);
            return mapSolicitudRow(data.solicitud);
        } catch (error) {
            console.error("Error al obtener la solicitud:", error);
            if(error.response) {
                const mensaje = error.response.data.msg || "Error al obtener la solicitud";
                Swal.fire({ icon: "error", title: "Error de conexión", text: mensaje})
            } else if( error.request) {
                Swal.fire({ icon: "error", title: "Error de conexión", text: "verifique su conexión a internet" })
            } else {
                Swal.fire({ icon: "error", title: "Error", text: "Ocurrió un error inesperado" })
            }
            return null;
        } finally {
            setCargando(false);
        }
    }

    const cambiarStatusSolicitud = async (id, nuevoStatus, comentarioAdmin = '') => {
        try {
            setCargando(true)
            const token = localStorage.getItem("token");
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }

            const payload = { status: nuevoStatus};

            if(comentarioAdmin.trim()) {
                payload.comentarioAdmin = comentarioAdmin.trim();
            }

            const { data } = await clienteAxios.put(`/solicitudes/${id}/status`, payload, config);

            setDatos((prev) => 
                prev.map((row) => 
                    row.id === data.solicitud.id ? mapSolicitudRow(data.solicitud) : row
                )
            )

            Swal.fire({ 
                icon: "success", 
                title: "¡Status actualizado!", 
                confirmButtonColor: "#3B82F6", 
                timer: 2500, 
                timerProgressBar: true,
                text: `El status de la solicitud ${data.solicitud.folio} se actualizó a ${data.solicitud.status}`,
            })

            return { success: true, solicitud: data.solicitud}; 
        } catch (error) {
            console.error("Error al cambiar el status de la solicitud:", error);
            if(error.response) {
                const mensaje = error.response.data.msg || "Error al cambiar el status de la solicitud";
                Swal.fire({ icon: "error", title: "Error de conexión", text: mensaje})
            } else if (error.request) {
                Swal.fire({ icon: "error", title: "Error de conexión", text: "verifique su conexión a internet" })
            } else {
                Swal.fire({ icon: "error", title: "Error", text: "Ocurrió un error inesperado" })
            }
            return { success: false };
        } finally {
            setCargando(false)
        }
    }
    
    return ( 
        <SolicitudContext.Provider
            value={{
                datos,
                cargando,
                cargandoDatos,
                obtenerSolicitudesUsuario,
                obtenerTodasSolicitudes,
                obtenerSolicitud,
                handleGuardarSolicitud,
                cargarSolicitudParaEditar,
                handleActualizarSolicitud,
                handleEliminarSOlicitud,
                cambiarStatusSolicitud
            }}
        >
            {children}
        </SolicitudContext.Provider>
    )
}

export { SolicitudProvider };
export default SolicitudContext;