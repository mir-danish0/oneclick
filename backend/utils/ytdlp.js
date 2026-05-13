import { exec, spawn } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';

const execAsync = promisify(exec);

const DEFAULT_USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36';

/**
 * Common yt-dlp arguments to avoid blocks and improve reliability
 */
export const getCommonYtdlpArgs = () => {
  const args = [
    '--no-check-certificate',
    '--user-agent', DEFAULT_USER_AGENT,
    '--add-header', 'referer:https://www.instagram.com/',
    '--add-header', 'accept:text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
    '--add-header', 'accept-language:en-US,en;q=0.9',
  ];

  // 1. Check for cookies.txt in the backend root (local dev)
  const cookiesPath = path.resolve(process.cwd(), 'cookies.txt');
  
  // 2. Or check for cookies provided via Environment Variable (Render/Production)
  // This is safer than committing a cookies.txt file to Git
  if (process.env.YT_DLP_COOKIES) {
    const envCookiesPath = path.resolve(process.cwd(), 'env_cookies.txt');
    // Only write if it doesn't exist or we want to ensure it's fresh
    fs.writeFileSync(envCookiesPath, process.env.YT_DLP_COOKIES);
    args.push('--cookies', envCookiesPath);
  } else if (fs.existsSync(cookiesPath)) {
    args.push('--cookies', cookiesPath);
  }

  return args;
};

/**
 * Fetches JSON info for a video URL
 */
export const fetchVideoInfo = async (url) => {
  const args = [
    'yt-dlp',
    '-j',
    '--no-playlist',
    ...getCommonYtdlpArgs(),
    `"${url}"`
  ];

  try {
    const { stdout } = await execAsync(args.join(' '));
    return JSON.parse(stdout);
  } catch (error) {
    console.error('fetchVideoInfo error:', error.message);
    // If it's a 429, we might want to throw a more specific error
    if (error.message.includes('429')) {
      throw new Error('Rate limited by the platform. Please try again later or provide cookies.');
    }
    throw error;
  }
};

/**
 * Spawns a yt-dlp process for streaming download
 */
export const spawnVideoDownload = (url, formatId) => {
  const format = formatId ? `${formatId}+bestaudio/best` : 'best';
  const args = [
    '-f', format,
    '-o', '-',
    ...getCommonYtdlpArgs(),
    url
  ];

  return spawn('yt-dlp', args);
};
