import cron from 'node-cron';
import https from 'https';
import http from 'http';

/**
 * Pings the server every 14 minutes to prevent it from sleeping.
 * Requires RENDER_EXTERNAL_URL or SELF_URL environment variable.
 */
export const startKeepAlive = () => {
  const url = process.env.RENDER_EXTERNAL_URL || process.env.SELF_URL;

  if (!url) {
    //console.log('[Keep-Alive]: No URL found (RENDER_EXTERNAL_URL or SELF_URL). Skipping keep-alive cron.');
    return;
  }

  console.log(`[Keep-Alive]: Scheduled ping for ${url} every 14 minutes.`);

  // Cron schedule: every 14 minutes
  cron.schedule('*/14 * * * *', () => {
    //console.log(`[Keep-Alive]: Pinging ${url} at ${new Date().toISOString()}`);
    
    const client = url.startsWith('https') ? https : http;
    
    client.get(url, (res) => {
      //console.log(`[Keep-Alive]: Ping response: ${res.statusCode}`);
    }).on('error', (err) => {
      //console.error(`[Keep-Alive]: Ping failed: ${err.message}`);
    });
  });
};
