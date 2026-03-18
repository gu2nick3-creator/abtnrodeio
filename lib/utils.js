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
  if (Array.isArray(value)) return Number(value[0]);
  if (value === undefined || value === null || value === '') return null;
  return Number(value);
}

function pick(body, keys) {
  const obj = {};
  for (const key of keys) obj[key] = body?.[key] ?? null;
  return obj;
}

function getStatusFromDate(dateValue) {
  if (!dateValue) return 'Em breve';
  const eventDate = new Date(dateValue);
  const now = new Date();
  const diffDays = (eventDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
  if (Number.isNaN(diffDays)) return 'Em breve';
  if (diffDays < -1) return 'Encerrado';
  if (diffDays <= 1) return 'Em andamento';
  return 'Em breve';
}

module.exports = { allowMethods, getId, pick, getStatusFromDate };
