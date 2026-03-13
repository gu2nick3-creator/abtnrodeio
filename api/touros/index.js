import { query } from '../lib/db.js';
import { requireAuth } from '../lib/auth.js';
import { handleError, json, methodNotAllowed } from '../lib/response.js';

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      const rows = await query(
        `SELECT t.*, tr.nome AS tropeiro_nome
         FROM touros t
         LEFT JOIN tropeiros tr ON tr.id = t.tropeiro_id
         ORDER BY t.nome ASC`,
      );
      return json(res, 200, rows);
    }

    if (req.method === 'POST') {
      requireAuth(req);
      const { nome, idade, peso, historico, observacoes, foto_url, tropeiro_id } = req.body || {};
      const result = await query(
        'INSERT INTO touros (nome, idade, peso, historico, observacoes, foto_url, tropeiro_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [nome, idade, peso, historico, observacoes, foto_url, tropeiro_id || null],
      );
      return json(res, 201, { id: result.insertId, message: 'Touro criado com sucesso' });
    }

    return methodNotAllowed(res, ['GET', 'POST']);
  } catch (error) {
    return handleError(res, error);
  }
}
