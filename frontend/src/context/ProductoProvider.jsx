import { useState, createContext } from "react";
import Swal from "sweetalert2";
import clienteAxios from "../config/clienteAxios";

const ProductoContext = createContext();

const ProductoProvider = ({ children }) => {
    const [productos, setProductos] = useState([]);
    const [cargando, setCargando] = useState(false);
    const [cargandoDatos, setCargandoDatos] = useState(true);

    /* Obtener todos los productos */
    const obtenerProductos = async () => {
        try {
            setCargandoDatos(true);
            const token = localStorage.getItem("token");
            if (!token) {
                Swal.fire({ icon: "error", title: "Error de autenticación", text: "No hay token de autenticación" });
                return;
            }

            const config = { 
                headers: { 
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}` 
                } 
            };
            const { data } = await clienteAxios.get("/productos", config);
            setProductos(data.productos);
        } catch (error) {
            console.error("Error al obtener productos:", error);
            if (error.response) {
                const mensaje = error.response.data.msg || "Error al obtener los productos";
                Swal.fire({ icon: "error", title: "Error de conexión", text: mensaje });
            } else if (error.request) {
                Swal.fire({ icon: "error", title: "Error de conexión", text: "Verifique su conexión a internet" });
            } else {
                Swal.fire({ icon: "error", title: "Error", text: "Ocurrió un error inesperado" });
            }
        } finally {
            setCargandoDatos(false);
        }
    };

    /* Obtener un producto por ID */
    const obtenerProducto = async (id) => {
        try {
            setCargando(true);
            const token = localStorage.getItem("token");
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            };
            const { data } = await clienteAxios.get(`/productos/${id}`, config);
            return data.producto;
        } catch (error) {
            console.error("Error al obtener el producto:", error);
            if (error.response) {
                const mensaje = error.response.data.msg || "Error al obtener el producto";
                Swal.fire({ icon: "error", title: "Error de conexión", text: mensaje });
            } else if (error.request) {
                Swal.fire({ icon: "error", title: "Error de conexión", text: "Verifique su conexión a internet" });
            } else {
                Swal.fire({ icon: "error", title: "Error", text: "Ocurrió un error inesperado" });
            }
            return null;
        } finally {
            setCargando(false);
        }
    };

    /* Crear un nuevo producto */
    const crearProducto = async (datosProducto) => {
        try {
            setCargando(true);
            const token = localStorage.getItem("token");
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            };

            const { data } = await clienteAxios.post("/productos", datosProducto, config);
            setProductos(prev => [...prev, data.producto].sort((a, b) => a.nombre.localeCompare(b.nombre)));
            
            Swal.fire({
                icon: "success",
                title: "¡Producto creado!",
                text: `El producto "${data.producto.nombre}" ha sido creado exitosamente`,
                confirmButtonColor: "#3B82F6",
                timer: 3000,
                timerProgressBar: true
            });
            
            return data.producto;
        } catch (error) {
            console.error("Error al crear el producto:", error);
            if (error.response) {
                const mensaje = error.response.data.msg || "Error al crear el producto";
                Swal.fire({ icon: "error", title: "Error de conexión", text: mensaje });
            } else if (error.request) {
                Swal.fire({ icon: "error", title: "Error de conexión", text: "Verifique su conexión a internet" });
            } else {
                Swal.fire({ icon: "error", title: "Error", text: "Ocurrió un error inesperado" });
            }
            return null;
        } finally {
            setCargando(false);
        }
    };

    /* Actualizar un producto */
    const actualizarProducto = async (id, datosProducto) => {
        try {
            setCargando(true);
            const token = localStorage.getItem("token");
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            };

            const { data } = await clienteAxios.put(`/productos/${id}`, datosProducto, config);
            setProductos(prev => 
                prev.map(producto => 
                    producto.id === id ? data.producto : producto
                ).sort((a, b) => a.nombre.localeCompare(b.nombre))
            );

            Swal.fire({
                icon: "success",
                title: "¡Producto actualizado!",
                text: `El producto "${data.producto.nombre}" se actualizó correctamente`,
                confirmButtonColor: "#3B82F6",
                timer: 2500,
                timerProgressBar: true
            });

            return data.producto;
        } catch (error) {
            console.error("Error al actualizar el producto:", error);
            if (error.response) {
                const mensaje = error.response.data.msg || "Error al actualizar el producto";
                Swal.fire({ icon: "error", title: "Error de conexión", text: mensaje });
            } else if (error.request) {
                Swal.fire({ icon: "error", title: "Error de conexión", text: "Verifique su conexión a internet" });
            } else {
                Swal.fire({ icon: "error", title: "Error", text: "Ocurrió un error inesperado" });
            }
            return null;
        } finally {
            setCargando(false);
        }
    };

    /* Eliminar un producto */
    const eliminarProducto = async (id, nombre) => {
        const resultado = await Swal.fire({
            title: '¿Eliminar Producto?',
            text: `¿Está seguro de eliminar el producto "${nombre}"? Esta acción no se puede deshacer.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        });

        if (!resultado.isConfirmed) return false;

        try {
            setCargando(true);
            const token = localStorage.getItem("token");
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            };

            await clienteAxios.delete(`/productos/${id}`, config);
            setProductos(prev => prev.filter(producto => producto.id !== id));

            Swal.fire({
                icon: "success",
                title: "¡Producto eliminado!",
                text: `El producto "${nombre}" ha sido eliminado exitosamente`,
                timer: 2000,
                showConfirmButton: false
            });

            return true;
        } catch (error) {
            console.error("Error al eliminar el producto:", error);
            if (error.response) {
                const mensaje = error.response.data.msg || "Error al eliminar el producto";
                Swal.fire({ icon: "error", title: "Error de conexión", text: mensaje });
            } else if (error.request) {
                Swal.fire({ icon: "error", title: "Error de conexión", text: "Verifique su conexión a internet" });
            } else {
                Swal.fire({ icon: "error", title: "Error", text: "Ocurrió un error inesperado" });
            }
            return false;
        } finally {
            setCargando(false);
        }
    };

    return (
        <ProductoContext.Provider
            value={{
                productos,
                cargando,
                cargandoDatos,
                obtenerProductos,
                obtenerProducto,
                crearProducto,
                actualizarProducto,
                eliminarProducto
            }}
        >
            {children}
        </ProductoContext.Provider>
    );
};

export { ProductoProvider };
export default ProductoContext;