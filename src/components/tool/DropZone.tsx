import { useCallback, useRef, useState } from 'react';
import { ACCEPTED_EXTENSIONS } from '../../lib/audioAnalysis';

interface DropZoneProps {
  onFileSelected: (file: File) => void;
  disabled?: boolean;
  selectedFileName?: string;
}

export default function DropZone({ onFileSelected, disabled, selectedFileName }: DropZoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) setIsDragOver(true);
  }, [disabled]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    if (disabled) return;

    const file = e.dataTransfer.files[0];
    if (file) onFileSelected(file);
  }, [disabled, onFileSelected]);

  const handleClick = useCallback(() => {
    if (!disabled) inputRef.current?.click();
  }, [disabled]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onFileSelected(file);
    // Reset input so re-selecting the same file triggers change
    e.target.value = '';
  }, [onFileSelected]);

  const acceptStr = ACCEPTED_EXTENSIONS.join(',');

  return (
    <div
      id="drop-zone"
      className={`drop-zone${isDragOver ? ' drag-over' : ''}${disabled ? ' disabled' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      aria-label="Upload audio file"
    >
      <input
        ref={inputRef}
        type="file"
        accept={acceptStr}
        onChange={handleChange}
        style={{ display: 'none' }}
        id="file-input"
        aria-hidden="true"
      />
      <div className="drop-zone-icon">♪</div>
      {selectedFileName ? (
        <>
          <div className="drop-zone-main">File selected</div>
          <div className="drop-zone-file">{selectedFileName}</div>
        </>
      ) : (
        <>
          <div className="drop-zone-main">Drop your audio file here</div>
          <div className="drop-zone-sub">MP3, WAV, FLAC, M4A — up to 20MB</div>
        </>
      )}
    </div>
  );
}
