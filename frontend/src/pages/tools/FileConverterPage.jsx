import { useParams } from 'react-router-dom';
import { getToolById } from '../../data/tools';
import ToolPageWrapper, { FileToolLayout } from '../../components/tools/ToolPageWrapper';
import { PDFDocument } from 'pdf-lib';
import toast from 'react-hot-toast';

/* Image to PDF — real implementation */
async function imagesToPdf(files) {
  const pdfDoc = await PDFDocument.create();
  for (const file of files) {
    const bytes = await file.arrayBuffer();
    let img;
    if (file.type === 'image/png') {
      img = await pdfDoc.embedPng(bytes);
    } else {
      img = await pdfDoc.embedJpg(bytes);
    }
    const page = pdfDoc.addPage([img.width, img.height]);
    page.drawImage(img, { x: 0, y: 0, width: img.width, height: img.height });
  }
  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([pdfBytes], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'converted.pdf';
  a.click();
  URL.revokeObjectURL(url);
}

export default function FileConverterPage() {
  const { toolId } = useParams();
  const tool = getToolById(toolId);

  if (!tool) return null;

  const handleProcess = async (files) => {
    if (tool.id === 'image-to-pdf') {
      await imagesToPdf(files);
      return;
    }

    const formData = new FormData();
    // Assuming single file for these converters
    formData.append('file', files[0]);

    // Map tool.id to the backend endpoint
    const endpointMap = {
      'word-to-pdf': '/api/convert/word-to-pdf',
      'ppt-to-pdf': '/api/convert/ppt-to-pdf',
      'excel-to-pdf': '/api/convert/excel-to-pdf',
      'pdf-to-word': '/api/convert/pdf-to-word',
    };

    const endpoint = endpointMap[tool.id];
    if (!endpoint) {
       toast.error(`Backend endpoint for ${tool.name} is not configured.`);
       return;
    }

    try {
      const response = await fetch(`http://localhost:5000${endpoint}`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        let errorMsg = 'Conversion failed';
        try {
          const errData = await response.json();
          if (errData.error) errorMsg = errData.error;
        } catch(e) {}
        throw new Error(errorMsg);
      }

      // Handle file download data
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      
      // Get filename from Content-Disposition header if available
      const contentDisposition = response.headers.get('Content-Disposition');
      let filename = 'converted_file';
      if (contentDisposition && contentDisposition.includes('filename="')) {
        filename = contentDisposition.split('filename="')[1].split('"')[0];
      } else {
        // Fallback extensions based on tool
        if (tool.id.endsWith('to-pdf')) filename += '.pdf';
        if (tool.id.endsWith('to-word')) filename += '.docx';
      }

      return { downloadUrl, filename };
      
    } catch (error) {
      console.error(error);
      throw error; // Will be caught by FileToolLayout's try-catch to show error toast
    }
  };

  return (
    <ToolPageWrapper>
      <FileToolLayout tool={tool} processLabel="Convert File" onProcess={handleProcess} />
      
      {/* Info section */}
      <div className="mt-8 pt-6 border-t border-[#1e1e32]">
        <h3 className="text-sm font-semibold text-white mb-3 font-[Space_Grotesk]">How it works</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { step: '1', title: 'Upload', desc: 'Drop your file or click to browse' },
            { step: '2', title: 'Convert', desc: 'We process your file securely' },
            { step: '3', title: 'Download', desc: 'Get your converted file instantly' },
          ].map(s => (
            <div key={s.step} className="flex items-start gap-3 p-3 rounded-xl bg-[#0a0a0f]">
              <div className="w-7 h-7 rounded-lg bg-[#00d4ff15] flex items-center justify-center text-[#00d4ff] text-xs font-bold shrink-0">
                {s.step}
              </div>
              <div>
                <p className="text-sm font-medium text-white">{s.title}</p>
                <p className="text-xs text-[#4a4a6a]">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </ToolPageWrapper>
  );
}
