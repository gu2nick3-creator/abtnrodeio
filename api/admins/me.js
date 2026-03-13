import { query } from '../lib/db.js';
import { requireAuth } from '../lib/auth.js';
import { handleError, json, methodNotAllowed } from '../lib/response.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') return methodNotAllowed(res, ['GET']);

  try {
    const session = requireAuth(req);
    const admins = await query('SELECT id, nome, email FROM admins WHERE id = ? LIMIT 1', [session.id]);

    if (!admins[0]) return json(res, 404, { error: 'Administrador não encontrado' });

    return json(res, 200, admins[0]);
  } catch (error) {
    return handleError(res, error);
  }
}
