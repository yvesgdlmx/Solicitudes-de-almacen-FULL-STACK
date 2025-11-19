import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config({ path: ".env"})

const sequelize = new Sequelize(
    process.env.BD_NOMBRE,
    process.env.BD_USER,
    process.env.BD_PASS ?? '',
    {
        host: process.env.BD_HOST,
        port: process.env.DB_PORT ?? 3306,
        dialect: 'mysql',
        timezone: '-06:00',

        define: {
            timestamps: true
        },
        pool: {
            max: 10,
            min: 0,
            acquire: 60000,
            idle: 10000
        },
        dialectOptions: {
            connectTimeout: 60000
        },
        logging: false,
        retry: {
            max: 3
        }
    }
)

//funcion de conexion de reitento infinito
async function connectWithRetry() {
    let connected = false;
    while (!connected) {
        try {
            await sequelize.authenticate();
            console.log('Conexion a la base de datos exitosa');
            connected = true;
        } catch (error) {
            console.log('Error de conexion a la base de datos. Reintentando en 5 segundos...', error.message);
            console.log('Reintentando en 5 segundos...')
            await new Promise(res => setTimeout(res, 5000));
        }
    }
}

connectWithRetry()

export default sequelize