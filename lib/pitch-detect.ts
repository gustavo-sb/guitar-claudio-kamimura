const NOTE_NAMES = [
  "C",
  "C#",
  "D",
  "D#",
  "E",
  "F",
  "F#",
  "G",
  "G#",
  "A",
  "A#",
  "B",
] as const

const A4_HZ = 440
const MIN_HZ = 60
const MAX_HZ = 1200

export type DetectedPitch = {
  frequency: number
  note: string
  octave: number
  midi: number
  cents: number
  clarity: number
}

/** YIN-inspired difference function + CMND for monophonic pitch. */
export function detectPitch(
  buffer: Float32Array,
  sampleRate: number
): DetectedPitch | null {
  const size = buffer.length
  let rms = 0
  for (let i = 0; i < size; i++) {
    const sample = buffer[i] ?? 0
    rms += sample * sample
  }
  rms = Math.sqrt(rms / size)
  if (rms < 0.01) return null

  const minLag = Math.floor(sampleRate / MAX_HZ)
  const maxLag = Math.min(Math.floor(sampleRate / MIN_HZ), size - 1)
  if (maxLag <= minLag) return null

  const yinBuffer = new Float32Array(maxLag + 1)
  yinBuffer[0] = 1

  for (let tau = 1; tau <= maxLag; tau++) {
    let sum = 0
    for (let i = 0; i < size - tau; i++) {
      const delta = (buffer[i] ?? 0) - (buffer[i + tau] ?? 0)
      sum += delta * delta
    }
    yinBuffer[tau] = sum
  }

  let runningSum = 0
  for (let tau = 1; tau <= maxLag; tau++) {
    runningSum += yinBuffer[tau] ?? 0
    yinBuffer[tau] = runningSum > 0 ? (yinBuffer[tau] ?? 0) * tau / runningSum : 1
  }

  const threshold = 0.15
  let tauEstimate = -1

  for (let tau = minLag; tau < maxLag; tau++) {
    const value = yinBuffer[tau] ?? 1
    if (value < threshold) {
      while (tau + 1 < maxLag && (yinBuffer[tau + 1] ?? 1) < (yinBuffer[tau] ?? 1)) {
        tau += 1
      }
      tauEstimate = tau
      break
    }
  }

  if (tauEstimate === -1) {
    let minValue = 1
    for (let tau = minLag; tau <= maxLag; tau++) {
      const value = yinBuffer[tau] ?? 1
      if (value < minValue) {
        minValue = value
        tauEstimate = tau
      }
    }
    if (minValue > 0.35 || tauEstimate < 0) return null
  }

  const betterTau = parabolicInterpolation(yinBuffer, tauEstimate)
  if (betterTau <= 0) return null

  const frequency = sampleRate / betterTau
  if (frequency < MIN_HZ || frequency > MAX_HZ) return null

  const clarity = 1 - (yinBuffer[tauEstimate] ?? 1)
  if (clarity < 0.55) return null

  return frequencyToPitch(frequency, clarity)
}

function parabolicInterpolation(buffer: Float32Array, tau: number): number {
  const prev = buffer[tau - 1] ?? 0
  const center = buffer[tau] ?? 0
  const next = buffer[tau + 1] ?? 0
  const denominator = 2 * (2 * center - prev - next)
  if (denominator === 0) return tau
  return tau + (prev - next) / denominator
}

export function frequencyToPitch(
  frequency: number,
  clarity = 1
): DetectedPitch {
  const midiFloat = 69 + 12 * Math.log2(frequency / A4_HZ)
  const midi = Math.round(midiFloat)
  const cents = (midiFloat - midi) * 100
  const noteIndex = ((midi % 12) + 12) % 12
  const octave = Math.floor(midi / 12) - 1

  return {
    frequency,
    note: NOTE_NAMES[noteIndex] ?? "A",
    octave,
    midi,
    cents,
    clarity,
  }
}

export function centsToNeedle(cents: number, maxCents = 50): number {
  const clamped = Math.max(-maxCents, Math.min(maxCents, cents))
  return clamped / maxCents
}

export function isInTune(cents: number, threshold = 5): boolean {
  return Math.abs(cents) <= threshold
}
