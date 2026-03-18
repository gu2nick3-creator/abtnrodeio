import { query } from '../lib/db.js';
import { comparePassword, signToken } from '../lib/auth.js';
import { ok, badRequest, unauthorized, serverError } from '../lib/response.js';
import { allowMethods } from '../lib/utils.js';

export default async function handler(req, res) {
  if (!allowMethods(req, res, ['POST'])) return;

  try {
    const { email, senha } = req.body || {};
    if (!email || !senha) return badRequest(res, 'E-mail e senha são obrigatórios');

    const rows = await query(
      'SELECT id, nome, email, senha_hash FROM admins WHERE email = ? LIMIT 1',
      [email]
    );

    if (!rows.length) return unauthorized(res, 'Credenciais inválidas');

    const admin = rows[0];
    const valid = await comparePassword(senha, admin.senha_hash);
    if (!valid) return unauthorized(res, 'Credenciais inválidas');

    const token = signToken({ ...admin, role: 'admin' });
    return ok(res, {
      token,
      admin: { id: admin.id, nome: admin.nome, email: admin.email },
    });
  } catch (error) {
    return serverError(res, error);
  }
}
