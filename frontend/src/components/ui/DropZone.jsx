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
          ? 'dropzone-active border-[var(--color-accent-blue)]'
          : 'border-[var(--color-border-bright)] hover:border-[var(--color-accent-blue-20)] bg-[var(--color-bg-secondary)] hover:bg-[var(--color-bg-secondary)]'
        }`}
    >
      <input {...getInputProps()} />
      
      <div className="flex flex-col items-center gap-4">
        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300
          ${isDragActive 
            ? 'bg-[var(--color-accent-blue-10)] scale-110' 
            : 'bg-[var(--color-bg-card)] group-hover:bg-[var(--color-accent-blue-10)] group-hover:scale-105'
          }`}
        >
          {isDragActive 
            ? <FileUp className="w-8 h-8 text-[var(--color-accent-blue)] animate-bounce" />
            : <UploadCloud className="w-8 h-8 text-[var(--color-text-muted)] group-hover:text-[var(--color-accent-blue)] transition-colors" />
          }
        </div>
        
        <div>
          <p className="text-base font-medium text-[var(--color-text-primary)] mb-1 font-[var(--font-display)]">
            {isDragActive ? 'Drop your files here' : 'Drag & drop your files here'}
          </p>
          <p className="text-sm text-[var(--color-text-secondary)]">
            or <span className="text-[var(--color-accent-blue)] font-medium">browse files</span> from your device
          </p>
        </div>

        {multiple && (
          <p className="text-xs text-[var(--color-text-muted)]">
            Upload up to {maxFiles} files at once
          </p>
        )}
      </div>

      {/* Corner decorations */}
      <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-[var(--color-accent-blue-20)] rounded-tl-md" />
      <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-[var(--color-accent-blue-20)] rounded-tr-md" />
      <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-[var(--color-accent-blue-20)] rounded-bl-md" />
      <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-[var(--color-accent-blue-20)] rounded-br-md" />
    </div>
  );
}
