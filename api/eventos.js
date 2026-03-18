import { query } from '../lib/db.js';
import { requireRole } from '../lib/auth.js';
import { ok, created, badRequest, unauthorized, notFound, serverError } from '../lib/response.js';
import { allowMethods, getId, pick, getStatusFromDate } from '../lib/utils.js';

export default async function handler(req, res) {
  if (!allowMethods(req, res, ['GET', 'POST', 'PUT', 'DELETE'])) return;

  try {
    if (req.method === 'GET') {
      const id = getId(req);
      if (id) {
        const rows = await query('SELECT * FROM eventos WHERE id = ? LIMIT 1', [id]);
        if (!rows.length) return notFound(res);
        return ok(res, rows[0]);
      }
      const rows = await query('SELECT * FROM eventos ORDER BY data_evento DESC, created_at DESC, id DESC');
      return ok(res, rows);
    }

    const payload = requireRole(req, 'admin');
    if (!payload) return unauthorized(res);

    if (req.method === 'POST') {
      const data = pick(req.body, ['nome', 'data_evento', 'data_fim', 'local_evento', 'cidade', 'estado', 'descricao', 'capa_url', 'qtd_touros', 'status']);
      if (!data.nome) return badRequest(res, 'Nome é obrigatório');
      const status = data.status || getStatusFromDate(data.data_evento);
      const result = await query(
        `INSERT INTO eventos (nome, data_evento, data_fim, local_evento, cidade, estado, descricao, capa_url, qtd_touros, status)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [data.nome, data.data_evento, data.data_fim, data.local_evento, data.cidade, data.estado, data.descricao, data.capa_url, data.qtd_touros, status]
      );
      return created(res, { id: result.insertId, ...data, status });
    }

    const id = getId(req);
    if (!id) return badRequest(res, 'ID é obrigatório');

    if (req.method === 'PUT') {
      const data = pick(req.body, ['nome', 'data_evento', 'data_fim', 'local_evento', 'cidade', 'estado', 'descricao', 'capa_url', 'qtd_touros', 'status']);
      if (!data.nome) return badRequest(res, 'Nome é obrigatório');
      const status = data.status || getStatusFromDate(data.data_evento);
      const result = await query(
        `UPDATE eventos
         SET nome = ?, data_evento = ?, data_fim = ?, local_evento = ?, cidade = ?, estado = ?, descricao = ?, capa_url = ?, qtd_touros = ?, status = ?
         WHERE id = ?`,
        [data.nome, data.data_evento, data.data_fim, data.local_evento, data.cidade, data.estado, data.descricao, data.capa_url, data.qtd_touros, status, id]
      );
      if (!result.affectedRows) return notFound(res);
      return ok(res, { id, ...data, status });
    }

    const result = await query('DELETE FROM eventos WHERE id = ?', [id]);
    if (!result.affectedRows) return notFound(res);
    return ok(res, { success: true });
  } catch (error) {
    return serverError(res, error);
  }
}
