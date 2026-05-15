import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { getToolById } from '../../data/tools';
import ToolPageWrapper, { FileToolLayout } from '../../components/tools/ToolPageWrapper';
import DropZone from '../../components/ui/DropZone';
import { Download, Loader2, CheckCircle2, X, FileText, RotateCw } from 'lucide-react';
import { PDFDocument, rgb, StandardFonts, degrees } from 'pdf-lib';
import toast from 'react-hot-toast';

async function mergePdfs(files) {
  const merged = await PDFDocument.create();
  for (const file of files) {
    const bytes = await file.arrayBuffer();
    const pdf = await PDFDocument.load(bytes);
    const pages = await merged.copyPages(pdf, pdf.getPageIndices());
    pages.forEach(p => merged.addPage(p));
  }
  const out = await merged.save();
  const blob = new Blob([out], { type: 'application/pdf' });
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'merged.pdf'; a.click();
}

async function rotatePdf(file, deg) {
  const bytes = await file.arrayBuffer();
  const pdf = await PDFDocument.load(bytes);
  pdf.getPages().forEach(p => p.setRotation(degrees(p.getRotation().angle + deg)));
  const out = await pdf.save();
  const blob = new Blob([out], { type: 'application/pdf' });
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'rotated.pdf'; a.click();
}

async function watermarkPdf(file, text) {
  const bytes = await file.arrayBuffer();
  const pdf = await PDFDocument.load(bytes);
  const font = await pdf.embedFont(StandardFonts.HelveticaBold);
  pdf.getPages().forEach(page => {
    const { width, height } = page.getSize();
    page.drawText(text || 'WATERMARK', {
      x: width / 4, y: height / 2, size: 50, font,
      color: rgb(0.75, 0.75, 0.75), rotate: degrees(45), opacity: 0.3,
    });
  });
  const out = await pdf.save();
  const blob = new Blob([out], { type: 'application/pdf' });
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'watermarked.pdf'; a.click();
}

async function addPageNumbers(file) {
  const bytes = await file.arrayBuffer();
  const pdf = await PDFDocument.load(bytes);
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const pages = pdf.getPages();
  pages.forEach((page, i) => {
    const { width } = page.getSize();
    page.drawText(`${i + 1} / ${pages.length}`, {
      x: width / 2 - 20, y: 25, size: 10, font, color: rgb(0.4, 0.4, 0.4),
    });
  });
  const out = await pdf.save();
  const blob = new Blob([out], { type: 'application/pdf' });
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'numbered.pdf'; a.click();
}

function MergePdfTool({ tool }) {
  return (
    <ToolPageWrapper>
      <FileToolLayout tool={tool} processLabel="Merge PDFs" onProcess={mergePdfs} />
    </ToolPageWrapper>
  );
}

