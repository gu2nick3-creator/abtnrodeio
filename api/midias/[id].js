import { query } from '../lib/db.js';
import { requireAuth } from '../lib/auth.js';
import { handleError, json, methodNotAllowed } from '../lib/response.js';

export default async function handler(req, res) {
  const { id } = req.query;

  try {
    if (req.method === 'GET') {
      const rows = await query('SELECT * FROM midias WHERE id = ? LIMIT 1', [id]);
      return rows[0] ? json(res, 200, rows[0]) : json(res, 404, { error: 'Mídia não encontrada' });
    }

    requireAuth(req);

    if (req.method === 'PUT') {
      const { tipo, titulo, categoria, url, public_id, formato, resource_type, touro_id, tropeiro_id, evento_id } = req.body || {};
      await query(
        'UPDATE midias SET tipo = ?, titulo = ?, categoria = ?, url = ?, public_id = ?, formato = ?, resource_type = ?, touro_id = ?, tropeiro_id = ?, evento_id = ? WHERE id = ?',
        [tipo, titulo, categoria, url, public_id, formato, resource_type, touro_id || null, tropeiro_id || null, evento_id || null, id],
      );
      return json(res, 200, { message: 'Mídia atualizada com sucesso' });
    }

    if (req.method === 'DELETE') {
      await query('DELETE FROM midias WHERE id = ?', [id]);
      return json(res, 200, { message: 'Mídia removida com sucesso' });
    }

    return methodNotAllowed(res, ['GET', 'PUT', 'DELETE']);
  } catch (error) {
    return handleError(res, error);
  }
}
