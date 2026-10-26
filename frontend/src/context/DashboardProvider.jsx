import { createContext, useEffect, useState } from "react";
import clienteAxios from "../config/clienteAxios";
import useAuth from "../hooks/useAuth";

const DashboardContext = createContext();

const dashboardInicial = {
  estadoSolicitudes: [],
  solicitudesPorMes: [],
  solicitudesPorPrioridad: [],
  productosMasSolicitados: [],
  ultimasSolicitudes: [],
  metricas: {
    totalSolicitudes: 0,
    solicitudesPendientes: 0,
    solicitudesEnProceso: 0,
    solicitudesEntregaParcial: 0,
    solicitudesSurtidas: 0,
    solicitudesRechazadas: 0,
    solicitudesActivas: 0,
    solicitudesDelMes: 0,
    solicitudesPrioridadAlta: 0,
    tasaAprobacion: 0,
    tasaRechazo: 0,
    productoTop: null,
    comparativos: {},
  },
};

const DashboardProvider = ({ children }) => {
  const { auth, cargando: cargandoAuth } = useAuth();
  const [dataDashboard, setDataDashboard] = useState(dashboardInicial);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);

  const obtenerDashboard = async () => {
    const token = localStorage.getItem("token");

    if (!token || !auth?.id) {
      setDataDashboard(dashboardInicial);
      setError(null);
      setCargando(false);
      return;
    }

    setCargando(true);
    setError(null);

    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await clienteAxios.get("/dashboard/usuario", config);
      setDataDashboard(data);
    } catch (error) {
      console.error("Error al obtener dashboard:", error);
      setError(error?.response?.data?.msg || "Error al cargar los datos del dashboard");
    } finally {
      setCargando(false);
    }
  };

  const refrescarDashboard = () => {
    obtenerDashboard();
  };

  useEffect(() => {
    if (cargandoAuth) return;

    if (!auth?.id) {
      setDataDashboard(dashboardInicial);
      setError(null);
      setCargando(false);
      return;
    }

    obtenerDashboard();
  }, [auth?.id, cargandoAuth]);

  return (
    <DashboardContext.Provider
      value={{
        dataDashboard,
        cargando: cargando || cargandoAuth,
        error,
        obtenerDashboard,
        refrescarDashboard,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
};

export { DashboardProvider };
export default DashboardContext;
