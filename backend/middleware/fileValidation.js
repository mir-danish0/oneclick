import path from 'path';

/**
 * Validates the file extension and MIME type.
 * @param {string[]} allowedExtensions - Array of allowed extensions (e.g. ['.jpg', '.png']).
 * @param {string[]} allowedMimeTypes - Array of allowed MIME types.
 */
export function validateFile(allowedExtensions, allowedMimeTypes) {
  return (req, res, next) => {
    if (!req.file && (!req.files || req.files.length === 0)) {
      return res.status(400).json({ error: 'No file uploaded.' });
    }

    const files = req.file ? [req.file] : req.files;

    for (const file of files) {
      const ext = path.extname(file.originalname).toLowerCase();
      if (!allowedExtensions.includes(ext) || !allowedMimeTypes.includes(file.mimetype)) {
        return res.status(400).json({ error: `Invalid file type. Expected: ${allowedExtensions.join(', ')}` });
      }
    }

    next();
  };
}
