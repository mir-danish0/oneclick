import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { exec } from 'child_process';
import { promisify } from 'util';
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
  limits: { fileSize: 50 * 1024 * 1024 }
});

const sendAndCleanup = (res, filePath, filesToClean, downloadName) => {
  res.download(filePath, downloadName, (err) => {
    if (err) console.error('Download error:', err);
    cleanupFiles(...filesToClean);
  });
};

// POST /api/pdf/merge
router.post('/merge', 
  upload.array('files', 10), 
  validateFile(['.pdf'], ['application/pdf']),
  async (req, res) => {
    let inputPaths = [];
    let outputPath;
    try {
      if (!req.files || req.files.length < 2) {
        throw new Error('Must provide at least 2 PDF files to merge.');
      }
      inputPaths = req.files.map(f => f.path);
      outputPath = path.join(TMP_DIR, `${uuidv4()}_merged.pdf`);
      
      const scriptPath = path.join(PYTHON_DIR, 'pdf_tools.py');
      const inputArgs = inputPaths.map(p => `"${p}"`).join(' ');
      
      await execAsync(`python "${scriptPath}" --action merge --output "${outputPath}" --inputs ${inputArgs}`);
      
      sendAndCleanup(res, outputPath, [...inputPaths, outputPath], 'merged.pdf');
    } catch (err) {
      cleanupFiles(...inputPaths, outputPath);
      res.status(500).json({ error: err.message });
    }
});

// POST /api/pdf/split
router.post('/split', 
  upload.single('file'), 
  validateFile(['.pdf'], ['application/pdf']),
  async (req, res) => {
    let inputPath, outputPath;
    try {
      inputPath = req.file.path;
      outputPath = path.join(TMP_DIR, `${uuidv4()}_split.zip`);
      const pages = req.body.pages;
      
      if (!pages) throw new Error('Must provide pages parameter');
      
      const scriptPath = path.join(PYTHON_DIR, 'pdf_tools.py');
      await execAsync(`python "${scriptPath}" --action split --input "${inputPath}" --output "${outputPath}" --pages "${pages}"`);
      
      sendAndCleanup(res, outputPath, [inputPath, outputPath], 'split_pages.zip');
    } catch (err) {
      cleanupFiles(inputPath, outputPath);
      res.status(500).json({ error: err.message });
    }
});

// POST /api/pdf/compress
router.post('/compress', 
  upload.single('file'), 
  validateFile(['.pdf'], ['application/pdf']),
  async (req, res) => {
    let inputPath, outputPath;
    try {
      inputPath = req.file.path;
      outputPath = path.join(TMP_DIR, `${uuidv4()}_compressed.pdf`);
      
      const scriptPath = path.join(PYTHON_DIR, 'pdf_tools.py');
      await execAsync(`python "${scriptPath}" --action compress --input "${inputPath}" --output "${outputPath}"`);
      
      sendAndCleanup(res, outputPath, [inputPath, outputPath], 'compressed.pdf');
    } catch (err) {
      cleanupFiles(inputPath, outputPath);
      res.status(500).json({ error: err.message });
    }
});

// POST /api/pdf/pdf-to-png
router.post('/pdf-to-png', 
  upload.single('file'), 
  validateFile(['.pdf'], ['application/pdf']),
  async (req, res) => {
    let inputPath, outputPath;
    try {
      inputPath = req.file.path;
      outputPath = path.join(TMP_DIR, `${uuidv4()}_pngs.zip`);
      
      const scriptPath = path.join(PYTHON_DIR, 'pdf_tools.py');
      const { stdout } = await execAsync(`python "${scriptPath}" --action to-png --input "${inputPath}" --output "${outputPath}"`);
      
      const actualOutput = stdout.trim();
      const ext = path.extname(actualOutput);
      
      sendAndCleanup(res, actualOutput, [inputPath, actualOutput], `converted${ext}`);
    } catch (err) {
      cleanupFiles(inputPath, outputPath);
      res.status(500).json({ error: err.message });
    }
});

// POST /api/pdf/protect
router.post('/protect', 
  upload.single('file'), 
  validateFile(['.pdf'], ['application/pdf']),
  async (req, res) => {
    let inputPath, outputPath;
    try {
      inputPath = req.file.path;
      outputPath = path.join(TMP_DIR, `${uuidv4()}_protected.pdf`);
      const password = req.body.password;
      
      if (!password) throw new Error('Password required');
      
      const scriptPath = path.join(PYTHON_DIR, 'pdf_tools.py');
      await execAsync(`python "${scriptPath}" --action protect --input "${inputPath}" --output "${outputPath}" --password "${password}"`);
      
      sendAndCleanup(res, outputPath, [inputPath, outputPath], 'protected.pdf');
    } catch (err) {
      cleanupFiles(inputPath, outputPath);
      res.status(500).json({ error: err.message });
    }
});

// POST /api/pdf/unlock
router.post('/unlock', 
  upload.single('file'), 
  validateFile(['.pdf'], ['application/pdf']),
  async (req, res) => {
    let inputPath, outputPath;
    try {
      inputPath = req.file.path;
      outputPath = path.join(TMP_DIR, `${uuidv4()}_unlocked.pdf`);
      const password = req.body.password;
      
      if (!password) throw new Error('Password required');
      
      const scriptPath = path.join(PYTHON_DIR, 'pdf_tools.py');
      await execAsync(`python "${scriptPath}" --action unlock --input "${inputPath}" --output "${outputPath}" --password "${password}"`);
      
      sendAndCleanup(res, outputPath, [inputPath, outputPath], 'unlocked.pdf');
    } catch (err) {
      cleanupFiles(inputPath, outputPath);
      res.status(500).json({ error: err.message });
    }
});

// POST /api/pdf/watermark
router.post('/watermark', 
  upload.single('file'), 
  validateFile(['.pdf'], ['application/pdf']),
  async (req, res) => {
    let inputPath, outputPath;
    try {
      inputPath = req.file.path;
      outputPath = path.join(TMP_DIR, `${uuidv4()}_watermarked.pdf`);
      const text = req.body.text;
      
      if (!text) throw new Error('Watermark text required');
      
      const scriptPath = path.join(PYTHON_DIR, 'pdf_tools.py');
      await execAsync(`python "${scriptPath}" --action watermark --input "${inputPath}" --output "${outputPath}" --text "${text}"`);
      
      sendAndCleanup(res, outputPath, [inputPath, outputPath], 'watermarked.pdf');
    } catch (err) {
      cleanupFiles(inputPath, outputPath);
      res.status(500).json({ error: err.message });
    }
});

export default router;
