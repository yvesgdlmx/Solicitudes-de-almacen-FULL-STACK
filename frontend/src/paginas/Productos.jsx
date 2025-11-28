import React, { useState, useEffect } from "react";
import { FiPlus, FiBox, FiSearch, FiPackage } from "react-icons/fi";
import useProducto from "../hooks/useProducto";
import useUnidadMedida from "../hooks/useUnidadMedida";
import ModalProducto from "../components/modales/ModalProducto";
import ModalUnidadMedida from "../components/modales/ModalUnidadMedida";
import ModalGestionUnidades from "../components/modales/ModalGestionUnidades";
import TablaProductos from "../components/tables/TablaProductos";

const Productos = () => {
  const [filtroTexto, setFiltroTexto] = useState("");
  
  // Estados del modal de productos
  const [modalAbierto, setModalAbierto] = useState(false);
  const [modoModal, setModoModal] = useState('crear');
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  
  // Estados del modal de unidades de medida
  const [modalUnidadAbierto, setModalUnidadAbierto] = useState(false);
  const [modoModalUnidad, setModoModalUnidad] = useState('crear');
  const [unidadSeleccionada, setUnidadSeleccionada] = useState(null);
  
  // Estado del modal de gestión de unidades
  const [modalGestionAbierto, setModalGestionAbierto] = useState(false);
  
  const {
    productos,
    cargando,
    cargandoDatos,
    obtenerProductos,
    crearProducto,
    actualizarProducto,
    eliminarProducto
  } = useProducto();

  const {
    unidades,
    cargando: cargandoUnidad,
    crearUnidadMedida,
    actualizarUnidadMedida,
    eliminarUnidadMedida
  } = useUnidadMedida();

  useEffect(() => {
    obtenerProductos();
  }, []);

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
      
      if (resultado) {
        handleCerrarModal();
      }
    } catch (error) {
      console.error('Error al guardar producto:', error);
    }
  };

  const handleCerrarModal = () => {
    setModalAbierto(false);
    setModoModal('crear');
    setProductoSeleccionado(null);
  };

  // Funciones para gestión de unidades
  const handleVerUnidades = () => {
    setModalGestionAbierto(true);
  };

  const handleNuevaUnidadDesdeGestion = () => {
    setModalGestionAbierto(false);
    setModoModalUnidad('crear');
    setUnidadSeleccionada(null);
    setModalUnidadAbierto(true);
  };

  const handleEditarUnidadDesdeGestion = (unidad) => {
    setModalGestionAbierto(false);
    setModoModalUnidad('editar');
    setUnidadSeleccionada(unidad);
    setModalUnidadAbierto(true);
  };

  const handleEliminarUnidad = async (unidad) => {
    await eliminarUnidadMedida(unidad.id, unidad.nombre);
  };

  const handleGuardarUnidad = async (datosUnidad) => {
    try {
      let resultado;
      
      if (modoModalUnidad === 'crear') {
        resultado = await crearUnidadMedida(datosUnidad);
      } else {
        resultado = await actualizarUnidadMedida(unidadSeleccionada.id, datosUnidad);
      }
      
      if (resultado) {
        handleCerrarModalUnidad();
        setModalGestionAbierto(true); // Volver al modal de gestión
      }
    } catch (error) {
      console.error('Error al guardar unidad:', error);
    }
  };

  const handleCerrarModalUnidad = () => {
    setModalUnidadAbierto(false);
    setModoModalUnidad('crear');
    setUnidadSeleccionada(null);
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
              <div className="flex gap-2">
                <button
                  onClick={handleVerUnidades}
                  disabled={cargando || cargandoUnidad}
                  className="bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
                >
                  <FiPackage className="text-lg" />
                  Ver Unidades
                </button>
                <button
                  onClick={handleNuevoProducto}
                  disabled={cargando}
                  className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
                >
                  <FiPlus className="text-lg" />
                  Nuevo Producto
                </button>
              </div>
            </div>

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

          <TablaProductos
            productosFiltrados={productosFiltrados}
            productos={productos}
            filtroTexto={filtroTexto}
            cargando={cargando}
            onEditar={handleEditar}
            onEliminar={handleEliminar}
            onNuevoProducto={handleNuevoProducto}
          />
        </div>
      </div>

      <ModalProducto
        isOpen={modalAbierto}
        onRequestClose={handleCerrarModal}
        onGuardar={handleGuardarProducto}
        cargando={cargando}
        modo={modoModal}
        productoParaEditar={productoSeleccionado}
        unidadesDisponibles={unidades}
      />

      <ModalGestionUnidades
        isOpen={modalGestionAbierto}
        onRequestClose={() => setModalGestionAbierto(false)}
        unidades={unidades}
        cargando={cargandoUnidad}
        onNuevaUnidad={handleNuevaUnidadDesdeGestion}
        onEditarUnidad={handleEditarUnidadDesdeGestion}
        onEliminarUnidad={handleEliminarUnidad}
      />

      <ModalUnidadMedida
        isOpen={modalUnidadAbierto}
        onRequestClose={handleCerrarModalUnidad}
        onGuardar={handleGuardarUnidad}
        cargando={cargandoUnidad}
        modo={modoModalUnidad}
        unidadParaEditar={unidadSeleccionada}
      />
    </>
  );
};

export default Productos;