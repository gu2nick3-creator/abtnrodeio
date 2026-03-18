const { query } = require('../lib/db');
const { requireRole } = require('../lib/auth');
const { ok, created, badRequest, unauthorized, notFound, serverError } = require('../lib/response');
const { allowMethods, getId, pick } = require('../lib/utils');

module.exports = async function handler(req, res) {
  if (!allowMethods(req, res, ['GET', 'POST', 'PUT', 'DELETE'])) return;

  try {
    if (req.method === 'GET') {
      const id = getId(req);
      if (id) {
        const rows = await query('SELECT * FROM touros WHERE id = ? LIMIT 1', [id]);
        if (!rows.length) return notFound(res);
        return ok(res, rows[0]);
      }
      const rows = await query(`SELECT t.*, tr.nome AS tropeiro_nome FROM touros t LEFT JOIN tropeiros tr ON tr.id = t.tropeiro_id ORDER BY t.created_at DESC, t.id DESC`);
      return ok(res, rows);
    }

    const payload = requireRole(req, 'admin');
    if (!payload) return unauthorized(res);

    if (req.method === 'POST') {
      const data = pick(req.body, ['nome', 'idade', 'peso', 'nota', 'historico', 'observacoes', 'foto_url', 'tropeiro_id', 'cidade', 'eventos', 'vitorias']);
      if (!data.nome) return badRequest(res, 'Nome é obrigatório');
      const result = await query(
        `INSERT INTO touros (nome, idade, peso, nota, historico, observacoes, foto_url, tropeiro_id, cidade, eventos, vitorias)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [data.nome, data.idade, data.peso, data.nota, data.historico, data.observacoes, data.foto_url, data.tropeiro_id, data.cidade, data.eventos, data.vitorias]
      );
      return created(res, { id: result.insertId, ...data });
    }

    const id = getId(req);
    if (!id) return badRequest(res, 'ID é obrigatório');

    if (req.method === 'PUT') {
      const data = pick(req.body, ['nome', 'idade', 'peso', 'nota', 'historico', 'observacoes', 'foto_url', 'tropeiro_id', 'cidade', 'eventos', 'vitorias']);
      if (!data.nome) return badRequest(res, 'Nome é obrigatório');
      const result = await query(
        `UPDATE touros
         SET nome = ?, idade = ?, peso = ?, nota = ?, historico = ?, observacoes = ?, foto_url = ?, tropeiro_id = ?, cidade = ?, eventos = ?, vitorias = ?
         WHERE id = ?`,
        [data.nome, data.idade, data.peso, data.nota, data.historico, data.observacoes, data.foto_url, data.tropeiro_id, data.cidade, data.eventos, data.vitorias, id]
      );
      if (!result.affectedRows) return notFound(res);
      return ok(res, { id, ...data });
    }

    const result = await query('DELETE FROM touros WHERE id = ?', [id]);
    if (!result.affectedRows) return notFound(res);
    return ok(res, { success: true });
  } catch (error) {
    return serverError(res, error);
  }
};
