import jwt from 'jsonwebtoken';

const TOKEN_COOKIE = 'abtn_token';

export function signToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token) {
  return jwt.verify(token, process.env.JWT_SECRET);
}

export function parseCookies(req) {
  const header = req.headers.cookie || '';
  return Object.fromEntries(
    header
      .split(';')
      .map((part) => part.trim())
      .filter(Boolean)
      .map((part) => {
        const index = part.indexOf('=');
        return [part.slice(0, index), decodeURIComponent(part.slice(index + 1))];
      }),
  );
}

export function getTokenFromRequest(req) {
  const cookies = parseCookies(req);
  const authHeader = req.headers.authorization || '';

  if (cookies[TOKEN_COOKIE]) return cookies[TOKEN_COOKIE];
  if (authHeader.startsWith('Bearer ')) return authHeader.slice(7);
  return null;
}

export function setAuthCookie(res, token) {
  res.setHeader(
    'Set-Cookie',
    `${TOKEN_COOKIE}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=604800; Secure`,
  );
}

export function clearAuthCookie(res) {
  res.setHeader('Set-Cookie', `${TOKEN_COOKIE}=; Path=/; HttpOnly; Max-Age=0; SameSite=Lax; Secure`);
}

export function requireAuth(req) {
  const token = getTokenFromRequest(req);
  if (!token) {
    const error = new Error('Não autenticado');
    error.statusCode = 401;
    throw error;
  }
  return verifyToken(token);
}
