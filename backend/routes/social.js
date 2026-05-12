import express from 'express';
import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';

const execAsync = promisify(exec);
const router = express.Router();

// GET /api/social/info?url=<url>
router.get('/info', async (req, res) => {
  const { url } = req.query;
  if (!url) return res.status(400).json({ error: 'URL is required' });

  try {
    // -j: dump json, --no-playlist: only single video
    const { stdout } = await execAsync(`yt-dlp -j --no-playlist "${url}"`);
    const info = JSON.parse(stdout);

    // Filter and simplify formats for the frontend
    const formats = info.formats
      .filter(f => f.vcodec !== 'none' || f.acodec !== 'none')
      .map(f => ({
        formatId: f.format_id,
        extension: f.ext,
        resolution: f.resolution || (f.vcodec === 'none' ? 'Audio' : 'Unknown'),
        note: f.format_note || '',
        filesize: f.filesize || f.filesize_approx || 0,
        hasVideo: f.vcodec !== 'none',
        hasAudio: f.acodec !== 'none'
      }))
      .reverse(); // Usually better qualities are later

    res.json({
      title: info.title,
      thumbnail: info.thumbnail,
      duration: info.duration,
      uploader: info.uploader,
      formats: formats.slice(0, 15) // Limit to top 15 formats
    });
  } catch (err) {
    console.error('yt-dlp info error:', err);
    res.status(500).json({ error: 'Could not fetch video info' });
  }
});

// GET /api/social/download?url=<url>&formatId=<id>
router.get('/download', async (req, res) => {
  const { url, formatId } = req.query;
  if (!url) return res.status(400).json({ error: 'URL is required' });

  try {
    // Get info first to get the title for filename
    const { stdout: infoStr } = await execAsync(`yt-dlp -j --no-playlist "${url}"`);
    const info = JSON.parse(infoStr);
    const safeTitle = info.title.replace(/[^\w\s-]/g, '').trim();

    // Set headers for download
    res.setHeader('Content-Disposition', `attachment; filename="${safeTitle}.mp4"`);
    res.setHeader('Content-Type', 'video/mp4');

    // Spawn yt-dlp to stream to stdout
    // Using -o - tells yt-dlp to output to stdout
    const format = formatId ? `-f "${formatId}+bestaudio/best"` : '-f "best"';
    const ytProcess = exec(`yt-dlp ${format} -o - "${url}"`);

    ytProcess.stdout.pipe(res);

    ytProcess.on('error', (err) => {
      console.error('yt-dlp stream error:', err);
      if (!res.headersSent) res.status(500).json({ error: 'Download failed' });
    });

  } catch (err) {
    console.error('yt-dlp download error:', err);
    res.status(500).json({ error: 'Download failed' });
  }
});

export default router;
