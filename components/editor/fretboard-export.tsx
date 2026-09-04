"use client"

import { useMemo } from "react"
import { STRING_COUNT } from "@/lib/tab-constants"
import { collectAllNotes, usedFretRange } from "@/lib/tab-export"
import type { TabMeasure } from "@/lib/tab-types"

type FretboardExportProps = {
  measures: TabMeasure[]
  tuningStrings: string[]
}

export function FretboardExport({ measures, tuningStrings }: FretboardExportProps) {
  const notes = useMemo(() => collectAllNotes(measures), [measures])
  const { min, max } = useMemo(() => usedFretRange(notes), [notes])
  const frets = useMemo(
    () => Array.from({ length: max - min + 1 }, (_, index) => min + index),
    [min, max]
  )

  const noteLookup = useMemo(() => {
    const map = new Map<string, number>()
    for (const note of notes) {
      map.set(`${note.string}-${note.fret}`, note.fret)
    }
    return map
  }, [notes])

  return (
    <div className="fretboard-export overflow-hidden rounded-lg border border-black/20 bg-[#f6f1ea] p-4">
      <div
        className="grid gap-0"
        style={{
          gridTemplateColumns: `40px repeat(${frets.length}, minmax(28px, 1fr))`,
        }}
      >
        <div />
        {frets.map((fret) => (
          <div
            key={`fret-num-${fret}`}
            className="pb-1 text-center font-mono text-[9px] text-black/55"
          >
            {fret === 0 ? "○" : fret}
          </div>
        ))}

        {Array.from({ length: STRING_COUNT }, (_, index) => {
          const stringNum = index + 1
          const label = tuningStrings[stringNum - 1] ?? ""

          return (
            <div
              key={`string-${stringNum}`}
              className="contents"
            >
              <div className="flex items-center pr-2 font-mono text-[10px] font-semibold text-black">
                {label}
              </div>

              {frets.map((fret) => {
                const hasNote = noteLookup.has(`${stringNum}-${fret}`)
                const isNut = fret === min && min === 0

                return (
                  <div
                    key={`${stringNum}-${fret}`}
                    className="relative flex h-8 items-center justify-center border-b border-black/10"
                    style={!isNut ? { borderLeft: "1px solid rgba(0,0,0,0.08)" } : undefined}
                  >
                    <span
                      className="pointer-events-none absolute inset-x-1 top-1/2 h-px -translate-y-1/2 bg-black/55"
                      style={{ height: stringNum >= 5 ? 2 : 1 }}
                      aria-hidden
                    />

                    {isNut ? (
                      <span
                        className="pointer-events-none absolute top-0 right-0 h-full w-0.5 bg-black/45"
                        aria-hidden
                      />
                    ) : null}

                    {hasNote ? (
                      <span className="relative z-10 flex size-5 items-center justify-center rounded-full bg-black font-mono text-[9px] font-bold text-white">
                        {fret}
                      </span>
                    ) : null}
                  </div>
                )
              })}
            </div>
          )
        })}
      </div>
    </div>
  )
}
