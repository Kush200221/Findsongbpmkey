/**
 * Audio analysis using Essentia.js (client-side WASM).
 * Detects BPM and musical key from audio files.
 */

export interface AnalysisResult {
  bpm: number;
  key: string;
  scale: string;
  confidence: number;
}

export interface AnalysisProgress {
  stage: 'decoding' | 'analyzing-bpm' | 'analyzing-key' | 'done';
  percent: number;
}

type ProgressCallback = (progress: AnalysisProgress) => void;

const TARGET_SAMPLE_RATE = 44100;
const MAX_ANALYSIS_SECONDS = 75;

type EssentiaVector = {
  delete?: () => void;
};

type EssentiaInstance = {
  arrayToVector: (audio: Float32Array) => EssentiaVector;
  RhythmExtractor2013: (audio: EssentiaVector) => { bpm: number };
  PercivalBpmEstimator: (audio: EssentiaVector) => { bpm: number };
  KeyExtractor: (audio: EssentiaVector) => {
    key: string;
    scale: string;
    strength: number;
  };
};

let essentiaInstancePromise: Promise<EssentiaInstance> | null = null;

/**
 * Maximum file size in bytes (20MB).
 */
export const MAX_FILE_SIZE = 20 * 1024 * 1024;

/**
 * Accepted MIME types for audio files.
 */
export const ACCEPTED_TYPES = [
  'audio/mpeg',
  'audio/wav',
  'audio/x-wav',
  'audio/flac',
  'audio/x-flac',
  'audio/mp4',
  'audio/x-m4a',
  'audio/aac',
];

/**
 * Accepted file extensions.
 */
export const ACCEPTED_EXTENSIONS = ['.mp3', '.wav', '.flac', '.m4a'];

/**
 * Validate the uploaded file.
 */
export function validateFile(file: File | Blob): string | null {
  if (file.size > MAX_FILE_SIZE) {
    return `File is too large (${(file.size / 1024 / 1024).toFixed(1)}MB). Maximum size is 20MB.`;
  }

  const typeOk = ACCEPTED_TYPES.includes(file.type);
  let extOk = false;
  
  if ('name' in file) {
    const ext = '.' + file.name.split('.').pop()?.toLowerCase();
    extOk = ACCEPTED_EXTENSIONS.includes(ext);
  } else {
    // If it's a Blob from the backend, we rely on MIME type
    extOk = true; 
  }

  if (!typeOk && !extOk) {
    return `Unsupported file format. Please upload an MP3, WAV, FLAC, or M4A file.`;
  }

  return null;
}

/**
 * Downmix stereo audio to mono by averaging channels.
 */
function downmixToMono(
  audioBuffer: AudioBuffer,
  startFrame: number,
  frameCount: number,
): Float32Array {
  if (audioBuffer.numberOfChannels === 1) {
    return audioBuffer
      .getChannelData(0)
      .subarray(startFrame, startFrame + frameCount);
  }

  const mono = new Float32Array(frameCount);
  const channels = audioBuffer.numberOfChannels;

  for (let ch = 0; ch < channels; ch++) {
    const channelData = audioBuffer.getChannelData(ch);
    for (let i = 0; i < frameCount; i++) {
      mono[i] += channelData[startFrame + i] / channels;
    }
  }

  return mono;
}

/**
 * Select the representative middle of long tracks and prepare it at 44100 Hz.
 */
async function prepareAnalysisSignal(
  audioBuffer: AudioBuffer,
): Promise<Float32Array> {
  const duration = Math.min(audioBuffer.duration, MAX_ANALYSIS_SECONDS);
  const startTime = Math.max(0, (audioBuffer.duration - duration) / 2);
  const startFrame = Math.floor(startTime * audioBuffer.sampleRate);
  const frameCount = Math.min(
    audioBuffer.length - startFrame,
    Math.ceil(duration * audioBuffer.sampleRate),
  );

  if (audioBuffer.sampleRate === TARGET_SAMPLE_RATE) {
    return downmixToMono(audioBuffer, startFrame, frameCount);
  }

  const targetLength = Math.ceil(duration * TARGET_SAMPLE_RATE);
  const offlineCtx = new OfflineAudioContext(
    1,
    targetLength,
    TARGET_SAMPLE_RATE,
  );

  const source = offlineCtx.createBufferSource();
  source.buffer = audioBuffer;
  source.connect(offlineCtx.destination);
  source.start(0, startTime, duration);

  const resampled = await offlineCtx.startRendering();
  return resampled.getChannelData(0);
}

async function getEssentiaInstance(): Promise<EssentiaInstance> {
  if (!essentiaInstancePromise) {
    essentiaInstancePromise = Promise.all([
      import('essentia.js/dist/essentia.js-core.es.js'),
      import('essentia.js/dist/essentia-wasm.es.js'),
    ])
      .then(([EssentiaModule, WasmModule]) => {
        return new EssentiaModule.default(
          WasmModule.EssentiaWASM,
        ) as EssentiaInstance;
      })
      .catch((error) => {
        // A failed first load should not permanently break later uploads.
        essentiaInstancePromise = null;
        throw error;
      });
  }

  return essentiaInstancePromise;
}

function yieldToBrowser(): Promise<void> {
  return new Promise((resolve) => requestAnimationFrame(() => resolve()));
}

/**
 * Main analysis function.
 * Decodes audio, runs BPM and key detection via Essentia.js.
 */
export async function analyzeAudio(
  file: File | Blob,
  onProgress?: ProgressCallback
): Promise<AnalysisResult> {
  // Compile the WASM module while the browser reads and decodes the file.
  const essentiaTask = getEssentiaInstance();

  // Stage 1: Decode audio
  onProgress?.({ stage: 'decoding', percent: 10 });

  const arrayBuffer = await file.arrayBuffer();
  const audioCtx = new AudioContext({ sampleRate: TARGET_SAMPLE_RATE });

  let audioBuffer: AudioBuffer;
  try {
    audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
  } finally {
    await audioCtx.close();
  }

  onProgress?.({ stage: 'decoding', percent: 30 });

  // Analyze at most 75 seconds instead of processing the entire track twice.
  const monoData = await prepareAnalysisSignal(audioBuffer);

  onProgress?.({ stage: 'analyzing-bpm', percent: 40 });

  // Stage 2: Reuse the cached Essentia instance across uploads.
  const essentia = await essentiaTask;
  const audioVector = essentia.arrayToVector(monoData);

  try {
    // BPM detection
    onProgress?.({ stage: 'analyzing-bpm', percent: 50 });
    await yieldToBrowser();

    let bpm = 0;
    try {
      const rhythm = essentia.RhythmExtractor2013(audioVector);
      bpm = Math.round(rhythm.bpm);
    } catch {
      // Fallback: try PercivalBpmEstimator
      try {
        const percival = essentia.PercivalBpmEstimator(audioVector);
        bpm = Math.round(percival.bpm);
      } catch {
        bpm = 0;
      }
    }

    // Key detection
    onProgress?.({ stage: 'analyzing-key', percent: 75 });
    await yieldToBrowser();

    let key = 'C';
    let scale = 'major';
    let confidence = 0;

    try {
      const keyResult = essentia.KeyExtractor(audioVector);
      key = keyResult.key;
      scale = keyResult.scale;
      confidence = keyResult.strength;
    } catch {
      // Key detection failed, keep defaults
    }

    onProgress?.({ stage: 'done', percent: 100 });

    return { bpm, key, scale, confidence };
  } finally {
    audioVector.delete?.();
  }
}
