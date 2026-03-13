function allowMethods(req, res, methods) {
  if (!methods.includes(req.method)) {
    res.setHeader('Allow', methods);
    res.status(405).json({ error: 'Método não permitido' });
    return false;
  }
  return true;
}

function getId(req) {
  const value = req.query.id;
  if (Array.isArray(value)) return value[0];
  if (value === undefined || value === null || value === '') return null;
  return Number(value);
}

function pick(body, keys) {
  const obj = {};
  for (const key of keys) obj[key] = body?.[key] ?? null;
  return obj;
}

module.exports = { allowMethods, getId, pick };
