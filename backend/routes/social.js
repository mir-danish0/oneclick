import express from 'express';
import { fetchVideoInfo, spawnVideoDownload } from '../utils/ytdlp.js';

const router = express.Router();

// GET /api/social/info?url=<url>
router.get('/info', async (req, res) => {
  const { url } = req.query;
  if (!url) return res.status(400).json({ error: 'URL is required' });

  try {
    const info = await fetchVideoInfo(url);

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
    const message = err.message.includes('Rate limited') 
      ? err.message 
      : 'Could not fetch video info. The platform might be blocking the request.';
    res.status(500).json({ error: message });
  }
});

// GET /api/social/download?url=<url>&formatId=<id>
router.get('/download', async (req, res) => {
  const { url, formatId } = req.query;
  if (!url) return res.status(400).json({ error: 'URL is required' });

  try {
    // Get info first to get the title for filename
    const info = await fetchVideoInfo(url);
    const safeTitle = info.title.replace(/[^\w\s-]/g, '').trim();

    // Set headers for download
    res.setHeader('Content-Disposition', `attachment; filename="${safeTitle}.mp4"`);
    res.setHeader('Content-Type', 'video/mp4');

    // Spawn yt-dlp to stream to stdout
    const ytProcess = spawnVideoDownload(url, formatId);

    ytProcess.stdout.pipe(res);

    ytProcess.on('error', (err) => {
      console.error('yt-dlp stream error:', err);
      if (!res.headersSent) res.status(500).json({ error: 'Download failed' });
    });

    ytProcess.stderr.on('data', (data) => {
      // Optional: Log stderr for debugging but don't send to user
      if (data.toString().includes('ERROR')) {
        console.error(`yt-dlp error: ${data}`);
      }
    });

  } catch (err) {
    console.error('yt-dlp download error:', err);
    res.status(500).json({ error: 'Download failed' });
  }
});

export default router;
