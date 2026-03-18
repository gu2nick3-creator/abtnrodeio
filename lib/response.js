function send(res, status, data) {
  res.status(status).json(data);
}

export function ok(res, data = {}) {
  return send(res, 200, data);
}

export function created(res, data = {}) {
  return send(res, 201, data);
}

export function badRequest(res, message = 'Requisição inválida') {
  return send(res, 400, { error: message });
}

export function unauthorized(res, message = 'Não autorizado') {
  return send(res, 401, { error: message });
}

export function notFound(res, message = 'Registro não encontrado') {
  return send(res, 404, { error: message });
}

export function serverError(res, error) {
  console.error(error);
  return send(res, 500, { error: 'Erro interno do servidor' });
}
