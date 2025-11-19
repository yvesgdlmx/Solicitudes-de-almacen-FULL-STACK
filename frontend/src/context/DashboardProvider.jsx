import { useState, useEffect, createContext } from 'react';
import clienteAxios from '../config/clienteAxios';

const DashboardContext = createContext();

const DashboardProvider = ({ children }) => {
  const [dataDashboard, setDataDashboard] = useState({
    estadoSolicitudes: [],
    solicitudesPorMes: [],
    solicitudesPorPrioridad: [],
    productosMasSolicitados: [],
    metricas: {
      totalSolicitudes: 0,
      solicitudesPendientes: 0,
      solicitudesDelMes: 0,
      tasaAprobacion: 0
    }
  });
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);

  const obtenerDashboard = async () => {
    setCargando(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No hay token de autenticación');
      }

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      };

      const { data } = await clienteAxios.get('/dashboard/usuario', config);
      setDataDashboard(data);
    } catch (error) {
      console.error('Error al obtener dashboard:', error);
      setError(error?.response?.data?.msg || 'Error al cargar los datos del dashboard');
    } finally {
      setCargando(false);
    }
  };

  const refrescarDashboard = () => {
    obtenerDashboard();
  };

  // Cargar dashboard al montar el componente
  useEffect(() => {
    obtenerDashboard();
  }, []);

  return (
    <DashboardContext.Provider
      value={{
        dataDashboard,
        cargando,
        error,
        obtenerDashboard,
        refrescarDashboard
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
};

export { DashboardProvider };
export default DashboardContext;