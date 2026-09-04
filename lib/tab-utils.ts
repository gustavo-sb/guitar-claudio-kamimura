import type { TabBeat, TabMeasure, TabNote, Technique } from "./tab-types"
import { STRING_COUNT } from "./tab-constants"
import { getTechniqueDef } from "./tab-constants"

const LINKED_TECHNIQUES = new Set<Technique>([
  "hammer-on",
  "pull-off",
  "slide-up",
  "slide-down",
])

export function isLinkedTechnique(
  technique: Technique | undefined
): technique is Technique {
  return technique !== undefined && LINKED_TECHNIQUES.has(technique)
}

export function createId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

function formatFret(fret: number): string {
  return fret === 0 ? "0" : String(fret)
}

export function getNextBeatCursor(
  measures: TabMeasure[],
  measureIndex: number,
  beatIndex: number
): { measureIndex: number; beatIndex: number } | null {
  const measure = measures[measureIndex]
  if (!measure) return null

  if (beatIndex + 1 < measure.beats.length) {
    return { measureIndex, beatIndex: beatIndex + 1 }
  }

  if (measureIndex + 1 < measures.length) {
    return { measureIndex: measureIndex + 1, beatIndex: 0 }
  }

  return null
}

export function getPrevBeatCursor(
  measures: TabMeasure[],
  measureIndex: number,
  beatIndex: number
): { measureIndex: number; beatIndex: number } | null {
  if (beatIndex > 0) {
    return { measureIndex, beatIndex: beatIndex - 1 }
  }

  if (measureIndex > 0) {
    const prevMeasure = measures[measureIndex - 1]
    return {
      measureIndex: measureIndex - 1,
      beatIndex: Math.max(0, prevMeasure.beats.length - 1),
    }
  }

  return null
}

export function beatAt(
  measures: TabMeasure[],
  measureIndex: number,
  beatIndex: number
): TabBeat {
  return measures[measureIndex]?.beats[beatIndex] ?? { id: "", notes: [] }
}

export function notesOnString(beat: TabBeat, stringNum: number): TabNote[] {
  return beat.notes.filter((note) => note.string === stringNum)
}

function formatLinkedNotes(origin: TabNote, destination: TabNote): string {
  const symbol = getTechniqueDef(origin.technique!)?.symbol ?? ""
  return `${formatFret(origin.fret)}${symbol}${formatFret(destination.fret)}`
}

function isLinkTargetFromPreviousBeat(
  measures: TabMeasure[],
  measureIndex: number,
  beatIndex: number,
  stringNum: number
): boolean {
  const prev = getPrevBeatCursor(measures, measureIndex, beatIndex)
  if (!prev) return false

  const prevNotes = notesOnString(
    beatAt(measures, prev.measureIndex, prev.beatIndex),
    stringNum
  )
  const origin = prevNotes.find((note) => isLinkedTechnique(note.technique))
  if (!origin) return false

  const sameBeatDest = prevNotes.find((note) => note.id !== origin.id)
  return !sameBeatDest
}

export type StringBeatDisplay = {
  text: string
  note: TabNote | undefined
  isLinkTarget: boolean
}

/** Formats one string row inside a beat, merging linked techniques (e.g. 7/9, 5h7). */
export function formatStringAtBeat(
  measures: TabMeasure[],
  measureIndex: number,
  beatIndex: number,
  stringNum: number
): StringBeatDisplay {
  const beat = beatAt(measures, measureIndex, beatIndex)
  const stringNotes = notesOnString(beat, stringNum)

  if (stringNotes.length === 0) {
    return { text: "", note: undefined, isLinkTarget: false }
  }

  const origin = stringNotes.find((note) => isLinkedTechnique(note.technique))

  if (origin) {
    const sameBeatDest = stringNotes.find((note) => note.id !== origin.id)
    if (sameBeatDest) {
      return {
        text: formatLinkedNotes(origin, sameBeatDest),
        note: origin,
        isLinkTarget: false,
      }
    }

    const next = getNextBeatCursor(measures, measureIndex, beatIndex)
    if (next) {
      const nextNote = findNoteOnString(
        beatAt(measures, next.measureIndex, next.beatIndex),
        stringNum
      )
      if (nextNote) {
        return {
          text: formatLinkedNotes(origin, nextNote),
          note: origin,
          isLinkTarget: false,
        }
      }
    }

    const symbol = getTechniqueDef(origin.technique!)?.symbol ?? ""
    return {
      text: `${formatFret(origin.fret)}${symbol}`,
      note: origin,
      isLinkTarget: false,
    }
  }

  const note = stringNotes[0]

  if (isLinkTargetFromPreviousBeat(measures, measureIndex, beatIndex, stringNum)) {
    return { text: "", note, isLinkTarget: true }
  }

  return {
    text: formatNoteForTab(note),
    note,
    isLinkTarget: false,
  }
}

export function longestStringTextInBeat(
  measures: TabMeasure[],
  measureIndex: number,
  beatIndex: number
): number {
  let max = 0

  for (let string = 1; string <= STRING_COUNT; string++) {
    const { text, isLinkTarget } = formatStringAtBeat(
      measures,
      measureIndex,
      beatIndex,
      string
    )
    if (!isLinkTarget) {
      max = Math.max(max, text.length)
    }
  }

  return max
}

export function formatNoteForTab(note: TabNote): string {
  const fret = formatFret(note.fret)
  const tech = note.technique ? getTechniqueDef(note.technique) : undefined

  if (!tech || isLinkedTechnique(note.technique)) return fret

  if (tech.position === "before") {
    return `${tech.symbol}${fret}`
  }

  return `${fret}${tech.symbol}`
}

export function noteKey(string: number, fret: number): string {
  return `${string}-${fret}`
}

export function findNoteInBeat(
  beat: TabBeat,
  string: number,
  fret: number
): TabNote | undefined {
  return beat.notes.find((n) => n.string === string && n.fret === fret)
}

export function findNoteOnString(beat: TabBeat, string: number): TabNote | undefined {
  return beat.notes.find((n) => n.string === string)
}

export function applyTechnique(note: TabNote, technique: Technique): TabNote {
  return { ...note, technique }
}
