import { useContext } from "react";
import SolicitudContext from "../context/SolicitudProvider";

const useSolicitud = () => {
    return useContext(SolicitudContext);
}

export default useSolicitud;