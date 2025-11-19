import React, { useState, useEffect } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

const GraficaMensual = ({ datos = [], añoInicial = null }) => {
  // Obtener años únicos de los datos
  const obtenerAñosDisponibles = () => {
    if (datos.length === 0) return [new Date().getFullYear()];
    
    const años = [...new Set(datos.map(item => {
      const [fecha] = item.fechaHora.split(' ');
      const [, , año] = fecha.split('/');
      return parseInt(año);
    }))].sort();
    return años;
  };

  const añosDisponibles = obtenerAñosDisponibles();
  const [añoSeleccionado, setAñoSeleccionado] = useState(
    añoInicial || añosDisponibles[0] || new Date().getFullYear()
  );

  // Actualizar año seleccionado si cambian los datos
  useEffect(() => {
    if (añoInicial) {
      setAñoSeleccionado(añoInicial);
    } else if (añosDisponibles.length > 0 && !añosDisponibles.includes(añoSeleccionado)) {
      setAñoSeleccionado(añosDisponibles[0]);
    }
  }, [datos, añoInicial, añosDisponibles, añoSeleccionado]);

  // Calcular estadísticas por mes del año seleccionado
  const calcularEstadisticasMensuales = () => {
    const meses = {
      '01': 'Enero', '02': 'Febrero', '03': 'Marzo', '04': 'Abril',
      '05': 'Mayo', '06': 'Junio', '07': 'Julio', '08': 'Agosto',
      '09': 'Septiembre', '10': 'Octubre', '11': 'Noviembre', '12': 'Diciembre'
    };

    // Inicializar todos los meses con 0
    const conteoMensual = {};
    Object.keys(meses).forEach(numeroMes => {
      conteoMensual[meses[numeroMes]] = 0;
    });
    
    // Contar solo los datos del año seleccionado
    datos.forEach(item => {
      const [fecha] = item.fechaHora.split(' ');
      const [, mes, año] = fecha.split('/');
      
      if (parseInt(año) === añoSeleccionado) {
        const nombreMes = meses[mes];
        conteoMensual[nombreMes]++;
      }
    });

    return conteoMensual;
  };

  const datosMensuales = calcularEstadisticasMensuales();

  // Configuración para gráfica de barras
  const datosBarras = {
    labels: Object.keys(datosMensuales),
    datasets: [{
      label: 'Requisiciones',
      data: Object.values(datosMensuales),
      backgroundColor: '#60a5fa',
      borderColor: '#3b82f6',
      borderWidth: 1,
    }],
  };

  const opcionesBarras = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: `Requisiciones por Mes - ${añoSeleccionado}`,
        font: {
          size: 16,
          weight: 'bold'
        }
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 h-80">
      {/* Selector de año */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Año:
        </label>
        <select
          value={añoSeleccionado}
          onChange={(e) => setAñoSeleccionado(parseInt(e.target.value))}
          className="w-32 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
        >
          {añosDisponibles.map(año => (
            <option key={año} value={año}>{año}</option>
          ))}
        </select>
      </div>
      
      <div className="h-48">
        <Bar data={datosBarras} options={opcionesBarras} />
      </div>
    </div>
  );
};

export default GraficaMensual;