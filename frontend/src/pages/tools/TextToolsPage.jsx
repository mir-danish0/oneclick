import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { getToolById } from '../../data/tools';
import ToolPageWrapper from '../../components/tools/ToolPageWrapper';
import { Copy, Check } from 'lucide-react';
import toast from 'react-hot-toast';

function WordCounter() {
  const [text, setText] = useState('');
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const chars = text.length;
  const sentences = text.trim() ? text.split(/[.!?]+/).filter(Boolean).length : 0;
  const paragraphs = text.trim() ? text.split(/\n\n+/).filter(Boolean).length : 0;
  const readingTime = Math.ceil(words / 200);

  return (
    <ToolPageWrapper>
      <div className="space-y-6">
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Start typing or paste your text here..."
          rows={8}
          className="w-full bg-[#0f0f1a] border border-[#2a2a45] rounded-xl p-5 text-white placeholder:text-[#4a4a6a] focus:outline-none focus:border-[#00d4ff55] text-sm resize-none leading-relaxed"
        />
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {[
            { label: 'Words', value: words, color: '#00d4ff' },
            { label: 'Characters', value: chars, color: '#00ff88' },
            { label: 'Sentences', value: sentences, color: '#7c3aed' },
            { label: 'Paragraphs', value: paragraphs, color: '#f59e0b' },
            { label: 'Read Time', value: `${readingTime}m`, color: '#f43f5e' },
          ].map(s => (
            <div key={s.label} className="bg-[#0f0f1a] border border-[#1e1e32] rounded-xl p-4 text-center">
              <p className="text-2xl font-bold font-[Space_Grotesk]" style={{ color: s.color }}>{s.value}</p>
              <p className="text-xs text-[#4a4a6a] mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </ToolPageWrapper>
  );
}

function CaseConverter() {
  const [text, setText] = useState('');
  const [copied, setCopied] = useState(false);

  const convert = (type) => {
    switch (type) {
      case 'upper': setText(text.toUpperCase()); break;
      case 'lower': setText(text.toLowerCase()); break;
      case 'title': setText(text.replace(/\w\S*/g, t => t.charAt(0).toUpperCase() + t.substr(1).toLowerCase())); break;
      case 'sentence': setText(text.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, c => c.toUpperCase())); break;
      case 'alternate': setText([...text].map((c, i) => i % 2 === 0 ? c.toLowerCase() : c.toUpperCase()).join('')); break;
      case 'inverse': setText([...text].map(c => c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase()).join('')); break;
    }
    toast.success('Text converted!');
  };

  const copy = () => { navigator.clipboard.writeText(text); setCopied(true); toast.success('Copied!'); setTimeout(() => setCopied(false), 2000); };

  const cases = [
    { id: 'upper', label: 'UPPER CASE' },
    { id: 'lower', label: 'lower case' },
    { id: 'title', label: 'Title Case' },
    { id: 'sentence', label: 'Sentence case' },
    { id: 'alternate', label: 'aLtErNaTe' },
    { id: 'inverse', label: 'iNVERSE' },
  ];

  return (
    <ToolPageWrapper>
      <div className="space-y-6">
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Type or paste text to convert..."
          rows={6}
          className="w-full bg-[#0f0f1a] border border-[#2a2a45] rounded-xl p-5 text-white placeholder:text-[#4a4a6a] focus:outline-none focus:border-[#00d4ff55] text-sm resize-none"
        />
        <div className="flex flex-wrap gap-2">
          {cases.map(c => (
            <button key={c.id} onClick={() => convert(c.id)}
              className="px-4 py-2 rounded-xl bg-[#13131f] border border-[#1e1e32] text-sm text-[#8888aa] hover:text-white hover:border-[#00d4ff44] transition-all">
              {c.label}
            </button>
          ))}
        </div>
        {text && (
          <button onClick={copy} className="px-5 py-2 rounded-lg bg-[#00d4ff15] text-[#00d4ff] text-sm font-medium hover:bg-[#00d4ff25] flex items-center gap-1.5">
            {copied ? <><Check className="w-3.5 h-3.5" /> Copied</> : <><Copy className="w-3.5 h-3.5" /> Copy Text</>}
          </button>
        )}
      </div>
    </ToolPageWrapper>
  );
}

function LoremGenerator() {
  const [count, setCount] = useState(3);
  const [type, setType] = useState('paragraphs');
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);

  const loremBase = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';
  const loremSentences = loremBase.split('. ').map(s => s.endsWith('.') ? s : s + '.');
  const loremWords = loremBase.split(' ');

  const generate = () => {
    let result = '';
    if (type === 'paragraphs') {
      result = Array(count).fill(null).map(() => {
        const sentCount = 3 + Math.floor(Math.random() * 4);
        return Array(sentCount).fill(null).map((_, i) => loremSentences[i % loremSentences.length]).join(' ');
      }).join('\n\n');
    } else if (type === 'sentences') {
      result = Array(count).fill(null).map((_, i) => loremSentences[i % loremSentences.length]).join(' ');
    } else {
      result = Array(count).fill(null).map((_, i) => loremWords[i % loremWords.length]).join(' ');
    }
    setOutput(result);
    toast.success('Generated!');
  };

  const copy = () => { navigator.clipboard.writeText(output); setCopied(true); toast.success('Copied!'); setTimeout(() => setCopied(false), 2000); };

  return (
    <ToolPageWrapper>
      <div className="space-y-6">
        <div className="flex flex-wrap gap-3 items-end">
          <div>
            <label className="block text-xs text-[#4a4a6a] mb-1">Count</label>
            <input type="number" value={count} onChange={e => setCount(Math.max(1, parseInt(e.target.value) || 1))} min={1} max={100}
              className="bg-[#0f0f1a] border border-[#2a2a45] rounded-xl px-4 py-2.5 text-white text-sm w-24 focus:outline-none focus:border-[#00d4ff55]" />
          </div>
          <div className="flex gap-2">
            {['paragraphs', 'sentences', 'words'].map(t => (
              <button key={t} onClick={() => setType(t)}
                className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${type === t ? 'bg-[#00d4ff] text-[#0a0a0f]' : 'bg-[#1e1e32] text-[#8888aa]'}`}>
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>
          <button onClick={generate} className="btn-primary px-6 py-2.5 rounded-xl font-bold"><span>Generate</span></button>
        </div>
        {output && (
          <div className="relative">
            <textarea readOnly value={output} rows={8}
              className="w-full bg-[#0f0f1a] border border-[#2a2a45] rounded-xl p-5 text-sm text-[#8888aa] focus:outline-none resize-none leading-relaxed" />
            <button onClick={copy} className="absolute top-3 right-3 p-2 rounded-lg bg-[#1e1e32] hover:bg-[#00d4ff22] text-[#8888aa] hover:text-[#00d4ff]">
              {copied ? <Check className="w-4 h-4 text-[#00ff88]" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        )}
      </div>
    </ToolPageWrapper>
  );
}

function TextToSpeechPlaceholder() {
  const tool = getToolById('text-to-speech');
  return (
    <ToolPageWrapper>
      <div className="text-center py-12">
        <div className="w-20 h-20 rounded-2xl bg-[#00d4ff10] flex items-center justify-center mx-auto mb-5">
          {tool && <tool.icon className="w-10 h-10 text-[#00d4ff]" />}
        </div>
        <h3 className="text-xl font-bold text-white font-[Space_Grotesk] mb-2">Text to Speech</h3>
        <p className="text-[#8888aa] mb-4 max-w-md mx-auto">Convert text into natural-sounding audio.</p>
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#f59e0b15] border border-[#f59e0b33]">
          <span className="text-sm text-[#f59e0b] font-medium">🚧 Coming Soon — API integration required</span>
        </div>
      </div>
    </ToolPageWrapper>
  );
}

export default function TextToolsPage() {
  const { toolId } = useParams();
  if (toolId === 'word-counter') return <WordCounter />;
  if (toolId === 'case-converter') return <CaseConverter />;
  if (toolId === 'lorem-generator') return <LoremGenerator />;
  if (toolId === 'text-to-speech') return <TextToSpeechPlaceholder />;
  return null;
}
