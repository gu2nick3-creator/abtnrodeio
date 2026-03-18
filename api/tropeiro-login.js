const { query } = require('../lib/db');
const { comparePassword, signToken } = require('../lib/auth');
const { ok, badRequest, unauthorized, serverError } = require('../lib/response');
const { allowMethods } = require('../lib/utils');

module.exports = async function handler(req, res) {
  if (!allowMethods(req, res, ['POST'])) return;

  try {
    const { username, senha } = req.body || {};
    if (!username || !senha) return badRequest(res, 'Usuário e senha são obrigatórios');

    const rows = await query(
      `SELECT tu.id, tu.username, tu.senha_hash, tu.ativo, tu.tropeiro_id, t.nome
       FROM tropeiro_usuarios tu
       INNER JOIN tropeiros t ON t.id = tu.tropeiro_id
       WHERE LOWER(tu.username) = LOWER(?) LIMIT 1`,
      [username]
    );

    if (!rows.length) return unauthorized(res, 'Credenciais inválidas');
    const user = rows[0];
    if (!user.ativo) return unauthorized(res, 'Esse acesso está inativo');

    const valid = await comparePassword(senha, user.senha_hash);
    if (!valid) return unauthorized(res, 'Credenciais inválidas');

    const token = signToken({
      id: user.id,
      user_id: user.id,
      username: user.username,
      nome: user.nome,
      tropeiro_id: user.tropeiro_id,
      role: 'tropeiro',
    });

    return ok(res, {
      token,
      user: {
        id: user.id,
        username: user.username,
        tropeiro_id: user.tropeiro_id,
        nome: user.nome,
      },
    });
  } catch (error) {
    return serverError(res, error);
  }
};
