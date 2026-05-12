# Backend Integration Complete

I have successfully added the Node.js + Express backend to your project and restructured the workspace according to your strict requirements. 

## What Was Done

### 1. Folder Restructuring
- Moved all the original Vite React files into the `frontend/` directory.
- Created the new `backend/` directory.
- Created a root-level `package.json` that uses `concurrently` to run both frontend and backend dev servers via `npm run dev`.

### 2. Backend Setup
- Created `backend/package.json` and installed required dependencies (`express`, `multer`, `sharp`, `cors`, `express-rate-limit`, `dotenv`, `archiver`, `uuid`).
- Created `backend/server.js` running on port 5000 with CORS allowed for the Vite dev server and production domains.
- Added Global Rate Limiting (`20 requests per 15 minutes`) and File Validation middleware to ensure security.

### 3. File Processing & Cleanup
- Implemented `backend/utils/cleanupFiles.js`. This is called in the `finally` block of every single route, guaranteeing that **no files remain on the server** once the response is complete.
- Added a fallback startup cleanup task that automatically sweeps `backend/tmp/` for files older than 1 hour.
- Configured Multer to save uploaded files to `backend/tmp/` with a 50MB file size limit.

### 4. API Routes
- **`POST /api/convert/*`**: Uses `sharp` natively in Node for lightning-fast image conversions and resizing. Office documents and images-to-PDF call Python sub-processes.
- **`POST /api/pdf/*`**: Calls Python sub-processes to manipulate PDFs using your requested tools (`pypdf`, `Ghostscript`, `pdf2image`, `pikepdf`, `reportlab`).
- **`POST /api/download/*`**: Uses `yt-dlp` via child process. The `/video` route directly pipes the output from stdout to `res.pipe()`, streaming it directly to the user without touching the disk.

### 5. Python Scripts
- `python/office_to_pdf.py`: Headless LibreOffice wrapper.
- `python/pdf_tools.py`: A comprehensive script acting on `--action` flags (merge, split, compress, protect, unlock, watermark, to-png, to-jpg).
- `python/image_tools.py`: Uses Pillow to handle PDF creation.

> [!IMPORTANT]
> The backend relies on **system-level dependencies** installed locally on your machine. For everything to function properly, please ensure you have the following installed and accessible in your system's PATH:
> - Python 3
> - LibreOffice (for document conversion)
> - Ghostscript (for PDF compression)
> - yt-dlp (for social media downloading)
> 
> Also ensure you run `pip install pypdf pdf2image pikepdf reportlab Pillow` in your global/virtual Python environment so the scripts can execute.

## Next Steps
You can now start both servers simultaneously by running the following command from the root folder (`d:\MY Projects\OneClick`):
```bash
npm run dev
```
