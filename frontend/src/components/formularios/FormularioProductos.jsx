import React, { useEffect } from 'react';
import Select from 'react-select';
import { unidadesDisponibles } from "../../data/Index";
import useFormularioSolicitud from '../../hooks/useFormularioSolicitud';
import useProducto from '../../hooks/useProducto';
import { useSelectStyles } from '../../hooks/useSelectStyles';

const FormularioProductos = ({ cargando }) => {
    const {
        formulario,
        errores,
        handleProductoChange,
        agregarProducto,
        eliminarProducto
    } = useFormularioSolicitud();

    const {
        productos,
        obtenerProductos,
        cargandoDatos: cargandoProductos
    } = useProducto();

    const { estilosSelect, estilosSelectError } = useSelectStyles();

    // Cargar productos al montar el componente
    useEffect(() => {
        if (productos.length === 0) {
            obtenerProductos();
        }
    }, []);

    // Convertir productos del contexto a formato para react-select
    const opcionesProductos = productos.map(producto => ({
        value: producto.nombre,
        label: producto.nombre,
        unidad: producto.unidad,
        id: producto.id
    }));

    // Convertir unidades a formato para react-select (mantener las de data + las de productos del contexto)
    const unidadesDeProductos = [...new Set(productos.map(p => p.unidad))];
    const todasLasUnidades = [...new Set([...unidadesDeProductos, ...unidadesDisponibles])];
    const opcionesUnidades = todasLasUnidades.map(unidad => ({
        value: unidad,
        label: unidad
    }));

    // Función para manejar el cambio de producto y auto-completar la unidad
    const handleProductoSeleccionado = (indice, opcionSeleccionada) => {
        const nombreProducto = opcionSeleccionada?.value || '';
        
        // Actualizar el nombre del producto
        handleProductoChange(indice, 'producto', nombreProducto);
        
        // Si se seleccionó un producto, auto-completar la unidad
        if (opcionSeleccionada && opcionSeleccionada.unidad) {
            handleProductoChange(indice, 'unidad', opcionSeleccionada.unidad);
        } else if (!opcionSeleccionada) {
            // Si se limpió la selección, también limpiar la unidad
            handleProductoChange(indice, 'unidad', '');
        }
    };

    // Función personalizada para filtrar opciones (búsqueda más flexible)
    const filtrarOpciones = (opcion, inputValue) => {
        const valor = opcion.label.toLowerCase();
        const busqueda = inputValue.toLowerCase();
        return valor.includes(busqueda);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">
                    Productos *
                </label>
                <button
                    type="button"
                    onClick={agregarProducto}
                    disabled={cargando || cargandoProductos}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    + Agregar producto
                </button>
            </div>

            {/* Indicador de carga de productos */}
            {cargandoProductos && (
                <div className="mb-3 p-2 bg-blue-50 border border-blue-200 rounded-lg flex items-center gap-2">
                    <svg className="animate-spin w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span className="text-blue-700 text-xs">Cargando productos...</span>
                </div>
            )}

            <div className="space-y-3">
                {formulario.productos.map((producto, indice) => (
                    <div key={indice} className="border border-gray-200 rounded-lg p-3 bg-gray-50">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                            <div className="md:col-span-2">
                                <Select
                                    value={producto.producto ? { 
                                        value: producto.producto, 
                                        label: producto.producto,
                                        unidad: productos.find(p => p.nombre === producto.producto)?.unidad
                                    } : null}
                                    onChange={(opcionSeleccionada) => handleProductoSeleccionado(indice, opcionSeleccionada)}
                                    options={opcionesProductos}
                                    placeholder="Buscar y seleccionar producto..."
                                    isSearchable={true}
                                    isClearable={true}
                                    isDisabled={cargando || cargandoProductos}
                                    styles={errores[`producto_${indice}`] ? estilosSelectError : estilosSelect}
                                    noOptionsMessage={() => productos.length === 0 ? "No hay productos disponibles" : "No se encontraron productos"}
                                    loadingMessage={() => "Cargando productos..."}
                                    filterOption={filtrarOpciones}
                                    menuPortalTarget={document.body}
                                    menuPosition="fixed"
                                    formatOptionLabel={(opcion, { context }) => (
                                        <div className="flex justify-between items-center">
                                            <span className="truncate">{opcion.label}</span>
                                            {context === 'menu' && (
                                                <span className="text-xs text-gray-500 ml-2 flex-shrink-0">
                                                    {opcion.unidad}
                                                </span>
                                            )}
                                        </div>
                                    )}
                                />
                                {errores[`producto_${indice}`] && (
                                    <p className="text-red-500 text-xs mt-1">{errores[`producto_${indice}`]}</p>
                                )}
                            </div>

                            <div>
                                <input
                                    type="number"
                                    placeholder="Cantidad"
                                    value={producto.cantidad}
                                    onChange={(e) => handleProductoChange(indice, 'cantidad', e.target.value)}
                                    disabled={cargando}
                                    className={`w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400 disabled:opacity-50 disabled:cursor-not-allowed ${
                                        errores[`cantidad_${indice}`] ? 'border-red-300' : 'border-gray-300'
                                    }`}
                                    min="1"
                                />
                                {errores[`cantidad_${indice}`] && (
                                    <p className="text-red-500 text-xs mt-1">{errores[`cantidad_${indice}`]}</p>
                                )}
                            </div>

                            <div className="flex gap-2">
                                <div className="flex-1">
                                    <Select
                                        value={producto.unidad ? { value: producto.unidad, label: producto.unidad } : null}
                                        onChange={(opcionSeleccionada) => handleProductoChange(indice, 'unidad', opcionSeleccionada?.value || '')}
                                        options={opcionesUnidades}
                                        placeholder="Unidad"
                                        isSearchable={true}
                                        isClearable={true}
                                        isDisabled={cargando}
                                        styles={errores[`unidad_${indice}`] ? estilosSelectError : estilosSelect}
                                        noOptionsMessage={() => "No se encontraron unidades"}
                                        menuPortalTarget={document.body}
                                        menuPosition="fixed"
                                    />
                                </div>

                                {formulario.productos.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => eliminarProducto(indice)}
                                        disabled={cargando}
                                        className="text-red-600 hover:text-red-700 p-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                        title="Eliminar producto"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                )}
                            </div>
                        </div>
                        {errores[`unidad_${indice}`] && (
                            <p className="text-red-500 text-xs mt-1">{errores[`unidad_${indice}`]}</p>
                        )}
                    </div>
                ))}
            </div>

            {/* Información adicional */}
            {productos.length > 0 && (
                <div className="mt-2 text-xs text-gray-500">
                    💡 Tip: Al seleccionar un producto, la unidad se completará automáticamente, pero puedes cambiarla si necesitas otra unidad.
                </div>
            )}
        </div>
    );
};

export default FormularioProductos;