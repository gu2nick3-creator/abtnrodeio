import { query } from '../lib/db.js';
import { requireRole } from '../lib/auth.js';
import { ok, created, badRequest, unauthorized, notFound, serverError } from '../lib/response.js';
import { allowMethods, getId, pick } from '../lib/utils.js';

export default async function handler(req, res) {
  if (!allowMethods(req, res, ['GET', 'POST', 'PUT', 'DELETE'])) return;

  try {
    if (req.method === 'GET') {
      const id = getId(req);
      if (id) {
        const rows = await query('SELECT * FROM avaliacoes WHERE id = ? LIMIT 1', [id]);
        if (!rows.length) return notFound(res);
        return ok(res, rows[0]);
      }
      const rows = await query(`SELECT a.*, t.nome AS touro_nome, tr.nome AS tropeiro_nome, e.nome AS evento_nome
         FROM avaliacoes a
         LEFT JOIN touros t ON t.id = a.touro_id
         LEFT JOIN tropeiros tr ON tr.id = a.tropeiro_id
         LEFT JOIN eventos e ON e.id = a.evento_id
         ORDER BY a.created_at DESC, a.id DESC`);
      return ok(res, rows);
    }

    const payload = requireRole(req, 'admin');
    if (!payload) return unauthorized(res);

    if (req.method === 'POST') {
      const data = pick(req.body, ['nome', 'foto_url', 'nota', 'comentarios', 'data_avaliacao', 'touro_id', 'tropeiro_id', 'evento_id']);
      if (!data.nome) return badRequest(res, 'Nome é obrigatório');
      const result = await query(
        `INSERT INTO avaliacoes (nome, foto_url, nota, comentarios, data_avaliacao, touro_id, tropeiro_id, evento_id)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [data.nome, data.foto_url, data.nota, data.comentarios, data.data_avaliacao, data.touro_id, data.tropeiro_id, data.evento_id]
      );
      return created(res, { id: result.insertId, ...data });
    }

    const id = getId(req);
    if (!id) return badRequest(res, 'ID é obrigatório');

    if (req.method === 'PUT') {
      const data = pick(req.body, ['nome', 'foto_url', 'nota', 'comentarios', 'data_avaliacao', 'touro_id', 'tropeiro_id', 'evento_id']);
      if (!data.nome) return badRequest(res, 'Nome é obrigatório');
      const result = await query(
        `UPDATE avaliacoes
         SET nome = ?, foto_url = ?, nota = ?, comentarios = ?, data_avaliacao = ?, touro_id = ?, tropeiro_id = ?, evento_id = ?
         WHERE id = ?`,
        [data.nome, data.foto_url, data.nota, data.comentarios, data.data_avaliacao, data.touro_id, data.tropeiro_id, data.evento_id, id]
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
}
