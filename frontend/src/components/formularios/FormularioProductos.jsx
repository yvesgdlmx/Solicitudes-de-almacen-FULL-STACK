import React, { useEffect } from 'react';
import Select from 'react-select';
import useFormularioSolicitud from '../../hooks/useFormularioSolicitud';
import useProducto from '../../hooks/useProducto';
import useDashboard from '../../hooks/useDashboard';
import { useSelectStyles } from '../../hooks/useSelectStyles';

const FormularioProductos = ({ cargando, unidadesDisponibles = [] }) => {
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

    const { dataDashboard } = useDashboard();

    const { estilosSelect, estilosSelectError } = useSelectStyles();

    // Cargar productos al montar el componente
    useEffect(() => {
        if (productos.length === 0) {
            obtenerProductos();
        }
    }, []);

    // Ordenar productos: primero los más solicitados por el usuario, luego alfabéticamente
    const obtenerProductosOrdenados = () => {
        const productosMasSolicitados = dataDashboard?.productosMasSolicitados || [];
        
        // Crear un mapa de nombres de productos más solicitados con su índice
        const mapaProductosSolicitados = new Map(
            productosMasSolicitados.map((p, index) => [p.nombre.toLowerCase(), index])
        );

        // Ordenar productos
        const productosOrdenados = [...productos].sort((a, b) => {
            const nombreA = a.nombre.toLowerCase();
            const nombreB = b.nombre.toLowerCase();
            
            const indexA = mapaProductosSolicitados.has(nombreA) 
                ? mapaProductosSolicitados.get(nombreA) 
                : Infinity;
            const indexB = mapaProductosSolicitados.has(nombreB) 
                ? mapaProductosSolicitados.get(nombreB) 
                : Infinity;

            // Si ambos están en los más solicitados, ordenar por índice
            if (indexA !== Infinity && indexB !== Infinity) {
                return indexA - indexB;
            }
            
            // Si solo uno está en los más solicitados, ese va primero
            if (indexA !== Infinity) return -1;
            if (indexB !== Infinity) return 1;
            
            // Si ninguno está en los más solicitados, ordenar alfabéticamente
            return a.nombre.localeCompare(b.nombre);
        });

        return productosOrdenados;
    };

    // Convertir productos ordenados a formato para react-select
    const opcionesProductos = obtenerProductosOrdenados().map((producto, index) => {
        const esMasSolicitado = dataDashboard?.productosMasSolicitados?.some(
            p => p.nombre.toLowerCase() === producto.nombre.toLowerCase()
        );

        return {
            value: producto.nombre,
            label: producto.nombre,
            unidad: producto.unidad,
            id: producto.id,
            esMasSolicitado,
            orden: index
        };
    });

    // Convertir unidades de la base de datos a formato para react-select
    const opcionesUnidades = unidadesDisponibles
        .sort((a, b) => a.id - b.id)
        .map(unidad => ({
            value: unidad.nombre,
            label: unidad.nombre,
            id: unidad.id
        }));

    // Función para manejar el cambio de producto y auto-completar la unidad
    const handleProductoSeleccionado = (indice, opcionSeleccionada) => {
        const nombreProducto = opcionSeleccionada?.value || '';
        
        handleProductoChange(indice, 'producto', nombreProducto);
        
        if (opcionSeleccionada && opcionSeleccionada.unidad) {
            handleProductoChange(indice, 'unidad', opcionSeleccionada.unidad);
        } else if (!opcionSeleccionada) {
            handleProductoChange(indice, 'unidad', '');
        }
    };

    // Función personalizada para filtrar opciones (búsqueda más flexible)
    const filtrarOpciones = (opcion, inputValue) => {
        const valor = opcion.label.toLowerCase();
        const busqueda = inputValue.toLowerCase();
        return valor.includes(busqueda);
    };

    // Componente personalizado para las opciones del select
    const formatearOpcion = (opcion, { context }) => (
        <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 flex-1 truncate">
                {opcion.esMasSolicitado && (
                    <span className="text-yellow-500 flex-shrink-0" title="Producto más solicitado por ti">
                        ⭐
                    </span>
                )}
                <span className="truncate">{opcion.label}</span>
            </div>
            {context === 'menu' && (
                <span className="text-xs text-gray-500 ml-2 flex-shrink-0">
                    {opcion.unidad}
                </span>
            )}
        </div>
    );

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
                                        unidad: productos.find(p => p.nombre === producto.producto)?.unidad,
                                        esMasSolicitado: dataDashboard?.productosMasSolicitados?.some(
                                            p => p.nombre.toLowerCase() === producto.producto.toLowerCase()
                                        )
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
                                    formatOptionLabel={formatearOpcion}
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
                                        noOptionsMessage={() => unidadesDisponibles.length === 0 ? "No hay unidades disponibles" : "No se encontraron unidades"}
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
            {productos.length > 0 && unidadesDisponibles.length > 0 && (
                <div className="mt-2 space-y-1">
                    <div className="text-xs text-gray-500">
                        💡 Tip: Al seleccionar un producto, la unidad se completará automáticamente.
                    </div>
                    {dataDashboard?.productosMasSolicitados && dataDashboard.productosMasSolicitados.length > 0 && (
                        <div className="text-xs text-yellow-700 flex items-center gap-1">
                            <span>⭐</span>
                            <span>Los productos marcados con estrella son tus más solicitados y aparecen primero.</span>
                        </div>
                    )}
                </div>
            )}

            {unidadesDisponibles.length === 0 && (
                <div className="mt-2 text-xs text-amber-600">
                    ⚠️ No hay unidades de medida registradas. Por favor, registra unidades primero.
                </div>
            )}
        </div>
    );
};

export default FormularioProductos;