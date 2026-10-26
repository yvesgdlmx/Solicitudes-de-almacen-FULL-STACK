-- Solo lectura. Selecciona primero la base de datos de la aplicacion.
-- No muestra contrasenas ni datos de usuarios.
SELECT DATABASE() AS base_seleccionada, VERSION() AS version_servidor;

SELECT TABLE_NAME, ENGINE, TABLE_COLLATION
FROM information_schema.TABLES
WHERE TABLE_SCHEMA = DATABASE()
  AND TABLE_NAME IN (
    'usuarios', 'solicitudes', 'suministros', 'suministros_parciales',
    'productos', 'unidades_medidas', 'seguimientos_surtido', 'eventos_surtido'
  )
ORDER BY TABLE_NAME;

SELECT TABLE_NAME, ORDINAL_POSITION, COLUMN_NAME, COLUMN_TYPE,
       IS_NULLABLE, COLUMN_DEFAULT, COLUMN_KEY, EXTRA
FROM information_schema.COLUMNS
WHERE TABLE_SCHEMA = DATABASE()
  AND TABLE_NAME IN (
    'usuarios', 'solicitudes', 'suministros', 'suministros_parciales',
    'productos', 'unidades_medidas', 'seguimientos_surtido', 'eventos_surtido'
  )
ORDER BY TABLE_NAME, ORDINAL_POSITION;

SELECT TABLE_NAME, INDEX_NAME, NON_UNIQUE, SEQ_IN_INDEX, COLUMN_NAME
FROM information_schema.STATISTICS
WHERE TABLE_SCHEMA = DATABASE()
  AND TABLE_NAME IN (
    'usuarios', 'solicitudes', 'suministros', 'suministros_parciales',
    'productos', 'unidades_medidas', 'seguimientos_surtido', 'eventos_surtido'
  )
ORDER BY TABLE_NAME, INDEX_NAME, SEQ_IN_INDEX;

SELECT k.TABLE_NAME, k.CONSTRAINT_NAME, k.COLUMN_NAME,
       k.REFERENCED_TABLE_NAME, k.REFERENCED_COLUMN_NAME,
       r.UPDATE_RULE, r.DELETE_RULE
FROM information_schema.KEY_COLUMN_USAGE AS k
JOIN information_schema.REFERENTIAL_CONSTRAINTS AS r
  ON r.CONSTRAINT_SCHEMA = k.CONSTRAINT_SCHEMA
 AND r.TABLE_NAME = k.TABLE_NAME
 AND r.CONSTRAINT_NAME = k.CONSTRAINT_NAME
WHERE k.CONSTRAINT_SCHEMA = DATABASE()
  AND k.TABLE_NAME IN (
    'usuarios', 'solicitudes', 'suministros', 'suministros_parciales',
    'productos', 'unidades_medidas', 'seguimientos_surtido', 'eventos_surtido'
  )
ORDER BY k.TABLE_NAME, k.CONSTRAINT_NAME, k.ORDINAL_POSITION;
