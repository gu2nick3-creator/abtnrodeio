import { query } from '../lib/db.js';
import { requireRole, hashPassword } from '../lib/auth.js';
import { ok, created, badRequest, unauthorized, notFound, serverError } from '../lib/response.js';
import { allowMethods, getId } from '../lib/utils.js';

export default async function handler(req, res) {
  if (!allowMethods(req, res, ['GET', 'POST', 'PUT', 'DELETE'])) return;

  try {
    const payload = requireRole(req, 'admin');
    if (!payload) return unauthorized(res);

    if (req.method === 'GET') {
      const id = getId(req);
      if (id) {
        const rows = await query('SELECT id, tropeiro_id, username, ativo FROM tropeiro_usuarios WHERE id = ? LIMIT 1', [id]);
        if (!rows.length) return notFound(res);
        return ok(res, rows[0]);
      }
      const rows = await query('SELECT id, tropeiro_id, username, ativo FROM tropeiro_usuarios ORDER BY id DESC');
      return ok(res, rows);
    }

    if (req.method === 'POST') {
      const { tropeiro_id, username, password, ativo } = req.body || {};
      if (!tropeiro_id || !username || !password) return badRequest(res, 'Tropeiro, usuário e senha são obrigatórios');
      const exists = await query('SELECT id FROM tropeiro_usuarios WHERE LOWER(username) = LOWER(?) LIMIT 1', [username]);
      if (exists.length) return badRequest(res, 'Esse usuário já existe');
      const senha_hash = await hashPassword(password);
      const result = await query(
        'INSERT INTO tropeiro_usuarios (tropeiro_id, username, senha_hash, ativo) VALUES (?, ?, ?, ?)',
        [tropeiro_id, username, senha_hash, ativo ? 1 : 0]
      );
      return created(res, { id: result.insertId, tropeiro_id, username, ativo: !!ativo });
    }

    const id = getId(req);
    if (!id) return badRequest(res, 'ID é obrigatório');

    if (req.method === 'PUT') {
      const { tropeiro_id, username, password, ativo } = req.body || {};
      if (!tropeiro_id || !username) return badRequest(res, 'Tropeiro e usuário são obrigatórios');
      const duplicate = await query('SELECT id FROM tropeiro_usuarios WHERE LOWER(username) = LOWER(?) AND id <> ? LIMIT 1', [username, id]);
      if (duplicate.length) return badRequest(res, 'Esse usuário já existe');
      if (password) {
        const senha_hash = await hashPassword(password);
        const result = await query(
          'UPDATE tropeiro_usuarios SET tropeiro_id = ?, username = ?, senha_hash = ?, ativo = ? WHERE id = ?',
          [tropeiro_id, username, senha_hash, ativo ? 1 : 0, id]
        );
        if (!result.affectedRows) return notFound(res);
      } else {
        const result = await query(
          'UPDATE tropeiro_usuarios SET tropeiro_id = ?, username = ?, ativo = ? WHERE id = ?',
          [tropeiro_id, username, ativo ? 1 : 0, id]
        );
        if (!result.affectedRows) return notFound(res);
      }
      return ok(res, { id, tropeiro_id, username, ativo: !!ativo });
    }

    const result = await query('DELETE FROM tropeiro_usuarios WHERE id = ?', [id]);
    if (!result.affectedRows) return notFound(res);
    return ok(res, { success: true });
  } catch (error) {
    return serverError(res, error);
  }
}
