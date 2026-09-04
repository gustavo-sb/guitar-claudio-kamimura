export type TabSongMetadata = {
  title: string
  artist: string
  bpm: number
  timeSignature: {
    numerator: number
    denominator: number
  }
}

export const DEFAULT_TAB_METADATA: TabSongMetadata = {
  title: "Minha Tablatura",
  artist: "",
  bpm: 120,
  timeSignature: { numerator: 4, denominator: 4 },
}
