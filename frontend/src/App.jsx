import { Suspense, lazy } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthProvider";
import { SolicitudProvider } from "./context/SolicitudProvider";
import { UsuariosProvider } from "./context/UsuariosProvider";
import { DashboardProvider } from "./context/DashboardProvider";
import { FormularioSolicitudProvider } from "./context/FormularioSolicitudProvider";
import { ProductoProvider } from "./context/ProductoProvider";
import { UnidadMedidaProvider } from "./context/UnidadMedidaProvider";
import { SuministroParcialProvider } from "./context/SuministroParcialProvider";

const AuthLayout = lazy(() => import("./layouts/AuthLayout"));
const Login = lazy(() => import("./paginas/Login"));
const LayoutProtegido = lazy(() => import("./layouts/LayoutProtegido"));
const MisSolicitudes = lazy(() => import("./paginas/MisSolicitudes"));
const RoleProtectedRoute = lazy(() =>
  import("./components/RoleProtectedRoute")
);
const TodasSolicitudes = lazy(() => import("./paginas/TodasSolicitudes"));
const Dashboard = lazy(() => import("./paginas/Dashboard"));
const CuentasDeUsuario = lazy(() => import("./paginas/CuentasDeUsuario"));
const Productos = lazy(() => import("./paginas/Productos"));
const CumplimientoSurtido = lazy(() => import("./paginas/CumplimientoSurtido"));

function App() {
  return (
    <Router>
      <AuthProvider>
        <SolicitudProvider>
          <UsuariosProvider>
            <DashboardProvider>
              <FormularioSolicitudProvider>
                <ProductoProvider>
                  <UnidadMedidaProvider>
                    <SuministroParcialProvider>
                      <Suspense fallback={<div>Cargando...</div>}>
                        <Routes>
                          <Route path="/" element={<AuthLayout />}>
                            <Route index element={<Login />} />
                          </Route>

                          <Route element={<LayoutProtegido />}>
                            <Route path="/cumplimiento-surtido" element={<RoleProtectedRoute allowedRoles={["superadmin"]}><CumplimientoSurtido /></RoleProtectedRoute>} />
                            <Route
                              path="/solicitudes"
                              element={
                                <RoleProtectedRoute
                                  allowedRoles={["admin", "superadmin", "user", "desarrollo"]}
                                >
                                  <MisSolicitudes />
                                </RoleProtectedRoute>
                              }
                            />
                            <Route
                              path="/todas-solicitudes"
                              element={
                                <RoleProtectedRoute
                                  allowedRoles={["admin", "superadmin", "desarrollo"]}
                                >
                                  <TodasSolicitudes />
                                </RoleProtectedRoute>
                              }
                            />
                            <Route
                              path="/dashboard"
                              element={
                                <RoleProtectedRoute
                                  allowedRoles={["admin", "user", "superadmin", "desarrollo"]}
                                >
                                  <Dashboard />
                                </RoleProtectedRoute>
                              }
                            />
                            <Route
                              path="/cuentas-usuario"
                              element={
                                <RoleProtectedRoute
                                  allowedRoles={["superadmin", "desarrollo"]}
                                >
                                  <CuentasDeUsuario />
                                </RoleProtectedRoute>
                              }
                            />
                            <Route
                              path="/productos"
                              element={
                                <RoleProtectedRoute
                                  allowedRoles={["superadmin", "desarrollo"]}
                                >
                                  <Productos />
                                </RoleProtectedRoute>
                              }
                            />
                          </Route>
                        </Routes>
                      </Suspense>
                    </SuministroParcialProvider>
                  </UnidadMedidaProvider>
                </ProductoProvider>
              </FormularioSolicitudProvider>
            </DashboardProvider>
          </UsuariosProvider>
        </SolicitudProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
