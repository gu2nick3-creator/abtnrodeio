const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

function signToken(admin) {
  return jwt.sign(
    { id: admin.id, email: admin.email, nome: admin.nome },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
}

function parseBearer(req) {
  const auth = req.headers.authorization || '';
  if (!auth.startsWith('Bearer ')) return null;
  return auth.slice(7);
}

function verifyToken(req) {
  const token = parseBearer(req);
  if (!token) return null;
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return null;
  }
}

async function hashPassword(password) {
  return bcrypt.hash(password, 10);
}

async function comparePassword(password, hash) {
  return bcrypt.compare(password, hash);
}

module.exports = { signToken, verifyToken, hashPassword, comparePassword };
