import { test } from 'node:test';
import assert from 'node:assert/strict';
import soloSuperadmin from '../middleware/soloSuperadmin.js';

test('superadmin puede acceder a cumplimiento', () => {
    let autorizado = false;
    soloSuperadmin({ usuario: { rol: 'superadmin' } }, {}, () => { autorizado = true; });
    assert.equal(autorizado, true);
});

for (const rol of ['user', 'admin', 'desarrollo', 'otro', undefined]) {
    test(`cumplimiento rechaza el rol ${rol ?? 'ausente'} con 403`, () => {
        let codigo;
        let mensaje;
        const res = {
            status(valor) { codigo = valor; return this; },
            json(valor) { mensaje = valor.msg; },
        };
        soloSuperadmin({ usuario: rol ? { rol } : undefined }, res, () => assert.fail('Acceso no permitido'));
        assert.equal(codigo, 403);
        assert.equal(mensaje, 'Acceso exclusivo para superadmin');
    });
}
