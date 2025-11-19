import {formatearTextoEstado} from '../functions/Index';

const FiltroEstadoSolicitudes = ({ 
  estadoActivo, 
  onCambiarEstado, 
  datos = [],
  titulo = "Filtrar Solicitudes",
  className = ""
}) => {

  // Estados disponibles con sus colores más discretos
  const estados = [
    { 
      nombre: "Todos", 
      colorIndicador: "bg-gray-400", 
      colorTexto: "text-gray-700",
      colorFondo: "bg-gray-50",
      colorBorde: "border-gray-200"
    },
    { 
      nombre: "pendiente autorizacion", 
      colorIndicador: "bg-blue-500", 
      colorTexto: "text-blue-700",
      colorFondo: "bg-blue-50",
      colorBorde: "border-blue-200"
    },
    {
      nombre: 'autorizada',
      colorIndicador: 'bg-purple-500',
      colorTexto: 'text-purple-700',
      colorFondo: 'bg-purple-50',
      colorBorde: 'border-purple-200'
    },
    { 
      nombre: "rechazada", 
      colorIndicador: "bg-red-500", 
      colorTexto: "text-red-700",
      colorFondo: "bg-red-50",
      colorBorde: "border-red-200"
    },
    { 
      nombre: "entrega parcial", 
      colorIndicador: "bg-amber-500", 
      colorTexto: "text-amber-700",
      colorFondo: "bg-amber-50",
      colorBorde: "border-amber-200"
    },
    { 
      nombre: "surtido", 
      colorIndicador: "bg-green-500", 
      colorTexto: "text-green-700",
      colorFondo: "bg-green-50",
      colorBorde: "border-green-200"
    },
  ];

  // Contar solicitudes por estado
  const contarPorEstado = (estado) => {
    if (estado === "Todos") return datos.length;
    return datos.filter(item => item.status === estado).length;
  };

  return (
    <div className={`bg-white p-6 rounded-lg shadow-xs border border-gray-100 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-800 mb-4">{titulo}</h3>
      
      {/* Filtros en línea */}
      <div className="flex flex-wrap gap-3">
        {estados.map((estado) => (
          <button
            key={estado.nombre}
            onClick={() => onCambiarEstado(estado.nombre)}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-lg border transition-all duration-200
              ${estadoActivo === estado.nombre 
                ? `${estado.colorFondo} ${estado.colorBorde} ${estado.colorTexto} border-2` 
                : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
              }
            `}
          >
            {/* Indicador de color discreto */}
            <div className={`w-3 h-3 rounded-full ${estado.colorIndicador}`}></div>
            
            {/* Texto y contador */}
            <span className="text-sm font-medium">{formatearTextoEstado(estado.nombre)}</span>
            <span className={`
              text-xs px-2 py-1 rounded-full
              ${estadoActivo === estado.nombre 
                ? 'bg-white bg-opacity-60' 
                : 'bg-gray-100'
              }
            `}>
              {contarPorEstado(estado.nombre)}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default FiltroEstadoSolicitudes;