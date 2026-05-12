import fs from 'fs/promises';
import fsSync from 'fs';
import path from 'path';

/**
 * Deletes the specified files from the filesystem.
 * This is used to clean up temp files immediately after they are sent to the user.
 * 
 * @param {...string} filePaths - Paths of the files to delete.
 */
export async function cleanupFiles(...filePaths) {
  for (const filePath of filePaths) {
    if (!filePath) continue;
    try {
      await fs.access(filePath);
      await fs.unlink(filePath);
      console.log(`[Cleanup] Deleted file: ${filePath}`);
    } catch (err) {
      if (err.code !== 'ENOENT') {
        console.error(`[Cleanup Error] Failed to delete file ${filePath}:`, err);
      }
    }
  }
}

/**
 * Periodically cleans up the /tmp directory to remove any leftover files 
 * older than a certain duration (e.g., 1 hour). This is a fallback mechanism.
 */
export function startPeriodicCleanup(tmpDir, maxAgeMs = 3600000, intervalMs = 1800000) {
  setInterval(async () => {
    try {
      console.log(`[Periodic Cleanup] Checking ${tmpDir} for old files...`);
      const files = await fs.readdir(tmpDir);
      const now = Date.now();
      
      for (const file of files) {
        if (file === '.gitkeep') continue;
        const filePath = path.join(tmpDir, file);
        const stats = await fs.stat(filePath);
        
        if (now - stats.mtimeMs > maxAgeMs) {
          await fs.unlink(filePath);
          console.log(`[Periodic Cleanup] Deleted old file: ${filePath}`);
        }
      }
    } catch (err) {
      console.error(`[Periodic Cleanup Error] Failed to clean tmp directory:`, err);
    }
  }, intervalMs);
}
