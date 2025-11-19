import { useState, useEffect, createContext } from 'react'
import clienteAxios from '../config/clienteAxios';

const AuthContext = createContext();

const AuthProvider = ({children}) => {

    const [auth, setAuth] = useState({})
    const [cargando, setCargando] = useState(true)

    useEffect(() => {
        const autenticarUsuario = async () => {
            const token = localStorage.getItem('token')
            if(!token){
                setCargando(false)
                return
            }

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }

            try {
                const { data } = await clienteAxios.get('/usuarios/perfil', config)
                setAuth(data)
            } catch (error) {
                // Si falla la verificación, limpiamos token y auth
                console.error('Error al autenticar usuario:', error?.response?.data || error.message)
                localStorage.removeItem('token')
                setAuth({})
            } finally {
                setCargando(false)
            }            
        }
        autenticarUsuario()
    }, [])

    const cerrarSesionAuth = () => {
        localStorage.removeItem('token')
        setAuth({})
    }

    const actualizarColorPerfil = async (nuevoColor) => {
        try {
            const token = localStorage.getItem('token');
            if(!token) {
                throw new Error('No hay token de autenticación');
            }

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            };

            await clienteAxios.put('usuarios/color-perfil', { colorPerfil: nuevoColor }, config);

            setAuth(prev => ({
                ...prev,
                colorPerfil: nuevoColor
            }))

            return { success: true}
        } catch (error) {
            console.error('Error al actualizar el color de perfil:', error);
            return {
                success: false,
                msg: error?.response?.data?.msg || 'Error al actualizar el color de perfil'
            }
        }
    }

    return (
        <AuthContext.Provider
            value={{
                auth,
                setAuth,
                cargando,
                cerrarSesionAuth,
                actualizarColorPerfil
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export { AuthProvider }
export default AuthContext;
