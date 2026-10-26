Cumplimiento de surtido
======================

Acceso: `/cumplimiento-surtido` en el frontend. La API `/api/cumplimiento`
requiere autenticación y rol superadmin en todas sus operaciones. El menú y los
enlaces a esta sección se muestran únicamente para superadmin.

Al reiniciar el backend, `await db.sync()` crea las tablas nuevas
`seguimientos_surtido` y `eventos_surtido`. No se usa `alter`, ni se reemplazan
las tablas existentes. El usuario
de la base de datos necesita permiso para crear tablas e índices.

Los horarios son diarios, en America/Mexico_City (UTC-06:00), sin excepción de
prioridad ni corte de recepción. El inicio está incluido y el fin excluido.
Se puede trabajar en preparación fuera de horario; el servidor rechaza registros
de entrega completa o parcial fuera de un rango permitido. Si se entrega en un
rango posterior, no se recorre la fecha límite original.

El rol desarrollo conserva acceso a gestión de usuarios, productos, unidades de
medida y solicitudes, pero no a Cumplimiento de surtido. Puede
registrar entregas completas y parciales a cualquier hora, incluso antes de la
ventana asignada. La excepción se decide con el rol leído de la cuenta autenticada
en el servidor, no con datos del formulario. El historial guarda `rolActor` y
`excepcionHorario`. Se conservan las fechas reales: las pruebas participan en
los indicadores según esas fechas, sin transformarse automáticamente en entregas
a tiempo. Las reglas de cierre, integridad de solicitudes e historial siguen vigentes.

Para habilitarlo: ingresar como superadmin, abrir Cuentas de Usuario y crear una
cuenta con rol Desarrollo, o asignarlo a una cuenta existente. Si se cambia el rol
de una sesión abierta, cerrar sesión y volver a entrar para refrescar la interfaz.
Solo desarrollo puede editar o eliminar cuentas que ya tengan ese rol; superadmin
sí puede crear o promover una cuenta para habilitar el primer acceso de desarrollo.
No se crean cuentas ni contraseñas predeterminadas. No requiere cambios de esquema:
el campo de rol existente es de texto.

Las solicitudes nuevas guardan su ventana al crearse. Las antiguas cerradas no
se evalúan: no se inventan responsables ni fechas de entrega. Las antiguas
activas adquieren seguimiento al asignarse o atenderse, calculando el vencimiento
desde su fecha original. No se permiten reaperturas de solicitudes cerradas.
Las solicitudes asignadas, atendidas o vencidas con seguimiento no se pueden
editar ni eliminar por el solicitante, para conservar las cantidades y resultados
de la evaluación. Las solicitudes pendientes sin asignar y aún en plazo conservan
su edición y eliminación habituales.

El periodo del reporte usa la fecha límite local. El porcentaje a tiempo divide
los cierres completos a tiempo entre todas las solicitudes evaluables cuyo plazo
ya venció, incluyendo pendientes vencidas. Rechazadas e históricas sin datos se
excluyen. La entrega completa compara completas con todas las evaluables del
periodo, incluso si su plazo todavía no venció. Sin denominador se muestra —.

El primer administrador que gestiona el estado queda asignado si no había uno.
Las asignaciones explícitas, incidencias, estados y entregas parciales registran
actor y responsable en un historial transaccional. La tabla por persona agrupa
por el responsable actual, no constituye una calificación ni atribuye a esa
persona todos los movimientos del historial. Los motivos contextualizan el
atraso; no lo eliminan del cumplimiento general.

Validación local: `npm test` en backend y `npm run build` en frontend. Las pruebas
unitarias no requieren MySQL. Para validar el flujo integrado, iniciar con MySQL,
crear una solicitud, asignarla desde cumplimiento, cambiar su estado y comprobar
el historial. Verificar también una entrega fuera de rango (409), usuario normal
en API de cumplimiento (403), y una solicitud antigua cerrada (sin seguimiento).
