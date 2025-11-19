import React, { useState, useEffect } from "react";
import { FiPlus, FiEdit2, FiTrash2, FiBox, FiSearch } from "react-icons/fi";
import useProducto from "../hooks/useProducto";
import ModalProducto from "../components/modales/ModalProducto";

const Productos = () => {
  const [filtroTexto, setFiltroTexto] = useState("");
  
  // Estados del modal
  const [modalAbierto, setModalAbierto] = useState(false);
  const [modoModal, setModoModal] = useState('crear'); // 'crear' o 'editar'
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  
  const {
    productos,
    cargando,
    cargandoDatos,
    obtenerProductos,
    crearProducto,
    actualizarProducto,
    eliminarProducto
  } = useProducto();

  useEffect(() => {
    obtenerProductos();
  }, []);

  // Filtrar productos por nombre
  const productosFiltrados = productos.filter(producto =>
    producto.nombre.toLowerCase().includes(filtroTexto.toLowerCase()) ||
    producto.unidad.toLowerCase().includes(filtroTexto.toLowerCase())
  );

  const handleNuevoProducto = () => {
    setModoModal('crear');
    setProductoSeleccionado(null);
    setModalAbierto(true);
  };

  const handleEditar = (producto) => {
    setModoModal('editar');
    setProductoSeleccionado(producto);
    setModalAbierto(true);
  };

  const handleEliminar = async (producto) => {
    await eliminarProducto(producto.id, producto.nombre);
  };

  const handleGuardarProducto = async (datosProducto) => {
    try {
      let resultado;
      
      if (modoModal === 'crear') {
        resultado = await crearProducto(datosProducto);
      } else {
        resultado = await actualizarProducto(productoSeleccionado.id, datosProducto);
      }
      
      // Si la operación fue exitosa, cerrar el modal
      if (resultado) {
        handleCerrarModal();
      }
    } catch (error) {
      console.error('Error al guardar producto:', error);
      // El error ya se maneja en el contexto con SweetAlert
    }
  };

  const handleCerrarModal = () => {
    setModalAbierto(false);
    setModoModal('crear');
    setProductoSeleccionado(null);
  };

  if (cargandoDatos) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Cargando productos...</span>
      </div>
    );
  }

  return (
    <>
      <div className="container mx-auto px-4 py-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {/* Header */}
          <div className="border-b border-gray-200 p-6">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-3">
                <FiBox className="text-2xl text-blue-600" />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    Gestión de Productos
                  </h1>
                  <p className="text-gray-600">
                    Administra el catálogo de productos del almacén
                  </p>
                </div>
              </div>
              <button
                onClick={handleNuevoProducto}
                disabled={cargando}
                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
              >
                <FiPlus className="text-lg" />
                Nuevo Producto
              </button>
            </div>

            {/* Buscador */}
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar productos..."
                value={filtroTexto}
                onChange={(e) => setFiltroTexto(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Estadísticas */}
          <div className="p-6 border-b border-gray-200 bg-gray-50">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{productos.length}</div>
                <div className="text-sm text-gray-600">Total de Productos</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{productosFiltrados.length}</div>
                <div className="text-sm text-gray-600">Productos Filtrados</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {[...new Set(productos.map(p => p.unidad))].length}
                </div>
                <div className="text-sm text-gray-600">Tipos de Unidades</div>
              </div>
            </div>
          </div>

          {/* Tabla */}
          <div className="overflow-x-auto">
            {productosFiltrados.length === 0 ? (
              <div className="text-center py-12">
                <FiBox className="text-4xl text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">
                  {filtroTexto ? 'No se encontraron productos con ese filtro' : 'No hay productos registrados'}
                </p>
                {!filtroTexto && (
                  <button
                    onClick={handleNuevoProducto}
                    className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors inline-flex items-center gap-2"
                  >
                    <FiPlus className="text-lg" />
                    Agregar primer producto
                  </button>
                )}
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nombre del Producto
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Unidad de Medida
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {productosFiltrados.map((producto) => (
                    <tr key={producto.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {producto.id}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        <div className="max-w-xs">
                          <p className="font-medium truncate" title={producto.nombre}>
                            {producto.nombre}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {producto.unidad}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => handleEditar(producto)}
                            disabled={cargando}
                            className="text-blue-600 hover:text-blue-900 disabled:opacity-50 disabled:cursor-not-allowed p-2 rounded-full hover:bg-blue-100 transition-colors"
                            title="Editar producto"
                          >
                            <FiEdit2 className="text-lg" />
                          </button>
                          <button
                            onClick={() => handleEliminar(producto)}
                            disabled={cargando}
                            className="text-gray-500 hover:text-red-900 disabled:opacity-50 disabled:cursor-not-allowed p-2 rounded-full hover:bg-red-100 transition-colors"
                            title="Eliminar producto"
                          >
                            <FiTrash2 className="text-lg" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Footer con información adicional */}
          {productosFiltrados.length > 0 && (
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 text-sm text-gray-600">
              Mostrando {productosFiltrados.length} de {productos.length} productos
            </div>
          )}
        </div>
      </div>

      {/* Modal de Producto */}
      <ModalProducto
        isOpen={modalAbierto}
        onRequestClose={handleCerrarModal}
        onGuardar={handleGuardarProducto}
        cargando={cargando}
        modo={modoModal}
        productoParaEditar={productoSeleccionado}
      />
    </>
  );
};

export default Productos;