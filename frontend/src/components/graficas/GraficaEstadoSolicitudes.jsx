import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const GraficaEstadoSolicitudes = ({ estadoSolicitudes }) => {
  const colores = {
    'pendiente surtido': '#3B82F6',
    'en proceso': '#1E3A8A',
    'rechazada': '#EF4444',
    'entrega parcial': '#F59E0B',
    'surtido': '#10B981'
  };

  const formatearTexto = (texto) => {
    return texto.split(' ').map(palabra => 
      palabra.charAt(0).toUpperCase() + palabra.slice(1)
    ).join(' ');
  };

  const data = {
    labels: estadoSolicitudes.map(item => formatearTexto(item.status)),
    datasets: [
      {
        data: estadoSolicitudes.map(item => item.cantidad),
        backgroundColor: estadoSolicitudes.map(item => colores[item.status] || '#6B7280'),
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
    cutout: '60%'
  };

  if (estadoSolicitudes.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-[#E2E8F0] p-5">
        <h3 className="text-lg font-semibold text-[#0F172A] mb-4">
          Estado de Solicitudes
        </h3>
        <div className="h-64 flex items-center justify-center">
          <p className="text-gray-500">No hay datos disponibles</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-[#E2E8F0] p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#3B82F6]">
        Distribucion
      </p>
      <h3 className="text-lg font-semibold text-[#0F172A] mb-4">
        Estado de Solicitudes
      </h3>
      <div className="h-64">
        <Doughnut data={data} options={options} />
      </div>
    </div>
  );
};

export default GraficaEstadoSolicitudes;
