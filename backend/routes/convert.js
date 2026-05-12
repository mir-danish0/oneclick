import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { exec } from 'child_process';
import { promisify } from 'util';
import sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';

import { validateFile } from '../middleware/fileValidation.js';
import { cleanupFiles } from '../utils/cleanupFiles.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const execAsync = promisify(exec);

const router = express.Router();
const TMP_DIR = path.resolve(__dirname, '../tmp');
const PYTHON_DIR = path.resolve(__dirname, '../python');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, TMP_DIR),
  filename: (req, file, cb) => {
    cb(null, `${uuidv4()}${path.extname(file.originalname)}`);
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB
});

// Helper for sending files and cleaning up
const sendAndCleanup = (res, filePath, filesToClean, downloadName) => {
  res.download(filePath, downloadName, (err) => {
    if (err) console.error('Download error:', err);
    cleanupFiles(...filesToClean);
  });
};

// POST /api/convert/word-to-pdf
router.post('/word-to-pdf', 
  upload.single('file'), 
  validateFile(['.docx'], ['application/vnd.openxmlformats-officedocument.wordprocessingml.document']),
  async (req, res) => {
    let inputPath, outputPath;
    try {
      inputPath = req.file.path;
      // LibreOffice will generate a PDF with the same base name
      const baseName = path.parse(inputPath).name;
      outputPath = path.join(TMP_DIR, `${baseName}.pdf`);
      
      const scriptPath = path.join(PYTHON_DIR, 'office_to_pdf.py');
      await execAsync(`python "${scriptPath}" "${inputPath}" "${TMP_DIR}"`);
      
      if (!fs.existsSync(outputPath)) throw new Error('Conversion failed');
      
      sendAndCleanup(res, outputPath, [inputPath, outputPath], 'converted.pdf');
    } catch (err) {
      cleanupFiles(inputPath, outputPath);
      res.status(500).json({ error: err.message });
    }
});

// POST /api/convert/ppt-to-pdf
router.post('/ppt-to-pdf', 
  upload.single('file'), 
  validateFile(['.pptx'], ['application/vnd.openxmlformats-officedocument.presentationml.presentation']),
  async (req, res) => {
    let inputPath, outputPath;
    try {
      inputPath = req.file.path;
      const baseName = path.parse(inputPath).name;
      outputPath = path.join(TMP_DIR, `${baseName}.pdf`);
      
      const scriptPath = path.join(PYTHON_DIR, 'office_to_pdf.py');
      await execAsync(`python "${scriptPath}" "${inputPath}" "${TMP_DIR}"`);
      
      if (!fs.existsSync(outputPath)) throw new Error('Conversion failed');
      
      sendAndCleanup(res, outputPath, [inputPath, outputPath], 'converted.pdf');
    } catch (err) {
      cleanupFiles(inputPath, outputPath);
      res.status(500).json({ error: err.message });
    }
});

