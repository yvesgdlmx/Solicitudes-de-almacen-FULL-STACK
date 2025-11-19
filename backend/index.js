import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import db from './config/db.js';
import usuarioRoutes from './routes/usuarioRoutes.js'
import solicitudRoutes  from './routes/solicitudRoutes.js'
import dashboardRoutes from './routes/dashboardRoutes.js'
import productoRoutes from './routes/productoRoutes.js';

const app = express();
app.use(express.json());

dotenv.config();

try {
    await db.authenticate();
    db.sync()
    console.log('Conexion a la base de datos exitosa');
} catch (error) {
    console.error(error);
}

const FRONTEND = process.env.FRONTEND_URL;
const whitelist = [FRONTEND];

const corsOptions = {
    origin: (origin, callback) => {
        if(!origin) return callback(null, true)
        
        console.log('Origen de la peticion', origin)
        if(whitelist.includes(origin)){
            //puede consultar la api
            callback(null, true)
        } else {    
            callback(new Error('No autorizado'))
        }
    },
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin'],
    exposedHeaders: ['Authorization'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    optionsSuccessStatus: 200
}

app.use(cors(corsOptions));

app.use('/api/usuarios', usuarioRoutes);
app.use('/api/solicitudes', solicitudRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/productos', productoRoutes)


const PORT = process.env.PORT || 3000;
const servidor = app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});

app.use((err, req, res, next) => {
  console.error("Error global:", err);
  res.status(500).json({ error: err.message, stack: err.stack });
});


