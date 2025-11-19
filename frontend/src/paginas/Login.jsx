import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import clienteAxios from "../config/clienteAxios";
import Swal from "sweetalert2";

const Login = () => {
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");

  const { setAuth } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if ([user, password].includes("")) {
      Swal.fire({
        icon: "warning",
        title: "Campos requeridos",
        text: "Todos los campos son obligatorios",
      });
      return;
    }

    try {
      const { data } = await clienteAxios.post("/usuarios/login", {
        user,
        password,
      });

      if (data.token) {
        localStorage.setItem("token", data.token);
        setAuth(data);

        await Swal.fire({
          icon: "success",
          title: "¡Bienvenido!",
          text: "Inicio de sesión exitoso",
          timer: 1200,
          showConfirmButton: false,
        });

        navigate("/solicitudes");
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se recibió token del servidor",
        });
      }
    } catch (error) {
      console.error(error?.response?.data || error.message);
      Swal.fire({
        icon: "error",
        title: "Error de autenticación",
        text: error?.response?.data?.msg || "Credenciales incorrectas",
      });
    }
  };

  return (
    <div className="flex min-h-screen">
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center bg-white px-8 lg:px-24">
        <div className="flex items-center justify-center w-full mb-2">
          <div className="flex items-center">
            <img src="/img/logo_real.png" alt="logo" width={200}/>
          </div>
        </div>
        <h2 className="text-3xl font-semibold text-gray-800 mb-2">Sistema de solicitudes de almacén </h2>
        <p className="text-gray-500 mb-8 text-center">
          Ingresa tu usuario y contraseña para acceder a tu cuenta.
        </p>

        <form className="w-full max-w-sm" onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Usuario</label>
            <input
              type="text"
              required
              placeholder="Escribe tu usuario"
              value={user}
              onChange={(e) => setUser(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-600"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              required
              placeholder="Escribe tu password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-600"
            />
          </div>

          <div className="flex items-center justify-between mb-6 text-sm">
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" />
              Recordarme
            </label>
            <a href="#" className="text-indigo-600 hover:underline">
              ¿Olvidaste tu password?
            </a>
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-700 transition"
          >
            Log In
          </button>
        </form>
        <div className="text-xs text-gray-400 mt-10">
          © 2025 Optimex SA de CV
        </div>
      </div>

      {/* Sección derecha - diseño mejorado */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-700 text-white flex-col justify-center items-center relative overflow-hidden">
        {/* Elementos decorativos de fondo */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-400/20 rounded-full blur-3xl"></div>
          <div className="absolute top-20 left-10 w-32 h-32 bg-purple-400/10 rounded-full blur-2xl"></div>
          <div className="absolute bottom-20 right-10 w-24 h-24 bg-indigo-300/15 rounded-full blur-xl"></div>
        </div>

        {/* Contenido principal */}
        <div className="text-center px-12 relative z-10">
          <h2 className="text-3xl font-bold mb-4 leading-tight">
            Maneja tus solicitudes de almacén 
            <span className="text-indigo-200"> fácilmente</span>
          </h2>
          <p className="text-indigo-100 mb-10 text-lg leading-relaxed">
            Accede a un dashboard intuitivo para gestionar y rastrear todas tus solicitudes en tiempo real
          </p>
          
          {/* Container de imágenes */}
          <div className="relative w-full max-w-xl mx-auto mb-8">
            {/* Imagen principal del dashboard */}
            <div className="relative">
              <img
                src="/img/login1.png"
                alt="Dashboard principal"
                className="w-full rounded-2xl shadow-2xl border-2 border-white/30 backdrop-blur-sm"
              />
            </div>
            
            {/* Imagen superpuesta - gráficas */}
            <div className="absolute -bottom-8 -right-6 w-56 transform rotate-2 hover:rotate-0 hover:scale-110 transition-all duration-500">
              <img
                src="/img/login2.png"
                alt="Gráficas detalladas"
                className="w-full rounded-xl shadow-2xl border-2 border-white/50 bg-white/95 backdrop-blur-sm"
              />
            </div>
            
            {/* Elemento circular flotante */}
            <div className="absolute top-4 -right-12 w-16 h-16 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-full flex items-center justify-center transform -rotate-12 hover:rotate-0 transition-transform duration-300 animate-bounce">
              <span className="text-white font-bold text-xs">LIVE</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;