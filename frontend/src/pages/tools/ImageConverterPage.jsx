import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { getToolById } from '../../data/tools';
import ToolPageWrapper from '../../components/tools/ToolPageWrapper';
import DropZone from '../../components/ui/DropZone';
import { Download, Loader2, CheckCircle2, X, FileText, Copy, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import imageCompression from 'browser-image-compression';

function ImageConvert({ tool }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState(null);

  const handleFile = (files) => {
    setFile(files[0]);
    setPreview(URL.createObjectURL(files[0]));
    setResult(null);
    toast.success('Image loaded!');
  };

  const convert = async () => {
    if (!file) return;
    setProcessing(true);
    try {
      const canvas = document.createElement('canvas');
      const img = new window.Image();
      img.src = URL.createObjectURL(file);
      await new Promise(r => { img.onload = r; });
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d');
      const isJpg = tool.id.includes('to-jpg') || tool.id === 'png-to-jpg' || tool.id === 'heic-to-jpg';
      if (isJpg) { ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, canvas.width, canvas.height); }
      ctx.drawImage(img, 0, 0);
      const outType = isJpg ? 'image/jpeg' : 'image/png';
      const ext = isJpg ? 'jpg' : 'png';
      canvas.toBlob(blob => {
        setResult({ url: URL.createObjectURL(blob), name: `converted.${ext}`, size: blob.size });
        toast.success('Done!');
        setProcessing(false);
      }, outType, 0.92);
    } catch { toast.error('Failed'); setProcessing(false); }
  };

  return (
    <ToolPageWrapper>
      <div className="space-y-6">
        {!file ? <DropZone onFilesSelected={handleFile} accept={tool.accept} /> : (
          <>
            <div className="flex items-center gap-4 bg-[#0f0f1a] rounded-xl p-4 border border-[#1e1e32]">
              {preview && <img src={preview} className="w-16 h-16 rounded-lg object-cover" alt="" />}
              <div className="flex-1 min-w-0"><p className="text-sm font-medium text-white truncate">{file.name}</p><p className="text-xs text-[#4a4a6a]">{(file.size/1024).toFixed(1)} KB</p></div>
              <button onClick={() => { setFile(null); setResult(null); }} className="text-[#4a4a6a] hover:text-red-400"><X className="w-4 h-4" /></button>
            </div>
            <button onClick={convert} disabled={processing} className="btn-primary px-8 py-3 rounded-xl font-bold flex items-center gap-2 disabled:opacity-50 w-full sm:w-auto justify-center">
              <span className="flex items-center gap-2">{processing ? <><Loader2 className="w-5 h-5 animate-spin" /> Converting...</> : 'Convert'}</span>
            </button>
            {result && (
              <div className="bg-[#00ff8810] border border-[#00ff8833] rounded-xl p-5 flex flex-col sm:flex-row items-center gap-4 animate-slide-up">
                <CheckCircle2 className="w-6 h-6 text-[#00ff88] shrink-0" />
                <div className="flex-1 text-center sm:text-left"><p className="text-sm text-white">{result.name} — {(result.size/1024).toFixed(1)} KB</p></div>
                <a href={result.url} download={result.name} className="btn-primary px-5 py-2 rounded-lg text-sm no-underline"><span className="flex items-center gap-2"><Download className="w-4 h-4" /> Download</span></a>
              </div>
            )}
          </>
        )}
      </div>
    </ToolPageWrapper>
  );
}

