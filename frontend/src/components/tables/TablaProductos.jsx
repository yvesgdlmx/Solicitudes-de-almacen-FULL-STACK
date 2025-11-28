import React from "react";
import { FiEdit2, FiTrash2, FiBox, FiPlus } from "react-icons/fi";

const TablaProductos = ({ 
  productosFiltrados, 
  productos,
  filtroTexto,
  cargando,
  onEditar, 
  onEliminar,
  onNuevoProducto 
}) => {
  
  if (productosFiltrados.length === 0) {
    return (
      <div className="overflow-x-auto">
        <div className="text-center py-12">
          <FiBox className="text-4xl text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">
            {filtroTexto ? 'No se encontraron productos con ese filtro' : 'No hay productos registrados'}
          </p>
          {!filtroTexto && (
            <button
              onClick={onNuevoProducto}
              className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors inline-flex items-center gap-2"
            >
              <FiPlus className="text-lg" />
              Agregar primer producto
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto">
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
                      onClick={() => onEditar(producto)}
                      disabled={cargando}
                      className="text-blue-600 hover:text-blue-900 disabled:opacity-50 disabled:cursor-not-allowed p-2 rounded-full hover:bg-blue-100 transition-colors"
                      title="Editar producto"
                    >
                      <FiEdit2 className="text-lg" />
                    </button>
                    <button
                      onClick={() => onEliminar(producto)}
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
      </div>

      {/* Footer con información adicional */}
      <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 text-sm text-gray-600">
        Mostrando {productosFiltrados.length} de {productos.length} productos
      </div>
    </>
  );
};

export default TablaProductos;