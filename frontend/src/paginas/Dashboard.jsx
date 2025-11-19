import React from 'react';
import useDashboard from '../hooks/useDashboard';
import MetricasCards from '../components/graficas/MetricasCard';
import GraficaEstadoSolicitudes from '../components/graficas/GraficaEstadoSolicitudes';
import GraficaSolicitudesPorMes from '../components/graficas/GraficaSolicitudesPorMes';
import GraficaPrioridades from '../components/graficas/GraficaPrioridades';
import Spinner from '../components/spinners/Spinner';
import { FaSync } from 'react-icons/fa';

const Dashboard = () => {
  const { dataDashboard, cargando, error, refrescarDashboard } = useDashboard();

  if (cargando) {
    return <Spinner />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={refrescarDashboard}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-600">Dashboard</h1>
        <button
          onClick={refrescarDashboard}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          disabled={cargando}
        >
          <FaSync className={`${cargando ? 'animate-spin' : ''}`} />
          Actualizar
        </button>
      </div>

      {/* Gráficas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GraficaEstadoSolicitudes estadoSolicitudes={dataDashboard.estadoSolicitudes} />
        <GraficaPrioridades solicitudesPorPrioridad={dataDashboard.solicitudesPorPrioridad} />
      </div>

      <div className="grid grid-cols-1 gap-6">
        <GraficaSolicitudesPorMes solicitudesPorMes={dataDashboard.solicitudesPorMes} />
      </div>

      {/* Productos más solicitados */}
      {dataDashboard.productosMasSolicitados.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-600 mb-4">
            Productos Más Solicitados
          </h3>
          <div className="space-y-3">
            {dataDashboard.productosMasSolicitados.map((producto, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="font-medium text-gray-700">{producto.nombre}</span>
                <div className="text-right">
                  <span className="text-blue-600 font-semibold">
                    {producto.totalSolicitado} unidades
                  </span>
                  <p className="text-gray-500 text-sm">
                    {producto.vecesSolicitado} solicitud{producto.vecesSolicitado !== 1 ? 'es' : ''}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;