const { query } = require('./lib/db');
const { comparePassword, signToken } = require('./lib/auth');
const { ok, badRequest, unauthorized, serverError } = require('./lib/response');
const { allowMethods } = require('./lib/utils');

module.exports = async function handler(req, res) {
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

    const token = signToken(admin);
    return ok(res, {
      token,
      admin: { id: admin.id, nome: admin.nome, email: admin.email },
    });
  } catch (error) {
    return serverError(res, error);
  }
};
