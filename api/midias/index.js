import { query } from '../lib/db.js';
import { requireAuth } from '../lib/auth.js';
import { handleError, json, methodNotAllowed } from '../lib/response.js';

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      const rows = await query(
        `SELECT m.*, t.nome AS touro_nome, tr.nome AS tropeiro_nome, e.nome AS evento_nome
         FROM midias m
         LEFT JOIN touros t ON t.id = m.touro_id
         LEFT JOIN tropeiros tr ON tr.id = m.tropeiro_id
         LEFT JOIN eventos e ON e.id = m.evento_id
         ORDER BY m.created_at DESC, m.id DESC`,
      );
      return json(res, 200, rows);
    }

    if (req.method === 'POST') {
      requireAuth(req);
      const { tipo, titulo, categoria, url, public_id, formato, resource_type, touro_id, tropeiro_id, evento_id } = req.body || {};
      const result = await query(
        'INSERT INTO midias (tipo, titulo, categoria, url, public_id, formato, resource_type, touro_id, tropeiro_id, evento_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [tipo, titulo, categoria, url, public_id, formato, resource_type, touro_id || null, tropeiro_id || null, evento_id || null],
      );
      return json(res, 201, { id: result.insertId, message: 'Mídia salva com sucesso' });
    }

    return methodNotAllowed(res, ['GET', 'POST']);
  } catch (error) {
    return handleError(res, error);
  }
}
