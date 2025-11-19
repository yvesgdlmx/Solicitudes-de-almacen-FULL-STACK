import Usuario from "../models/Usuario.js";
import generarJWT from "../helpers/generarJWT.js";
import { Op } from "sequelize";
import path from "path";

export const nuevoUsuario = async (req, res) => {
    const { user, password, rol, area } = req.body;

    try {
        // Verificar que quien hace la petición sea admin
        if (req.usuario.rol !== 'superadmin') {
            const error = new Error('No tienes permisos para crear usuarios');
            return res.status(403).json({ msg: error.message });
        }

        // Verificar que el usuario no exista
        const existeUsuario = await Usuario.findOne({ where: { user } });
        if (existeUsuario) {
            const error = new Error('El usuario ya está registrado');
            return res.status(400).json({ msg: error.message });
        }

        // Crear el usuario con todos los campos necesarios
        const usuario = await Usuario.create({
            user,
            password,
            rol: rol || 'user',
            area,
            confirmado: true, // Los usuarios creados por admin se confirman automáticamente
            colorPerfil: 'text-gray-400' // Valor por defecto
        });

        res.json({
            msg: 'Usuario creado correctamente',
            usuario: {
                id: usuario.id,
                user: usuario.user,
                rol: usuario.rol,
                area: usuario.area,
                confirmado: usuario.confirmado,
                colorPerfil: usuario.colorPerfil
            }
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Error en el servidor al crear el usuario' });
    }
};

export const autenticar = async (req, res) => {
    const { user, password } = req.body;

    const usuario = await Usuario.findOne({ where: {user: user}})
    if(!usuario) {
        const error = new Error('El usuario no existe');
        return res.status(404).json({msg: error.message});
    }

    if(!usuario.confirmado) {
        const error = new Error('Tu cuenta no ha sido confirmada');
        return res.status(403).json({msg: error.message});
    }

    if(usuario.verificarPassword(password)) {
        const token = generarJWT(usuario.id);
        
        usuario.token = token;
        await usuario.save()

        res.json({
            id: usuario.id,
            user: usuario.user,
            rol: usuario.rol, 
            area: usuario.area,
            colorPerfil: usuario.colorPerfil,
            token: token
        }); 
    } else {
        const error = new Error('Password incorrecto');
        return res.status(403).json({msg: error.message});
    }
}

export const perfil = async (req, res) => {
    const {usuario} = req;
    res.json(usuario);
}

export const obtenerUsuarios = async (req, res) => {
    try {
        const usuarios = await Usuario.findAll({
            attributes: { exclude: ['password', 'token']}
        });
        res.json(usuarios);
    } catch (error) {
        console.log(error);
        res.status(500).json({msg: 'Error en el servidor al obtener los usuarios'});
    }
}

export const obtenerUsuarioPorId = async (req, res) => {
    try {
        const {id} = req.params;
        const usuario = await Usuario.findByPk(id, {
            attributes: { exclude: ['password', 'token']}
        })
        if(!usuario) {
            const error = new Error('Usuario no encontrado');
            return res.status(404).json({msg: error.message});
        }
        res.json(usuario);
    } catch (error) {
        console.log(error);
        res.status(500).json({msg: 'Error en el servidor al obtener el usuario'});       
    }
}

export const actualizarColorPerfil = async (req, res) => {
    try {
        const { colorPerfil } = req.body;
        const usuario = req.usuario;

        if(!colorPerfil) {
            return res.satus(400).json({ msg: 'El color de perfil es obligatorio'})
        }

        const coloresPermitidos = [
            'text-gray-400', 'text-blue-500', 'text-green-500', 'text-red-500',
            'text-purple-500', 'text-yellow-500', 'text-pink-500', 'text-indigo-500'
        ];

        if(!coloresPermitidos.includes(colorPerfil)) {
            return res.status(400).json({ msg: 'Color de perfil no permitido', colorPerfil: usuario.colorPerfil });
        }

        usuario.colorPerfil = colorPerfil;
        await usuario.save();
        res.json({ msg: 'Color de perfil actualizado correctamente' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Error en el servidor al actualizar el color de perfil' });
    }
}

export const editarUsuario = async (req, res) => {
    const { id, user, password, rol, area } = req.body;

    try {
        // Verificar que quien hace la petición sea admin
        if (req.usuario.rol !== 'superadmin') {
            const error = new Error('No tienes permisos para editar usuarios');
            return res.status(403).json({ msg: error.message });
        }

        // Verificar que el usuario a editar exista
        const usuario = await Usuario.findByPk(id);
        if (!usuario) {
            const error = new Error('Usuario no encontrado');
            return res.status(404).json({ msg: error.message });
        }

        // Si se está cambiando el nombre de usuario, verificar que no exista otro con ese nombre
        if (user !== usuario.user) {
            const existeUsuario = await Usuario.findOne({ 
                where: { 
                    user: user,
                    id: { [Op.ne]: id } // Excluir el usuario actual
                } 
            });
            if (existeUsuario) {
                const error = new Error('El nombre de usuario ya está en uso');
                return res.status(400).json({ msg: error.message });
            }
        }

        // Actualizar los campos
        usuario.user = user;
        usuario.rol = rol || 'user';
        usuario.area = area;

        // Solo actualizar la contraseña si se proporciona una nueva
        if (password && password.trim() !== '') {
            usuario.password = password;
        }

        await usuario.save();

        res.json({
            msg: 'Usuario actualizado correctamente',
            usuario: {
                id: usuario.id,
                user: usuario.user,
                rol: usuario.rol,
                area: usuario.area,
                confirmado: usuario.confirmado,
                colorPerfil: usuario.colorPerfil
            }
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Error en el servidor al editar el usuario' });
    }
};

export const eliminarUsuario = async (req, res) => {
    const {id} = req.params;

    try {
        if(req.usuario.rol !== 'superadmin') {
            const error = new Error('No tienes permisos para eliminar usuarios');
            return res.status(403).json({msg: error.message});
        }

        const usuario = await Usuario.findByPk(id);
        if(!usuario) {
            const error = new Error('Usuario no encontrado');
            return res.status(404).json({msg: error.message});
        }

        if(usuario.id === req.usuario-id) {
            const error = new Error('No puedes eliminar tu propio usuario');
            return res.status(400).json({msg: error.message});
        }

        await usuario.destroy();

        res.json({
            msg: 'Usuario eliminado correctamente',
            usuarioEliminado: {
                id: usuario.id,
                user: usuario.user
            }
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({msg: 'Error en el servidor al eliminar el usuario'});
    }
}