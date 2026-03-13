import cloudinary from '../lib/cloudinary.js';
import { requireAuth } from '../lib/auth.js';
import { handleError, json, methodNotAllowed } from '../lib/response.js';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '25mb',
    },
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') return methodNotAllowed(res, ['POST']);

  try {
    requireAuth(req);

    const { file, folder = 'abtn/uploads', resource_type } = req.body || {};

    if (!file) {
      return json(res, 400, { error: 'Arquivo em base64 é obrigatório' });
    }

    const upload = await cloudinary.uploader.upload(file, {
      folder,
      resource_type: resource_type || 'auto',
    });

    return json(res, 200, {
      url: upload.secure_url,
      public_id: upload.public_id,
      formato: upload.format,
      resource_type: upload.resource_type,
    });
  } catch (error) {
    return handleError(res, error);
  }
}
