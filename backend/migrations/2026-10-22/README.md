# Cambios de esquema para Cumplimiento de surtido

Referencia comparada: último commit local `7359f98`, del 9 de marzo de 2026,
contra los modelos actuales, incluidos los archivos aún no registrados en Git.
Esta comparación no confirma qué esquema está instalado en producción.

| Tabla | Cambio desde `7359f98` |
| --- | --- |
| `seguimientos_surtido` | Nueva: una fila por solicitud con responsable, ventana, fechas e incidencia. |
| `eventos_surtido` | Nueva: historial de cambios, actor, responsable y datos del evento. |
| `usuarios` | Sin cambios de estructura. `rol` sigue siendo `VARCHAR(255)`; `desarrollo` no exige ampliar un ENUM. |
| `solicitudes` | Sin cambios de estructura. El seguimiento está en la nueva tabla. |
| `suministros` | Sin cambios desde la referencia. |
| `suministros_parciales` | Sin cambios desde la referencia. |
| `productos` | Sin cambios desde la referencia. |
| `unidades_medidas` | Sin cambios desde la referencia. |

## Orden de revisión y ejecución

1. Seleccionar la base de la aplicación en el cliente SQL y ejecutar
   `00_revision_esquema.sql`. Solo consulta metadatos.
2. Confirmar que el esquema instalado corresponde a la referencia. Los padres
   `solicitudes` y `usuarios` deben existir, usar InnoDB y tener `id` de tipo
   `INT` con signo. Confirmar soporte de `JSON` en el servidor.
3. Si las tablas nuevas ya existen, comparar sus columnas y relaciones con
   `01_cumplimiento_surtido.sql`. `IF NOT EXISTS` únicamente omite la creación;
   no verifica ni repara una tabla existente.
4. Respaldar la base. Ejecutar `01_cumplimiento_surtido.sql` antes de desplegar
   el backend nuevo. MySQL hace commit implícito de estas instrucciones DDL;
   no se debe contar con `ROLLBACK` para deshacerlas.
5. Repetir la consulta de revisión para comprobar ambas tablas y sus claves.

El SQL reproduce la salida del generador MySQL de Sequelize con las asociaciones
actuales, sin importar `config/db.js`, conectarse a MySQL ni ejecutar `sync()`.
Se preservan las reglas actuales: borrar una solicitud elimina su seguimiento
y eventos; borrar el responsable pone a NULL el responsable del seguimiento;
un usuario con eventos como actor no puede borrarse por la clave foránea.
`eventos_surtido.responsableId` es un entero nullable sin clave foránea, tal como
está definido en el modelo actual. `eventos_surtido` no tiene `updatedAt`.

No hay `INSERT`, `UPDATE`, datos ficticios, usuarios predeterminados ni un proceso
de rellenado de solicitudes históricas. Estos archivos no se ejecutan solos.
El arranque actual del backend usa `db.sync()` sin `alter`: crea tablas faltantes,
pero no migra columnas de tablas que ya existen. No cambiarlo a `alter` o `force`
para desplegar esta migración.

## Si producción es anterior

El historial contiene otros cambios que **ya forman parte de `7359f98`**:

- `a698330`, 2 de marzo de 2026: `productos.codigo VARCHAR(255) NOT NULL UNIQUE`
  y `suministros.cantidad DECIMAL(10,2) NOT NULL` en lugar de entero.
- `5a78a73`, 28 de noviembre de 2025: tablas `suministros_parciales` y
  `unidades_medidas`, y estados de solicitud `pendiente surtido` / `en proceso`
  en lugar de `pendiente autorizacion` / `autorizada`.

Si esos cambios faltan, hace falta otra migración basada en los resultados de
`00_revision_esquema.sql`. No añadir `codigo NOT NULL UNIQUE` a productos con
registros sin definir antes cómo asignar sus códigos reales; tampoco recortar
el ENUM de estados sin revisar los estados guardados. Esta migración no aplica
esas transformaciones ni supone cómo convertir los datos existentes.
