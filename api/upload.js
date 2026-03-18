const cloudinary = require('../lib/cloudinary');
const { verifyToken } = require('../lib/auth');
const { ok, badRequest, unauthorized, serverError } = require('../lib/response');
const { allowMethods } = require('../lib/utils');

module.exports = async function handler(req, res) {
  if (!allowMethods(req, res, ['POST'])) return;

  try {
    const payload = verifyToken(req);
    if (!payload) return unauthorized(res);

    const { file, folder, tipo } = req.body || {};
    if (!file) return badRequest(res, 'Arquivo em base64 é obrigatório');

    const resourceType = tipo === 'video' ? 'video' : 'image';
    const result = await cloudinary.uploader.upload(file, {
      folder: folder || `abtn/${resourceType === 'video' ? 'videos' : 'fotos'}`,
      resource_type: resourceType,
    });

    return ok(res, {
      url: result.secure_url,
      public_id: result.public_id,
      formato: result.format,
      resource_type: result.resource_type,
      bytes: result.bytes,
      width: result.width || null,
      height: result.height || null,
      duration: result.duration || null,
    });
  } catch (error) {
    return serverError(res, error);
  }
};
