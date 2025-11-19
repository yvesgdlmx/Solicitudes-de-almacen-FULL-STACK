
/* (1) Funcion para formatear el texto de visualización */
 export const formatearTextoEstado = (nombreEstado) => {
    if(nombreEstado === "Todos") return "Todos";
    return nombreEstado.split(' ').map(palabra => palabra.charAt(0).toUpperCase() + palabra.slice(1)).join(' ');
  }

  export const mapSolicitudRow = (solicitud) => ({
    id: solicitud.id,
    folio: solicitud.folio,
    area: solicitud.area,
    fechaHora: solicitud.fechaHora || solicitud.createdAt,
    solicitante: solicitud.usuario?.user,
    prioridad: solicitud.prioridad,
    status: solicitud.status,
    comentarioUser: solicitud.comentarioUser,
    comentarioAdmin: solicitud.comentarioAdmin,
    suministros: solicitud.suministros
  })

  // Formatear fecha/hora en 24h. Acepta "YYYY-MM-DD HH:mm:ss", ISO o Date.
  export const formatearFecha = (valor) => {
    if (!valor) return { fecha: "-", hora: "-" };

    let d = null;

    if (valor instanceof Date) {
      d = valor;
    } else if (typeof valor === "string") {
      // Soporta "YYYY-MM-DD HH:mm:ss" o "YYYY-MM-DDTHH:mm:ss"
      const m = valor.match(/^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2})(?::(\d{2}))?$/);
      if (m) {
        const [_, Y, M, D, h, mn, s] = m;
        // Construir Date en hora local para evitar desfases por timezone
        d = new Date(
          Number(Y),
          Number(M) - 1,
          Number(D),
          Number(h),
          Number(mn),
          s ? Number(s) : 0,
          0
        );
      } else {
        const tmp = new Date(valor); // fallback para ISO u otros
        if (!isNaN(tmp)) d = tmp;
      }
    }

    if (!(d && !isNaN(d))) return { fecha: "-", hora: "-" };

    const fecha = d.toLocaleDateString("es-MX", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });

    const hora = d.toLocaleTimeString("es-MX", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false, // 24 horas
    });

    return { fecha, hora };
  };