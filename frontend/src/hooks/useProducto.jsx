import { useContext } from "react";
import ProductoContext from "../context/ProductoProvider";

const useProducto = () => {
    return useContext(ProductoContext);
}

export default useProducto;