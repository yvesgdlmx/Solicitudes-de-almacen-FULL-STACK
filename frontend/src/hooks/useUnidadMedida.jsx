import { useContext } from 'react';
import UnidadMedidaContext from '../context/UnidadMedidaProvider';

const useUnidadMedida = () => {
    return useContext(UnidadMedidaContext);
};

export default useUnidadMedida;