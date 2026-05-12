import express from 'express';
import { spawn, exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);
const router = express.Router();

// POST /api/download/info
router.post('/info', async (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: 'URL is required' });

  try {
    const { stdout } = await execAsync(`yt-dlp --dump-json "${url}"`);
    const data = JSON.parse(stdout);
    
    // Extract formats with video (ignore formats that are audio only unless it's the only option, but mostly let's filter)
    const formats = data.formats
      .filter(f => f.format_id && f.ext)
      .map(f => ({
        format_id: f.format_id,
        ext: f.ext,
        quality: f.format_note || f.resolution || (f.height ? `${f.height}p` : 'audio'),
        vcodec: f.vcodec,
        acodec: f.acodec,
        filesize: f.filesize
      }))
      .filter(f => f.vcodec !== 'none' || f.acodec !== 'none'); // Keep valid streams

    res.json({
      title: data.title,
      thumbnail: data.thumbnail,
      formats: formats
    });
  } catch (err) {
    console.error('yt-dlp error:', err);
    res.status(500).json({ error: 'Failed to fetch video info. Ensure URL is valid.' });
  }
});

// POST /api/download/video
router.post('/video', (req, res) => {
  const { url, format_id } = req.body;
  if (!url) return res.status(400).json({ error: 'URL is required' });

  try {
    const formatArg = format_id ? ['-f', format_id] : ['-f', 'best'];
    
    // Use yt-dlp to stream output to stdout
    const ytdlp = spawn('yt-dlp', [...formatArg, '-o', '-', url]);

    res.setHeader('Content-Disposition', `attachment; filename="downloaded_video.mp4"`);
    res.setHeader('Content-Type', 'application/octet-stream');

    ytdlp.stdout.pipe(res);

    ytdlp.stderr.on('data', (data) => {
      console.log(`yt-dlp stderr: ${data}`);
    });

    ytdlp.on('close', (code) => {
      if (code !== 0) {
        console.error(`yt-dlp process exited with code ${code}`);
        // Cannot send 500 here since headers are already sent, stream will just end
      }
    });

    req.on('close', () => {
      ytdlp.kill();
    });

  } catch (err) {
    console.error('Download error:', err);
    res.status(500).json({ error: 'Failed to download video.' });
  }
});

export default router;
