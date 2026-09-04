import type { TabBeat, TabNote } from "./tab-types"

const NOTE_SEMITONES: Record<string, number> = {
  C: 0,
  "C#": 1,
  Db: 1,
  D: 2,
  "D#": 3,
  Eb: 3,
  E: 4,
  F: 5,
  "F#": 6,
  Gb: 6,
  G: 7,
  "G#": 8,
  Ab: 8,
  A: 9,
  "A#": 10,
  Bb: 10,
  B: 11,
}

/** Standard tuning open-string MIDI (string 1 = high E → string 6 = low E). */
const STANDARD_OPEN_NOTES = ["E", "B", "G", "D", "A", "E"] as const
const STANDARD_OPEN_MIDI = [64, 59, 55, 50, 45, 40] as const

export const DEFAULT_BEAT_DURATION_MS = 480

function parsePitchClass(name: string): number {
  const trimmed = name.trim()
  const fromMap = NOTE_SEMITONES[trimmed]
  if (fromMap !== undefined) return fromMap

  const match = trimmed.match(/^([A-Ga-g])([#b♯♭]?)/)
  if (!match) return 4

  const letter = match[1].toUpperCase()
  const accidental = match[2]
  const base = NOTE_SEMITONES[letter] ?? 4

  if (accidental === "#" || accidental === "♯") return (base + 1) % 12
  if (accidental === "b" || accidental === "♭") return (base + 11) % 12
  return base
}

export function getOpenStringMidi(stringNum: number, openNote: string): number {
  const index = stringNum - 1
  const referenceNote = STANDARD_OPEN_NOTES[index] ?? "E"
  const referenceMidi = STANDARD_OPEN_MIDI[index] ?? 40
  const semitoneShift = parsePitchClass(openNote) - parsePitchClass(referenceNote)
  return referenceMidi + semitoneShift
}

export function getNoteMidi(
  stringNum: number,
  fret: number,
  openNote: string
): number {
  return getOpenStringMidi(stringNum, openNote) + fret
}

export function midiToFrequency(midi: number): number {
  return 440 * Math.pow(2, (midi - 69) / 12)
}

export function getNoteFrequency(
  stringNum: number,
  fret: number,
  openNote: string
): number {
  const midi = getNoteMidi(stringNum, fret, openNote)
  return midiToFrequency(midi)
}

export function getNoteFrequencyFromTab(
  note: TabNote,
  tuningStrings: string[]
): number {
  const openNote = tuningStrings[note.string - 1] ?? "E"
  return getNoteFrequency(note.string, note.fret, openNote)
}

type PlayOptions = {
  duration?: number
  palmMute?: boolean
}

export class TabAudioEngine {
  private context: AudioContext | null = null
  private playbackToken = 0

  async ensureContext(): Promise<AudioContext> {
    if (!this.context) {
      this.context = new AudioContext()
    }
    if (this.context.state === "suspended") {
      await this.context.resume()
    }
    return this.context
  }

  playFrequency(frequency: number, options: PlayOptions = {}) {
    if (!this.context) return

    const { duration = 0.65, palmMute = false } = options
    const ctx = this.context
    const now = ctx.currentTime
    const noteDuration = palmMute ? 0.2 : duration

    const fundamental = ctx.createOscillator()
    const partial = ctx.createOscillator()
    const gain = ctx.createGain()
    const filter = ctx.createBiquadFilter()

    fundamental.type = "triangle"
    partial.type = "sine"
    fundamental.frequency.value = frequency
    partial.frequency.value = frequency * 2

    filter.type = "lowpass"
    filter.frequency.setValueAtTime(palmMute ? 700 : 3200, now)
    filter.Q.value = palmMute ? 1.5 : 0.7

    const peak = palmMute ? 0.14 : 0.22
    gain.gain.setValueAtTime(0.001, now)
    gain.gain.linearRampToValueAtTime(peak, now + 0.008)
    gain.gain.exponentialRampToValueAtTime(0.001, now + noteDuration)

    const partialGain = ctx.createGain()
    partialGain.gain.value = 0.35

    fundamental.connect(filter)
    partial.connect(partialGain)
    partialGain.connect(filter)
    filter.connect(gain)
    gain.connect(ctx.destination)

    fundamental.start(now)
    partial.start(now)
    fundamental.stop(now + noteDuration + 0.05)
    partial.stop(now + noteDuration + 0.05)
  }

  playNote(note: TabNote, tuningStrings: string[]) {
    const openNote = tuningStrings[note.string - 1] ?? "E"
    const frequency = getNoteFrequency(note.string, note.fret, openNote)
    this.playFrequency(frequency, {
      palmMute: note.technique === "palm-mute",
    })
  }

  playPreview(stringNum: number, fret: number, openNote: string) {
    const frequency = getNoteFrequency(stringNum, fret, openNote)
    this.playFrequency(frequency)
  }

  stopPlayback() {
    this.playbackToken += 1
  }

  async playBeats(
    beats: TabBeat[],
    tuningStrings: string[],
    onBeatChange: (index: number | null) => void,
    beatDurationMs = DEFAULT_BEAT_DURATION_MS
  ) {
    const token = ++this.playbackToken
    await this.ensureContext()

    for (let i = 0; i < beats.length; i++) {
      if (token !== this.playbackToken) {
        onBeatChange(null)
        return
      }

      onBeatChange(i)
      const beat = beats[i]

      for (const note of beat.notes) {
        this.playNote(note, tuningStrings)
      }

      await new Promise((resolve) => setTimeout(resolve, beatDurationMs))
    }

    if (token === this.playbackToken) {
      onBeatChange(null)
    }
  }
}
