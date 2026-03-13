import bcrypt from 'bcryptjs';
import { query } from './lib/db.js';
import { handleError, json, methodNotAllowed } from './lib/response.js';
import { setAuthCookie, signToken } from './lib/auth.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return methodNotAllowed(res, ['POST']);

  try {
    const { email, senha } = req.body || {};

    if (!email || !senha) {
      return json(res, 400, { error: 'E-mail e senha são obrigatórios' });
    }

    const admins = await query('SELECT id, nome, email, senha_hash FROM admins WHERE email = ? LIMIT 1', [email]);
    const admin = admins[0];

    if (!admin) {
      return json(res, 401, { error: 'Credenciais inválidas' });
    }

    const validPassword = await bcrypt.compare(senha, admin.senha_hash);
    if (!validPassword) {
      return json(res, 401, { error: 'Credenciais inválidas' });
    }

    const token = signToken({ id: admin.id, email: admin.email, nome: admin.nome });
    setAuthCookie(res, token);

    return json(res, 200, {
      message: 'Login realizado com sucesso',
      admin: { id: admin.id, nome: admin.nome, email: admin.email },
      token,
    });
  } catch (error) {
    return handleError(res, error);
  }
}
