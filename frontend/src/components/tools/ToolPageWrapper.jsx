import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Download, CheckCircle2, Loader2, X, FileText } from 'lucide-react';
import { getToolById, getCategoryById } from '../../data/tools';
import DropZone from '../ui/DropZone';
import toast from 'react-hot-toast';

export default function ToolPageWrapper({ children }) {
  const { toolId } = useParams();
  const tool = getToolById(toolId);
  const category = tool ? getCategoryById(tool.category) : null;

  if (!tool) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <p className="text-6xl mb-4">🔍</p>
        <h1 className="text-2xl font-bold text-[var(--color-text-primary)] font-[Space_Grotesk] mb-2">Tool Not Found</h1>
        <p className="text-[var(--color-text-secondary)] mb-6">The tool you're looking for doesn't exist.</p>
        <Link to="/" className="btn-primary px-6 py-3 rounded-xl no-underline"><span>Back to Home</span></Link>
      </div>
    );
  }

  const Icon = tool.icon;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)] mb-8">
        <Link to="/" className="hover:text-[var(--color-text-primary)] transition-colors">Home</Link>
        <span>/</span>
        <Link to={`/category/${tool.category}`} className="hover:text-[var(--color-text-primary)] transition-colors">
          {category?.name}
        </Link>
        <span>/</span>
        <span className="text-[var(--color-text-primary)]">{tool.name}</span>
      </div>

      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <div
          className="w-14 h-14 rounded-xl flex items-center justify-center"
          style={{ background: `${category?.color || '#00d4ff'}15` }}
        >
          <Icon className="w-7 h-7" style={{ color: category?.color || '#00d4ff' }} />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[var(--color-text-primary)] font-[Space_Grotesk]">
            {tool.name}
          </h1>
          <p className="text-[var(--color-text-secondary)] text-sm mt-1">{tool.description}</p>
        </div>
      </div>

      {/* Tool Content */}
      <div className="glass-card rounded-2xl border border-[var(--color-border)] p-6 sm:p-8">
        {children}
      </div>
    </div>
  );
}


