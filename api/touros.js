import { query } from '../lib/db.js';
import { requireRole } from '../lib/auth.js';
import { ok, created, badRequest, unauthorized, notFound, serverError } from '../lib/response.js';
import { allowMethods, getId } from '../lib/utils.js';

function toNumber(value, fallback = 0) {
  if (value === undefined || value === null || value === '') return fallback;
  const n = Number(value);
  return Number.isNaN(n) ? fallback : n;
}

function toNullableNumber(value) {
  if (value === undefined || value === null || value === '') return null;
  const n = Number(value);
  return Number.isNaN(n) ? null : n;
}

function toText(value, fallback = '') {
  if (value === undefined || value === null) return fallback;
  return String(value).trim();
}

function normalizeTourosBody(body = {}) {
  return {
    nome: toText(body.nome ?? body.name),
    idade: toNumber(body.idade ?? body.age, 0),
    peso: toNumber(body.peso ?? body.weight, 0),
    nota: toNumber(body.nota ?? body.score, 0),
    historico: toText(body.historico ?? body.history),
    observacoes: toText(body.observacoes ?? body.companhia ?? body.company),
    foto_url: toText(body.foto_url ?? body.image ?? body.foto),
    tropeiro_id: toNullableNumber(body.tropeiro_id ?? body.tropeiro ?? body.tropeiroId),
    cidade: toText(body.cidade ?? body.city),
    eventos: toNumber(body.eventos ?? body.events, 0),
    vitorias: toNumber(body.vitorias ?? body.wins, 0),
  };
}

async function validateTropeiro(tropeiroId) {
  if (!tropeiroId) return true;
  const rows = await query('SELECT id FROM tropeiros WHERE id = ? LIMIT 1', [tropeiroId]);
  return rows.length > 0;
}

export default async function handler(req, res) {
  if (!allowMethods(req, res, ['GET', 'POST', 'PUT', 'DELETE'])) return;

  try {
    if (req.method === 'GET') {
      const id = getId(req);

      if (id) {
        const rows = await query(
          `
          SELECT t.*, tr.nome AS tropeiro_nome
          FROM touros t
          LEFT JOIN tropeiros tr ON tr.id = t.tropeiro_id
          WHERE t.id = ?
          LIMIT 1
          `,
          [id]
        );

        if (!rows.length) return notFound(res);
        return ok(res, rows[0]);
      }

      const rows = await query(`
        SELECT t.*, tr.nome AS tropeiro_nome
        FROM touros t
        LEFT JOIN tropeiros tr ON tr.id = t.tropeiro_id
        ORDER BY t.created_at DESC, t.id DESC
      `);

      return ok(res, rows);
    }

    const payload = requireRole(req, 'admin');
    if (!payload) return unauthorized(res);

    if (req.method === 'POST') {
      const data = normalizeTourosBody(req.body);

      console.log('POST /api/touros body normalizado:', data);

      if (!data.nome) {
        return badRequest(res, 'Nome é obrigatório');
      }

      const tropeiroExiste = await validateTropeiro(data.tropeiro_id);
      if (!tropeiroExiste) {
        return badRequest(res, 'Tropeiro selecionado não existe');
      }

      const result = await query(
        `
        INSERT INTO touros (
          nome,
          idade,
          peso,
          nota,
          historico,
          observacoes,
          foto_url,
          tropeiro_id,
          cidade,
          eventos,
          vitorias
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
        [
          data.nome,
          data.idade,
          data.peso,
          data.nota,
          data.historico,
          data.observacoes,
          data.foto_url,
          data.tropeiro_id,
          data.cidade,
          data.eventos,
          data.vitorias,
        ]
      );

      return created(res, {
        id: result.insertId,
        ...data,
      });
    }

    const id = getId(req);
    if (!id) return badRequest(res, 'ID é obrigatório');

    if (req.method === 'PUT') {
      const data = normalizeTourosBody(req.body);

      console.log('PUT /api/touros body normalizado:', { id, ...data });

      if (!data.nome) {
        return badRequest(res, 'Nome é obrigatório');
      }

      const tropeiroExiste = await validateTropeiro(data.tropeiro_id);
      if (!tropeiroExiste) {
        return badRequest(res, 'Tropeiro selecionado não existe');
      }

      const result = await query(
        `
        UPDATE touros
        SET
          nome = ?,
          idade = ?,
          peso = ?,
          nota = ?,
          historico = ?,
          observacoes = ?,
          foto_url = ?,
          tropeiro_id = ?,
          cidade = ?,
          eventos = ?,
          vitorias = ?
        WHERE id = ?
        `,
        [
          data.nome,
          data.idade,
          data.peso,
          data.nota,
          data.historico,
          data.observacoes,
          data.foto_url,
          data.tropeiro_id,
          data.cidade,
          data.eventos,
          data.vitorias,
          id,
        ]
      );

      if (!result.affectedRows) return notFound(res);

      return ok(res, {
        id: Number(id),
        ...data,
      });
    }

    if (req.method === 'DELETE') {
      const result = await query('DELETE FROM touros WHERE id = ?', [id]);

      if (!result.affectedRows) return notFound(res);

      return ok(res, { success: true });
    }
  } catch (error) {
    console.error('Erro real em /api/touros:', error);
    return serverError(res, error);
  }
}
