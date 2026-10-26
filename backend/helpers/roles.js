export const ROLES = ['user', 'admin', 'superadmin', 'desarrollo'];
export const puedeGestionarUsuarios = rol => ['superadmin', 'desarrollo'].includes(rol);
export const puedeGestionarCuenta = (actorRol, cuentaRol) => puedeGestionarUsuarios(actorRol)
    && (cuentaRol !== 'desarrollo' || actorRol === 'desarrollo');
export const puedeOmitirHorario = rol => rol === 'desarrollo';
