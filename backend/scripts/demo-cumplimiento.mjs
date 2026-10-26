import { randomBytes } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
import { AREA, AREA_LEGADA, MARCA, CUENTAS, CUENTAS_LEGADAS, crearEscenarios, resumenEscenarios, sumarMinutos } from './demo-cumplimiento-datos.mjs';
import { fechaLocal } from '../helpers/horariosSurtido.js';

const TABLAS = ['usuarios', 'solicitudes', 'suministros', 'suministros_parciales', 'seguimientos_surtido', 'eventos_surtido'];
const formato = fecha => new Date(fecha).toLocaleString('es-MX', { timeZone: 'America/Mexico_City', hour12: false });
const csvIds = ids => ids.map(() => '?').join(',');
const clavePrueba = 'demo-cumplimiento-v1:';

function mostrarVista(filas, ahora) {
    console.table(filas.map(f => ({ folio: f.folio, caso: f.descripcion, turno: f.turno, estado: f.status, prioridad: f.prioridad, limite: formato(f.limite) })));
    console.log('Resultado esperado solo para este lote:');
    console.log(JSON.stringify(resumenEscenarios(filas, ahora), null, 2));
    console.log(`En Cumplimiento de surtido usa Desde ${fechaLocal(filas[0].limite)} y Hasta ${fechaLocal(filas.at(-1).limite)}. Si el rango cambia de mes, ajusta Desde manualmente.`);
    console.log('Son nombres ficticios: los datos de prueba se suman a los reales. Filtra por Carlos Mendoza o Ana Torres para ver su carga por separado.');
}

async function conectar() {
    const { default: dotenv } = await import('dotenv');
    dotenv.config({ path: fileURLToPath(new URL('../.env', import.meta.url)), quiet: true });
    if (!process.env.BD_NOMBRE || !process.env.BD_USER) throw new Error('Faltan BD_NOMBRE o BD_USER en backend/.env. No se escribió ningún dato.');
    const { default: mysql } = await import('mysql2/promise');
    const db = await mysql.createConnection({
        host: process.env.BD_HOST || 'localhost', port: Number(process.env.DB_PORT || 3306),
        user: process.env.BD_USER, password: process.env.BD_PASS || '', database: process.env.BD_NOMBRE,
        timezone: '-06:00', dateStrings: false, connectTimeout: 5000,
    });
    try {
        // DATETIME se guarda con la misma zona operativa que Sequelize en esta app.
        await db.query("SET time_zone = '-06:00'");
        const [tablas] = await db.execute(`SELECT TABLE_NAME AS nombre, ENGINE AS motor FROM information_schema.TABLES WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME IN (${csvIds(TABLAS)})`, TABLAS);
        if (TABLAS.some(nombre => !tablas.some(t => t.nombre === nombre))) throw new Error('Faltan tablas de la aplicación. Inicia el backend actualizado antes de ejecutar la demo.');
        if (tablas.some(t => t.motor !== 'InnoDB')) throw new Error('La demo requiere tablas InnoDB para garantizar transacciones. No se escribió ningún dato.');
        return db;
    } catch (error) { await db.end(); throw error; }
}

// Se pasan fechas como texto local; evita depender de la zona del equipo que ejecuta Node.
const sqlFecha = fecha => fecha == null ? null : new Date(new Date(fecha).getTime() - 6 * 3600000).toISOString().slice(0, 23).replace('T', ' ');

async function evento(db, solicitudId, actorId, responsableId, tipo, datos, fecha) {
    await db.execute('INSERT INTO eventos_surtido (SolicitudId, actorId, responsableId, tipo, datos, createdAt) VALUES (?, ?, ?, ?, ?, ?)',
        [solicitudId, actorId, responsableId, tipo, JSON.stringify({ ...datos, demo: MARCA, rolActor: 'admin', excepcionHorario: false }), sqlFecha(fecha)]);
}

