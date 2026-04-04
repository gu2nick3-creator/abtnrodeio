import { query } from '../lib/db.js';
import { ok, serverError } from '../lib/response.js';
import { allowMethods, getStatusFromDate } from '../lib/utils.js';

export default async function handler(req, res) {
  if (!allowMethods(req, res, ['GET'])) return;

  try {
    const [tropeiros, touros, eventos, galeria, users, avaliacoes] = await Promise.all([
      query('SELECT * FROM tropeiros ORDER BY created_at DESC, id DESC'),
      query(`SELECT t.*, tr.nome AS tropeiro_nome, tr.cidade AS tropeiro_cidade, tr.equipe AS tropeiro_equipe
             FROM touros t
             LEFT JOIN tropeiros tr ON tr.id = t.tropeiro_id
             ORDER BY t.created_at DESC, t.id DESC`),
      query('SELECT * FROM eventos ORDER BY data_evento DESC, created_at DESC, id DESC'),
      query(`SELECT m.*, t.nome AS touro_nome, tr.nome AS tropeiro_nome, e.nome AS evento_nome
             FROM midias m
             LEFT JOIN touros t ON t.id = m.touro_id
             LEFT JOIN tropeiros tr ON tr.id = m.tropeiro_id
             LEFT JOIN eventos e ON e.id = m.evento_id
             ORDER BY m.created_at DESC, m.id DESC`),
      query('SELECT id, tropeiro_id, username, ativo FROM tropeiro_usuarios ORDER BY id DESC'),
      query(`SELECT a.*, t.nome AS touro_nome, tr.nome AS tropeiro_nome, e.nome AS evento_nome
             FROM avaliacoes a
             LEFT JOIN touros t ON t.id = a.touro_id
             LEFT JOIN tropeiros tr ON tr.id = a.tropeiro_id
             LEFT JOIN eventos e ON e.id = a.evento_id
             ORDER BY a.created_at DESC, a.id DESC`),
    ]);

    return ok(res, {
      tropeiros: tropeiros.map((item) => ({
        id: item.id,
        name: item.nome,
        phone: item.telefone || '',
        team: item.equipe || '',
        description: item.descricao || '',
        bullCount: touros.filter((bull) => bull.tropeiro_id === item.id).length,
        city: item.cidade || '',
        image: item.foto_url || '',
        instagram: item.instagram || '',
        facebook: item.facebook || '',
        state: item.estado || '',
        video: item.video_url || '',
        image_fit: item.image_fit || 'cover',
      })),
      bulls: touros.map((item) => ({
        id: item.id,
        name: item.nome,
        age: Number(item.idade || 0),
        weight: Number(item.peso || 0),
        score: Number(item.nota || 0),
        tropeiro: item.tropeiro_nome || '',
        tropeiroId: item.tropeiro_id || 0,
        company: item.tropeiro_equipe || '',
        city: item.cidade || item.tropeiro_cidade || '',
        image: item.foto_url || '',
        events: Number(item.eventos || 0),
        wins: Number(item.vitorias || 0),
        history: [],
      })),
      events: eventos.map((item) => ({
        id: item.id,
        name: item.nome,
        date: item.data_evento ? new Date(item.data_evento).toISOString().slice(0, 10) : '',
        dateEnd: item.data_fim
          ? new Date(item.data_fim).toISOString().slice(0, 10)
          : (item.data_evento ? new Date(item.data_evento).toISOString().slice(0, 10) : ''),
        location: item.local_evento || '',
        city: item.cidade || '',
        status: item.status || getStatusFromDate(item.data_evento),
        image: item.capa_url || '',
        description: item.descricao || '',
        bullCount: Number(item.qtd_touros || 0),
      })),
      gallery: galeria.map((item) => ({
        id: item.id,
        type: item.tipo === 'video' ? 'video' : 'photo',
        url: item.url,
        title: item.titulo,
        category: item.categoria || '',
        bull: item.touro_nome || undefined,
        event: item.evento_nome || undefined,
        tropeiro: item.tropeiro_nome || undefined,
      })),
      users: users.map((item) => ({
        id: item.id,
        tropeiroId: item.tropeiro_id,
        username: item.username,
        password: '',
        active: Boolean(item.ativo),
      })),
      evaluations: avaliacoes,
    });
  } catch (error) {
    return serverError(res, error);
  }
}
