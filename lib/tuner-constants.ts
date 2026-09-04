import type { Tuning } from "@/lib/tab-types"

export type TunerInstrument = "guitar" | "classical"

export type InstrumentTuning = Tuning & {
  instrument: TunerInstrument
}

export const TUNER_INSTRUMENTS = [
  {
    id: "guitar" as const,
    label: "Guitarra",
    description: "Elétrica ou acústica de aço",
  },
  {
    id: "classical" as const,
    label: "Violão",
    description: "Nylon / clássico / popular",
  },
] as const

export const TUNER_TUNINGS: InstrumentTuning[] = [
  {
    id: "guitar-standard",
    instrument: "guitar",
    name: "Padrão (EADGBE)",
    strings: ["E", "B", "G", "D", "A", "E"],
  },
  {
    id: "guitar-drop-d",
    instrument: "guitar",
    name: "Drop D (DADGBE)",
    strings: ["E", "B", "G", "D", "A", "D"],
  },
  {
    id: "guitar-half-step",
    instrument: "guitar",
    name: "Meio tom abaixo (Eb)",
    strings: ["Eb", "Bb", "Gb", "Db", "Ab", "Eb"],
  },
  {
    id: "guitar-drop-c",
    instrument: "guitar",
    name: "Drop C (CGCFAD)",
    strings: ["D", "A", "F", "C", "G", "C"],
  },
  {
    id: "guitar-open-d",
    instrument: "guitar",
    name: "Open D (DADF#AD)",
    strings: ["D", "A", "F#", "D", "A", "D"],
  },
  {
    id: "guitar-open-g",
    instrument: "guitar",
    name: "Open G (DGDGBD)",
    strings: ["D", "B", "G", "D", "G", "D"],
  },
  {
    id: "guitar-dadgad",
    instrument: "guitar",
    name: "DADGAD",
    strings: ["D", "A", "G", "D", "A", "D"],
  },
  {
    id: "classical-standard",
    instrument: "classical",
    name: "Padrão (EADGBE)",
    strings: ["E", "B", "G", "D", "A", "E"],
  },
  {
    id: "classical-drop-d",
    instrument: "classical",
    name: "Drop D (DADGBE)",
    strings: ["E", "B", "G", "D", "A", "D"],
  },
  {
    id: "classical-half-step",
    instrument: "classical",
    name: "Meio tom abaixo (Eb)",
    strings: ["Eb", "Bb", "Gb", "Db", "Ab", "Eb"],
  },
  {
    id: "classical-open-g",
    instrument: "classical",
    name: "Open G (DGDGBD)",
    strings: ["D", "B", "G", "D", "G", "D"],
  },
  {
    id: "classical-dadgad",
    instrument: "classical",
    name: "DADGAD",
    strings: ["D", "A", "G", "D", "A", "D"],
  },
]

export const STRING_LABELS = ["1ª", "2ª", "3ª", "4ª", "5ª", "6ª"] as const

export function getTuningsForInstrument(instrument: TunerInstrument) {
  return TUNER_TUNINGS.filter((tuning) => tuning.instrument === instrument)
}

export function getDefaultTuningId(instrument: TunerInstrument) {
  return instrument === "guitar" ? "guitar-standard" : "classical-standard"
}

export function getTunerTuningById(id: string): InstrumentTuning {
  return (
    TUNER_TUNINGS.find((tuning) => tuning.id === id) ??
    TUNER_TUNINGS[0]
  )
}
