import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';

import { globalLimiter } from './middleware/rateLimit.js';
import { startPeriodicCleanup } from './utils/cleanupFiles.js';

import convertRoutes from './routes/convert.js';
import pdfRoutes from './routes/pdf.js';
import downloadRoutes from './routes/download.js';
import socialRoutes from './routes/social.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
const TMP_DIR = path.resolve(__dirname, process.env.TMP_DIR || './tmp');

// Ensure tmp directory exists
if (!fs.existsSync(TMP_DIR)) {
  fs.mkdirSync(TMP_DIR, { recursive: true });
}

// Middleware
app.use(cors({ origin: [FRONTEND_URL, /\.yourproductiondomain\.com$/] }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(globalLimiter);

// Health check
app.get('/', (req, res) => {
  res.json({ status: 'active', message: 'OneClick API is running' });
});

// Routes
app.use('/api/convert', convertRoutes);
app.use('/api/pdf', pdfRoutes);
app.use('/api/download', downloadRoutes);
app.use('/api/social', socialRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message || 'Something went wrong on the server.' });
});

const execAsync = promisify(exec);

// Startup Checks
async function startupChecks() {
  console.log('--- Startup Checks ---');
  try {
    const { stdout: pythonVer } = await execAsync('python --version');
    console.log(`[Python]: ${pythonVer.trim()}`);
  } catch (e) {
    console.log('[Python]: Not found or error');
  }

  try {
    const libreCmd = process.platform === 'win32' ? 'soffice' : 'libreoffice';
    const { stdout: libreVer } = await execAsync(`${libreCmd} --version`);
    console.log(`[LibreOffice]: ${libreVer.trim()}`);
  } catch (e) {
    console.log('[LibreOffice]: Not found or error');
  }

  try {
    const { stdout: ytdlpVer } = await execAsync('yt-dlp --version');
    console.log(`[yt-dlp]: Installed (version ${ytdlpVer.trim()})`);
  } catch (e) {
    console.log('[yt-dlp]: Not found or error');
  }
  console.log('----------------------');
}

// Start periodic cleanup of tmp folder
startPeriodicCleanup(TMP_DIR);

app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  await startupChecks();
});