// POST /api/convert/excel-to-pdf
router.post('/excel-to-pdf', 
  upload.single('file'), 
  validateFile(['.xlsx'], ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']),
  async (req, res) => {
    let inputPath, outputPath;
    try {
      inputPath = req.file.path;
      const baseName = path.parse(inputPath).name;
      outputPath = path.join(TMP_DIR, `${baseName}.pdf`);
      
      const scriptPath = path.join(PYTHON_DIR, 'office_to_pdf.py');
      await execAsync(`python "${scriptPath}" "${inputPath}" "${TMP_DIR}"`);
      
      if (!fs.existsSync(outputPath)) throw new Error('Conversion failed');
      
      sendAndCleanup(res, outputPath, [inputPath, outputPath], 'converted.pdf');
    } catch (err) {
      cleanupFiles(inputPath, outputPath);
      res.status(500).json({ error: err.message });
    }
});

// POST /api/convert/image-to-pdf
router.post('/image-to-pdf', 
  upload.single('file'), 
  validateFile(['.jpg', '.jpeg', '.png'], ['image/jpeg', 'image/png']),
  async (req, res) => {
    let inputPath, outputPath;
    try {
      inputPath = req.file.path;
      outputPath = path.join(TMP_DIR, `${uuidv4()}.pdf`);
      
      const scriptPath = path.join(PYTHON_DIR, 'image_tools.py');
      await execAsync(`python "${scriptPath}" --action to-pdf --input "${inputPath}" --output "${outputPath}"`);
      
      sendAndCleanup(res, outputPath, [inputPath, outputPath], 'converted.pdf');
    } catch (err) {
      cleanupFiles(inputPath, outputPath);
      res.status(500).json({ error: err.message });
    }
});

// POST /api/convert/pdf-to-word
router.post('/pdf-to-word', 
  upload.single('file'), 
  validateFile(['.pdf'], ['application/pdf']),
  async (req, res) => {
    let inputPath, outputPath;
    try {
      inputPath = req.file.path;
      outputPath = path.join(TMP_DIR, `${uuidv4()}.docx`);
      
      const scriptPath = path.join(PYTHON_DIR, 'pdf_tools.py');
      await execAsync(`python "${scriptPath}" --action to-docx --input "${inputPath}" --output "${outputPath}"`);
      
      sendAndCleanup(res, outputPath, [inputPath, outputPath], 'converted.docx');
    } catch (err) {
      cleanupFiles(inputPath, outputPath);
      res.status(500).json({ error: err.message });
    }
});

// POST /api/convert/pdf-to-jpg
router.post('/pdf-to-jpg', 
  upload.single('file'), 
  validateFile(['.pdf'], ['application/pdf']),
  async (req, res) => {
    let inputPath, outputPath;
    try {
      inputPath = req.file.path;
      outputPath = path.join(TMP_DIR, `${uuidv4()}_out`); // Python script will append .zip or .jpg
      
      const scriptPath = path.join(PYTHON_DIR, 'pdf_tools.py');
      const { stdout } = await execAsync(`python "${scriptPath}" --action to-jpg --input "${inputPath}" --output "${outputPath}"`);
      
      const actualOutput = stdout.trim();
      const ext = path.extname(actualOutput);
      
      sendAndCleanup(res, actualOutput, [inputPath, actualOutput], `converted${ext}`);
    } catch (err) {
      cleanupFiles(inputPath, outputPath);
      res.status(500).json({ error: err.message });
    }
});

// POST /api/convert/jpg-to-png
router.post('/jpg-to-png', 
  upload.single('file'), 
  validateFile(['.jpg', '.jpeg'], ['image/jpeg']),
  async (req, res) => {
    let inputPath, outputPath;
    try {
      inputPath = req.file.path;
      outputPath = path.join(TMP_DIR, `${uuidv4()}.png`);
      
      await sharp(inputPath).png().toFile(outputPath);
      
      sendAndCleanup(res, outputPath, [inputPath, outputPath], 'converted.png');
    } catch (err) {
      cleanupFiles(inputPath, outputPath);
      res.status(500).json({ error: err.message });
    }
});

// POST /api/convert/png-to-jpg
router.post('/png-to-jpg', 
  upload.single('file'), 
  validateFile(['.png'], ['image/png']),
  async (req, res) => {
    let inputPath, outputPath;
    try {
      inputPath = req.file.path;
      outputPath = path.join(TMP_DIR, `${uuidv4()}.jpg`);
      
      // Flatten handles transparency (white bg by default)
      await sharp(inputPath).flatten({ background: { r: 255, g: 255, b: 255 } }).jpeg().toFile(outputPath);
      
      sendAndCleanup(res, outputPath, [inputPath, outputPath], 'converted.jpg');
    } catch (err) {
      cleanupFiles(inputPath, outputPath);
      res.status(500).json({ error: err.message });
    }
});

// POST /api/convert/webp-to-jpg
router.post('/webp-to-jpg', 
  upload.single('file'), 
  validateFile(['.webp'], ['image/webp']),
  async (req, res) => {
    let inputPath, outputPath;
    try {
      inputPath = req.file.path;
      outputPath = path.join(TMP_DIR, `${uuidv4()}.jpg`);
      
      await sharp(inputPath).flatten({ background: { r: 255, g: 255, b: 255 } }).jpeg().toFile(outputPath);
      
      sendAndCleanup(res, outputPath, [inputPath, outputPath], 'converted.jpg');
    } catch (err) {
      cleanupFiles(inputPath, outputPath);
      res.status(500).json({ error: err.message });
    }
});

// POST /api/convert/compress-image
router.post('/compress-image', 
  upload.single('file'), 
  validateFile(['.jpg', '.jpeg', '.png'], ['image/jpeg', 'image/png']),
  async (req, res) => {
    let inputPath, outputPath;
    try {
      inputPath = req.file.path;
      const ext = path.extname(inputPath).toLowerCase();
      outputPath = path.join(TMP_DIR, `${uuidv4()}${ext}`);
      
      const pipeline = sharp(inputPath);
      if (ext === '.png') {
        pipeline.png({ quality: 80, compressionLevel: 9 });
      } else {
        pipeline.jpeg({ quality: 80 });
      }
      await pipeline.toFile(outputPath);
      
      sendAndCleanup(res, outputPath, [inputPath, outputPath], `compressed${ext}`);
    } catch (err) {
      cleanupFiles(inputPath, outputPath);
      res.status(500).json({ error: err.message });
    }
});

// POST /api/convert/resize-image
router.post('/resize-image', 
  upload.single('file'), 
  validateFile(['.jpg', '.jpeg', '.png', '.webp'], ['image/jpeg', 'image/png', 'image/webp']),
  async (req, res) => {
    let inputPath, outputPath;
    try {
      inputPath = req.file.path;
      const ext = path.extname(inputPath).toLowerCase();
      outputPath = path.join(TMP_DIR, `${uuidv4()}${ext}`);
      
      const width = parseInt(req.body.width) || null;
      const height = parseInt(req.body.height) || null;
      
      if (!width && !height) {
        throw new Error('Must provide width or height');
      }
      
      await sharp(inputPath).resize(width, height).toFile(outputPath);
      
      sendAndCleanup(res, outputPath, [inputPath, outputPath], `resized${ext}`);
    } catch (err) {
      cleanupFiles(inputPath, outputPath);
      res.status(500).json({ error: err.message });
    }
});

export default router;
