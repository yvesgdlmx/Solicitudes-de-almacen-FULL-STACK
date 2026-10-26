import Usuario from "./Usuario.js";
import Solicitud from "./Solicitud.js";
import Suministro from "./Suministro.js";
import SuministroParcial from "./SuministroParcial.js";
import SeguimientoSurtido, { EventoSurtido } from './SeguimientoSurtido.js';

Solicitud.hasOne(SeguimientoSurtido, { foreignKey: 'SolicitudId', as: 'seguimiento', onDelete: 'CASCADE' });
SeguimientoSurtido.belongsTo(Solicitud, { foreignKey: 'SolicitudId', as: 'solicitud' });
SeguimientoSurtido.belongsTo(Usuario, { foreignKey: 'responsableId', as: 'responsable' });
Solicitud.hasMany(EventoSurtido, { foreignKey: 'SolicitudId', as: 'eventosSurtido', onDelete: 'CASCADE' });
EventoSurtido.belongsTo(Usuario, { foreignKey: 'actorId', as: 'actor' });

Solicitud.belongsTo(Usuario, { foreignKey: 'solicitante', as: "usuario" });
Usuario.hasMany(Solicitud, { foreignKey: 'solicitante', as: "solicitudes" });

Solicitud.hasMany(Suministro, { foreignKey: 'SolicitudId', as: "suministros" });
Suministro.belongsTo(Solicitud, { foreignKey: 'SolicitudId', as: "solicitud" });

Solicitud.hasMany(SuministroParcial, { foreignKey: 'SolicitudId', as: "suministrosParciales" });
SuministroParcial.belongsTo(Solicitud, { foreignKey: 'SolicitudId', as: "solicitud" });


export {Usuario, Solicitud, Suministro, SuministroParcial, SeguimientoSurtido, EventoSurtido};
