import type { AnalysisResult } from '../../lib/audioAnalysis';
import { getCamelotCode, getTempoLabel, formatKeyName, normalizeScale } from '../../lib/musicalKey';

interface ResultCardProps {
  result: AnalysisResult;
  fileName: string;
}

export default function ResultCard({ result, fileName }: ResultCardProps) {
  const { bpm, key, scale } = result;
  const camelot = getCamelotCode(key, scale);
  const tempoLabel = getTempoLabel(bpm);
  const displayKey = formatKeyName(key);
  const displayScale = normalizeScale(scale);

  return (
    <div className="result-card" id="result-card">
      <div className="result-header">
        <span>Analysis result</span>
        <span className="result-filename">{fileName}</span>
      </div>
      <div className="result-grid">
        <div className="result-cell" id="result-bpm">
          <div className="result-label">BPM</div>
          <div className="result-value">
            {bpm > 0 ? bpm : '—'}
          </div>
          <div className="result-sub">{bpm > 0 ? tempoLabel : 'Unknown'}</div>
        </div>
        <div className="result-cell" id="result-key">
          <div className="result-label">Key</div>
          <div className="result-value key-accent">{displayKey}</div>
          <div className="result-sub">{displayScale}</div>
        </div>
        <div className="result-cell" id="result-camelot">
          <div className="result-label">Camelot</div>
          <div className="result-value">
            {camelot.number > 0 ? camelot.number : '—'}
            {camelot.number > 0 && <span className="unit">{camelot.letter}</span>}
          </div>
          <div className="result-sub">Mix-ready</div>
        </div>
      </div>
    </div>
  );
}
