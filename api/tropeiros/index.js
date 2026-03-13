import { query } from '../lib/db.js';
import { requireAuth } from '../lib/auth.js';
import { handleError, json, methodNotAllowed } from '../lib/response.js';

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      const rows = await query('SELECT * FROM tropeiros ORDER BY nome ASC');
      return json(res, 200, rows);
    }

    if (req.method === 'POST') {
      requireAuth(req);
      const { nome, telefone, equipe, cidade, estado, descricao, instagram, foto_url } = req.body || {};
      const result = await query(
        'INSERT INTO tropeiros (nome, telefone, equipe, cidade, estado, descricao, instagram, foto_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [nome, telefone, equipe, cidade, estado, descricao, instagram, foto_url],
      );
      return json(res, 201, { id: result.insertId, message: 'Tropeiro criado com sucesso' });
    }

    return methodNotAllowed(res, ['GET', 'POST']);
  } catch (error) {
    return handleError(res, error);
  }
}
