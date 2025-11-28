import React, { useState } from 'react';
import { FaClock, FaSun, FaMoon, FaInfoCircle, FaChevronDown, FaChevronUp } from 'react-icons/fa';

const LeyendaHorarios = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const turnos = [
    {
      nombre: "Matutino",
      icon: <FaSun className="text-yellow-500" />,
      color: "bg-yellow-50 border-yellow-200",
      rangos: [
        "07:00 - 07:30",
        "09:30 - 10:00", 
        "12:00 - 12:30"
      ]
    },
    {
      nombre: "Vespertino",
      icon: <FaSun className="text-orange-500" />,
      color: "bg-orange-50 border-orange-200",
      rangos: [
        "15:00 - 15:30",
        "17:30 - 18:00",
        "20:00 - 20:30"
      ]
    },
    {
      nombre: "Nocturno",
      icon: <FaMoon className="text-blue-500" />,
      color: "bg-blue-50 border-blue-200",
      rangos: [
        "22:30 - 23:00",
        "01:00 - 01:30",
        "03:30 - 04:00"
      ]
    }
  ];

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg mb-6">
      {/* Header clickeable */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 hover:bg-gray-100 transition-colors rounded-t-lg"
      >
        <div className="flex items-center gap-2">
          <FaClock className="text-blue-600 text-lg" />
          <h3 className="text-lg font-semibold text-gray-600">
            Horarios para Levantar Solicitudes
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">
            {isExpanded ? 'Ocultar' : 'Ver horarios'}
          </span>
          {isExpanded ? (
            <FaChevronUp className="text-gray-500" />
          ) : (
            <FaChevronDown className="text-gray-500" />
          )}
        </div>
      </button>

      {/* Contenido desplegable */}
      {isExpanded && (
        <div className="px-6 pb-6">
          <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mb-4 flex items-start gap-2 mt-4">
            <FaInfoCircle className="text-blue-600 mt-0.5" />
            <p className="text-blue-800 text-sm">
              Las solicitudes levantadas fuera de estos horarios serán surtidas hasta el siguiente rango permitido.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {turnos.map((turno, index) => (
              <div
                key={index}
                className="border-2 border-gray-300 border-dashed rounded-lg p-4"
              >
                <div className="flex items-center gap-2 mb-3">
                  {turno.icon}
                  <h4 className="font-semibold text-gray-700">
                    Turno {turno.nombre}
                  </h4>
                </div>
                
                <div className="space-y-2">
                  {turno.rangos.map((rango, rangoIndex) => (
                    <div 
                      key={rangoIndex}
                      className="bg-white rounded-md px-3 py-2 text-sm font-medium text-gray-700 border border-gray-200"
                    >
                      <span className="text-xs text-gray-500 mr-2">
                        {rangoIndex + 1}°
                      </span>
                      {rango}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LeyendaHorarios;