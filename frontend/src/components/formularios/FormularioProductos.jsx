import React, { useEffect } from "react";
import Select from "react-select";
import useFormularioSolicitud from "../../hooks/useFormularioSolicitud";
import useProducto from "../../hooks/useProducto";
import useDashboard from "../../hooks/useDashboard";
import { useSelectStyles } from "../../hooks/useSelectStyles";

const FormularioProductos = ({ cargando, unidadesDisponibles = [] }) => {
  const {
    formulario,
    errores,
    handleProductoChange,
    agregarProducto,
    eliminarProducto,
  } = useFormularioSolicitud();

  const {
    productos,
    obtenerProductos,
    cargandoDatos: cargandoProductos,
  } = useProducto();

  const { dataDashboard } = useDashboard();

  // Puedes seguir usando tus estilos base si quieres
  const { estilosSelect, estilosSelectError } = useSelectStyles();

  useEffect(() => {
    if (productos.length === 0) {
      obtenerProductos();
    }
  }, []);

  const obtenerProductosOrdenados = () => {
    const productosMasSolicitados =
      dataDashboard?.productosMasSolicitados || [];
    const mapaProductosSolicitados = new Map(
      productosMasSolicitados.map((p, index) => [
        p.nombre.toLowerCase(),
        index,
      ]),
    );
    const productosOrdenados = [...productos].sort((a, b) => {
      const nombreA = a.nombre.toLowerCase();
      const nombreB = b.nombre.toLowerCase();
      const indexA = mapaProductosSolicitados.has(nombreA)
        ? mapaProductosSolicitados.get(nombreA)
        : Infinity;
      const indexB = mapaProductosSolicitados.has(nombreB)
        ? mapaProductosSolicitados.get(nombreB)
        : Infinity;
      if (indexA !== Infinity && indexB !== Infinity) {
        return indexA - indexB;
      }
      if (indexA !== Infinity) return -1;
      if (indexB !== Infinity) return 1;
      return a.nombre.localeCompare(b.nombre);
    });
    return productosOrdenados;
  };

  // Opciones para react-select: código y nombre completo
  const opcionesProductos = obtenerProductosOrdenados().map(
    (producto, index) => {
      const esMasSolicitado = dataDashboard?.productosMasSolicitados?.some(
        (p) => p.nombre.toLowerCase() === producto.nombre.toLowerCase(),
      );
      return {
        value: producto.id,
        label: producto.nombre,
        nombreCompleto: producto.nombre,
        codigo: producto.codigo,
        unidad: producto.unidad,
        id: producto.id,
        esMasSolicitado,
        orden: index,
      };
    },
  );

  const opcionesUnidades = unidadesDisponibles
    .sort((a, b) => a.id - b.id)
    .map((unidad) => ({
      value: unidad.nombre,
      label: unidad.nombre,
      id: unidad.id,
    }));

  const handleProductoSeleccionado = (indice, opcionSeleccionada) => {
    const productoSeleccionado = productos.find(
      (p) => p.id === opcionSeleccionada?.value,
    );
    handleProductoChange(
      indice,
      "producto",
      productoSeleccionado ? productoSeleccionado.nombre : "",
    );
    if (productoSeleccionado && productoSeleccionado.unidad) {
      handleProductoChange(indice, "unidad", productoSeleccionado.unidad);
    } else if (!opcionSeleccionada) {
      handleProductoChange(indice, "unidad", "");
    }
  };

  const filtrarOpciones = (opcion, inputValue) => {
    const valor = opcion.label.toLowerCase();
    const busqueda = inputValue.toLowerCase();
    return valor.includes(busqueda);
  };

  // Mejor formato visual para las opciones del menú
  const formatearOpcion = (opcion, { context }) => (
    <div className="flex flex-col py-1">
      <span className="font-mono text-xs text-blue-700">{opcion.codigo}</span>
      <span className="font-semibold text-gray-800">
        {opcion.nombreCompleto}
      </span>
      {context === "menu" && (
        <span className="text-xs text-gray-500">{opcion.unidad}</span>
      )}
    </div>
  );

  // Estilos personalizados para react-select
  const customSelectStyles = {
    ...estilosSelect,
    control: (provided, state) => ({
      ...provided,
      minHeight: "48px",
      fontSize: "1rem",
      borderRadius: "0.5rem",
      borderColor: state.isFocused ? "#2563eb" : "#d1d5db",
      boxShadow: state.isFocused ? "0 0 0 2px #2563eb33" : provided.boxShadow,
    }),
    menu: (provided) => ({
      ...provided,
      zIndex: 50,
      fontSize: "1rem",
    }),
    menuList: (provided) => ({
      ...provided,
      maxHeight: 320,
      overflowY: "auto",
    }),
    option: (provided, state) => ({
      ...provided,
      whiteSpace: "normal",
      paddingTop: 12,
      paddingBottom: 12,
      backgroundColor: state.isFocused ? "#eff6ff" : "white",
      color: "#1e293b",
    }),
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

      {cargandoProductos && (
        <div className="mb-3 p-2 bg-blue-50 border border-blue-200 rounded-lg flex items-center gap-2">
          <svg
            className="animate-spin w-4 h-4 text-blue-600"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <span className="text-blue-700 text-xs">Cargando productos...</span>
        </div>
      )}

      <div className="space-y-6">
        {formulario.productos.map((producto, indice) => {
          const productoSeleccionado = productos.find(
            (p) => p.nombre === producto.producto,
          );
          return (
            <div
              key={indice}
              className="border border-gray-200 rounded-lg p-5 bg-gray-50 mb-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-2 min-w-[320px]">
                  <Select
                    value={
                      productoSeleccionado
                        ? {
                            value: productoSeleccionado.id,
                            label: productoSeleccionado.nombre,
                            nombreCompleto: productoSeleccionado.nombre,
                            codigo: productoSeleccionado.codigo,
                            unidad: productoSeleccionado.unidad,
                            id: productoSeleccionado.id,
                            esMasSolicitado:
                              dataDashboard?.productosMasSolicitados?.some(
                                (p) =>
                                  p.nombre.toLowerCase() ===
                                  productoSeleccionado.nombre.toLowerCase(),
                              ),
                          }
                        : null
                    }
                    onChange={(opcionSeleccionada) =>
                      handleProductoSeleccionado(indice, opcionSeleccionada)
                    }
                    options={opcionesProductos}
                    placeholder="Buscar y seleccionar producto..."
                    isSearchable={true}
                    isClearable={true}
                    isDisabled={cargando || cargandoProductos}
                    styles={
                      errores[`producto_${indice}`]
                        ? {
                            ...customSelectStyles,
                            control: (base) => ({
                              ...customSelectStyles.control(base),
                              borderColor: "#fca5a5",
                              backgroundColor: "#fef2f2",
                            }),
                          }
                        : customSelectStyles
                    }
                    noOptionsMessage={() =>
                      productos.length === 0
                        ? "No hay productos disponibles"
                        : "No se encontraron productos"
                    }
                    loadingMessage={() => "Cargando productos..."}
                    filterOption={filtrarOpciones}
                    menuPortalTarget={document.body}
                    menuPosition="fixed"
                    formatOptionLabel={formatearOpcion}
                  />
                  {errores[`producto_${indice}`] && (
                    <p className="text-red-500 text-xs mt-1">
                      {errores[`producto_${indice}`]}
                    </p>
                  )}
                </div>

                <div>
                  <input
                    type="number"
                    step="any"
                    placeholder="Cantidad"
                    value={producto.cantidad}
                    onChange={(e) =>
                      handleProductoChange(indice, "cantidad", e.target.value)
                    }
                    disabled={cargando}
                    className={`w-full border rounded-md px-4 py-3 text-base focus:outline-none focus:ring-1 focus:ring-blue-400 disabled:opacity-50 disabled:cursor-not-allowed ${
                      errores[`cantidad_${indice}`]
                        ? "border-red-300"
                        : "border-gray-300"
                    }`}
                    min="0"
                  />
                  {errores[`cantidad_${indice}`] && (
                    <p className="text-red-500 text-xs mt-1">
                      {errores[`cantidad_${indice}`]}
                    </p>
                  )}
                </div>

                <div className="flex gap-2">
                  <div className="flex-1">
                    <Select
                      value={
                        producto.unidad
                          ? { value: producto.unidad, label: producto.unidad }
                          : null
                      }
                      onChange={(opcionSeleccionada) =>
                        handleProductoChange(
                          indice,
                          "unidad",
                          opcionSeleccionada?.value || "",
                        )
                      }
                      options={opcionesUnidades}
                      placeholder="Unidad"
                      isSearchable={true}
                      isClearable={true}
                      isDisabled={cargando}
                      styles={
                        errores[`unidad_${indice}`]
                          ? {
                              ...customSelectStyles,
                              control: (base) => ({
                                ...customSelectStyles.control(base),
                                borderColor: "#fca5a5",
                                backgroundColor: "#fef2f2",
                              }),
                            }
                          : customSelectStyles
                      }
                      noOptionsMessage={() =>
                        unidadesDisponibles.length === 0
                          ? "No hay unidades disponibles"
                          : "No se encontraron unidades"
                      }
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
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
              {errores[`unidad_${indice}`] && (
                <p className="text-red-500 text-xs mt-1">
                  {errores[`unidad_${indice}`]}
                </p>
              )}
            </div>
          );
        })}
      </div>

      {productos.length > 0 && unidadesDisponibles.length > 0 && (
        <div className="mt-2 space-y-1">
          <div className="text-xs text-gray-500">
            💡 Tip: Al seleccionar un producto, la unidad se completará
            automáticamente.
          </div>
          {dataDashboard?.productosMasSolicitados &&
            dataDashboard.productosMasSolicitados.length > 0 && (
              <div className="text-xs text-yellow-700 flex items-center gap-1">
                <span>⭐</span>
                <span>
                  Los productos marcados con estrella son tus más solicitados y
                  aparecen primero.
                </span>
              </div>
            )}
        </div>
      )}

      {unidadesDisponibles.length === 0 && (
        <div className="mt-2 text-xs text-amber-600">
          ⚠️ No hay unidades de medida registradas. Por favor, registra unidades
          primero.
        </div>
      )}
    </div>
  );
};

export default FormularioProductos;
