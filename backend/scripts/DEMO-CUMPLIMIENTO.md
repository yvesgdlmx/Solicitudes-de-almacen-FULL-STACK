Demo de cumplimiento de surtido
==============================

Este script es independiente: no modifica rutas, servicios, pantallas ni el
esquema de MySQL. Usa las dependencias ya instaladas y lee backend/.env. No
importa config/db.js ni su bucle de reconexión. Si falla la conexión, termina.

Ejecutar desde la carpeta backend:

    node scripts/demo-cumplimiento.mjs vista-previa
    node scripts/demo-cumplimiento.mjs crear
    node scripts/demo-cumplimiento.mjs estado
    node scripts/demo-cumplimiento.mjs limpiar
    node scripts/demo-cumplimiento.mjs renombrar
    node scripts/demo-cumplimiento.mjs areas

Sin argumentos equivale a vista-previa: no se conecta a la base ni escribe nada.
También se puede ejecutar desde la raíz con node backend/scripts/demo-cumplimiento.mjs.
Inicia primero el backend actualizado para que existan sus tablas de seguimiento.

Crear genera 20 solicitudes con folios ALM-0001 a ALM-0020, suministros ficticios y
tres cuentas ficticias inactivas: Sofía Ramírez (solicitante), Carlos Mendoza y
Ana Torres (responsables). Los nombres no representan empleados reales. Las cuentas no
pueden iniciar sesión y tienen contraseñas aleatorias que no se imprimen.
Entra con tu cuenta habitual de admin, superadmin o desarrollo para ver la demo.
No altera cuentas existentes, catálogos de productos, unidades ni inventario.
Las solicitudes se reparten entre Surtido, AR, Mantenimiento y Administrativos
(cinco por área). El comando areas aplica esta distribución a las solicitudes
ya existentes del lote, conservando fechas, estados e historial. No modifica
las áreas de las cuentas ni solicitudes ajenas al lote.
El lote se inserta en una transacción; repetir crear no duplica ni sobreescribe.

Escenarios:

- 9 solicitudes completas a tiempo, una por cada rango permitido.
- 3 completas tarde, entregadas en el siguiente rango, con incidencias.
- 3 pendientes vencidas (una pendiente y dos en proceso).
- 1 entrega parcial vencida, con 4 de 10 guantes entregados.
- 1 rechazada, excluida de cumplimiento.
- 1 histórica cerrada sin seguimiento.
- 2 del rango actual o siguiente, una sin asignar y otra en preparación.
- Historial de creación, asignación, estados, entregas e incidencias; uno de los
  casos incluye una reasignación del responsable B al A.

Las fechas se calculan en Ciudad de México desde el momento de ejecución. Los
casos cerrados están dos días atrás y los vencidos un día atrás. El script indica
qué fechas seleccionar en Cumplimiento de surtido; si empieza un mes nuevo, amplía
Desde para incluir los dos días anteriores. Presiona Actualizar tras la carga.

Para el lote recién creado, antes de que venza su rango actual/siguiente:
56% a tiempo (9/16), 67% entrega completa (12/18), 4 pendientes vencidas,
3 completas tarde, 1 rechazada y 1 sin seguimiento. Los indicadores generales
también incluyen tus solicitudes reales. Filtrar por Carlos Mendoza o Ana Torres permite
ver su carga individual; las dos cuentas tienen resultados distintos.
Al pasar el tiempo o cambiar estados desde la app, los resultados evolucionan.

La demo usa inserciones directas de datos sintéticos y fechas históricas para
mostrar resultados sin esperar al reloj. Los eventos llevan la marca demo en
sus datos y los comentarios conservan la marca de prueba para reconocer el lote. Esto permite
revisar visualmente filtros, indicadores e historial; no sustituye las pruebas
de autenticación, permisos o validación de horarios a través de la API.

Limpiar elimina únicamente folios exactos de este lote que además tengan la
marca en comentarioUser y pertenezcan al solicitante ficticio y área esperados. Elimina
sus suministros, parciales, seguimiento e historial dentro de una transacción.
No usa TRUNCATE ni borrados por prefijos. Las cuentas nuevas también requieren
la marca de prueba de su contraseña aleatoria para ser eliminadas; no basta con
coincidir por nombre. Las cuentas modificadas o con
referencias a otras solicitudes se conservan. Si cambias el comentario o el
solicitante de una solicitud demo, deja de reconocerse como propia para limpieza.

No se restablecen contadores autoincrementales. Los IDs usados dejan huecos tras
limpiar, algo normal. El script verifica InnoDB y no crea ni altera tablas.

Renombrar transforma el lote antiguo DEMO-CUMP-V1-* a los nombres y folios nuevos
sin borrarlo ni regenerarlo. Conserva IDs, fechas, estados, asignaciones e historial;
cambia únicamente nombres, folios, área y nombres de artículos. Mantiene la marca
de prueba y las cuentas inactivas. Si los destinos ya existen, una cuenta fue
modificada o tiene referencias fuera del lote, revierte la operación completa.
Estado y limpiar reconocen tanto el lote antiguo como el renombrado.
