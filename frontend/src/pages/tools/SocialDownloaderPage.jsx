import { useParams } from 'react-router-dom';
import { getToolById } from '../../data/tools';
import ToolPageWrapper, { SocialDownloaderLayout } from '../../components/tools/ToolPageWrapper';

export default function SocialDownloaderPage() {
  const { toolId } = useParams();
  const tool = getToolById(toolId);
  if (!tool) return null;

  return (
    <ToolPageWrapper>
      <SocialDownloaderLayout tool={tool} />
      
      {/* Info */}
      <div className="mt-8 pt-6 border-t border-[var(--color-border)]">
        <h3 className="text-sm font-semibold text-[var(--color-text-primary)] mb-3 font-[var(--font-display)]">How it works</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { step: '1', title: 'Paste URL', desc: 'Copy the video link and paste it above' },
            { step: '2', title: 'Fetch Info', desc: 'We analyze the video and find download links' },
            { step: '3', title: 'Download', desc: 'Choose your preferred quality and download' },
          ].map(s => (
            <div key={s.step} className="flex items-start gap-3 p-3 rounded-xl bg-[var(--color-bg-primary)]">
              <div className="w-7 h-7 rounded-lg bg-[#f43f5e15] flex items-center justify-center text-[#f43f5e] text-xs font-bold shrink-0">{s.step}</div>
              <div><p className="text-sm font-medium text-[var(--color-text-primary)]">{s.title}</p><p className="text-xs text-[var(--color-text-muted)]">{s.desc}</p></div>
            </div>
          ))}
        </div>
      </div>

      {/* Disclaimer */}
      <div className="mt-6 px-4 py-3 rounded-xl bg-[#f59e0b08] border border-[#f59e0b22]">
        <p className="text-xs text-[#f59e0b99]">
          ⚠️ This tool is for personal use only. Please respect copyright laws and the terms of service of the respective platforms.
        </p>
      </div>
    </ToolPageWrapper>
  );
}
