import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, FileUp } from 'lucide-react';

export default function DropZone({ onFilesSelected, accept, multiple = false, maxFiles = 10 }) {
  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      onFilesSelected(acceptedFiles);
    }
  }, [onFilesSelected]);

  const { getRootProps, getInputProps, isDragActive, acceptedFiles } = useDropzone({
    onDrop,
    accept,
    multiple,
    maxFiles,
  });

  return (
    <div
      {...getRootProps()}
      className={`relative border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer
        transition-all duration-300 group
        ${isDragActive
          ? 'dropzone-active border-[#00d4ff]'
          : 'border-[#2a2a45] hover:border-[#00d4ff55] bg-[#0f0f1a]/50 hover:bg-[#0f0f1a]'
        }`}
    >
      <input {...getInputProps()} />
      
      <div className="flex flex-col items-center gap-4">
        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300
          ${isDragActive 
            ? 'bg-[#00d4ff]/15 scale-110' 
            : 'bg-[#1e1e32] group-hover:bg-[#00d4ff]/10 group-hover:scale-105'
          }`}
        >
          {isDragActive 
            ? <FileUp className="w-8 h-8 text-[#00d4ff] animate-bounce" />
            : <UploadCloud className="w-8 h-8 text-[#8888aa] group-hover:text-[#00d4ff] transition-colors" />
          }
        </div>
        
        <div>
          <p className="text-base font-medium text-white mb-1 font-[Space_Grotesk]">
            {isDragActive ? 'Drop your files here' : 'Drag & drop your files here'}
          </p>
          <p className="text-sm text-[#8888aa]">
            or <span className="text-[#00d4ff] font-medium">browse files</span> from your device
          </p>
        </div>

        {multiple && (
          <p className="text-xs text-[#4a4a6a]">
            Upload up to {maxFiles} files at once
          </p>
        )}
      </div>

      {/* Corner decorations */}
      <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-[#00d4ff33] rounded-tl-md" />
      <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-[#00d4ff33] rounded-tr-md" />
      <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-[#00d4ff33] rounded-bl-md" />
      <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-[#00d4ff33] rounded-br-md" />
    </div>
  );
}
