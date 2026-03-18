import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

export function signToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email || null,
      username: user.username || null,
      nome: user.nome,
      role: user.role || 'admin',
      tropeiro_id: user.tropeiro_id || null,
      user_id: user.user_id || user.id,
    },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
}

function parseBearer(req) {
  const auth = req.headers.authorization || '';
  if (!auth.startsWith('Bearer ')) return null;
  return auth.slice(7);
}

export function verifyToken(req) {
  const token = parseBearer(req);
  if (!token) return null;
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return null;
  }
}

export function requireRole(req, role) {
  const payload = verifyToken(req);
  if (!payload || payload.role !== role) return null;
  return payload;
}

export async function hashPassword(password) {
  return bcrypt.hash(password, 10);
}

export async function comparePassword(password, hash) {
  return bcrypt.compare(password, hash);
}
