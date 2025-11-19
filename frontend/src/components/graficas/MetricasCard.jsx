import React from 'react';
import { FaClipboardList, FaClock, FaCalendarAlt, FaChartLine } from 'react-icons/fa';

const MetricasCards = ({ metricas }) => {
  const cards = [
    {
      titulo: 'Total Solicitudes',
      valor: metricas.totalSolicitudes,
      icon: <FaClipboardList className="text-blue-500" />,
      color: 'bg-blue-50 border-blue-200'
    },
    {
      titulo: 'Pendientes',
      valor: metricas.solicitudesPendientes,
      icon: <FaClock className="text-orange-500" />,
      color: 'bg-orange-50 border-orange-200'
    },
    {
      titulo: 'Este Mes',
      valor: metricas.solicitudesDelMes,
      icon: <FaCalendarAlt className="text-green-500" />,
      color: 'bg-green-50 border-green-200'
    },
    {
      titulo: 'Tasa Aprobación',
      valor: `${metricas.tasaAprobacion}%`,
      icon: <FaChartLine className="text-purple-500" />,
      color: 'bg-purple-50 border-purple-200'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {cards.map((card, index) => (
        <div
          key={index}
          className={`${card.color} border rounded-lg p-6 transition-transform hover:scale-105 shadow-sm`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">{card.titulo}</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">{card.valor}</p>
            </div>
            <div className="text-3xl">
              {card.icon}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MetricasCards;