function RotatePdfTool({ tool }) {
  const [file, setFile] = useState(null);
  const [angle, setAngle] = useState(90);
  const [processing, setProcessing] = useState(false);
  const [done, setDone] = useState(false);

  const run = async () => {
    setProcessing(true);
    try {
      await rotatePdf(file, angle);
      setDone(true);
      toast.success('PDF Rotated!');
    } catch {
      toast.error('Rotation failed.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <ToolPageWrapper>
      <div className="space-y-8">
        {!file ? (
          <DropZone onFilesSelected={f => { setFile(f[0]); toast.success('PDF loaded!'); }} accept={tool.accept} />
        ) : (
          <div className="animate-in slide-in-from-bottom-4 duration-500">
            {/* File Insight Card */}
            <div className="flex items-center gap-4 bg-[var(--color-bg-secondary)] rounded-2xl p-5 border border-[var(--color-border)] mb-6">
              <div className="w-12 h-12 rounded-xl bg-[var(--color-accent-green-10)] flex items-center justify-center">
                <FileText className="w-6 h-6 text-[var(--color-accent-green)]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-[var(--color-text-primary)] truncate">{file.name}</p>
                <p className="text-xs text-[var(--color-text-muted)]">{(file.size / 1024).toFixed(1)} KB • PDF Document</p>
              </div>
              <button onClick={() => { setFile(null); setDone(false); }} className="p-2 rounded-lg hover:bg-red-400/10 text-[var(--color-text-muted)] hover:text-red-400 transition-all">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Controls */}
            <div className="space-y-4">
              <label className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-widest">Select Rotation Angle</label>
              <div className="grid grid-cols-3 gap-3">
                {[90, 180, 270].map(a => (
                  <button 
                    key={a} 
                    onClick={() => { setAngle(a); setDone(false); }} 
                    className={`flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border transition-all duration-300 
                      ${angle === a ? 'bg-[var(--color-accent-blue-10)] border-[var(--color-accent-blue)] text-[var(--color-accent-blue)]' : 'bg-[var(--color-bg-secondary)] border-[var(--color-border)] text-[var(--color-text-muted)] hover:border-[var(--color-border-bright)]'}`}
                  >
                    <RotateCw className={`w-5 h-5 ${angle === a ? 'animate-spin-slow' : ''}`} style={{ transform: `rotate(${a}deg)` }} />
                    <span className="text-sm font-bold">{a}°</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Action */}
            <div className="mt-8 pt-8 border-t border-[var(--color-border)] flex justify-center">
              {!done ? (
                <button 
                  onClick={run} 
                  disabled={processing} 
                  className="group relative bg-gradient-to-r from-[var(--color-accent-blue)] to-[var(--color-accent-green)] text-[var(--color-bg-primary)] px-12 py-4 rounded-2xl font-bold hover:scale-105 hover:shadow-[0_0_30px_var(--color-accent-blue-10)] transition-all disabled:opacity-50"
                >
                  <span className="flex items-center gap-2">
                    {processing ? <><Loader2 className="w-5 h-5 animate-spin" /> Rotating...</> : 'Rotate PDF'}
                  </span>
                </button>
              ) : (
                <div className="flex gap-4 animate-in zoom-in">
                  <button onClick={() => setDone(false)} className="px-8 py-4 rounded-2xl border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-all font-medium">Change Settings</button>
                  <div className="flex items-center gap-2 text-[var(--color-accent-green)] font-bold"><CheckCircle2 className="w-5 h-5" /> Downloaded!</div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </ToolPageWrapper>
  );
}

function WatermarkPdfTool({ tool }) {
  const [file, setFile] = useState(null);
  const [text, setText] = useState('CONFIDENTIAL');
  const [processing, setProcessing] = useState(false);
  const [done, setDone] = useState(false);

  const run = async () => { 
    setProcessing(true); 
    try {
      await watermarkPdf(file, text); 
      setDone(true); 
      toast.success('Watermark added!'); 
    } catch {
      toast.error('Failed to add watermark.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <ToolPageWrapper>
      <div className="space-y-8">
        {!file ? (
          <DropZone onFilesSelected={f => { setFile(f[0]); toast.success('PDF loaded!'); }} accept={tool.accept} />
        ) : (
          <div className="animate-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center gap-4 bg-[var(--color-bg-secondary)] rounded-2xl p-5 border border-[var(--color-border)] mb-8">
              <div className="w-12 h-12 rounded-xl bg-[var(--color-accent-purple-10)] flex items-center justify-center">
                <FileText className="w-6 h-6 text-[var(--color-accent-purple)]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-[var(--color-text-primary)] truncate">{file.name}</p>
                <p className="text-xs text-[var(--color-text-muted)]">{(file.size / 1024).toFixed(1)} KB • Ready for Watermark</p>
              </div>
              <button onClick={() => { setFile(null); setDone(false); }} className="p-2 rounded-lg hover:bg-red-400/10 text-[var(--color-text-muted)] hover:text-red-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <label className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-widest">Watermark Text</label>
              <input 
                type="text" 
                value={text} 
                onChange={e => { setText(e.target.value); setDone(false); }} 
                placeholder="Enter text (e.g. DRAFT, PRIVATE)..."
                className="w-full bg-[var(--color-bg-secondary)] border border-[var(--color-border-bright)] rounded-2xl px-6 py-4 text-[var(--color-text-primary)] font-medium focus:outline-none focus:border-[var(--color-accent-blue-20)] focus:ring-4 focus:ring-[var(--color-accent-blue-10)] transition-all" 
              />
            </div>

            <div className="mt-10 pt-8 border-t border-[var(--color-border)] flex justify-center">
              {!done ? (
                <button 
                  onClick={run} 
                  disabled={processing} 
                  className="bg-gradient-to-r from-[var(--color-accent-purple)] to-[var(--color-accent-blue)] text-white px-12 py-4 rounded-2xl font-bold hover:scale-105 hover:shadow-[0_0_30px_var(--color-accent-purple-10)] transition-all disabled:opacity-50"
                >
                  <span className="flex items-center gap-2">
                    {processing ? <><Loader2 className="w-5 h-5 animate-spin" /> Processing...</> : 'Add Watermark'}
                  </span>
                </button>
              ) : (
                <div className="flex items-center gap-2 text-[var(--color-accent-green)] font-bold animate-in zoom-in">
                  <CheckCircle2 className="w-6 h-6" /> Success! File Downloaded
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </ToolPageWrapper>
  );
}

function PageNumberTool({ tool }) {
  const [file, setFile] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [done, setDone] = useState(false);
  const run = async () => { setProcessing(true); await addPageNumbers(file); setDone(true); setProcessing(false); toast.success('Page numbers added!'); };
  return (
    <ToolPageWrapper>
      <div className="space-y-6">
        {!file ? <DropZone onFilesSelected={f => { setFile(f[0]); toast.success('PDF loaded!'); }} accept={tool.accept} /> : (
          <>
            <div className="flex items-center gap-4 bg-[var(--color-bg-secondary)] rounded-xl p-4 border border-[var(--color-border)]">
              <FileText className="w-5 h-5 text-[var(--color-accent-green)]" />
              <div className="flex-1"><p className="text-sm text-[var(--color-text-primary)] truncate">{file.name}</p></div>
              <button onClick={() => { setFile(null); setDone(false); }} className="text-[var(--color-text-muted)] hover:text-red-400"><X className="w-4 h-4" /></button>
            </div>
            <button onClick={run} disabled={processing} className="btn-primary px-8 py-3 rounded-xl font-bold disabled:opacity-50"><span>{processing ? 'Adding...' : 'Add Page Numbers'}</span></button>
            {done && <div className="bg-[var(--color-accent-green-10)] border border-[var(--color-accent-green-20)] rounded-xl p-5 flex items-center gap-4 animate-slide-up"><CheckCircle2 className="w-6 h-6 text-[var(--color-accent-green)]" /><p className="text-sm text-[var(--color-text-primary)]">Page numbers added!</p></div>}
          </>
        )}
      </div>
    </ToolPageWrapper>
  );
}

function GenericPdfTool({ tool }) {
  return (
    <ToolPageWrapper>
      <FileToolLayout tool={tool} processLabel="Process PDF" />
    </ToolPageWrapper>
  );
}

export default function PdfToolsPage() {
  const { toolId } = useParams();
  const tool = getToolById(toolId);
  if (!tool) return null;
  if (tool.id === 'merge-pdf') return <MergePdfTool tool={tool} />;
  if (tool.id === 'rotate-pdf') return <RotatePdfTool tool={tool} />;
  if (tool.id === 'watermark-pdf') return <WatermarkPdfTool tool={tool} />;
  if (tool.id === 'pdf-page-numbers') return <PageNumberTool tool={tool} />;
  return <GenericPdfTool tool={tool} />;
}
