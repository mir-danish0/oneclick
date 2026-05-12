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
        <h1 className="text-2xl font-bold text-white font-[Space_Grotesk] mb-2">Tool Not Found</h1>
        <p className="text-[#8888aa] mb-6">The tool you're looking for doesn't exist.</p>
        <Link to="/" className="btn-primary px-6 py-3 rounded-xl no-underline"><span>Back to Home</span></Link>
      </div>
    );
  }

  const Icon = tool.icon;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-[#8888aa] mb-8">
        <Link to="/" className="hover:text-white transition-colors">Home</Link>
        <span>/</span>
        <Link to={`/category/${tool.category}`} className="hover:text-white transition-colors">
          {category?.name}
        </Link>
        <span>/</span>
        <span className="text-white">{tool.name}</span>
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
          <h1 className="text-2xl sm:text-3xl font-bold text-white font-[Space_Grotesk]">
            {tool.name}
          </h1>
          <p className="text-[#8888aa] text-sm mt-1">{tool.description}</p>
        </div>
      </div>

      {/* Tool Content */}
      <div className="glass-card rounded-2xl border border-[#1e1e32] p-6 sm:p-8">
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
  };

  const handleProcess = async () => {
    setProcessing(true);
    try {
      if (onProcess) {
        const result = await onProcess(files);
        if (result && result.downloadUrl) {
          setDownloadData(result);
        }
      } else {
        // Simulate processing
        await new Promise(r => setTimeout(r, 2000));
      }
      setDone(true);
      toast.success('Processing complete!');
    } catch {
      toast.error('Processing failed. Please try again.');
    }
    setProcessing(false);
  };

  return (
    <div className="space-y-6">
      {files.length === 0 ? (
        <DropZone
          onFilesSelected={handleFiles}
          accept={tool.accept}
          multiple={tool.multiple || false}
        />
      ) : (
        <>
          {/* File list */}
          <div className="space-y-3">
            {files.map((file, i) => (
              <div key={i} className="flex items-center gap-3 bg-[#0f0f1a] rounded-xl p-4 border border-[#1e1e32]">
                <FileText className="w-5 h-5 text-[#00d4ff] shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{file.name}</p>
                  <p className="text-xs text-[#4a4a6a]">{(file.size / 1024).toFixed(1)} KB</p>
                </div>
                <button onClick={() => removeFile(i)} className="text-[#4a4a6a] hover:text-red-400 transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleProcess}
              disabled={processing}
              className="btn-primary px-8 py-3 rounded-xl text-base font-bold flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <span className="flex items-center gap-2">
                {processing ? (
                  <><Loader2 className="w-5 h-5 animate-spin" /> Processing...</>
                ) : done ? (
                  <><CheckCircle2 className="w-5 h-5" /> Done!</>
                ) : (
                  processLabel
                )}
              </span>
            </button>
            <button
              onClick={() => { setFiles([]); setDone(false); setDownloadData(null); }}
              className="px-6 py-3 rounded-xl border border-[#2a2a45] text-[#8888aa] hover:text-white hover:border-[#00d4ff44] transition-all text-sm"
            >
              Clear Files
            </button>
          </div>

          {/* Result */}
          {done && (
            <div className="bg-[#00ff8810] border border-[#00ff8833] rounded-xl p-5 flex items-center gap-4 animate-slide-up">
              <CheckCircle2 className="w-6 h-6 text-[#00ff88] shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium text-white">Files processed successfully!</p>
                <p className="text-xs text-[#8888aa]">Your converted files are ready to download.</p>
              </div>
              <button 
                onClick={() => {
                  if (downloadData) {
                    const a = document.createElement('a');
                    a.href = downloadData.downloadUrl;
                    a.download = downloadData.filename;
                    document.body.appendChild(a);
                    a.click();
                    a.remove();
                  } else {
                     toast('File was downloaded automatically.');
                  }
                }}
                className="btn-primary px-5 py-2 rounded-lg text-sm flex items-center gap-2"
              >
                <span className="flex items-center gap-2"><Download className="w-4 h-4" /> Download</span>
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

/* ============ Social Downloader Layout ============ */
export function SocialDownloaderLayout({ tool }) {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);

  const handleFetch = async () => {
    if (!url.trim()) return toast.error('Please paste a valid URL');
    setLoading(true);
    // Simulate API call
    await new Promise(r => setTimeout(r, 1500));
    setResults({
      title: 'Sample Video Title — Downloaded via OneClick',
      thumbnail: null,
      qualities: [
        { label: '1080p HD', size: '45.2 MB', badge: 'Best' },
        { label: '720p', size: '22.8 MB', badge: null },
        { label: '360p', size: '8.5 MB', badge: null },
        { label: 'Audio Only', size: '3.2 MB', badge: null },
      ],
    });
    setLoading(false);
    toast.success('Video found!');
  };

  return (
    <div className="space-y-6">
      {/* URL Input */}
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="url"
          value={url}
          onChange={e => setUrl(e.target.value)}
          placeholder={tool.placeholder || 'Paste video URL here...'}
          className="flex-1 bg-[#0f0f1a] border border-[#2a2a45] rounded-xl px-5 py-3.5 text-white placeholder:text-[#4a4a6a] 
            focus:outline-none focus:border-[#00d4ff55] search-glow transition-all text-sm"
        />
        <button
          onClick={handleFetch}
          disabled={loading}
          className="btn-primary px-8 py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 shrink-0 disabled:opacity-50"
        >
          <span className="flex items-center gap-2">
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Download className="w-5 h-5" />}
            {loading ? 'Fetching...' : 'Fetch'}
          </span>
        </button>
      </div>

      {/* Results */}
      {results && (
        <div className="space-y-4 animate-slide-up">
          {/* Video info */}
          <div className="bg-[#0f0f1a] rounded-xl p-5 border border-[#1e1e32]">
            <div className="flex gap-4">
              <div className="w-32 h-20 rounded-lg bg-[#1e1e32] flex items-center justify-center shrink-0">
                <span className="text-3xl">🎬</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{results.title}</p>
                <p className="text-xs text-[#4a4a6a] mt-1">Ready to download</p>
              </div>
            </div>
          </div>

          {/* Quality options */}
          <div className="space-y-2">
            {results.qualities.map((q, i) => (
              <div key={i} className="flex items-center gap-4 bg-[#0f0f1a] rounded-xl p-4 border border-[#1e1e32] hover:border-[#00d4ff33] transition-all group">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-white">{q.label}</span>
                    {q.badge && (
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-[#00ff8820] text-[#00ff88]">
                        {q.badge}
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-[#4a4a6a]">{q.size}</span>
                </div>
                <button className="px-5 py-2 rounded-lg bg-[#00d4ff15] text-[#00d4ff] text-sm font-medium hover:bg-[#00d4ff25] transition-all flex items-center gap-1.5">
                  <Download className="w-3.5 h-3.5" />
                  Download
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
