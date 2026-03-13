import { query } from '../lib/db.js';
import { requireAuth } from '../lib/auth.js';
import { handleError, json, methodNotAllowed } from '../lib/response.js';

export default async function handler(req, res) {
  const { id } = req.query;

  try {
    if (req.method === 'GET') {
      const rows = await query('SELECT * FROM avaliacoes WHERE id = ? LIMIT 1', [id]);
      return rows[0] ? json(res, 200, rows[0]) : json(res, 404, { error: 'Avaliação não encontrada' });
    }

    requireAuth(req);

    if (req.method === 'PUT') {
      const { touro_id, tropeiro_id, evento_id, nota, comentarios, data_avaliacao } = req.body || {};
      await query(
        'UPDATE avaliacoes SET touro_id = ?, tropeiro_id = ?, evento_id = ?, nota = ?, comentarios = ?, data_avaliacao = ? WHERE id = ?',
        [touro_id, tropeiro_id || null, evento_id || null, nota, comentarios, data_avaliacao || null, id],
      );
      return json(res, 200, { message: 'Avaliação atualizada com sucesso' });
    }

    if (req.method === 'DELETE') {
      await query('DELETE FROM avaliacoes WHERE id = ?', [id]);
      return json(res, 200, { message: 'Avaliação removida com sucesso' });
    }

    return methodNotAllowed(res, ['GET', 'PUT', 'DELETE']);
  } catch (error) {
    return handleError(res, error);
  }
}
