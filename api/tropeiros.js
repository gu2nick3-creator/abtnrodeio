import { query } from '../lib/db.js';
import { requireRole } from '../lib/auth.js';
import { ok, created, badRequest, unauthorized, notFound, serverError } from '../lib/response.js';
import { allowMethods, getId, pick } from '../lib/utils.js';

export default async function handler(req, res) {
  if (!allowMethods(req, res, ['GET', 'POST', 'PUT', 'DELETE'])) return;

  try {
    if (req.method === 'GET') {
      const id = getId(req);
      if (id) {
        const rows = await query('SELECT * FROM tropeiros WHERE id = ? LIMIT 1', [id]);
        if (!rows.length) return notFound(res);
        return ok(res, rows[0]);
      }
      const rows = await query('SELECT * FROM tropeiros ORDER BY created_at DESC, id DESC');
      return ok(res, rows);
    }

    const payload = requireRole(req, 'admin');
    if (!payload) return unauthorized(res);

    if (req.method === 'POST') {
      const data = pick(req.body, [
        'nome',
        'telefone',
        'equipe',
        'cidade',
        'estado',
        'descricao',
        'instagram',
        'facebook',
        'foto_url',
        'video_url',
        'image_fit'
      ]);

      if (!data.nome) return badRequest(res, 'Nome é obrigatório');

      const result = await query(
        `INSERT INTO tropeiros (nome, telefone, equipe, cidade, estado, descricao, instagram, facebook, foto_url, video_url, image_fit)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          data.nome,
          data.telefone,
          data.equipe,
          data.cidade,
          data.estado,
          data.descricao,
          data.instagram,
          data.facebook,
          data.foto_url,
          data.video_url,
          data.image_fit || 'cover'
        ]
      );

      return created(res, { id: result.insertId, ...data, image_fit: data.image_fit || 'cover' });
    }

    const id = getId(req);
    if (!id) return badRequest(res, 'ID é obrigatório');

    if (req.method === 'PUT') {
      const data = pick(req.body, [
        'nome',
        'telefone',
        'equipe',
        'cidade',
        'estado',
        'descricao',
        'instagram',
        'facebook',
        'foto_url',
        'video_url',
        'image_fit'
      ]);

      if (!data.nome) return badRequest(res, 'Nome é obrigatório');

      const result = await query(
        `UPDATE tropeiros
         SET nome = ?, telefone = ?, equipe = ?, cidade = ?, estado = ?, descricao = ?, instagram = ?, facebook = ?, foto_url = ?, video_url = ?, image_fit = ?
         WHERE id = ?`,
        [
          data.nome,
          data.telefone,
          data.equipe,
          data.cidade,
          data.estado,
          data.descricao,
          data.instagram,
          data.facebook,
          data.foto_url,
          data.video_url,
          data.image_fit || 'cover',
          id
        ]
      );

      if (!result.affectedRows) return notFound(res);
      return ok(res, { id, ...data, image_fit: data.image_fit || 'cover' });
    }

    const result = await query('DELETE FROM tropeiros WHERE id = ?', [id]);
    if (!result.affectedRows) return notFound(res);
    return ok(res, { success: true });
  } catch (error) {
    return serverError(res, error);
  }
}
