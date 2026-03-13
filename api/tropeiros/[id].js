import { query } from '../lib/db.js';
import { requireAuth } from '../lib/auth.js';
import { handleError, json, methodNotAllowed } from '../lib/response.js';

export default async function handler(req, res) {
  const { id } = req.query;

  try {
    if (req.method === 'GET') {
      const rows = await query('SELECT * FROM tropeiros WHERE id = ? LIMIT 1', [id]);
      return rows[0] ? json(res, 200, rows[0]) : json(res, 404, { error: 'Tropeiro não encontrado' });
    }

    requireAuth(req);

    if (req.method === 'PUT') {
      const { nome, telefone, equipe, cidade, estado, descricao, instagram, foto_url } = req.body || {};
      await query(
        'UPDATE tropeiros SET nome = ?, telefone = ?, equipe = ?, cidade = ?, estado = ?, descricao = ?, instagram = ?, foto_url = ? WHERE id = ?',
        [nome, telefone, equipe, cidade, estado, descricao, instagram, foto_url, id],
      );
      return json(res, 200, { message: 'Tropeiro atualizado com sucesso' });
    }

    if (req.method === 'DELETE') {
      await query('DELETE FROM tropeiros WHERE id = ?', [id]);
      return json(res, 200, { message: 'Tropeiro removido com sucesso' });
    }

    return methodNotAllowed(res, ['GET', 'PUT', 'DELETE']);
  } catch (error) {
    return handleError(res, error);
  }
}
