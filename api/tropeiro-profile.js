import { query } from '../lib/db.js';
import { requireRole, hashPassword } from '../lib/auth.js';
import { ok, badRequest, unauthorized, notFound, serverError } from '../lib/response.js';
import { allowMethods, pick } from '../lib/utils.js';

export default async function handler(req, res) {
  if (!allowMethods(req, res, ['GET', 'PUT'])) return;

  try {
    const payload = requireRole(req, 'tropeiro');
    if (!payload) return unauthorized(res);

    if (req.method === 'GET') {
      const rows = await query(
        `SELECT tu.id AS user_id, tu.username, tu.ativo, tu.tropeiro_id,
                t.*
         FROM tropeiro_usuarios tu
         INNER JOIN tropeiros t ON t.id = tu.tropeiro_id
         WHERE tu.id = ? LIMIT 1`,
        [payload.user_id || payload.id]
      );
      if (!rows.length) return notFound(res);
      return ok(res, rows[0]);
    }

    const data = pick(req.body, ['nome', 'telefone', 'equipe', 'cidade', 'estado', 'descricao', 'instagram', 'facebook', 'foto_url', 'video_url', 'username', 'password']);
    if (!data.nome) return badRequest(res, 'Nome é obrigatório');

    const userRows = await query('SELECT id, tropeiro_id FROM tropeiro_usuarios WHERE id = ? LIMIT 1', [payload.user_id || payload.id]);
    if (!userRows.length) return notFound(res, 'Usuário não encontrado');
    const user = userRows[0];

    if (data.username) {
      const duplicate = await query('SELECT id FROM tropeiro_usuarios WHERE LOWER(username) = LOWER(?) AND id <> ? LIMIT 1', [data.username, user.id]);
      if (duplicate.length) return badRequest(res, 'Esse usuário já existe');
    }

    await query(
      `UPDATE tropeiros
       SET nome = ?, telefone = ?, equipe = ?, cidade = ?, estado = ?, descricao = ?, instagram = ?, facebook = ?, foto_url = ?, video_url = ?
       WHERE id = ?`,
      [data.nome, data.telefone, data.equipe, data.cidade, data.estado, data.descricao, data.instagram, data.facebook, data.foto_url, data.video_url, user.tropeiro_id]
    );

    if (data.password) {
      const senha_hash = await hashPassword(data.password);
      await query('UPDATE tropeiro_usuarios SET username = ?, senha_hash = ? WHERE id = ?', [data.username, senha_hash, user.id]);
    } else if (data.username) {
      await query('UPDATE tropeiro_usuarios SET username = ? WHERE id = ?', [data.username, user.id]);
    }

    return ok(res, { success: true });
  } catch (error) {
    return serverError(res, error);
  }
}
