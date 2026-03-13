export function json(res, statusCode, data) {
  res.status(statusCode).json(data);
}

export function methodNotAllowed(res, methods = []) {
  res.setHeader('Allow', methods);
  return json(res, 405, { error: 'Método não permitido' });
}

export function handleError(res, error) {
  const statusCode = error.statusCode || 500;
  return json(res, statusCode, {
    error: error.message || 'Erro interno do servidor',
  });
}
