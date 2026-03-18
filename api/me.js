const { query } = require('../lib/db');
const { verifyToken } = require('../lib/auth');
const { ok, unauthorized, notFound, serverError } = require('../lib/response');
const { allowMethods } = require('../lib/utils');

module.exports = async function handler(req, res) {
  if (!allowMethods(req, res, ['GET'])) return;

  try {
    const payload = verifyToken(req);
    if (!payload) return unauthorized(res);

    if (payload.role === 'admin') {
      const rows = await query('SELECT id, nome, email FROM admins WHERE id = ? LIMIT 1', [payload.id]);
      if (!rows.length) return notFound(res, 'Admin não encontrado');
      return ok(res, { role: 'admin', admin: rows[0] });
    }

    const rows = await query(
      `SELECT tu.id, tu.username, tu.ativo, tu.tropeiro_id,
              t.nome, t.telefone, t.equipe, t.cidade, t.estado, t.descricao, t.instagram, t.facebook, t.foto_url, t.video_url
       FROM tropeiro_usuarios tu
       INNER JOIN tropeiros t ON t.id = tu.tropeiro_id
       WHERE tu.id = ? LIMIT 1`,
      [payload.user_id || payload.id]
    );

    if (!rows.length) return notFound(res, 'Usuário não encontrado');
    return ok(res, { role: 'tropeiro', user: rows[0] });
  } catch (error) {
    return serverError(res, error);
  }
};
