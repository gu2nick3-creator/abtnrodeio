import { query } from '../lib/db.js';
import { requireAuth } from '../lib/auth.js';
import { handleError, json, methodNotAllowed } from '../lib/response.js';

export default async function handler(req, res) {
  const { id } = req.query;

  try {
    if (req.method === 'GET') {
      const rows = await query('SELECT * FROM eventos WHERE id = ? LIMIT 1', [id]);
      return rows[0] ? json(res, 200, rows[0]) : json(res, 404, { error: 'Evento não encontrado' });
    }

    requireAuth(req);

    if (req.method === 'PUT') {
      const { nome, data_evento, local_evento, cidade, estado, descricao, capa_url } = req.body || {};
      await query(
        'UPDATE eventos SET nome = ?, data_evento = ?, local_evento = ?, cidade = ?, estado = ?, descricao = ?, capa_url = ? WHERE id = ?',
        [nome, data_evento || null, local_evento, cidade, estado, descricao, capa_url, id],
      );
      return json(res, 200, { message: 'Evento atualizado com sucesso' });
    }

    if (req.method === 'DELETE') {
      await query('DELETE FROM eventos WHERE id = ?', [id]);
      return json(res, 200, { message: 'Evento removido com sucesso' });
    }

    return methodNotAllowed(res, ['GET', 'PUT', 'DELETE']);
  } catch (error) {
    return handleError(res, error);
  }
}
