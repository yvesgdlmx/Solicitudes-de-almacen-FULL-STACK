import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const GraficaPrioridades = ({ solicitudesPorPrioridad }) => {
  const coloresPrioridad = {
    'muy alto': '#EF4444',
    'alto': '#F59E0B',
    'moderado': '#10B981',
    'bajo': '#6B7280'
  };

  const formatearPrioridad = (prioridad) => {
    return prioridad.split(' ').map(palabra => 
      palabra.charAt(0).toUpperCase() + palabra.slice(1)
    ).join(' ');
  };

  const data = {
    labels: solicitudesPorPrioridad.map(item => formatearPrioridad(item.prioridad)),
    datasets: [
      {
        data: solicitudesPorPrioridad.map(item => parseInt(item.cantidad)),
        backgroundColor: solicitudesPorPrioridad.map(item => 
          coloresPrioridad[item.prioridad] || '#6B7280'
        ),
        borderWidth: 2,
        borderColor: '#ffffff',
        hoverBorderWidth: 3,
        hoverOffset: 4
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          font: {
            size: 12,
            family: 'Inter, sans-serif'
          },
          usePointStyle: true,
          pointStyle: 'circle'
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        callbacks: {
          label: function(context) {
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const porcentaje = ((context.raw / total) * 100).toFixed(1);
            return `${context.label}: ${context.raw} (${porcentaje}%)`;
          }
        }
      }
    },
    cutout: '50%'
  };

  if (solicitudesPorPrioridad.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-600 mb-4">
          Solicitudes por Prioridad
        </h3>
        <div className="h-64 flex items-center justify-center">
          <p className="text-gray-500">No hay datos disponibles</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-600 mb-4">
        Solicitudes por Prioridad
      </h3>
      <div className="h-64">
        <Doughnut data={data} options={options} />
      </div>
    </div>
  );
};

export default GraficaPrioridades;