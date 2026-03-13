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
        const rows = await query('SELECT * FROM avaliacoes WHERE id = ? LIMIT 1', [id]);
        if (!rows.length) return notFound(res);
        return ok(res, rows[0]);
      }

      const rows = await query(
        `SELECT a.*, t.nome AS touro_nome, tr.nome AS tropeiro_nome, e.nome AS evento_nome
         FROM avaliacoes a
         LEFT JOIN touros t ON t.id = a.touro_id
         LEFT JOIN tropeiros tr ON tr.id = a.tropeiro_id
         LEFT JOIN eventos e ON e.id = a.evento_id
         ORDER BY a.created_at DESC`
      );
      return ok(res, rows);
    }

    const payload = verifyToken(req);
    if (!payload) return unauthorized(res);

    if (req.method === 'POST') {
      const data = pick(req.body, ['touro_id', 'tropeiro_id', 'evento_id', 'nota', 'comentarios', 'data_avaliacao']);
      if (!data.touro_id) return badRequest(res, 'Touro é obrigatório');

      const result = await query(
        `INSERT INTO avaliacoes (touro_id, tropeiro_id, evento_id, nota, comentarios, data_avaliacao)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [data.touro_id, data.tropeiro_id, data.evento_id, data.nota, data.comentarios, data.data_avaliacao]
      );

      return created(res, { id: result.insertId, ...data });
    }

    const id = getId(req);
    if (!id) return badRequest(res, 'ID é obrigatório');

    if (req.method === 'PUT') {
      const data = pick(req.body, ['touro_id', 'tropeiro_id', 'evento_id', 'nota', 'comentarios', 'data_avaliacao']);
      if (!data.touro_id) return badRequest(res, 'Touro é obrigatório');

      const result = await query(
        `UPDATE avaliacoes
         SET touro_id = ?, tropeiro_id = ?, evento_id = ?, nota = ?, comentarios = ?, data_avaliacao = ?
         WHERE id = ?`,
        [data.touro_id, data.tropeiro_id, data.evento_id, data.nota, data.comentarios, data.data_avaliacao, id]
      );

      if (!result.affectedRows) return notFound(res);
      return ok(res, { id, ...data });
    }

    const result = await query('DELETE FROM avaliacoes WHERE id = ?', [id]);
    if (!result.affectedRows) return notFound(res);
    return ok(res, { success: true });
  } catch (error) {
    return serverError(res, error);
  }
};
