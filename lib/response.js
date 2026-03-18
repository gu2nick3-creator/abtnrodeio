function send(res, status, data) {
  res.status(status).json(data);
}

function ok(res, data = {}) {
  return send(res, 200, data);
}

function created(res, data = {}) {
  return send(res, 201, data);
}

function badRequest(res, message = 'Requisição inválida') {
  return send(res, 400, { error: message });
}

function unauthorized(res, message = 'Não autorizado') {
  return send(res, 401, { error: message });
}

function notFound(res, message = 'Registro não encontrado') {
  return send(res, 404, { error: message });
}

function serverError(res, error) {
  console.error(error);
  return send(res, 500, { error: 'Erro interno do servidor' });
}

module.exports = { ok, created, badRequest, unauthorized, notFound, serverError };
