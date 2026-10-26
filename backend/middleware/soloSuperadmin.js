export default function soloSuperadmin(req, res, next) {
    if (req.usuario?.rol === 'superadmin') return next();
    return res.status(403).json({ msg: 'Acceso exclusivo para superadmin' });
}