function ImageResize({ tool }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  const [mode, setMode] = useState('px');
  const [result, setResult] = useState(null);
  const [processing, setProcessing] = useState(false);

  const handleFile = (files) => { setFile(files[0]); setPreview(URL.createObjectURL(files[0])); toast.success('Loaded!'); };

  const resize = async () => {
    if (!file) return;
    setProcessing(true);
    const canvas = document.createElement('canvas');
    const img = new window.Image();
    img.src = URL.createObjectURL(file);
    await new Promise(r => { img.onload = r; });
    let w = parseInt(width) || img.naturalWidth;
    let h = parseInt(height) || img.naturalHeight;
    if (mode === '%') { w = Math.round(img.naturalWidth * w / 100); h = Math.round(img.naturalHeight * h / 100); }
    canvas.width = w; canvas.height = h;
    canvas.getContext('2d').drawImage(img, 0, 0, w, h);
    canvas.toBlob(blob => {
      setResult({ url: URL.createObjectURL(blob), name: 'resized.png', size: blob.size });
      toast.success('Resized!'); setProcessing(false);
    }, 'image/png');
  };

  return (
    <ToolPageWrapper>
      <div className="space-y-6">
        {!file ? <DropZone onFilesSelected={handleFile} accept={tool.accept} /> : (
          <>
            <div className="flex items-center gap-4 bg-[#0f0f1a] rounded-xl p-4 border border-[#1e1e32]">
              {preview && <img src={preview} className="w-16 h-16 rounded-lg object-cover" alt="" />}
              <div className="flex-1"><p className="text-sm text-white truncate">{file.name}</p></div>
              <button onClick={() => { setFile(null); setResult(null); }} className="text-[#4a4a6a] hover:text-red-400"><X className="w-4 h-4" /></button>
            </div>
            <div className="flex flex-wrap gap-3 items-end">
              <div className="flex gap-2">
                <button onClick={() => setMode('px')} className={`px-3 py-1.5 rounded-lg text-xs font-medium ${mode === 'px' ? 'bg-[#00d4ff] text-[#0a0a0f]' : 'bg-[#1e1e32] text-[#8888aa]'}`}>Pixels</button>
                <button onClick={() => setMode('%')} className={`px-3 py-1.5 rounded-lg text-xs font-medium ${mode === '%' ? 'bg-[#00d4ff] text-[#0a0a0f]' : 'bg-[#1e1e32] text-[#8888aa]'}`}>Percent</button>
              </div>
              <input type="number" placeholder="Width" value={width} onChange={e => setWidth(e.target.value)} className="bg-[#0f0f1a] border border-[#2a2a45] rounded-xl px-4 py-2.5 text-white text-sm w-28 focus:outline-none focus:border-[#00d4ff55]" />
              <span className="text-[#4a4a6a]">×</span>
              <input type="number" placeholder="Height" value={height} onChange={e => setHeight(e.target.value)} className="bg-[#0f0f1a] border border-[#2a2a45] rounded-xl px-4 py-2.5 text-white text-sm w-28 focus:outline-none focus:border-[#00d4ff55]" />
            </div>
            <button onClick={resize} disabled={processing} className="btn-primary px-8 py-3 rounded-xl font-bold disabled:opacity-50"><span>{processing ? 'Resizing...' : 'Resize'}</span></button>
            {result && (
              <div className="bg-[#00ff8810] border border-[#00ff8833] rounded-xl p-5 flex items-center gap-4 animate-slide-up">
                <CheckCircle2 className="w-6 h-6 text-[#00ff88]" />
                <div className="flex-1"><p className="text-sm text-white">{(result.size/1024).toFixed(1)} KB</p></div>
                <a href={result.url} download={result.name} className="btn-primary px-5 py-2 rounded-lg text-sm no-underline"><span><Download className="w-4 h-4 inline mr-1" />Download</span></a>
              </div>
            )}
          </>
        )}
      </div>
    </ToolPageWrapper>
  );
}

function ImageCompress({ tool }) {
  const [file, setFile] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState(null);
  const handleFile = (files) => { setFile(files[0]); toast.success('Loaded!'); };
  const compress = async () => {
    if (!file) return; setProcessing(true);
    try {
      const compressed = await imageCompression(file, { maxSizeMB: 1, maxWidthOrHeight: 1920, useWebWorker: true });
      setResult({ url: URL.createObjectURL(compressed), name: `compressed_${file.name}`, origSize: file.size, newSize: compressed.size });
      toast.success('Compressed!');
    } catch { toast.error('Failed'); }
    setProcessing(false);
  };
  return (
    <ToolPageWrapper>
      <div className="space-y-6">
        {!file ? <DropZone onFilesSelected={handleFile} accept={tool.accept} /> : (
          <>
            <div className="flex items-center gap-4 bg-[#0f0f1a] rounded-xl p-4 border border-[#1e1e32]">
              <FileText className="w-5 h-5 text-[#00d4ff]" />
              <div className="flex-1"><p className="text-sm text-white truncate">{file.name}</p><p className="text-xs text-[#4a4a6a]">{(file.size/1024).toFixed(1)} KB</p></div>
              <button onClick={() => { setFile(null); setResult(null); }} className="text-[#4a4a6a] hover:text-red-400"><X className="w-4 h-4" /></button>
            </div>
            <button onClick={compress} disabled={processing} className="btn-primary px-8 py-3 rounded-xl font-bold disabled:opacity-50"><span>{processing ? 'Compressing...' : 'Compress'}</span></button>
            {result && (
              <div className="bg-[#00ff8810] border border-[#00ff8833] rounded-xl p-5 animate-slide-up space-y-3">
                <div className="flex items-center gap-4">
                  <CheckCircle2 className="w-6 h-6 text-[#00ff88]" />
                  <div className="flex-1"><p className="text-sm text-white">{(result.origSize/1024).toFixed(0)} KB → {(result.newSize/1024).toFixed(0)} KB</p><p className="text-xs text-[#00ff88]">Saved {((1 - result.newSize / result.origSize) * 100).toFixed(0)}%</p></div>
                  <a href={result.url} download={result.name} className="btn-primary px-5 py-2 rounded-lg text-sm no-underline"><span><Download className="w-4 h-4 inline mr-1" />Download</span></a>
                </div>
                <div className="w-full bg-[#1e1e32] rounded-full h-2"><div className="h-2 rounded-full bg-gradient-to-r from-[#00d4ff] to-[#00ff88]" style={{ width: `${(result.newSize / result.origSize) * 100}%` }} /></div>
              </div>
            )}
          </>
        )}
      </div>
    </ToolPageWrapper>
  );
}

