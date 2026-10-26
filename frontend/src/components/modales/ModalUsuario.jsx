import { useEffect, useState } from "react";
import Modal from "./ModalBase";
import { FiBriefcase, FiEye, FiEyeOff, FiLock, FiUser, FiUsers, FiX } from "react-icons/fi";
import useUsuarios from "../../hooks/useUsuarios";

const ModalUsuario = ({ isOpen, onRequestClose, usuarioEditar = null }) => {
  const [formData, setFormData] = useState({
    user: "",
    password: "",
    rol: "user",
    area: "",
  });
  const [procesandoUsuario, setProcesandoUsuario] = useState(false);
  const [error, setError] = useState("");
  const [mostrarPassword, setMostrarPassword] = useState(false);

  const { crearUsuario, editarUsuario } = useUsuarios();
  const esEdicion = usuarioEditar !== null;

  useEffect(() => {
    if (!isOpen) return;

    if (esEdicion) {
      setFormData({
        user: usuarioEditar.user || "",
        password: "",
        rol: usuarioEditar.rol || "user",
        area: usuarioEditar.area || "",
      });
    } else {
      setFormData({
        user: "",
        password: "",
        rol: "user",
        area: "",
      });
    }

    setError("");
    setProcesandoUsuario(false);
    setMostrarPassword(false);
  }, [isOpen, usuarioEditar, esEdicion]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (error) setError("");
  };

  const limpiarYCerrar = () => {
    setFormData({
      user: "",
      password: "",
      rol: "user",
      area: "",
    });
    setError("");
    setProcesandoUsuario(false);
    setMostrarPassword(false);
    onRequestClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.user.trim() || !formData.area.trim()) {
      setError("El nombre de usuario y el area son obligatorios");
      return;
    }

    if (!esEdicion && !formData.password.trim()) {
      setError("La contraseña es obligatoria");
      return;
    }

    if (formData.password.trim() && formData.password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    setProcesandoUsuario(true);
    setError("");

    const resultado = esEdicion
      ? await editarUsuario({ id: usuarioEditar.id, ...formData })
      : await crearUsuario(formData);

    if (resultado.success) {
      limpiarYCerrar();
    } else if (!resultado.isDuplicate && !resultado.isPermissionError && !resultado.isNotFound) {
      setError(resultado.error);
    }

    setProcesandoUsuario(false);
  };

  return (
    <Modal size="md"
      isOpen={isOpen}
      onRequestClose={() => { if (!procesandoUsuario) limpiarYCerrar(); }}
      shouldCloseOnOverlayClick={!procesandoUsuario}
      shouldCloseOnEsc={!procesandoUsuario}
      className="am-kind-usuario"

      contentLabel={`Modal ${esEdicion ? "Editar" : "Nuevo"} Usuario`}

    >
      <div>
        <div className="
          flex items-center justify-between gap-[14px] pt-6 pr-6 pb-6 pl-6
          [&&]:[background:linear-gradient(115deg,_#143363,_#245196)] [border-bottom-width:1px]
          [border-bottom-style:solid] [&&]:[border-bottom-color:#315e9d] [&&]:text-[#e1eeff] max-[650.001px]:gap-[10px]
          max-[650.001px]:pt-5 max-[650.001px]:pr-5 max-[650.001px]:pb-5 max-[650.001px]:pl-5 [&_>_div:only-child]:w-full
          [&_h2]:text-[length:21px] [&_h2]:font-[650] [&_h2]:leading-[1.3] [&_h2]:tracking-[-.025em] [&&_h2]:text-white
          max-[650.001px]:[&_h2]:text-[length:19px] [&_h3]:text-[length:18px] [&_h3]:font-[650] [&&_h3]:text-white
          [&_p]:text-[length:13px] [&&_p]:text-[#d4e5fc] [&_p]:leading-[1.65] [&_p]:mt-[5px]
          max-[650.001px]:[&_p]:text-[length:12px] [&&_[class*='bg-blue-100']]:[background:#ffffff1c]
          [&&_[class*='bg-blue-100']]:text-[#bceeff] [&_[class*='bg-blue-100']]:rounded-[12px]
          [&_[class*='bg-blue-100']]:pt-[11px] [&_[class*='bg-blue-100']]:pr-[11px] [&_[class*='bg-blue-100']]:pb-[11px]
          [&_[class*='bg-blue-100']]:pl-[11px] [&&_[class*='bg-green-100']]:[background:#ffffff1c]
          [&&_[class*='bg-green-100']]:text-[#bceeff] [&_[class*='bg-green-100']]:rounded-[12px]
          [&_[class*='bg-green-100']]:pt-[11px] [&_[class*='bg-green-100']]:pr-[11px]
          [&_[class*='bg-green-100']]:pb-[11px] [&_[class*='bg-green-100']]:pl-[11px] [&&_.text-green-600]:text-[#bceeff]
          [&&_.text-blue-600]:text-[#bceeff]
        ">
          <h2 className="text-xl font-semibold text-gray-800">
            {esEdicion ? "Editar Usuario" : "Crear Nuevo Usuario"}
          </h2>
          <button
            onClick={limpiarYCerrar}
            className="
              flex items-center justify-center self-start shrink-0 w-8 h-8 [&&]:[background:#ffffff15] [&&]:text-white
              pt-[6px] pr-[6px] pb-[6px] pl-[6px] rounded-[10px] ml-auto border border-solid [&&]:border-[#bdd7ff55]
              [&&:hover]:[background:#ffffff2b] [&&:hover]:text-white [&&:hover]:border-[#d0e4ff99] [&_>_svg]:w-[17px]
              [&_>_svg]:h-[17px] [&_>_svg]:text-inherit
            " disabled={procesandoUsuario} aria-label="Cerrar usuario"
            type="button"
          >
            <FiX className="text-xl text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="mb-4 rounded-lg border border-red-400 bg-red-100 p-3 text-red-700">
              {error}
            </div>
          )}

          <div className="mb-4">
            <label htmlFor="user" className="mb-2 block text-sm font-medium text-gray-700">
              Nombre de Usuario
            </label>
            <div className="relative">
              <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                id="user"
                name="user"
                value={formData.user}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                placeholder="Ingrese el nombre de usuario"
                disabled={procesandoUsuario}
              />
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="mb-2 block text-sm font-medium text-gray-700">
              {esEdicion ? "Nueva Contraseña (opcional)" : "Contraseña"}
            </label>
            <div className="relative">
              <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type={mostrarPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-11 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                placeholder={esEdicion ? "Escribe una nueva contraseña" : "Ingrese la contraseña"}
                disabled={procesandoUsuario}
              />
              <button
                type="button"
                onClick={() => setMostrarPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 transition-colors hover:text-gray-600"
                disabled={procesandoUsuario}
                title={mostrarPassword ? "Ocultar contraseña" : "Ver contraseña"}
              >
                {mostrarPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
            <p className="mt-1 text-xs text-gray-500">
              {esEdicion
                ? "Dejar vacio para mantener la contraseña actual"
                : "Minimo 6 caracteres"}
            </p>
          </div>

          <div className="mb-4">
            <label htmlFor="rol" className="mb-2 block text-sm font-medium text-gray-700">
              Rol
            </label>
            <div className="relative">
              <FiUsers className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <select
                id="rol"
                name="rol"
                value={formData.rol}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                disabled={procesandoUsuario}
              >
                <option value="user">Usuario</option>
                <option value="admin">Administrador</option>
                <option value="superadmin">Super admin</option>
                <option value="desarrollo">Desarrollo</option>
              </select>
            </div>
            {formData.rol === 'desarrollo' && <p className="mt-2 text-sm text-amber-700">Acceso completo y permiso para registrar entregas fuera de horario. Las excepciones quedan en el historial.</p>}
          </div>

          <div className="mb-6">
            <label htmlFor="area" className="mb-2 block text-sm font-medium text-gray-700">
              Area
            </label>
            <div className="relative">
              <FiBriefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                id="area"
                name="area"
                value={formData.area}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                placeholder="Ej: Recursos Humanos, IT, Ventas"
                disabled={procesandoUsuario}
              />
            </div>
          </div>

          <div className="flex items-center justify-end flex-wrap gap-[10px] pt-[21px] [border-top-width:1px] [border-top-style:solid] mt-[22px] [&&]:border-[#cddbef]">
            <button
              type="button"
              onClick={limpiarYCerrar}
              className="
                [.am-dialog_&]:inline-flex [.am-dialog_&]:items-center [.am-dialog_&]:justify-center [.am-dialog_&]:gap-[7px]
                [.am-dialog_&]:min-h-10 [.am-dialog_&]:pt-[9px] [.am-dialog_&]:pr-[15px] [.am-dialog_&]:pb-[9px]
                [.am-dialog_&]:pl-[15px] [.am-dialog_&]:rounded-[10px] [.am-dialog_&]:text-[length:13px]
                [.am-dialog_&]:font-semibold [.am-dialog_&]:leading-[1.5] [.am-dialog_&]:no-underline
                max-[650.001px]:[.am-dialog_&]:[padding-inline:12px] [&&]:[background:#edf3fc] [&&]:text-[#355886] border
                border-solid [&&]:border-[#bdcee8] [&:hover:not(:disabled)]:[background:#eef5ff]
                [&:hover:not(:disabled)]:border-[#bdd1ef]
              "
              disabled={procesandoUsuario}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={procesandoUsuario}
              className="flex items-center rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {procesandoUsuario ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-white" />
                  {esEdicion ? "Actualizando..." : "Creando..."}
                </>
              ) : (
                esEdicion ? "Actualizar Usuario" : "Crear Usuario"
              )}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default ModalUsuario;
