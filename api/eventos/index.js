import { query } from '../lib/db.js';
import { requireAuth } from '../lib/auth.js';
import { handleError, json, methodNotAllowed } from '../lib/response.js';

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      const rows = await query('SELECT * FROM eventos ORDER BY data_evento DESC, nome ASC');
      return json(res, 200, rows);
    }

    if (req.method === 'POST') {
      requireAuth(req);
      const { nome, data_evento, local_evento, cidade, estado, descricao, capa_url } = req.body || {};
      const result = await query(
        'INSERT INTO eventos (nome, data_evento, local_evento, cidade, estado, descricao, capa_url) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [nome, data_evento || null, local_evento, cidade, estado, descricao, capa_url],
      );
      return json(res, 201, { id: result.insertId, message: 'Evento criado com sucesso' });
    }

    return methodNotAllowed(res, ['GET', 'POST']);
  } catch (error) {
    return handleError(res, error);
  }
}
