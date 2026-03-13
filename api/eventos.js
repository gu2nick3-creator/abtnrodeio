const { query } = require('./lib/db');
const { verifyToken } = require('./lib/auth');
const { ok, created, badRequest, unauthorized, notFound, serverError } = require('./lib/response');
const { allowMethods, getId, pick } = require('./lib/utils');

module.exports = async function handler(req, res) {
  if (!allowMethods(req, res, ['GET', 'POST', 'PUT', 'DELETE'])) return;

  try {
    if (req.method === 'GET') {
      const id = getId(req);
      if (id) {
        const rows = await query('SELECT * FROM eventos WHERE id = ? LIMIT 1', [id]);
        if (!rows.length) return notFound(res);
        return ok(res, rows[0]);
      }

      const rows = await query('SELECT * FROM eventos ORDER BY data_evento DESC, created_at DESC');
      return ok(res, rows);
    }

    const payload = verifyToken(req);
    if (!payload) return unauthorized(res);

    if (req.method === 'POST') {
      const data = pick(req.body, ['nome', 'data_evento', 'local_evento', 'cidade', 'estado', 'descricao', 'capa_url']);
      if (!data.nome) return badRequest(res, 'Nome é obrigatório');

      const result = await query(
        `INSERT INTO eventos (nome, data_evento, local_evento, cidade, estado, descricao, capa_url)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [data.nome, data.data_evento, data.local_evento, data.cidade, data.estado, data.descricao, data.capa_url]
      );

      return created(res, { id: result.insertId, ...data });
    }

    const id = getId(req);
    if (!id) return badRequest(res, 'ID é obrigatório');

    if (req.method === 'PUT') {
      const data = pick(req.body, ['nome', 'data_evento', 'local_evento', 'cidade', 'estado', 'descricao', 'capa_url']);
      if (!data.nome) return badRequest(res, 'Nome é obrigatório');

      const result = await query(
        `UPDATE eventos
         SET nome = ?, data_evento = ?, local_evento = ?, cidade = ?, estado = ?, descricao = ?, capa_url = ?
         WHERE id = ?`,
        [data.nome, data.data_evento, data.local_evento, data.cidade, data.estado, data.descricao, data.capa_url, id]
      );

      if (!result.affectedRows) return notFound(res);
      return ok(res, { id, ...data });
    }

    const result = await query('DELETE FROM eventos WHERE id = ?', [id]);
    if (!result.affectedRows) return notFound(res);
    return ok(res, { success: true });
  } catch (error) {
    return serverError(res, error);
  }
};
