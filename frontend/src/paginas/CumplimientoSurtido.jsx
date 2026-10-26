import { useCallback, useEffect, useState } from 'react';
import { FiX } from 'react-icons/fi';
import VistaCumplimiento from '../components/cumplimiento/VistaCumplimiento';
import clienteAxios from '../config/clienteAxios';
import Modal from "../components/modales/ModalBase";
import useAuth from '../hooks/useAuth';

const zona = 'America/Mexico_City';
const fechaDia = fecha => new Intl.DateTimeFormat('en-CA', { timeZone: zona, year: 'numeric', month: '2-digit', day: '2-digit' }).format(fecha);
const fecha = valor => valor ? new Date(valor).toLocaleString('es-MX', { timeZone: zona, dateStyle: 'short', timeStyle: 'short' }) : 'Sin registro';
const config = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
const campo = 'rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 w-full';
const boton = 'rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50';

function GestionSolicitud({ fila, datos, onClose, onSave }) {
    const [responsable, setResponsable] = useState(String(fila.responsableId || ''));
    const [motivo, setMotivo] = useState(fila.motivo || '');
    const [detalle, setDetalle] = useState(fila.detalle || '');
    const [eventos, setEventos] = useState([]);
    const [cargandoHistorial, setCargandoHistorial] = useState(true);
    const [errorHistorial, setErrorHistorial] = useState('');
    const [error, setError] = useState('');
    const [guardando, setGuardando] = useState(false);
    const cerrada = ['surtido', 'rechazada'].includes(fila.status);
    const historica = cerrada && fila.cumplimiento === 'sin seguimiento';

    useEffect(() => {
        let activo = true;
        clienteAxios.get(`/cumplimiento/${fila.id}/historial`, config()).then(({ data }) => {
            if (activo) setEventos(data.eventos);
        }).catch(() => { if (activo) setErrorHistorial('No se pudo cargar el historial. Cierra y vuelve a abrir el detalle para reintentar.'); })
            .finally(() => { if (activo) setCargandoHistorial(false); });
        return () => { activo = false; };
    }, [fila.id]);

    const guardar = async e => {
        e.preventDefault();
        setGuardando(true);
        setError('');
        try {
            const payload = { motivo: motivo || null, detalle };
            if (!cerrada && responsable && responsable !== String(fila.responsableId || '')) payload.responsableId = Number(responsable);
            await clienteAxios.put(`/cumplimiento/${fila.id}`, payload, config());
            onSave();
        } catch (err) { setError(err.response?.data?.msg || 'No se pudo guardar el seguimiento'); }
        finally { setGuardando(false); }
    };

    return <Modal size="lg" isOpen appElement={document.getElementById('root')} onRequestClose={() => !guardando && onClose()} shouldCloseOnOverlayClick={!guardando} shouldCloseOnEsc={!guardando} contentLabel={`Seguimiento de ${fila.folio}`}  className="
      pt-6 pr-6 pb-6 pl-6 [&_>_dl]:rounded-[13px] [&_>_dl]:[background:#f8fafd] [&_>_dl]:border [&_>_dl]:border-solid
      [&_>_dl]:border-[#e5ecf7] max-[650.001px]:[&_>_dl]:grid-cols-[1fr] [&_ol_>_li]:rounded-[12px]
      [&_ol_>_li]:[background:#fcfdff] [&_ol_>_li]:border-[#e4ecf7]
    ">
            <div className="
              flex items-center justify-between gap-[14px] pt-6 pr-6 pb-6 pl-6
              [&&]:[background:linear-gradient(115deg,_#143363,_#245196)] [border-bottom-width:1px]
              [border-bottom-style:solid] [&&]:[border-bottom-color:#315e9d] [&&]:text-[#e1eeff] mt-[-24px] mr-[-24px]
              mb-[23px] ml-[-24px] max-[650.001px]:gap-[10px] max-[650.001px]:pt-5 max-[650.001px]:pr-5 max-[650.001px]:pb-5
              max-[650.001px]:pl-5 max-[650.001px]:mt-[-24px] max-[650.001px]:mr-[-24px] max-[650.001px]:mb-[21px]
              max-[650.001px]:ml-[-24px] [&_>_div:only-child]:w-full [&_h2]:text-[length:21px] [&_h2]:font-[650]
              [&_h2]:leading-[1.3] [&_h2]:tracking-[-.025em] [&&_h2]:text-white max-[650.001px]:[&_h2]:text-[length:19px]
              [&_h3]:text-[length:18px] [&_h3]:font-[650] [&&_h3]:text-white [&_p]:text-[length:13px] [&&_p]:text-[#d4e5fc]
              [&_p]:leading-[1.65] [&_p]:mt-[5px] max-[650.001px]:[&_p]:text-[length:12px]
              [&&_[class*='bg-blue-100']]:[background:#ffffff1c] [&&_[class*='bg-blue-100']]:text-[#bceeff]
              [&_[class*='bg-blue-100']]:rounded-[12px] [&_[class*='bg-blue-100']]:pt-[11px]
              [&_[class*='bg-blue-100']]:pr-[11px] [&_[class*='bg-blue-100']]:pb-[11px] [&_[class*='bg-blue-100']]:pl-[11px]
              [&&_[class*='bg-green-100']]:[background:#ffffff1c] [&&_[class*='bg-green-100']]:text-[#bceeff]
              [&_[class*='bg-green-100']]:rounded-[12px] [&_[class*='bg-green-100']]:pt-[11px]
              [&_[class*='bg-green-100']]:pr-[11px] [&_[class*='bg-green-100']]:pb-[11px]
              [&_[class*='bg-green-100']]:pl-[11px] [&&_.text-green-600]:text-[#bceeff] [&&_.text-blue-600]:text-[#bceeff]
            "><h2 id="titulo-gestion" className="text-xl font-semibold">Solicitud {fila.folio}</h2><button autoFocus type="button" onClick={onClose} disabled={guardando} aria-label="Cerrar detalle" className="
              flex items-center justify-center self-start shrink-0 w-8 h-8 [&&]:[background:#ffffff15] [&&]:text-white
              pt-[6px] pr-[6px] pb-[6px] pl-[6px] rounded-[10px] ml-auto border border-solid [&&]:border-[#bdd7ff55]
              [&&:hover]:[background:#ffffff2b] [&&:hover]:text-white [&&:hover]:border-[#d0e4ff99] [&_>_svg]:w-[17px]
              [&_>_svg]:h-[17px] [&_>_svg]:text-inherit
            "><FiX /></button></div>
            <p className="mt-2 text-sm text-slate-600">{fila.area} · {fila.prioridad} · {fila.status}</p>
            <dl className="my-4 grid grid-cols-2 gap-3 rounded-xl bg-slate-50 p-4 text-sm">
                <div><dt className="text-slate-500">Ventana asignada · {fila.turno}</dt><dd>{fecha(fila.inicio)} – {fecha(fila.limite)}</dd></div>
                <div><dt className="text-slate-500">Resultado</dt><dd>{fila.cumplimiento}</dd></div>
                <div><dt className="text-slate-500">Primera atención</dt><dd>{fecha(fila.primeraAtencion)}</dd></div>
                <div><dt className="text-slate-500">Surtido completo</dt><dd>{fecha(fila.completada)}</dd></div>
            </dl>
            {historica ? <p className="rounded-xl bg-amber-50 p-3 text-sm text-amber-800">Solicitud histórica cerrada. No hay fechas ni responsable verificables; queda fuera de los indicadores de desempeño.</p> : <form onSubmit={guardar} className="space-y-4">
                <label className="block text-sm font-medium">Responsable<select className={`  ${campo}  mt-1 `} value={responsable} onChange={e => setResponsable(e.target.value)} disabled={cerrada || guardando}>
                    <option value="" disabled>Sin asignar</option>{datos.responsables.map(r => <option key={r.id} value={r.id}>{r.user}</option>)}
                </select></label>
                <label className="block text-sm font-medium">Motivo de incidencia<select className={`  ${campo}  mt-1 `} value={motivo} onChange={e => setMotivo(e.target.value)} disabled={guardando}>
                    <option value="">Sin incidencia / sin clasificar</option>{datos.motivos.map(m => <option key={m}>{m}</option>)}
                </select></label>
                <label className="block text-sm font-medium">Detalle<textarea className={`  ${campo}  mt-1 `} rows={3} maxLength={2000} value={detalle} onChange={e => setDetalle(e.target.value)} disabled={guardando} /></label>
                {!fila.responsableId && <p className="text-xs text-slate-500">Si no se asigna antes, quien realice la primera gestión de estado quedará como responsable. Las reasignaciones conservan su historial.</p>}
                {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
                <button type="submit" disabled={guardando} className={boton}>{guardando ? 'Guardando…' : 'Guardar seguimiento'}</button>
            </form>}
            <h3 className="mb-3 mt-6 font-semibold">Historial de atención</h3>
            {cargandoHistorial && <p className="text-sm text-slate-500">Cargando historial…</p>}
            {errorHistorial && <p role="alert" className="text-sm text-red-700">{errorHistorial}</p>}
            {!cargandoHistorial && !errorHistorial && !eventos.length && <p className="text-sm text-slate-500">Todavía no hay movimientos registrados.</p>}
            <ol className="space-y-3">{eventos.map(ev => <li key={ev.id} className="rounded-xl border border-slate-200 p-3 text-sm">
                <p className="font-medium">{ev.actor?.user || `Usuario ${ev.actorId}`} · {ev.tipo}</p><p className="text-xs text-slate-500">{fecha(ev.createdAt)}</p>
                {ev.datos.excepcionHorario && <p className="mt-2 rounded-lg bg-amber-50 p-2 text-amber-800">Prueba de desarrollo: entrega registrada con excepción de horario.</p>}
                {typeof ev.datos.nuevo === 'string' && <p className="mt-1">{ev.datos.anterior} → {ev.datos.nuevo}</p>}
                {ev.datos.nuevo && typeof ev.datos.nuevo === 'object' && <div className="mt-1">
                    <p>Responsable: {datos.responsables.find(r => r.id === ev.datos.nuevo.responsableId)?.user || ev.datos.nuevo.responsableId || 'Sin asignar'}</p>
                    <p>Motivo: {ev.datos.nuevo.motivo || 'Sin clasificar'}</p>{ev.datos.nuevo.detalle && <p>{ev.datos.nuevo.detalle}</p>}
                </div>}
                {ev.datos.comentarioAdmin && <p>{ev.datos.comentarioAdmin}</p>}
                {ev.datos.entregas?.map((entrega, i) => <p key={i}>{entrega.nombre}: {entrega.cantidad} {entrega.unidad}</p>)}
            </li>)}</ol>
    </Modal>;
}

export default function CumplimientoSurtido() {
    const { auth } = useAuth();
    const [filtros, setFiltros] = useState(() => {
        const hoy = fechaDia(new Date());
        return { desde: `${hoy.slice(0, 7)}-01`, hasta: hoy, responsable: '', prioridad: '', turno: '' };
    });
    const [datos, setDatos] = useState(null);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState('');
    const [seleccionada, setSeleccionada] = useState(null);
    const [estado, setEstado] = useState('');
    const [pagina, setPagina] = useState(1);
    const cargar = useCallback(async signal => {
        setCargando(true);
        setError('');
        try {
            const { data } = await clienteAxios.get('/cumplimiento', { ...config(), params: filtros, signal });
            setDatos(data);
        } catch (err) {
            if (err.code !== 'ERR_CANCELED') setError(err.response?.data?.msg || 'No se pudo consultar el cumplimiento. Intenta actualizar.');
        } finally { if (!signal?.aborted) setCargando(false); }
    }, [filtros]);
    useEffect(() => {
        const controller = new AbortController();
        cargar(controller.signal);
        const timer = setInterval(() => cargar(controller.signal), 60000);
        return () => { controller.abort(); clearInterval(timer); };
    }, [cargar]);
    const cambiar = (nombre, valor) => { setFiltros(prev => ({ ...prev, [nombre]: valor })); setPagina(1); };
    const filas = (datos?.filas || []).filter(f => !estado || f.cumplimiento === estado);
    const paginas = Math.max(1, Math.ceil(filas.length / 25));
    const paginaActual = Math.min(pagina, paginas);
    return <VistaCumplimiento datos={datos} auth={auth} filtros={filtros} cambiar={cambiar} cargar={cargar}
        cargando={cargando} error={error} filas={filas} estado={estado} setEstado={setEstado}
        paginaActual={paginaActual} paginas={paginas} setPagina={setPagina} setSeleccionada={setSeleccionada}>
        {seleccionada && datos && <GestionSolicitud key={seleccionada.id} fila={seleccionada} datos={datos}
            onClose={() => setSeleccionada(null)} onSave={() => { setSeleccionada(null); cargar(); }} />}
    </VistaCumplimiento>;
}