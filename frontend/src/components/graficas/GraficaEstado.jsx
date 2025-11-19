import React from "react";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const GraficasEstado = ({ datos = [] }) => {
  // Calcular estadísticas por status
  const calcularEstadisticasStatus = () => {
    const statusCounts = {
      "En proceso": 0,
      "Surtido": 0,
      "Rechazada": 0,
      "Entrega parcial": 0
    };

    datos.forEach(item => {
      if (statusCounts.hasOwnProperty(item.status)) {
        statusCounts[item.status]++;
      }
    });

    const total = datos.length;
    const porcentajes = {};
    Object.keys(statusCounts).forEach(status => {
      porcentajes[status] = total > 0 ? ((statusCounts[status] / total) * 100).toFixed(1) : 0;
    });

    return { counts: statusCounts, percentages: porcentajes };
  };

  const { counts: statusCounts, percentages: statusPercentages } = calcularEstadisticasStatus();

  // Configuración para gráficas circulares
  const opcionesCirculares = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  const crearDatosCirculares = (valor, color) => ({
    datasets: [{
      data: [valor, 100 - valor],
      backgroundColor: [color, '#f3f4f6'],
      borderWidth: 0,
    }],
  });

  const estadosConfig = [
    { 
      key: "En proceso", 
      color: '#3b82f6',
      label: 'En proceso' 
    },
    { 
      key: "Surtido", 
      color: '#10b981',
      label: 'Surtido' 
    },
    { 
      key: "Rechazada", 
      color: '#ef4444',
      label: 'Rechazada' 
    },
    { 
      key: "Entrega parcial", 
      color: '#f59e0b',
      label: 'Entrega parcial' 
    },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 h-80">
      <div className="grid grid-cols-2 gap-4 h-60">
        {estadosConfig.map((estado) => (
          <div key={estado.key} className="text-center flex flex-col justify-center">
            <div className="relative w-20 h-20 mx-auto mb-2">
              <Doughnut 
                data={crearDatosCirculares(parseFloat(statusPercentages[estado.key]), estado.color)}
                options={opcionesCirculares}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-sm font-bold text-gray-700">{statusPercentages[estado.key]}%</span>
              </div>
            </div>
            <p className="text-xs text-gray-600 mb-1">{estado.label}</p>
            <p className="text-sm font-semibold text-gray-800">{statusCounts[estado.key]}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GraficasEstado;