function ImageBase64({ tool }) {
  const [file, setFile] = useState(null);
  const [base64, setBase64] = useState('');
  const [copied, setCopied] = useState(false);
  const handleFile = (files) => { const f = files[0]; setFile(f); const r = new FileReader(); r.onload = () => { setBase64(r.result); toast.success('Encoded!'); }; r.readAsDataURL(f); };
  const copy = () => { navigator.clipboard.writeText(base64); setCopied(true); toast.success('Copied!'); setTimeout(() => setCopied(false), 2000); };
  return (
    <ToolPageWrapper>
      <div className="space-y-6">
        {!file ? <DropZone onFilesSelected={handleFile} accept={tool.accept} /> : (
          <>
            <div className="flex items-center gap-4 bg-[#0f0f1a] rounded-xl p-4 border border-[#1e1e32]">
              <FileText className="w-5 h-5 text-[#00d4ff]" />
              <div className="flex-1"><p className="text-sm text-white truncate">{file.name}</p></div>
              <button onClick={() => { setFile(null); setBase64(''); }} className="text-[#4a4a6a] hover:text-red-400"><X className="w-4 h-4" /></button>
            </div>
            <div className="relative">
              <textarea readOnly value={base64} rows={6} className="w-full bg-[#0f0f1a] border border-[#2a2a45] rounded-xl p-4 text-xs text-[#8888aa] font-mono focus:outline-none resize-none" />
              <button onClick={copy} className="absolute top-3 right-3 p-2 rounded-lg bg-[#1e1e32] hover:bg-[#00d4ff22] text-[#8888aa] hover:text-[#00d4ff]">
                {copied ? <Check className="w-4 h-4 text-[#00ff88]" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-xs text-[#4a4a6a]">Length: {base64.length.toLocaleString()} chars</p>
          </>
        )}
      </div>
    </ToolPageWrapper>
  );
}

function PlaceholderTool({ tool }) {
  return (
    <ToolPageWrapper>
      <div className="text-center py-12">
        <div className="w-20 h-20 rounded-2xl bg-[#00d4ff10] flex items-center justify-center mx-auto mb-5"><tool.icon className="w-10 h-10 text-[#00d4ff]" /></div>
        <h3 className="text-xl font-bold text-white font-[Space_Grotesk] mb-2">{tool.name}</h3>
        <p className="text-[#8888aa] mb-4">{tool.description}</p>
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#f59e0b15] border border-[#f59e0b33]"><span className="text-sm text-[#f59e0b] font-medium">🚧 Coming Soon</span></div>
      </div>
    </ToolPageWrapper>
  );
}

export default function ImageConverterPage() {
  const { toolId } = useParams();
  const tool = getToolById(toolId);
  if (!tool) return null;
  if (tool.type === 'image-convert') return <ImageConvert tool={tool} />;
  if (tool.type === 'image-resize') return <ImageResize tool={tool} />;
  if (tool.type === 'image-compress') return <ImageCompress tool={tool} />;
  if (tool.type === 'image-base64') return <ImageBase64 tool={tool} />;
  if (tool.type === 'placeholder') return <PlaceholderTool tool={tool} />;
  return null;
}
