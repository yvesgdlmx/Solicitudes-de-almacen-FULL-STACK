import { useContext } from "react";
import SuministroParcialContext from "../context/SuministroParcialProvider";

const useSuministroParcial = () => {
    return useContext(SuministroParcialContext);
};

export default useSuministroParcial;