async function cargar(db, filas) {
    await db.beginTransaction();
    try {
        const [legadas] = await db.execute(`SELECT id FROM usuarios WHERE user IN (${csvIds(CUENTAS_LEGADAS)}) AND area = ? FOR UPDATE`, [...CUENTAS_LEGADAS, AREA_LEGADA]);
        if (legadas.length) throw new Error('Existe el lote anterior. Ejecuta renombrar para conservar sus fechas y estados, o limpiar antes de crear otro.');
        const [existentes] = await db.execute(`SELECT id FROM solicitudes WHERE folio IN (${csvIds(filas)}) FOR UPDATE`, filas.map(f => f.folio));
        if (existentes.length) throw new Error('El lote demo ya existe (o hay folios reservados ocupados). Usa estado para revisarlo o limpiar antes de regenerarlo. No se cambió nada.');
        const [cuentasExistentes] = await db.execute(`SELECT id FROM usuarios WHERE user IN (${csvIds(CUENTAS)}) FOR UPDATE`, CUENTAS.map(c => c.user));
        if (cuentasExistentes.length) throw new Error('Ya existe alguna cuenta con los nombres del lote. No se reutilizará ni modificará. Revisa estado antes de continuar.');
        const usuarios = [];
        for (const cuenta of CUENTAS) {
            const [resultado] = await db.execute('INSERT INTO usuarios (user, password, rol, area, colorPerfil, confirmado, token) VALUES (?, ?, ?, ?, ?, ?, ?)',
                [cuenta.user, clavePrueba + randomBytes(32).toString('hex'), cuenta.rol, AREA, 'text-gray-400', false, null]);
            usuarios.push(resultado.insertId);
        }
        for (const f of filas) {
            const responsableId = f.responsable == null ? null : usuarios[f.responsable];
            const actorId = responsableId || usuarios[1];
            const [resultado] = await db.execute('INSERT INTO solicitudes (folio, area, fechaHora, prioridad, status, comentarioUser, comentarioAdmin, solicitante, abierto) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
                [f.folio, f.area, sqlFecha(f.fechaHora), f.prioridad, f.status, `${MARCA} ${f.descripcion}`, `${MARCA} Datos sintéticos para probar indicadores.`, usuarios[0], false]);
            const id = resultado.insertId;
            for (const [nombre, cantidad] of [['Guantes de nitrilo', 10], ['Lentes de seguridad', 2]]) {
                await db.execute('INSERT INTO suministros (cantidad, nombre, unidad, SolicitudId) VALUES (?, ?, ?, ?)', [cantidad, nombre, 'Pieza', id]);
            }
            if (f.sinSeguimiento) continue;
            const ultimaFecha = f.completada || (['entrega parcial', 'rechazada'].includes(f.status) ? sumarMinutos(f.inicio, 10) : f.primeraAtencion) || f.fechaHora;
            await db.execute('INSERT INTO seguimientos_surtido (SolicitudId, responsableId, turno, inicio, limite, primeraAtencion, completada, motivo, detalle, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                [id, responsableId, f.turno, sqlFecha(f.inicio), sqlFecha(f.limite), sqlFecha(f.primeraAtencion), sqlFecha(f.completada), f.motivo, f.detalle, sqlFecha(f.fechaHora), sqlFecha(ultimaFecha)]);
            await evento(db, id, usuarios[1], responsableId, 'creación de solicitud demo', { nuevo: 'pendiente surtido' }, f.fechaHora);
            if (responsableId) {
                const inicial = f.reasignada ? usuarios[2] : responsableId;
                await evento(db, id, usuarios[1], inicial, 'asignación / incidencia', { nuevo: { responsableId: inicial, motivo: null, detalle: `${MARCA} Asignación simulada.` } }, f.fechaHora);
            }
            if (f.primeraAtencion) {
                await evento(db, id, actorId, responsableId, 'cambio de estado', { anterior: 'pendiente surtido', nuevo: 'en proceso' }, f.primeraAtencion);
            }
            if (f.reasignada) {
                await evento(db, id, usuarios[1], responsableId, 'asignación / incidencia', { anterior: { responsableId: usuarios[2] }, nuevo: { responsableId, motivo: null, detalle: `${MARCA} Reasignación simulada de B a A.` } }, sumarMinutos(f.inicio, 5));
            }
            if (f.status === 'entrega parcial') {
                const fechaEntrega = sumarMinutos(f.inicio, 10);
                await db.execute('INSERT INTO suministros_parciales (cantidad, nombre, unidad, SolicitudId, fechaEntrega) VALUES (?, ?, ?, ?, ?)', [4, 'Guantes de nitrilo', 'Pieza', id, sqlFecha(fechaEntrega)]);
                await evento(db, id, actorId, responsableId, 'entrega parcial', { anterior: 'en proceso', nuevo: f.status, entregas: [{ nombre: 'Guantes de nitrilo', cantidad: 4, unidad: 'Pieza' }] }, fechaEntrega);
            } else if (['surtido', 'rechazada'].includes(f.status)) {
                await evento(db, id, actorId, responsableId, 'cambio de estado', { anterior: 'en proceso', nuevo: f.status, comentarioAdmin: `${MARCA} ${f.descripcion}` }, f.completada || sumarMinutos(f.inicio, 10));
            }
            if (f.motivo) {
                await evento(db, id, actorId, responsableId, 'asignación / incidencia', { nuevo: { responsableId, motivo: f.motivo, detalle: f.detalle } }, f.completada || f.primeraAtencion || f.fechaHora);
            }
        }
        await db.commit();
        console.log(`Carga completa: ${filas.length} solicitudes y 3 cuentas DEMO inactivas. No se modificaron cuentas, productos ni solicitudes existentes.`);
    } catch (error) { await db.rollback(); throw error; }
}

async function filasPropias(db, filas, bloquear = false) {
    // Tres condiciones de pertenencia: folio exacto, marca y solicitante reservado.
    const [propias] = await db.execute(`SELECT s.id, s.folio, s.area, s.status, s.fechaHora FROM solicitudes s JOIN usuarios u ON u.id = s.solicitante WHERE LEFT(s.comentarioUser, ?) = ? AND ((s.folio IN (${csvIds(filas)}) AND u.user = ? AND u.area = ?) OR (s.folio IN (${csvIds(filas)}) AND u.user = ? AND u.area = ?))${bloquear ? ' FOR UPDATE' : ''}`,
        [MARCA.length, MARCA, ...filas.map(f => f.folio), CUENTAS[0].user, AREA, ...filas.map(f => f.folioLegado), CUENTAS_LEGADAS[0], AREA_LEGADA]);
    return propias;
}

async function limpiar(db, filas) {
    await db.beginTransaction();
    try {
        const propias = await filasPropias(db, filas, true);
        const ids = propias.map(f => f.id);
        if (ids.length) {
            for (const tabla of ['eventos_surtido', 'seguimientos_surtido', 'suministros_parciales', 'suministros']) {
                await db.execute(`DELETE FROM ${tabla} WHERE SolicitudId IN (${csvIds(ids)})`, ids);
            }
            await db.execute(`DELETE FROM solicitudes WHERE id IN (${csvIds(ids)})`, ids);
        }
        let eliminadas = 0;
        const cuentas = [...CUENTAS.map(c => ({ ...c, area: AREA })), ...CUENTAS.map((c, i) => ({ ...c, user: CUENTAS_LEGADAS[i], area: AREA_LEGADA }))];
        for (const cuenta of cuentas) {
            try {
                const [resultado] = await db.execute('DELETE FROM usuarios WHERE user = ? AND area = ? AND rol = ? AND confirmado = 0 AND token IS NULL AND (? = ? OR LEFT(password, ?) = ?)', [cuenta.user, cuenta.area, cuenta.rol, cuenta.area, AREA_LEGADA, clavePrueba.length, clavePrueba]);
                eliminadas += resultado.affectedRows;
            } catch (error) {
                if (error.code !== 'ER_ROW_IS_REFERENCED_2') throw error;
                console.log(`Se conserva ${cuenta.user}: tiene referencias fuera de las solicitudes demo eliminadas.`);
            }
        }
        await db.commit();
        console.log(`Limpieza completa: ${ids.length} solicitudes demo y ${eliminadas} cuentas demo inactivas eliminadas. Las cuentas modificadas o referenciadas se conservan.`);
    } catch (error) { await db.rollback(); throw error; }
}

async function renombrar(db, filas) {
    await db.beginTransaction();
    try {
        const propias = (await filasPropias(db, filas, true)).filter(f => filas.some(n => n.folioLegado === f.folio));
        if (!propias.length) {
            await db.rollback();
            console.log('No hay solicitudes del lote anterior para renombrar. No se cambió nada.');
            return;
        }
        const [colisiones] = await db.execute(`SELECT id FROM solicitudes WHERE folio IN (${csvIds(filas)}) FOR UPDATE`, filas.map(f => f.folio));
        const [nombres] = await db.execute(`SELECT id FROM usuarios WHERE user IN (${csvIds(CUENTAS)}) FOR UPDATE`, CUENTAS.map(c => c.user));
        if (colisiones.length || nombres.length) throw new Error('Algún nombre o folio de destino ya existe. No se cambió ningún registro.');
        const cuentas = [];
        for (const [i, nombre] of CUENTAS_LEGADAS.entries()) {
            const [coincidencias] = await db.execute('SELECT id, password FROM usuarios WHERE user = ? AND area = ? AND rol = ? AND confirmado = 0 AND token IS NULL FOR UPDATE', [nombre, AREA_LEGADA, CUENTAS[i].rol]);
            if (coincidencias.length !== 1 || !/^[a-f0-9]{64}$/.test(coincidencias[0].password)) throw new Error('Una cuenta del lote anterior fue modificada o no se reconoce. No se cambió nada.');
            cuentas.push(coincidencias[0]);
        }
        const ids = propias.map(f => f.id);
        const usuarioIds = cuentas.map(c => c.id);
        const [referencias] = await db.execute(`SELECT id FROM solicitudes WHERE solicitante IN (${csvIds(usuarioIds)}) AND id NOT IN (${csvIds(ids)}) LIMIT 1 FOR UPDATE`, [...usuarioIds, ...ids]);
        const [asignaciones] = await db.execute(`SELECT SolicitudId FROM seguimientos_surtido WHERE responsableId IN (${csvIds(usuarioIds)}) AND SolicitudId NOT IN (${csvIds(ids)}) LIMIT 1 FOR UPDATE`, [...usuarioIds, ...ids]);
        const [eventos] = await db.execute(`SELECT SolicitudId FROM eventos_surtido WHERE (actorId IN (${csvIds(usuarioIds)}) OR responsableId IN (${csvIds(usuarioIds)})) AND SolicitudId NOT IN (${csvIds(ids)}) LIMIT 1 FOR UPDATE`, [...usuarioIds, ...usuarioIds, ...ids]);
        if (referencias.length || asignaciones.length || eventos.length) throw new Error('Las cuentas de prueba tienen referencias fuera del lote. No se renombraron para no afectar otros registros.');
        for (const [i, cuenta] of cuentas.entries()) {
            await db.execute('UPDATE usuarios SET user = ?, area = ?, password = ? WHERE id = ?', [CUENTAS[i].user, AREA, clavePrueba + cuenta.password, cuenta.id]);
        }
        for (const propia of propias) {
            const nueva = filas.find(f => f.folioLegado === propia.folio);
            await db.execute('UPDATE solicitudes SET folio = ?, area = ? WHERE id = ?', [nueva.folio, nueva.area, propia.id]);
        }
        for (const tabla of ['suministros', 'suministros_parciales']) {
            await db.execute(`UPDATE ${tabla} SET nombre = CASE nombre WHEN 'Guantes DEMO' THEN 'Guantes de nitrilo' WHEN 'Lentes DEMO' THEN 'Lentes de seguridad' ELSE nombre END WHERE SolicitudId IN (${csvIds(ids)})`, ids);
        }
        // Actualiza solo el nombre del artículo en el historial; conserva fechas y estados.
        await db.execute(`UPDATE eventos_surtido SET datos = REPLACE(REPLACE(CAST(datos AS CHAR), 'Guantes DEMO', 'Guantes de nitrilo'), 'Lentes DEMO', 'Lentes de seguridad') WHERE SolicitudId IN (${csvIds(ids)})`, ids);
        await db.commit();
        console.log(`Renombradas ${propias.length} solicitudes y ${cuentas.length} cuentas ficticias. Se conservaron IDs, fechas, estados, responsables y la marca de prueba.`);
    } catch (error) { await db.rollback(); throw error; }
}

async function actualizarAreas(db, filas) {
    await db.beginTransaction();
    try {
        const propias = await filasPropias(db, filas, true);
        const resumen = {};
        for (const propia of propias) {
            const escenario = filas.find(f => f.folio === propia.folio || f.folioLegado === propia.folio);
            await db.execute('UPDATE solicitudes SET area = ? WHERE id = ?', [escenario.area, propia.id]);
            resumen[escenario.area] = (resumen[escenario.area] || 0) + 1;
        }
        await db.commit();
        console.log(`Áreas actualizadas en ${propias.length} solicitudes de prueba. Se conservaron fechas, estados e historial.`);
        console.table(resumen);
    } catch (error) { await db.rollback(); throw error; }
}

export async function main(args = process.argv.slice(2)) {
    const accion = args[0] || 'vista-previa';
    if (args.length > 1 || !['vista-previa', 'crear', 'estado', 'limpiar', 'renombrar', 'areas', 'ayuda', '--help'].includes(accion)) throw new Error('Uso: node scripts/demo-cumplimiento.mjs [vista-previa|crear|estado|limpiar|renombrar|areas]');
    if (['ayuda', '--help'].includes(accion)) {
        console.log('Desde backend: node scripts/demo-cumplimiento.mjs [vista-previa|crear|estado|limpiar|renombrar|areas]\nSin argumentos: vista previa sin conectar a MySQL. Renombrar conserva fechas, estados e IDs del lote anterior. Areas actualiza solo las áreas solicitantes del lote. No cambia el esquema ni el código de la aplicación.');
        return;
    }
    const ahora = new Date();
    const filas = crearEscenarios(ahora);
    if (accion === 'vista-previa') return mostrarVista(filas, ahora);
    const db = await conectar();
    try {
        if (accion === 'crear') { await cargar(db, filas); mostrarVista(filas, ahora); }
        if (accion === 'limpiar') await limpiar(db, filas);
        if (accion === 'renombrar') await renombrar(db, filas);
        if (accion === 'areas') await actualizarAreas(db, filas);
        if (accion === 'estado') {
            const propias = await filasPropias(db, filas);
            console.table(propias.map(f => ({ id: f.id, folio: f.folio, area: f.area, estado: f.status })));
            console.log(`${propias.length} solicitudes reconocidas como propias de este lote demo.`);
            if (propias.length) {
                const [persistidas] = await db.execute(`SELECT s.status, t.inicio, t.limite, t.completada, t.motivo, (t.SolicitudId IS NULL) AS sinSeguimiento FROM solicitudes s LEFT JOIN seguimientos_surtido t ON t.SolicitudId = s.id WHERE s.id IN (${csvIds(propias)})`, propias.map(f => f.id));
                console.log('Indicadores calculados a partir de los registros guardados en MySQL:');
                console.log(JSON.stringify(resumenEscenarios(persistidas), null, 2));
            }
        }
    } finally { await db.end(); }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
    main().catch(error => {
        const mensajes = {
            ECONNREFUSED: 'MySQL no está disponible. Inicia el servicio o revisa la conexión de backend/.env.',
            ETIMEDOUT: 'La conexión a MySQL agotó el tiempo de espera.',
            ER_ACCESS_DENIED_ERROR: 'MySQL rechazó las credenciales configuradas en backend/.env.',
            ER_BAD_DB_ERROR: 'La base configurada no existe.',
        };
        console.error(error.code ? (mensajes[error.code] || `La operación falló (${error.code}). No se muestra SQL ni credenciales.`) : error.message);
        process.exitCode = 1;
    });
}
