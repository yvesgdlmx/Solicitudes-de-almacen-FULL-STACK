import { useState, useEffect, createContext } from "react";

const FormularioSolicitudContext = createContext();

const FormularioSolicitudProvider = ({ children }) => {
    const estadoInicial = {
        prioridad: 'moderado',
        comentario: '',
        productos: [{ producto: '', cantidad: '', unidad: '' }]
    }

    const [formulario, setFormulario] = useState(estadoInicial);
    const [errores, setErrores] = useState({})
    const [isOpen, setIsOpen] = useState(false);
    const [initialData, setInitialData] = useState(null)
    const [modo, setModo] = useState('crear');

    useEffect(() => {
        if(isOpen){
            setFormulario(initialData ? initialData : estadoInicial)
            setErrores({})
        }
    }, [isOpen, initialData]);

    const handleInputChange = (campo, valor) => {
        setFormulario(prev => ({
            ...prev,
            [campo]: valor
        }))
        if (errores[campo]) {
            setErrores(prev => ({...prev, [campo]: '' }))
        }
    }

    const handleProductoChange = (indice, campo, valor) => {
        const nuevosProductos = [...formulario.productos];
        nuevosProductos[indice][campo] = valor;
        setFormulario(prev => ({...prev, productos: nuevosProductos }));

        const campoError = `${campo}_${indice}`;
        if(errores[campoError]){
            setErrores(prev => ({ ...prev, [campoError]: ''}))
        }
    }

    const agregarProducto = () => {
        setFormulario(prev => ({
            ...prev,
            productos: [...prev.productos, {producto: '', cantidad: '', unidad: ''}]
        }));
    };

    const eliminarProducto = (indice) => {
        if(formulario.productos.length > 1) {
            const nuevosProductos = formulario.productos.filter((_, i) => i !== indice);
            setFormulario(prev => ({...prev, productos:  nuevosProductos}))
        }
    };

    const validarFormulario = () => {
        const nuevosErrores = {}
        formulario.productos.forEach((producto, indice) => {
            if(!producto.producto.trim()) {
                nuevosErrores[`producto_${indice}`] = 'El nombre del producto es obligatorio.'
            }
            if (!producto.cantidad || Number(producto.cantidad) <= 0) {
                nuevosErrores[`cantidad_${indice}`] = 'La cantidad debe ser un número positivo.'
            }
            if (!producto.unidad.trim()) {
                nuevosErrores[`unidad_${indice}`] = 'La unidad es obligatoria.'
            }
        });

        setErrores(nuevosErrores);
        return Object.keys(nuevosErrores).length === 0;
    }

    const resetFormulario = () => {
        setFormulario(estadoInicial);
        setErrores({});
    }

    const abrirModal = (datos = null, modoEdicion = 'crear') => {
        setInitialData(datos);
        setModo(modoEdicion);
        setIsOpen(true);
    }

    const cerrarModal = () => {
        setIsOpen(false); 
        setInitialData(null);
        setModo('crear')
        resetFormulario();
    }

    const actualizarFormulario = (nuevosDatos) => {
        setFormulario(nuevosDatos);
    }

    return (
        <FormularioSolicitudContext.Provider 
            value={{
                formulario,
                errores,
                isOpen,
                initialData,
                modo,
                handleInputChange,
                handleProductoChange,
                agregarProducto,
                eliminarProducto,
                validarFormulario,
                resetFormulario,
                actualizarFormulario,
                abrirModal,
                cerrarModal,
                setFormulario,
                setErrores
            }}
        >
            {children}
        </FormularioSolicitudContext.Provider>
    )
}

export { FormularioSolicitudProvider }
export default FormularioSolicitudContext;