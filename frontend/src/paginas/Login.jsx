import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowRight, FiEye, FiLock, FiMail, FiPackage } from "react-icons/fi";
import useAuth from "../hooks/useAuth";
import clienteAxios from "../config/clienteAxios";
import Swal from "sweetalert2";
import MarcaAlmacen from "../components/MarcaAlmacen";

const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 2200,
  timerProgressBar: true,
  background: "rgba(15, 23, 42, 0.86)",
  color: "#FFFFFF",
  iconColor: "#93C5FD",
  customClass: {
    popup: "rounded-xl border border-white/15 shadow-2xl backdrop-blur-md",
    title: "text-sm font-semibold",
    timerProgressBar: "bg-[#3B82F6]",
  },
});

const Login = () => {
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");

  const { setAuth } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if ([user, password].includes("")) {
      Toast.fire({
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

        await Toast.fire({
          icon: "success",
          title: "Bienvenido",
          text: "Inicio de sesion exitoso",
          timer: 1100,
        });

        navigate("/solicitudes");
      } else {
        Toast.fire({
          icon: "error",
          title: "Error",
          text: "No se recibio token del servidor",
        });
      }
    } catch (error) {
      console.error(error?.response?.data || error.message);
      Toast.fire({
        icon: "error",
        title: "Error de autenticacion",
        text: error?.response?.data?.msg || "Credenciales incorrectas",
      });
    }
  };

  return (
    <main className="
      min-h-screen overflow-hidden bg-white text-[#0F172A]
      [&_>_div_>_section:first-child]:[background:radial-gradient(ellipse_at_0_0,_#dce9ff,_transparent_65%),_#f7faff]
      [&_form_>_div_>_div]:[box-shadow:0_3px_10px_#16386e08] [&_form_>_div_>_div]:border-[#b9cce7]
      [&_form_button[type='submit']]:[background:linear-gradient(110deg,_#1e63df,_#16396f)]
      [&_form_button[type='submit']]:[box-shadow:0_7px_18px_#164da333]
    ">
      <div className="grid min-h-screen lg:grid-cols-[44%_56%]">
        <section className="relative z-10 flex min-h-screen items-center justify-center px-8 py-10 sm:px-14 lg:px-20">
          <div className="w-full max-w-sm">
            <div className="mb-12 flex items-center gap-3">
              <MarcaAlmacen acceso />
            </div>

            <div className="mb-9">
              <h1 className="text-4xl font-bold tracking-tight text-[#0F172A]">
                Iniciar sesion
              </h1>
              <p className="mt-2 text-sm leading-6 text-[#64748B]">
                Ingresa tus credenciales para continuar.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-[#334155]">
                  Usuario
                </label>
                <div className="
                  flex h-12 items-center rounded-full border border-[#CBD5E1] bg-white px-4 transition
                  focus-within:border-[#94A3B8] focus-within:ring-4 focus-within:ring-slate-200
                ">
                  <FiMail className="mr-3 h-4 w-4 text-[#94A3B8]" />
                  <input
                    type="text"
                    required
                    placeholder="Escribe tu usuario"
                    value={user}
                    onChange={(e) => setUser(e.target.value)}
                    className="h-full w-full bg-transparent text-sm text-[#0F172A] outline-none placeholder:text-[#94A3B8]"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-[#334155]">
                  Password
                </label>
                <div className="
                  flex h-12 items-center rounded-full border border-[#CBD5E1] bg-white px-4 transition
                  focus-within:border-[#94A3B8] focus-within:ring-4 focus-within:ring-slate-200
                ">
                  <FiLock className="mr-3 h-4 w-4 text-[#94A3B8]" />
                  <input
                    type="password"
                    required
                    placeholder="Escribe tu password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-full w-full bg-transparent text-sm text-[#0F172A] outline-none placeholder:text-[#94A3B8]"
                  />
                  <FiEye className="ml-3 h-4 w-4 text-[#64748B]" />
                </div>
              </div>

              <div className="flex items-center justify-between pt-1 text-xs">
                <label className="flex items-center gap-2 text-[#64748B]">
                  <input type="checkbox" className="h-3.5 w-3.5 rounded border-[#CBD5E1] accent-[#3B82F6]" />
                  Recordarme
                </label>
              </div>

              <button
                type="submit"
                className="
                  mt-2 flex h-12 w-40 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#3B82F6] to-[#1E3A8A]
                  text-sm font-semibold text-white shadow-[0_8px_18px_rgba(30,58,138,0.18)] transition hover:-translate-y-0.5
                  hover:shadow-[0_10px_22px_rgba(30,58,138,0.2)] focus:outline-none focus:ring-4 focus:ring-[#93C5FD]/30
                "
              >
                Login
                <FiArrowRight className="h-4 w-4" />
              </button>
            </form>

            <p className="mt-10 text-xs text-[#94A3B8]">Optimex SA de CV</p>
          </div>
        </section>

        <section className="relative hidden min-h-screen overflow-hidden bg-gradient-to-br from-[#3B82F6] via-[#1E3A8A] to-[#0F172A] text-white lg:block">
          <div className="absolute inset-y-0 -left-24 w-48 rounded-r-[55%] bg-white" />
          <div className="
            absolute inset-0 opacity-20
            [background-image:radial-gradient(circle_at_20%_20%,#E2E8F0_0,transparent_18%),radial-gradient(circle_at_80%_70%,#93C5FD_0,transparent_24%)]
          " />
          <div className="absolute left-[-7rem] top-0 h-full w-64 rounded-r-[48%] bg-white" />

          <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-12 py-12 text-center">
            <div className="mb-8 flex items-center gap-2 rounded-full bg-white/12 px-4 py-2 text-sm font-semibold backdrop-blur">
              <FiPackage className="h-4 w-4" />
              Solicitudes de almacen
            </div>

            <h2 className="max-w-xl text-3xl font-bold leading-tight">
              No se trata solo de pedir material.
              <br />
              Se trata de mantener la operacion en movimiento.
            </h2>
            <p className="mt-3 text-sm text-[#E2E8F0]">
              Bienvenido al sistema de almacen
            </p>

            <div className="relative mt-10 w-full max-w-2xl">
              <div className="absolute inset-x-8 bottom-0 h-20 rounded-full bg-[#0F172A]/28 blur-2xl" />
              <img
                src="/img/login-blue-warehouse-illustration.png"
                alt="Ilustracion de acceso al sistema de almacen"
                className="relative mx-auto w-full max-w-xl object-contain drop-shadow-2xl"
              />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default Login;
