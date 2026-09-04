import type { TabBeat, TabMeasure, TabNote, Technique } from "./tab-types"
import { STRING_COUNT } from "./tab-constants"
import {
  beatAt,
  findNoteOnString,
  getNextBeatCursor,
  getPrevBeatCursor,
  isLinkedTechnique,
  notesOnString,
} from "./tab-utils"

export type LinkedTechnique = "hammer-on" | "pull-off" | "slide-up" | "slide-down"

export type TabArtifact =
  | "vibrato"
  | "bend"
  | "tap"
  | "harmonic"
  | "palm-mute"

export type TabStringNotation =
  | { kind: "empty" }
  | { kind: "link-target"; note: TabNote }
  | { kind: "fret"; note: TabNote; fret: string }
  | {
      kind: "linked"
      note: TabNote
      technique: LinkedTechnique
      originFret: string
      destFret: string
    }
  | {
      kind: "linked-pending"
      note: TabNote
      technique: LinkedTechnique
      originFret: string
    }
  | {
      kind: "fret-with-artifact"
      note: TabNote
      fret: string
      artifact: TabArtifact
    }

function formatFret(fret: number): string {
  return fret === 0 ? "0" : String(fret)
}

function isLinkTargetFromPreviousBeat(
  measures: TabMeasure[],
  measureIndex: number,
  beatIndex: number,
  stringNum: number
): boolean {
  const current = { measureIndex, beatIndex }

  for (let m = 0; m < measures.length; m++) {
    for (let b = 0; b < measures[m].beats.length; b++) {
      const notes = notesOnString(beatAt(measures, m, b), stringNum)
      const origin = notes.find((note) => isLinkedTechnique(note.technique))

      if (!origin?.linkTarget) continue

      if (
        origin.linkTarget.measureIndex === current.measureIndex &&
        origin.linkTarget.beatIndex === current.beatIndex
      ) {
        return true
      }
    }
  }

  const prev = getPrevBeatCursor(measures, measureIndex, beatIndex)
  if (!prev) return false

  const prevNotes = notesOnString(
    beatAt(measures, prev.measureIndex, prev.beatIndex),
    stringNum
  )
  const origin = prevNotes.find((note) => isLinkedTechnique(note.technique))
  if (!origin || origin.linkTarget) return false

  const sameBeatDest = prevNotes.find((note) => note.id !== origin.id)
  return !sameBeatDest
}

function artifactFromTechnique(
  technique: Technique | undefined
): TabArtifact | undefined {
  switch (technique) {
    case "vibrato":
    case "bend":
    case "tap":
    case "harmonic":
    case "palm-mute":
      return technique
    default:
      return undefined
  }
}

function resolveLinked(
  measures: TabMeasure[],
  measureIndex: number,
  beatIndex: number,
  origin: TabNote,
  sameBeatDest: TabNote | undefined
): TabStringNotation {
  const technique = origin.technique as LinkedTechnique
  const originFret = formatFret(origin.fret)

  if (sameBeatDest) {
    return {
      kind: "linked",
      note: origin,
      technique,
      originFret,
      destFret: formatFret(sameBeatDest.fret),
    }
  }

  if (origin.linkTarget) {
    const destBeat = beatAt(
      measures,
      origin.linkTarget.measureIndex,
      origin.linkTarget.beatIndex
    )
    const destNote = findNoteOnString(destBeat, origin.string)
    if (destNote) {
      return {
        kind: "linked",
        note: origin,
        technique,
        originFret,
        destFret: formatFret(destNote.fret),
      }
    }
  }

  const next = getNextBeatCursor(measures, measureIndex, beatIndex)
  if (next) {
    const nextNote = findNoteOnString(
      beatAt(measures, next.measureIndex, next.beatIndex),
      origin.string
    )
    if (nextNote) {
      return {
        kind: "linked",
        note: origin,
        technique,
        originFret,
        destFret: formatFret(nextNote.fret),
      }
    }
  }

  return {
    kind: "linked-pending",
    note: origin,
    technique,
    originFret,
  }
}

/** Resolves visual notation for one string inside a beat. */
export function resolveStringNotation(
  measures: TabMeasure[],
  measureIndex: number,
  beatIndex: number,
  stringNum: number
): TabStringNotation {
  const beat = beatAt(measures, measureIndex, beatIndex)
  const stringNotes = notesOnString(beat, stringNum)

  if (stringNotes.length === 0) {
    return { kind: "empty" }
  }

  const origin = stringNotes.find((note) => isLinkedTechnique(note.technique))

  if (origin) {
    const sameBeatDest = stringNotes.find((note) => note.id !== origin.id)
    return resolveLinked(measures, measureIndex, beatIndex, origin, sameBeatDest)
  }

  const note = stringNotes[0]

  if (isLinkTargetFromPreviousBeat(measures, measureIndex, beatIndex, stringNum)) {
    return { kind: "link-target", note }
  }

  const artifact = artifactFromTechnique(note.technique)
  const fret = formatFret(note.fret)

  if (artifact) {
    return { kind: "fret-with-artifact", note, fret, artifact }
  }

  return { kind: "fret", note, fret }
}

/** Character-equivalent width for layout (linked = two frets + connector). */
export function notationDisplayWidth(notation: TabStringNotation): number {
  switch (notation.kind) {
    case "empty":
    case "link-target":
      return 0
    case "fret":
      return notation.fret.length
    case "linked":
      return notation.originFret.length + notation.destFret.length + 5
    case "linked-pending":
      return notation.originFret.length + 4
    case "fret-with-artifact":
      return Math.max(notation.fret.length, notation.artifact === "tap" ? 2 : 1)
  }
}

export function longestNotationWidthInBeat(
  measures: TabMeasure[],
  measureIndex: number,
  beatIndex: number
): number {
  let max = 0

  for (let string = 1; string <= STRING_COUNT; string++) {
    const notation = resolveStringNotation(
      measures,
      measureIndex,
      beatIndex,
      string
    )
    max = Math.max(max, notationDisplayWidth(notation))
  }

  return max
}
