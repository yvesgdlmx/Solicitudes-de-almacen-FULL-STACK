import { useEffect, useState } from "react";
import { FiBox, FiLayers, FiPackage, FiSearch, FiX } from "react-icons/fi";
import PanelAdministracion from "../components/administracion/PanelAdministracion";
import useProducto from "../hooks/useProducto";
import useUnidadMedida from "../hooks/useUnidadMedida";
import ModalProducto from "../components/modales/ModalProducto";
import ModalUnidadMedida from "../components/modales/ModalUnidadMedida";
import ModalGestionUnidades from "../components/modales/ModalGestionUnidades";
import TablaProductos from "../components/tables/TablaProductos";

const Productos = () => {
  const [filtroTexto, setFiltroTexto] = useState("");
  const [modalAbierto, setModalAbierto] = useState(false);
  const [modoModal, setModoModal] = useState("crear");
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [modalUnidadAbierto, setModalUnidadAbierto] = useState(false);
  const [modoModalUnidad, setModoModalUnidad] = useState("crear");
  const [unidadSeleccionada, setUnidadSeleccionada] = useState(null);
  const [modalGestionAbierto, setModalGestionAbierto] = useState(false);

  const {
    productos,
    cargando,
    cargandoDatos,
    obtenerProductos,
    crearProducto,
    actualizarProducto,
    eliminarProducto,
  } = useProducto();

  const {
    unidades,
    cargando: cargandoUnidad,
    crearUnidadMedida,
    actualizarUnidadMedida,
    eliminarUnidadMedida,
  } = useUnidadMedida();

  useEffect(() => {
    obtenerProductos();
  }, []);

  const productosFiltrados = productos.filter(
    (producto) =>
      producto.nombre.toLowerCase().includes(filtroTexto.toLowerCase()) ||
      producto.unidad.toLowerCase().includes(filtroTexto.toLowerCase())
  );

  const handleNuevoProducto = () => {
    setModoModal("crear");
    setProductoSeleccionado(null);
    setModalAbierto(true);
  };

  const handleEditar = (producto) => {
    setModoModal("editar");
    setProductoSeleccionado(producto);
    setModalAbierto(true);
  };

  const handleEliminar = async (producto) => {
    await eliminarProducto(producto.id, producto.nombre);
  };

  const handleGuardarProducto = async (datosProducto) => {
    try {
      const resultado =
        modoModal === "crear"
          ? await crearProducto(datosProducto)
          : await actualizarProducto(productoSeleccionado.id, datosProducto);

      if (resultado) handleCerrarModal();
    } catch (error) {
      console.error("Error al guardar producto:", error);
    }
  };

  const handleCerrarModal = () => {
    setModalAbierto(false);
    setModoModal("crear");
    setProductoSeleccionado(null);
  };

  const handleVerUnidades = () => {
    setModalGestionAbierto(true);
  };

  const handleNuevaUnidadDesdeGestion = () => {
    setModalGestionAbierto(false);
    setModoModalUnidad("crear");
    setUnidadSeleccionada(null);
    setModalUnidadAbierto(true);
  };

  const handleEditarUnidadDesdeGestion = (unidad) => {
    setModalGestionAbierto(false);
    setModoModalUnidad("editar");
    setUnidadSeleccionada(unidad);
    setModalUnidadAbierto(true);
  };

  const handleEliminarUnidad = async (unidad) => {
    await eliminarUnidadMedida(unidad.id, unidad.nombre);
  };

  const handleGuardarUnidad = async (datosUnidad) => {
    try {
      const resultado =
        modoModalUnidad === "crear"
          ? await crearUnidadMedida(datosUnidad)
          : await actualizarUnidadMedida(unidadSeleccionada.id, datosUnidad);

      if (resultado) {
        handleCerrarModalUnidad();
        setModalGestionAbierto(true);
      }
    } catch (error) {
      console.error("Error al guardar unidad:", error);
    }
  };

  const handleCerrarModalUnidad = () => {
    setModalUnidadAbierto(false);
    setModoModalUnidad("crear");
    setUnidadSeleccionada(null);
  };

  const tarjetas = [
    { titulo: 'Productos registrados', valor: productos.length, nota: 'El catálogo disponible', icono: FiBox, tono: 'blue' },
    { titulo: 'Unidades de medida', valor: unidades.length, nota: 'Unidades configuradas', icono: FiLayers, tono: 'purple' },
    { titulo: 'Unidades en uso', valor: new Set(productos.map(p => p.unidad).filter(Boolean)).size, nota: 'Presentes en los productos', icono: FiPackage, tono: 'green' },
  ];
  return <>
    <PanelAdministracion tipo="productos" cargando={cargandoDatos} ocupado={cargando || cargandoUnidad}
      actualizar={obtenerProductos} crear={handleNuevoProducto} unidades={handleVerUnidades} tarjetas={tarjetas}>
      <section className="bg-white rounded-[18px] [&&]:[box-shadow:var(--app-shadow)] overflow-hidden border border-solid [&&]:border-[var(--app-line)]"><div className="
        flex justify-between items-center gap-3 pt-[22px] pr-[23px] pb-[18px] pl-[23px]
        [&&]:[background:linear-gradient(110deg,_#f0f5fd,_#fff)] max-[650.001px]:items-start max-[650.001px]:pt-[19px]
        max-[650.001px]:pr-[18px] max-[650.001px]:pb-[19px] max-[650.001px]:pl-[18px] [&_>_div]:flex
        [&_>_div]:items-center [&_>_div]:gap-[11px] [&_h2]:text-[length:14px] [&_h2]:font-[650] [&&_h2]:text-[#243f64]
        max-[650.001px]:[&_h2]:text-[length:13px] [&_p]:text-[length:12px] [&&_p]:text-[#5b6e87] [&_p]:mt-1
        max-[650.001px]:[&_p]:text-[length:11px]
      "><div><span className="flex items-center justify-center w-[33px] h-[33px] rounded-[10px] [&&]:[background:#e0ebfd] [&&]:text-[#245fc1] text-[length:16px] shrink-0"><FiPackage /></span><div><h2>Los productos de tu almacén</h2><p>Identifica cada material por su código, nombre y unidad.</p></div></div><span className="text-[#617b9b] text-[length:11px] pt-[5px] pr-2 pb-[5px] pl-2 rounded-[7px] [background:#f6f9fd] whitespace-nowrap border border-solid border-[#e8eef8]">{productosFiltrados.length} productos</span></div>
        <div className="
          flex flex-wrap items-center gap-3 pt-0 pr-[23px] pb-5 pl-[23px] max-[650.001px]:pt-0 max-[650.001px]:pr-[18px]
          max-[650.001px]:pb-[18px] max-[650.001px]:pl-[18px]
        "><label className="
          block relative flex-1 min-w-55 max-[650.001px]:min-w-0 max-[650.001px]:basis-full [&_>_svg]:absolute
          [&_>_svg]:left-[12px] [&_>_svg]:top-[13px] [&_>_svg]:w-[15px] [&_>_svg]:text-[#8aa1c2]
          [&_>_svg]:pointer-events-none [&_input]:w-full [&_input]:h-[41px] [&_input]:rounded-[9px]
          [&_input]:[background:#fafcff] [&_input]:pt-[9px] [&_input]:pr-3 [&_input]:pb-[9px] [&_input]:pl-[35px]
          [&_input]:[outline:none] [&_input]:text-[length:13px] [&_input]:text-[#526f96] [&_input]:border
          [&_input]:border-solid [&_input]:border-[#e1e9f6] [&_input::placeholder]:text-[#7c8da5]
          [&_input:focus]:bg-white [&_input:focus]:border-[#a5c0e9]
        "><FiSearch /><input type="search" aria-label="Buscar productos" placeholder="Buscar nombre o unidad de medida…" value={filtroTexto} onChange={e => setFiltroTexto(e.target.value)} /></label>{filtroTexto && <button className="inline-flex items-center gap-[5px] pt-[9px] pr-1 pb-[9px] pl-1 text-[length:12px] text-[#6783a6] hover:text-[#3f6cae]" onClick={() => setFiltroTexto('')}><FiX />Limpiar</button>}</div>
        <TablaProductos productosFiltrados={productosFiltrados} productos={productos} filtroTexto={filtroTexto} cargando={cargando} onEditar={handleEditar} onEliminar={handleEliminar} onNuevoProducto={handleNuevoProducto} />
      </section>
    </PanelAdministracion>
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
    </>;
};

export default Productos;
