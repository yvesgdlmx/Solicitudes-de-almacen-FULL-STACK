import Usuario from "./Usuario.js";
import Solicitud from "./Solicitud.js";
import Suministro from "./Suministro.js";
import SuministroParcial from "./SuministroParcial.js";

Solicitud.belongsTo(Usuario, { foreignKey: 'solicitante', as: "usuario" });
Usuario.hasMany(Solicitud, { foreignKey: 'solicitante', as: "solicitudes" });

Solicitud.hasMany(Suministro, { foreignKey: 'SolicitudId', as: "suministros" });
Suministro.belongsTo(Solicitud, { foreignKey: 'SolicitudId', as: "solicitud" });

Solicitud.hasMany(SuministroParcial, { foreignKey: 'SolicitudId', as: "suministrosParciales" });
SuministroParcial.belongsTo(Solicitud, { foreignKey: 'SolicitudId', as: "solicitud" });


export {Usuario, Solicitud, Suministro, SuministroParcial};