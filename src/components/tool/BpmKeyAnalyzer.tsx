import { useState, useCallback } from 'react';
import DropZone from './DropZone';
import ResultCard from './ResultCard';
import { analyzeAudio, validateFile, type AnalysisResult, type AnalysisProgress } from '../../lib/audioAnalysis';

type AppState = 'idle' | 'loading' | 'done' | 'error';

const STAGE_LABELS: Record<AnalysisProgress['stage'], string> = {
  'decoding': 'Decoding audio…',
  'analyzing-bpm': 'Detecting BPM…',
  'analyzing-key': 'Detecting key…',
  'done': 'Analysis complete',
};

export default function BpmKeyAnalyzer() {
  const [state, setState] = useState<AppState>('idle');
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [fileName, setFileName] = useState('');
  const [error, setError] = useState('');
  const [progress, setProgress] = useState<AnalysisProgress>({ stage: 'decoding', percent: 0 });
  const handleFileSelected = useCallback(async (file: File) => {
    // Validate
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      setState('error');
      return;
    }

    // Reset and start
    setError('');
    setResult(null);
    setFileName(file.name);
    setState('loading');
    setProgress({ stage: 'decoding', percent: 0 });

    try {
      const analysisResult = await analyzeAudio(file, (p) => {
        setProgress(p);
      });
      setResult(analysisResult);
      setState('done');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An unexpected error occurred during analysis.';
      setError(message);
      setState('error');
    }
  }, []);

  const isLoading = state === 'loading';

  return (
    <div id="bpm-key-analyzer">
      {/* Drop Zone */}
      <DropZone
        onFileSelected={handleFileSelected}
        disabled={isLoading}
        selectedFileName={state === 'done' || state === 'loading' ? fileName : undefined}
      />

      {/* Progress */}
      {isLoading && (
        <div className="progress-container" id="progress-indicator">
          <div className="progress-bar-track">
            <div
              className="progress-bar-fill"
              style={{ width: `${progress.percent}%` }}
            />
          </div>
          <div className="progress-label">{STAGE_LABELS[progress.stage]}</div>
        </div>
      )}

      {/* Error */}
      {state === 'error' && error && (
        <div className="error-message" id="error-message" role="alert">
          {error}
        </div>
      )}

      {/* Result Card */}
      {state === 'done' && result && (
        <ResultCard result={result} fileName={fileName} />
      )}
    </div>
  );
}
