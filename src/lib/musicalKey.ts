/**
 * Musical key utilities: Camelot wheel mapping, tempo labels, key formatting.
 */

/** Camelot code (e.g. "6B", "8A") */
export interface CamelotCode {
  number: number;
  letter: 'A' | 'B';
  display: string;
}

/**
 * Full Camelot Wheel mapping.
 * A = minor keys (inner ring), B = major keys (outer ring).
 */
const CAMELOT_MAP: Record<string, CamelotCode> = {
  // Minor keys → A
  'Ab_minor': { number: 1, letter: 'A', display: '1A' },
  'Eb_minor': { number: 2, letter: 'A', display: '2A' },
  'Bb_minor': { number: 3, letter: 'A', display: '3A' },
  'F_minor':  { number: 4, letter: 'A', display: '4A' },
  'C_minor':  { number: 5, letter: 'A', display: '5A' },
  'G_minor':  { number: 6, letter: 'A', display: '6A' },
  'D_minor':  { number: 7, letter: 'A', display: '7A' },
  'A_minor':  { number: 8, letter: 'A', display: '8A' },
  'E_minor':  { number: 9, letter: 'A', display: '9A' },
  'B_minor':  { number: 10, letter: 'A', display: '10A' },
  'F#_minor': { number: 11, letter: 'A', display: '11A' },
  'Db_minor': { number: 12, letter: 'A', display: '12A' },
  // Enharmonic minor equivalents
  'G#_minor': { number: 1, letter: 'A', display: '1A' },
  'D#_minor': { number: 2, letter: 'A', display: '2A' },
  'A#_minor': { number: 3, letter: 'A', display: '3A' },
  'C#_minor': { number: 12, letter: 'A', display: '12A' },
  'Gb_minor': { number: 11, letter: 'A', display: '11A' },

  // Major keys → B
  'B_major':  { number: 1, letter: 'B', display: '1B' },
  'Gb_major': { number: 2, letter: 'B', display: '2B' },
  'Db_major': { number: 3, letter: 'B', display: '3B' },
  'Ab_major': { number: 4, letter: 'B', display: '4B' },
  'Eb_major': { number: 5, letter: 'B', display: '5B' },
  'Bb_major': { number: 6, letter: 'B', display: '6B' },
  'F_major':  { number: 7, letter: 'B', display: '7B' },
  'C_major':  { number: 8, letter: 'B', display: '8B' },
  'G_major':  { number: 9, letter: 'B', display: '9B' },
  'D_major':  { number: 10, letter: 'B', display: '10B' },
  'A_major':  { number: 11, letter: 'B', display: '11B' },
  'E_major':  { number: 12, letter: 'B', display: '12B' },
  // Enharmonic major equivalents
  'F#_major': { number: 2, letter: 'B', display: '2B' },
  'C#_major': { number: 3, letter: 'B', display: '3B' },
  'G#_major': { number: 4, letter: 'B', display: '4B' },
  'D#_major': { number: 5, letter: 'B', display: '5B' },
  'A#_major': { number: 6, letter: 'B', display: '6B' },
  'Cb_major': { number: 1, letter: 'B', display: '1B' },
};

/**
 * Get the Camelot code for a given musical key and scale.
 * @param key - Root note (e.g., "Bb", "F#", "C")
 * @param scale - "major" or "minor"
 */
export function getCamelotCode(key: string, scale: string): CamelotCode {
  const normalizedScale = scale.toLowerCase();
  const lookupKey = `${key}_${normalizedScale}`;

  const result = CAMELOT_MAP[lookupKey];
  if (result) return result;

  // Fallback: return a sensible default
  return { number: 0, letter: 'B', display: '—' };
}

/**
 * Map BPM to an Italian tempo marking.
 */
export function getTempoLabel(bpm: number): string {
  if (bpm < 40) return 'Grave';
  if (bpm < 55) return 'Largo';
  if (bpm < 66) return 'Larghetto';
  if (bpm < 76) return 'Adagio';
  if (bpm < 92) return 'Andante';
  if (bpm < 108) return 'Moderato';
  if (bpm < 120) return 'Allegretto';
  if (bpm < 156) return 'Allegro';
  if (bpm < 176) return 'Vivace';
  if (bpm < 200) return 'Presto';
  return 'Prestissimo';
}

/**
 * Convert flat/sharp symbols to proper unicode.
 * Essentia returns keys like "Bb", "F#", etc.
 */
export function formatKeyName(key: string): string {
  return key
    .replace(/b$/, '♭')
    .replace(/bb$/, '𝄫')
    .replace(/#$/, '♯');
}

/**
 * Normalize the scale string from Essentia output.
 */
export function normalizeScale(scale: string): 'Major' | 'Minor' {
  return scale.toLowerCase() === 'minor' ? 'Minor' : 'Major';
}
