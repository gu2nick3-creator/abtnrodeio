const { query } = require('../lib/db');
const { requireRole } = require('../lib/auth');
const { ok, created, badRequest, unauthorized, notFound, serverError } = require('../lib/response');
const { allowMethods, getId, pick } = require('../lib/utils');

module.exports = async function handler(req, res) {
  if (!allowMethods(req, res, ['GET', 'POST', 'PUT', 'DELETE'])) return;

  try {
    if (req.method === 'GET') {
      const id = getId(req);
      if (id) {
        const rows = await query('SELECT * FROM midias WHERE id = ? LIMIT 1', [id]);
        if (!rows.length) return notFound(res);
        return ok(res, rows[0]);
      }
      const rows = await query(`SELECT m.*, t.nome AS touro_nome, tr.nome AS tropeiro_nome, e.nome AS evento_nome
         FROM midias m
         LEFT JOIN touros t ON t.id = m.touro_id
         LEFT JOIN tropeiros tr ON tr.id = m.tropeiro_id
         LEFT JOIN eventos e ON e.id = m.evento_id
         ORDER BY m.created_at DESC, m.id DESC`);
      return ok(res, rows);
    }

    const payload = requireRole(req, 'admin');
    if (!payload) return unauthorized(res);

    if (req.method === 'POST') {
      const data = pick(req.body, ['tipo', 'titulo', 'categoria', 'url', 'public_id', 'formato', 'resource_type', 'touro_id', 'tropeiro_id', 'evento_id']);
      if (!data.tipo || !data.titulo || !data.url) return badRequest(res, 'Tipo, título e URL são obrigatórios');
      const result = await query(
        `INSERT INTO midias (tipo, titulo, categoria, url, public_id, formato, resource_type, touro_id, tropeiro_id, evento_id)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [data.tipo, data.titulo, data.categoria, data.url, data.public_id, data.formato, data.resource_type, data.touro_id, data.tropeiro_id, data.evento_id]
      );
      return created(res, { id: result.insertId, ...data });
    }

    const id = getId(req);
    if (!id) return badRequest(res, 'ID é obrigatório');

    if (req.method === 'PUT') {
      const data = pick(req.body, ['tipo', 'titulo', 'categoria', 'url', 'public_id', 'formato', 'resource_type', 'touro_id', 'tropeiro_id', 'evento_id']);
      if (!data.tipo || !data.titulo || !data.url) return badRequest(res, 'Tipo, título e URL são obrigatórios');
      const result = await query(
        `UPDATE midias
         SET tipo = ?, titulo = ?, categoria = ?, url = ?, public_id = ?, formato = ?, resource_type = ?, touro_id = ?, tropeiro_id = ?, evento_id = ?
         WHERE id = ?`,
        [data.tipo, data.titulo, data.categoria, data.url, data.public_id, data.formato, data.resource_type, data.touro_id, data.tropeiro_id, data.evento_id, id]
      );
      if (!result.affectedRows) return notFound(res);
      return ok(res, { id, ...data });
    }

    const result = await query('DELETE FROM midias WHERE id = ?', [id]);
    if (!result.affectedRows) return notFound(res);
    return ok(res, { success: true });
  } catch (error) {
    return serverError(res, error);
  }
};
