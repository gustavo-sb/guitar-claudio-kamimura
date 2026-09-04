import { createBeat, createMeasure } from "./tab-document"
import { DEFAULT_TAB_METADATA, type TabSongMetadata } from "./tab-metadata"
import type { TabMeasure, TabNote, Technique } from "./tab-types"
import { createId } from "./tab-utils"

type NoteInput = {
  string: number
  fret: number
  technique?: Technique
}

function n(string: number, fret: number, technique?: Technique): TabNote {
  return { id: createId(), string, fret, technique }
}

function event(...notes: NoteInput[]): ReturnType<typeof createBeat> {
  return {
    id: createId(),
    notes: notes.map((note) => n(note.string, note.fret, note.technique)),
  }
}

function buildMeasure(events: NoteInput[][]): TabMeasure {
  return {
    id: createId(),
    beats: events.map((notes) => event(...notes)),
  }
}

/** Fictional riff demo — original content for layout testing only. */
export function createDemoSong(): {
  metadata: TabSongMetadata
  measures: TabMeasure[]
} {
  const metadata: TabSongMetadata = {
    title: "Riff de Exemplo",
    artist: "Demo Original",
    bpm: 117,
    timeSignature: { numerator: 4, denominator: 4 },
  }

  const measures: TabMeasure[] = [
    buildMeasure([
      [{ string: 3, fret: 5 }],
      [{ string: 3, fret: 7 }],
      [{ string: 3, fret: 5 }],
      [{ string: 4, fret: 5, technique: "hammer-on" }, { string: 4, fret: 7 }],
      [{ string: 4, fret: 7 }],
      [{ string: 4, fret: 5 }],
    ]),
    buildMeasure([
      [{ string: 3, fret: 7, technique: "slide-up" }, { string: 3, fret: 9 }],
      [{ string: 3, fret: 7 }],
      [{ string: 4, fret: 9 }],
      [{ string: 4, fret: 7 }],
      [{ string: 4, fret: 5 }],
    ]),
    buildMeasure([
      [{ string: 3, fret: 5 }],
      [{ string: 3, fret: 7 }],
      [{ string: 3, fret: 8 }],
      [{ string: 3, fret: 7 }],
      [{ string: 4, fret: 7 }],
      [{ string: 4, fret: 7 }],
    ]),
    buildMeasure([
      [{ string: 3, fret: 5 }],
      [{ string: 4, fret: 7 }],
      [{ string: 4, fret: 5 }],
      [{ string: 5, fret: 7 }],
    ]),
    buildMeasure([
      [{ string: 2, fret: 8 }],
      [{ string: 2, fret: 10 }],
      [{ string: 2, fret: 8 }],
      [{ string: 3, fret: 9 }],
      [{ string: 3, fret: 7 }],
      [{ string: 3, fret: 5 }],
    ]),
    buildMeasure([
      [{ string: 3, fret: 7 }],
      [{ string: 3, fret: 5 }],
      [{ string: 2, fret: 10, technique: "bend" }],
      [{ string: 2, fret: 10 }],
      [{ string: 2, fret: 8 }],
    ]),
    buildMeasure([
      [{ string: 3, fret: 9 }],
      [{ string: 3, fret: 7 }],
      [{ string: 3, fret: 5 }],
      [{ string: 4, fret: 7 }],
      [{ string: 4, fret: 7 }],
    ]),
    buildMeasure([
      [{ string: 3, fret: 5 }],
      [{ string: 4, fret: 7 }],
      [{ string: 4, fret: 5 }],
      [{ string: 5, fret: 7 }],
    ]),
  ]

  return { metadata, measures }
}

export function createEmptySong() {
  return {
    metadata: { ...DEFAULT_TAB_METADATA },
    measures: [createMeasure()],
  }
}