/* ============ Reusable File Tool Layout ============ */
export function FileToolLayout({ tool, processLabel = 'Convert', onProcess }) {
  const [files, setFiles] = useState([]);
  const [processing, setProcessing] = useState(false);
  const [done, setDone] = useState(false);
  const [downloadData, setDownloadData] = useState(null);

  const handleFiles = (f) => {
    setFiles(f);
    setDone(false);
    setDownloadData(null);
    toast.success(`${f.length} file(s) added`);
  };

  const removeFile = (idx) => {
    setFiles(prev => prev.filter((_, i) => i !== idx));
    if (files.length <= 1) setDone(false);
  };

  const handleProcess = async () => {
    setProcessing(true);
    setDone(false);
    try {
      if (onProcess) {
        const result = await onProcess(files);
        if (result && result.downloadUrl) {
          setDownloadData(result);
        }
      } else {
        await new Promise(r => setTimeout(r, 2000));
      }
      setDone(true);
      toast.success('Processing complete!');
    } catch (err) {
      console.error(err);
      toast.error('Processing failed. Please try again.');
    }
    setProcessing(false);
  };

  return (
    <div className="space-y-8">
      {files.length === 0 ? (
        <div className="animate-in fade-in zoom-in duration-300">
          <DropZone
            onFilesSelected={handleFiles}
            accept={tool.accept}
            multiple={tool.multiple || false}
          />
        </div>
      ) : (
        <div className="animate-in slide-in-from-bottom-4 duration-500">
          {/* File list */}
          <div className="space-y-3 mb-8">
            <h3 className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-2">Selected Files</h3>
            {files.map((file, i) => (
              <div key={i} className="group flex items-center gap-4 bg-[var(--color-bg-secondary)] rounded-2xl p-4 border border-[var(--color-border)] hover:border-[var(--color-accent-blue-20)] transition-all duration-300">
                <div className="w-10 h-10 rounded-xl bg-[var(--color-border)] flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <FileText className="w-5 h-5 text-[var(--color-accent-blue)]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[var(--color-text-primary)] truncate">{file.name}</p>
                  <p className="text-xs text-[var(--color-text-muted)]">{(file.size / 1024).toFixed(1)} KB</p>
                </div>
                <button 
                  onClick={() => removeFile(i)} 
                  className="p-2 rounded-lg text-[var(--color-text-muted)] hover:text-red-400 hover:bg-red-400/10 transition-all opacity-0 group-hover:opacity-100"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 py-4 border-t border-[var(--color-border)]">
            {!done ? (
              <button
                onClick={handleProcess}
                disabled={processing}
                className={`group relative overflow-hidden px-10 py-4 rounded-2xl text-base font-bold transition-all duration-500 
                  ${processing ? 'w-full bg-[var(--color-bg-secondary)] text-[var(--color-text-secondary)]' : 'bg-gradient-to-r from-[var(--color-accent-blue)] to-[var(--color-accent-green)] text-[var(--color-bg-primary)] hover:shadow-[0_0_30px_var(--color-accent-blue-20)] hover:scale-105'}`}
              >
                {processing && (
                  <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-accent-blue-20)] to-[var(--color-accent-green-10)] animate-pulse" />
                )}
                <span className="relative flex items-center gap-2 justify-center">
                  {processing ? (
                    <><Loader2 className="w-5 h-5 animate-spin" /> Analyzing & Processing...</>
                  ) : (
                    <>{processLabel}</>
                  )}
                </span>
              </button>
            ) : (
              <div className="flex flex-col sm:flex-row gap-4 w-full justify-center animate-in zoom-in duration-300">
                <button 
                  onClick={() => {
                    if (downloadData) {
                      const a = document.createElement('a');
                      a.href = downloadData.downloadUrl;
                      a.download = downloadData.filename;
                      document.body.appendChild(a);
                      a.click();
                      a.remove();
                    }
                  }}
                  className="btn-primary px-10 py-4 rounded-2xl font-bold flex items-center justify-center gap-3 bg-gradient-to-r from-[#00ff88] to-[#00d4ff]"
                >
                  <Download className="w-5 h-5" /> Download Result
                </button>
                <button
                  onClick={() => { setFiles([]); setDone(false); setDownloadData(null); }}
                  className="px-8 py-4 rounded-2xl border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-secondary)] transition-all font-medium"
                >
                  Start New Task
                </button>
              </div>
            )}
          </div>

          {/* Success Badge */}
          {done && !processing && (
            <div className="flex items-center justify-center gap-2 text-[var(--color-accent-green)] animate-bounce mt-4">
              <CheckCircle2 className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-widest">Processing Complete</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
/* ============ Social Downloader Layout ============ */
export function SocialDownloaderLayout({ tool }) {
  const [url, setUrl] = useState('');
  const [info, setInfo] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchInfo = async () => {
    if (!url) return toast.error('Please paste a URL');
    setLoading(true);
    setInfo(null);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || '/api'}/social/info?url=${encodeURIComponent(url)}`);
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setInfo(data);
      toast.success('Video info fetched!');
    } catch (err) {
      toast.error(err.message || 'Failed to fetch video info');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Input Section */}
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder={`Paste ${tool.name} link here...`}
          className="flex-1 bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-2xl px-6 py-4 text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-accent-blue-20)] transition-all"
        />
        <button
          onClick={fetchInfo}
          disabled={loading}
          className="btn-primary px-8 py-4 rounded-2xl font-bold disabled:opacity-50 min-w-[140px]"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Fetch Video'}
        </button>
      </div>

      {/* Info Display */}
      {info && (
        <div className="animate-in slide-in-from-bottom-4 duration-500 space-y-6">
          <div className="flex flex-col md:flex-row gap-6 p-6 bg-[var(--color-bg-secondary)] rounded-3xl border border-[var(--color-border)]">
            <img src={info.thumbnail} alt="" className="w-full md:w-48 h-32 object-cover rounded-2xl shadow-xl" />
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-bold text-[var(--color-text-primary)] mb-2 line-clamp-2">{info.title}</h3>
              <p className="text-sm text-[var(--color-text-secondary)] mb-4">Uploader: {info.uploader} • {Math.floor(info.duration / 60)}:{(info.duration % 60).toString().padStart(2, '0')}</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {info.formats.map((f, i) => (
                  <button
                    key={i}
                    onClick={() => window.open(`${import.meta.env.VITE_API_URL || '/api'}/social/download?url=${encodeURIComponent(url)}&formatId=${f.formatId}`)}
                    className="flex items-center justify-between p-3 rounded-xl bg-[var(--color-bg-card)] border border-[var(--color-border-bright)] hover:border-[var(--color-accent-blue-20)] hover:bg-[var(--color-bg-card-hover)] transition-all group"
                  >
                    <div className="text-left">
                      <p className="text-xs font-bold text-[var(--color-text-primary)] uppercase">{f.resolution}</p>
                      <p className="text-[10px] text-[var(--color-text-muted)] uppercase">{f.extension} • {(f.filesize / (1024 * 1024)).toFixed(1)} MB</p>
                    </div>
                    <Download className="w-4 h-4 text-[var(--color-text-secondary)] group-hover:text-[var(--color-accent-blue)] transition-colors" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
