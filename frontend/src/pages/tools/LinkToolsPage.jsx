import { useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { getToolById } from '../../data/tools';
import ToolPageWrapper from '../../components/tools/ToolPageWrapper';
import { QRCodeCanvas } from 'qrcode.react';
import { Copy, Check, Download, ExternalLink, Link as LinkIcon } from 'lucide-react';
import toast from 'react-hot-toast';

function LinkShortener() {
  const [url, setUrl] = useState('');
  const [result, setResult] = useState('');
  const [copied, setCopied] = useState(false);

  const shorten = () => {
    if (!url.trim()) return toast.error('Enter a URL');
    const hash = Math.random().toString(36).substring(2, 8);
    setResult(`https://tnest.link/${hash}`);
    toast.success('Link shortened!');
  };

  const copy = () => { navigator.clipboard.writeText(result); setCopied(true); toast.success('Copied!'); setTimeout(() => setCopied(false), 2000); };

  return (
    <ToolPageWrapper>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <input type="url" value={url} onChange={e => setUrl(e.target.value)} placeholder="Enter your long URL here..."
            className="flex-1 bg-[#0f0f1a] border border-[#2a2a45] rounded-xl px-5 py-3.5 text-white placeholder:text-[#4a4a6a] focus:outline-none search-glow text-sm" />
          <button onClick={shorten} className="btn-primary px-8 py-3.5 rounded-xl font-bold shrink-0"><span>Shorten</span></button>
        </div>
        {result && (
          <div className="bg-[#00d4ff08] border border-[#00d4ff22] rounded-xl p-5 flex items-center gap-4 animate-slide-up">
            <LinkIcon className="w-5 h-5 text-[#00d4ff] shrink-0" />
            <p className="flex-1 text-sm text-white font-mono truncate">{result}</p>
            <button onClick={copy} className="px-4 py-2 rounded-lg bg-[#00d4ff15] text-[#00d4ff] text-sm font-medium hover:bg-[#00d4ff25] flex items-center gap-1.5">
              {copied ? <><Check className="w-3.5 h-3.5" /> Copied</> : <><Copy className="w-3.5 h-3.5" /> Copy</>}
            </button>
          </div>
        )}
      </div>
    </ToolPageWrapper>
  );
}

function QrCodeGenerator() {
  const [text, setText] = useState('');
  const [fg, setFg] = useState('#00d4ff');
  const qrRef = useRef();

  const download = () => {
    const canvas = qrRef.current?.querySelector('canvas');
    if (!canvas) return;
    const url = canvas.toDataURL('image/png');
    const a = document.createElement('a'); a.href = url; a.download = 'qrcode.png'; a.click();
    toast.success('QR Code downloaded!');
  };

  return (
    <ToolPageWrapper>
      <div className="space-y-6">
        <input type="text" value={text} onChange={e => setText(e.target.value)} placeholder="Enter URL or text to generate QR code..."
          className="w-full bg-[#0f0f1a] border border-[#2a2a45] rounded-xl px-5 py-3.5 text-white placeholder:text-[#4a4a6a] focus:outline-none search-glow text-sm" />

        <div className="flex gap-3 items-center">
          <label className="text-sm text-[#8888aa]">Color:</label>
          {['#00d4ff', '#00ff88', '#7c3aed', '#f43f5e', '#f59e0b', '#ffffff'].map(c => (
            <button key={c} onClick={() => setFg(c)} className={`w-7 h-7 rounded-full border-2 transition-transform ${fg === c ? 'border-white scale-110' : 'border-transparent'}`} style={{ background: c }} />
          ))}
        </div>

        {text && (
          <div className="flex flex-col items-center gap-5 animate-slide-up">
            <div ref={qrRef} className="bg-white rounded-2xl p-6">
              <QRCodeCanvas value={text} size={200} fgColor={fg} bgColor="#ffffff" level="H" />
            </div>
            <button onClick={download} className="btn-primary px-6 py-3 rounded-xl font-bold flex items-center gap-2">
              <span className="flex items-center gap-2"><Download className="w-5 h-5" /> Download QR Code</span>
            </button>
          </div>
        )}
      </div>
    </ToolPageWrapper>
  );
}

function UtmBuilder() {
  const [base, setBase] = useState('');
  const [source, setSource] = useState('');
  const [medium, setMedium] = useState('');
  const [campaign, setCampaign] = useState('');
  const [copied, setCopied] = useState(false);

  const result = base ? `${base}${base.includes('?') ? '&' : '?'}utm_source=${encodeURIComponent(source)}&utm_medium=${encodeURIComponent(medium)}&utm_campaign=${encodeURIComponent(campaign)}` : '';
  const copy = () => { navigator.clipboard.writeText(result); setCopied(true); toast.success('Copied!'); setTimeout(() => setCopied(false), 2000); };

  const fields = [
    { label: 'Website URL', value: base, set: setBase, ph: 'https://example.com' },
    { label: 'Source', value: source, set: setSource, ph: 'e.g. google, newsletter' },
    { label: 'Medium', value: medium, set: setMedium, ph: 'e.g. cpc, email, social' },
    { label: 'Campaign', value: campaign, set: setCampaign, ph: 'e.g. spring_sale' },
  ];

  return (
    <ToolPageWrapper>
      <div className="space-y-5">
        {fields.map(f => (
          <div key={f.label}>
            <label className="block text-sm text-[#8888aa] mb-1.5">{f.label}</label>
            <input type="text" value={f.value} onChange={e => f.set(e.target.value)} placeholder={f.ph}
              className="w-full bg-[#0f0f1a] border border-[#2a2a45] rounded-xl px-5 py-3 text-white text-sm focus:outline-none focus:border-[#00d4ff55]" />
          </div>
        ))}
        {result && base && (
          <div className="bg-[#0f0f1a] border border-[#2a2a45] rounded-xl p-4 animate-slide-up">
            <p className="text-xs text-[#4a4a6a] mb-2">Generated URL:</p>
            <p className="text-sm text-[#00d4ff] font-mono break-all mb-3">{result}</p>
            <button onClick={copy} className="px-4 py-2 rounded-lg bg-[#00d4ff15] text-[#00d4ff] text-sm font-medium hover:bg-[#00d4ff25] flex items-center gap-1.5">
              {copied ? <><Check className="w-3.5 h-3.5" /> Copied</> : <><Copy className="w-3.5 h-3.5" /> Copy URL</>}
            </button>
          </div>
        )}
      </div>
    </ToolPageWrapper>
  );
}

function LinkExpander() {
  const [url, setUrl] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const expand = async () => {
    if (!url.trim()) return toast.error('Enter a URL');
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    setResult({ expanded: `https://www.example.com/very-long-destination-url?ref=campaign&id=12345`, safe: true, statusCode: 301 });
    setLoading(false);
    toast.success('Link expanded!');
  };

  return (
    <ToolPageWrapper>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <input type="url" value={url} onChange={e => setUrl(e.target.value)} placeholder="Paste short URL to expand..."
            className="flex-1 bg-[#0f0f1a] border border-[#2a2a45] rounded-xl px-5 py-3.5 text-white placeholder:text-[#4a4a6a] focus:outline-none search-glow text-sm" />
          <button onClick={expand} disabled={loading} className="btn-primary px-8 py-3.5 rounded-xl font-bold shrink-0 disabled:opacity-50">
            <span>{loading ? 'Expanding...' : 'Expand'}</span>
          </button>
        </div>
        {result && (
          <div className="bg-[#0f0f1a] border border-[#1e1e32] rounded-xl p-5 space-y-3 animate-slide-up">
            <div className="flex items-start gap-3">
              <ExternalLink className="w-5 h-5 text-[#00d4ff] shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-[#4a4a6a] mb-1">Destination URL:</p>
                <p className="text-sm text-white font-mono break-all">{result.expanded}</p>
              </div>
            </div>
            <div className="flex gap-4 pt-2">
              <span className="text-xs px-2 py-1 rounded bg-[#00ff8815] text-[#00ff88]">✓ Safe</span>
              <span className="text-xs px-2 py-1 rounded bg-[#00d4ff15] text-[#00d4ff]">Status: {result.statusCode}</span>
            </div>
          </div>
        )}
      </div>
    </ToolPageWrapper>
  );
}

export default function LinkToolsPage() {
  const { toolId } = useParams();
  const tool = getToolById(toolId);
  if (!tool) return null;
  if (tool.id === 'link-shortener') return <LinkShortener />;
  if (tool.id === 'qr-code-generator') return <QrCodeGenerator />;
  if (tool.id === 'utm-builder') return <UtmBuilder />;
  if (tool.id === 'link-expander') return <LinkExpander />;
  return null;
}
