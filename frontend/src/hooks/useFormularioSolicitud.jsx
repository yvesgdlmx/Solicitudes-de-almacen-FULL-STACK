import { useContext } from "react";
import FormularioSolicitudContext from "../context/FormularioSolicitudProvider";

const useFormularioSolicitud = () => {
    return useContext(FormularioSolicitudContext);
}

export default useFormularioSolicitud;