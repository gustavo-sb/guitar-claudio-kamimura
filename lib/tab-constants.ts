import type { TechniqueDef, Tuning } from "./tab-types"

export const STRING_COUNT = 6
export const DEFAULT_FRET_COUNT = 24

export const TUNINGS: Tuning[] = [
  {
    id: "standard",
    name: "Padrão (EADGBE)",
    strings: ["E", "B", "G", "D", "A", "E"],
  },
  {
    id: "drop-d",
    name: "Drop D (DADGBE)",
    strings: ["E", "B", "G", "D", "A", "D"],
  },
  {
    id: "half-step-down",
    name: "Meio tom abaixo (Eb)",
    strings: ["Eb", "Bb", "Gb", "Db", "Ab", "Eb"],
  },
  {
    id: "drop-c",
    name: "Drop C (CGCFAD)",
    strings: ["D", "A", "F", "C", "G", "C"],
  },
  {
    id: "open-d",
    name: "Open D (DADF#AD)",
    strings: ["D", "A", "F#", "D", "A", "D"],
  },
  {
    id: "open-g",
    name: "Open G (DGDGBD)",
    strings: ["D", "B", "G", "D", "G", "D"],
  },
  {
    id: "dadgad",
    name: "DADGAD",
    strings: ["D", "A", "G", "D", "A", "D"],
  },
]

export const TECHNIQUES: TechniqueDef[] = [
  { id: "hammer-on", label: "Martelado", short: "h", symbol: "h", position: "after" },
  { id: "pull-off", label: "Puxada", short: "p", symbol: "p", position: "after" },
  { id: "slide-up", label: "Slide cima", short: "/", symbol: "/", position: "after" },
  { id: "slide-down", label: "Slide baixo", short: "\\", symbol: "\\", position: "after" },
  { id: "bend", label: "Bend", short: "b", symbol: "b", position: "after" },
  { id: "vibrato", label: "Vibrato", short: "~", symbol: "~", position: "after" },
  { id: "tap", label: "Tap", short: "t", symbol: "T", position: "before" },
  { id: "harmonic", label: "Harmônico", short: "<>", symbol: "<>", position: "before" },
  { id: "palm-mute", label: "Abafado", short: "PM", symbol: "PM", position: "before" },
]

export function getTechniqueDef(id: string): TechniqueDef | undefined {
  return TECHNIQUES.find((t) => t.id === id)
}
