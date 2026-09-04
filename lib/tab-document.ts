import type { TabBeat, TabCursor, TabMeasure, TabNote } from "./tab-types"
import { BEATS_PER_MEASURE } from "./tab-types"
import { longestNotationWidthInBeat } from "./tab-notation"

import { createId } from "./tab-utils"

export function collectAllNotes(measures: TabMeasure[]): TabNote[] {
  return measures.flatMap((measure) =>
    measure.beats.flatMap((beat) => beat.notes)
  )
}

export function createBeat(): TabBeat {
  return { id: createId(), notes: [] }
}

export function createMeasure(beatCount = BEATS_PER_MEASURE): TabMeasure {
  return {
    id: createId(),
    beats: Array.from({ length: beatCount }, () => createBeat()),
  }
}

export function createInitialMeasures(): TabMeasure[] {
  return [createMeasure()]
}

export function flattenMeasures(measures: TabMeasure[]): TabBeat[] {
  return measures.flatMap((measure) => measure.beats)
}

export function globalBeatIndex(
  measures: TabMeasure[],
  measureIndex: number,
  beatIndex: number
): number {
  let index = 0
  for (let m = 0; m < measureIndex; m++) {
    index += measures[m]?.beats.length ?? 0
  }
  return index + beatIndex
}

export function cursorFromGlobal(
  measures: TabMeasure[],
  globalIndex: number
): TabCursor {
  let remaining = globalIndex
  for (let m = 0; m < measures.length; m++) {
    const beatCount = measures[m].beats.length
    if (remaining < beatCount) {
      return { measureIndex: m, beatIndex: remaining }
    }
    remaining -= beatCount
  }
  const lastMeasure = Math.max(0, measures.length - 1)
  return {
    measureIndex: lastMeasure,
    beatIndex: Math.max(0, (measures[lastMeasure]?.beats.length ?? 1) - 1),
  }
}

export function getBeatAt(
  measures: TabMeasure[],
  cursor: TabCursor
): TabBeat {
  return (
    measures[cursor.measureIndex]?.beats[cursor.beatIndex] ?? createBeat()
  )
}

export function ensureBeatSlot(
  measures: TabMeasure[],
  cursor: TabCursor
): TabMeasure[] {
  const next = measures.map((measure) => ({
    ...measure,
    beats: [...measure.beats],
  }))

  while (next.length <= cursor.measureIndex) {
    next.push(createMeasure())
  }

  const measure = next[cursor.measureIndex]
  while (measure.beats.length <= cursor.beatIndex) {
    measure.beats.push(createBeat())
  }

  return next
}

const BASE_BEAT_WIDTH = 24
const CHAR_WIDTH = 8.5
const MEASURE_PADDING = 20
const MIN_MEASURE_WIDTH = 80
const MIN_EMPTY_BEAT_CHARS = 3

/** ~180 mm printable width at 96 dpi (A4 portrait with margins). */
export const PRINT_SYSTEM_WIDTH_PX = 680

/** Screen layout width before wrapping to next system. */
export const SCREEN_SYSTEM_WIDTH_PX = 720

/** Width of one event (beat) based on the longest rendered string text in that column. */
export function beatContentWidth(
  measures: TabMeasure[],
  measureIndex: number,
  beatIndex: number
): number {
  const beat = measures[measureIndex]?.beats[beatIndex]
  if (!beat) {
    return BASE_BEAT_WIDTH + MIN_EMPTY_BEAT_CHARS * CHAR_WIDTH
  }

  if (beat.notes.length === 0) {
    return BASE_BEAT_WIDTH + MIN_EMPTY_BEAT_CHARS * CHAR_WIDTH
  }

  const longest = longestNotationWidthInBeat(measures, measureIndex, beatIndex)

  return Math.max(
    BASE_BEAT_WIDTH,
    longest * CHAR_WIDTH + 14,
    MIN_EMPTY_BEAT_CHARS * CHAR_WIDTH + 8
  )
}

export function measureContentWidth(
  measures: TabMeasure[],
  measureIndex: number
): number {
  const measure = measures[measureIndex]
  if (!measure) return MIN_MEASURE_WIDTH

  const beatsWidth = measure.beats.reduce(
    (sum, _, beatIndex) => sum + beatContentWidth(measures, measureIndex, beatIndex),
    0
  )
  return Math.max(MIN_MEASURE_WIDTH, beatsWidth + MEASURE_PADDING)
}

export type TabSystemLayout = {
  systemIndex: number
  items: Array<{ measure: TabMeasure; measureIndex: number }>
}

/** Groups measures into systems that fit within the available width. */
export function layoutMeasureSystems(
  measures: TabMeasure[],
  maxSystemWidth = SCREEN_SYSTEM_WIDTH_PX
): TabSystemLayout[] {
  if (measures.length === 0) return []

  const systems: TabSystemLayout[] = []
  let current: TabSystemLayout = { systemIndex: 0, items: [] }
  let currentWidth = 0

  for (let i = 0; i < measures.length; i++) {
    const measure = measures[i]
    const width = measureContentWidth(measures, i)

    if (current.items.length > 0 && currentWidth + width > maxSystemWidth) {
      systems.push(current)
      current = { systemIndex: systems.length, items: [] }
      currentWidth = 0
    }

    current.items.push({ measure, measureIndex: i })
    currentWidth += width
  }

  if (current.items.length > 0) {
    systems.push(current)
  }

  return systems
}

export function hasAnyNotes(measures: TabMeasure[]): boolean {
  return measures.some((measure) =>
    measure.beats.some((beat) => beat.notes.length > 0)
  )
}
