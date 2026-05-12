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
    await rotatePdf(file, angle);
    setDone(true); setProcessing(false);
    toast.success('Rotated!');
  };

  return (
    <ToolPageWrapper>
      <div className="space-y-6">
        {!file ? <DropZone onFilesSelected={f => { setFile(f[0]); toast.success('PDF loaded!'); }} accept={tool.accept} /> : (
          <>
            <div className="flex items-center gap-4 bg-[#0f0f1a] rounded-xl p-4 border border-[#1e1e32]">
              <FileText className="w-5 h-5 text-[#00ff88]" />
              <div className="flex-1"><p className="text-sm text-white truncate">{file.name}</p></div>
              <button onClick={() => { setFile(null); setDone(false); }} className="text-[#4a4a6a] hover:text-red-400"><X className="w-4 h-4" /></button>
            </div>
            <div className="flex gap-2">
              {[90, 180, 270].map(a => (
                <button key={a} onClick={() => setAngle(a)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${angle === a ? 'bg-[#00d4ff] text-[#0a0a0f]' : 'bg-[#1e1e32] text-[#8888aa] hover:text-white'}`}>
                  <RotateCw className="w-4 h-4 inline mr-1" />{a}°
                </button>
              ))}
            </div>
            <button onClick={run} disabled={processing} className="btn-primary px-8 py-3 rounded-xl font-bold disabled:opacity-50">
              <span>{processing ? 'Rotating...' : 'Rotate PDF'}</span>
            </button>
            {done && <div className="bg-[#00ff8810] border border-[#00ff8833] rounded-xl p-5 flex items-center gap-4 animate-slide-up"><CheckCircle2 className="w-6 h-6 text-[#00ff88]" /><p className="text-sm text-white">PDF rotated & downloaded!</p></div>}
          </>
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

  const run = async () => { setProcessing(true); await watermarkPdf(file, text); setDone(true); setProcessing(false); toast.success('Watermark added!'); };

  return (
    <ToolPageWrapper>
      <div className="space-y-6">
        {!file ? <DropZone onFilesSelected={f => { setFile(f[0]); toast.success('PDF loaded!'); }} accept={tool.accept} /> : (
          <>
            <div className="flex items-center gap-4 bg-[#0f0f1a] rounded-xl p-4 border border-[#1e1e32]">
              <FileText className="w-5 h-5 text-[#00ff88]" />
              <div className="flex-1"><p className="text-sm text-white truncate">{file.name}</p></div>
              <button onClick={() => { setFile(null); setDone(false); }} className="text-[#4a4a6a] hover:text-red-400"><X className="w-4 h-4" /></button>
            </div>
            <input type="text" value={text} onChange={e => setText(e.target.value)} placeholder="Watermark text..."
              className="w-full bg-[#0f0f1a] border border-[#2a2a45] rounded-xl px-5 py-3 text-white text-sm focus:outline-none focus:border-[#00d4ff55]" />
            <button onClick={run} disabled={processing} className="btn-primary px-8 py-3 rounded-xl font-bold disabled:opacity-50"><span>{processing ? 'Adding...' : 'Add Watermark'}</span></button>
            {done && <div className="bg-[#00ff8810] border border-[#00ff8833] rounded-xl p-5 flex items-center gap-4 animate-slide-up"><CheckCircle2 className="w-6 h-6 text-[#00ff88]" /><p className="text-sm text-white">Watermark added & downloaded!</p></div>}
          </>
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
            <div className="flex items-center gap-4 bg-[#0f0f1a] rounded-xl p-4 border border-[#1e1e32]">
              <FileText className="w-5 h-5 text-[#00ff88]" />
              <div className="flex-1"><p className="text-sm text-white truncate">{file.name}</p></div>
              <button onClick={() => { setFile(null); setDone(false); }} className="text-[#4a4a6a] hover:text-red-400"><X className="w-4 h-4" /></button>
            </div>
            <button onClick={run} disabled={processing} className="btn-primary px-8 py-3 rounded-xl font-bold disabled:opacity-50"><span>{processing ? 'Adding...' : 'Add Page Numbers'}</span></button>
            {done && <div className="bg-[#00ff8810] border border-[#00ff8833] rounded-xl p-5 flex items-center gap-4 animate-slide-up"><CheckCircle2 className="w-6 h-6 text-[#00ff88]" /><p className="text-sm text-white">Page numbers added!</p></div>}
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
