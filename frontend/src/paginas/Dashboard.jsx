import useDashboard from '../hooks/useDashboard';
import useAuth from '../hooks/useAuth';
import VistaDashboard from '../components/dashboard/VistaDashboard';

export default function Dashboard() {
  const { dataDashboard, cargando, error, refrescarDashboard } = useDashboard();
  const { auth } = useAuth();
  return <VistaDashboard datos={dataDashboard} auth={auth} cargando={cargando}
    error={error} actualizar={refrescarDashboard} />;
}