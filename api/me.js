const { query } = require('./lib/db');
const { verifyToken } = require('./lib/auth');
const { ok, unauthorized, notFound, serverError } = require('./lib/response');
const { allowMethods } = require('./lib/utils');

module.exports = async function handler(req, res) {
  if (!allowMethods(req, res, ['GET'])) return;

  try {
    const payload = verifyToken(req);
    if (!payload) return unauthorized(res);

    const rows = await query('SELECT id, nome, email FROM admins WHERE id = ? LIMIT 1', [payload.id]);
    if (!rows.length) return notFound(res, 'Admin não encontrado');

    return ok(res, { admin: rows[0] });
  } catch (error) {
    return serverError(res, error);
  }
};
