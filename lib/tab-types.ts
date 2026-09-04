export type Technique =
  | "hammer-on"
  | "pull-off"
  | "slide-up"
  | "slide-down"
  | "bend"
  | "vibrato"
  | "tap"
  | "harmonic"
  | "palm-mute"

export type TabNote = {
  id: string
  string: number
  fret: number
  technique?: Technique
  /** Explicit destination for slide / hammer-on / pull-off. */
  linkTarget?: TabCursor
}

/** A rhythmic position inside a measure (one or more simultaneous notes). */
export type TabBeat = {
  id: string
  notes: TabNote[]
}

/** A musical measure — the layout unit of tablature. */
export type TabMeasure = {
  id: string
  beats: TabBeat[]
}

export type TabCursor = {
  measureIndex: number
  beatIndex: number
}

export type SelectedNoteRef = {
  cursor: TabCursor
  string: number
  noteId: string
}

export type PendingLink = {
  originCursor: TabCursor
  string: number
  technique: Technique
  originFret: number
}

export type Tuning = {
  id: string
  name: string
  strings: [string, string, string, string, string, string]
}

export type TechniqueDef = {
  id: Technique
  label: string
  short: string
  symbol: string
  position: "before" | "after"
}

/** Default quarter-note pulses per 4/4 measure when creating new measures. */
export const BEATS_PER_MEASURE = 4
