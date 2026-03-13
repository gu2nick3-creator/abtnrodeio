const { query } = require('./lib/db');
const { verifyToken } = require('./lib/auth');
const { ok, created, badRequest, unauthorized, notFound, serverError } = require('./lib/response');
const { allowMethods, getId, pick } = require('./lib/utils');

module.exports = async function handler(req, res) {
  if (!allowMethods(req, res, ['GET', 'POST', 'PUT', 'DELETE'])) return;

  try {
    if (req.method === 'GET') {
      const id = getId(req);
      if (id) {
        const rows = await query('SELECT * FROM tropeiros WHERE id = ? LIMIT 1', [id]);
        if (!rows.length) return notFound(res);
        return ok(res, rows[0]);
      }

      const rows = await query('SELECT * FROM tropeiros ORDER BY created_at DESC');
      return ok(res, rows);
    }

    const payload = verifyToken(req);
    if (!payload) return unauthorized(res);

    if (req.method === 'POST') {
      const data = pick(req.body, ['nome', 'telefone', 'equipe', 'cidade', 'estado', 'descricao', 'instagram', 'foto_url']);
      if (!data.nome) return badRequest(res, 'Nome é obrigatório');

      const result = await query(
        `INSERT INTO tropeiros (nome, telefone, equipe, cidade, estado, descricao, instagram, foto_url)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [data.nome, data.telefone, data.equipe, data.cidade, data.estado, data.descricao, data.instagram, data.foto_url]
      );

      return created(res, { id: result.insertId, ...data });
    }

    const id = getId(req);
    if (!id) return badRequest(res, 'ID é obrigatório');

    if (req.method === 'PUT') {
      const data = pick(req.body, ['nome', 'telefone', 'equipe', 'cidade', 'estado', 'descricao', 'instagram', 'foto_url']);
      if (!data.nome) return badRequest(res, 'Nome é obrigatório');

      const result = await query(
        `UPDATE tropeiros
         SET nome = ?, telefone = ?, equipe = ?, cidade = ?, estado = ?, descricao = ?, instagram = ?, foto_url = ?
         WHERE id = ?`,
        [data.nome, data.telefone, data.equipe, data.cidade, data.estado, data.descricao, data.instagram, data.foto_url, id]
      );

      if (!result.affectedRows) return notFound(res);
      return ok(res, { id, ...data });
    }

    const result = await query('DELETE FROM tropeiros WHERE id = ?', [id]);
    if (!result.affectedRows) return notFound(res);
    return ok(res, { success: true });
  } catch (error) {
    return serverError(res, error);
  }
};
