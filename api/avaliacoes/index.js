import { query } from '../lib/db.js';
import { requireAuth } from '../lib/auth.js';
import { handleError, json, methodNotAllowed } from '../lib/response.js';

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      const rows = await query(
        `SELECT a.*, t.nome AS touro_nome, tr.nome AS tropeiro_nome, e.nome AS evento_nome
         FROM avaliacoes a
         INNER JOIN touros t ON t.id = a.touro_id
         LEFT JOIN tropeiros tr ON tr.id = a.tropeiro_id
         LEFT JOIN eventos e ON e.id = a.evento_id
         ORDER BY a.data_avaliacao DESC, a.id DESC`,
      );
      return json(res, 200, rows);
    }

    if (req.method === 'POST') {
      requireAuth(req);
      const { touro_id, tropeiro_id, evento_id, nota, comentarios, data_avaliacao } = req.body || {};
      const result = await query(
        'INSERT INTO avaliacoes (touro_id, tropeiro_id, evento_id, nota, comentarios, data_avaliacao) VALUES (?, ?, ?, ?, ?, ?)',
        [touro_id, tropeiro_id || null, evento_id || null, nota, comentarios, data_avaliacao || null],
      );
      return json(res, 201, { id: result.insertId, message: 'Avaliação criada com sucesso' });
    }

    return methodNotAllowed(res, ['GET', 'POST']);
  } catch (error) {
    return handleError(res, error);
  }
}
