import { useState, createContext } from "react";
import clienteAxios from "../config/clienteAxios";

const SuministroParcialContext = createContext();

const SuministroParcialProvider = ({ children }) => {
    const [cargando, setCargando] = useState(false);
    const [suministrosParciales, setSuministrosParciales] = useState([]);

    const registrarSuministrosParciales = async (solicitudId, suministros) => {
        setCargando(true);
        try {
            const token = localStorage.getItem('token');
            if (!token) return { success: false };

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            };

            const { data } = await clienteAxios.post(
                `/suministros-parciales/${solicitudId}`,
                { suministrosParciales: suministros },
                config
            );

            return { success: true, data };
        } catch (error) {
            console.error('Error al registrar suministros parciales:', error);
            return { 
                success: false, 
                error: error.response?.data?.msg || 'Error al registrar entrega parcial' 
            };
        } finally {
            setCargando(false);
        }
    };

    const obtenerSuministrosParciales = async (solicitudId) => {
        setCargando(true);
        try {
            const token = localStorage.getItem('token');
            if (!token) return;

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            };

            const { data } = await clienteAxios.get(
                `/suministros-parciales/${solicitudId}`,
                config
            );

            setSuministrosParciales(data.suministrosParciales || []);
            return data.suministrosParciales;
        } catch (error) {
            console.error('Error al obtener suministros parciales:', error);
            setSuministrosParciales([]);
        } finally {
            setCargando(false);
        }
    };

    const eliminarSuministroParcial = async (id) => {
        setCargando(true);
        try {
            const token = localStorage.getItem('token');
            if (!token) return { success: false };

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            };

            await clienteAxios.delete(`/suministros-parciales/${id}`, config);
            
            setSuministrosParciales(prev => prev.filter(s => s.id !== id));
            return { success: true };
        } catch (error) {
            console.error('Error al eliminar suministro parcial:', error);
            return { 
                success: false, 
                error: error.response?.data?.msg || 'Error al eliminar' 
            };
        } finally {
            setCargando(false);
        }
    };

    return (
        <SuministroParcialContext.Provider
            value={{
                cargando,
                suministrosParciales,
                registrarSuministrosParciales,
                obtenerSuministrosParciales,
                eliminarSuministroParcial
            }}
        >
            {children}
        </SuministroParcialContext.Provider>
    );
};

export { SuministroParcialProvider };
export default SuministroParcialContext;