"use client"

import { useMemo } from "react"
import { cn } from "@/lib/utils"
import { DEFAULT_FRET_COUNT, STRING_COUNT } from "@/lib/tab-constants"
import type { TabCursor, TabMeasure, TabNote } from "@/lib/tab-types"
import { collectAllNotes } from "@/lib/tab-document"
import { getBeatAt } from "@/lib/tab-document"
import { isLinkedTechnique } from "@/lib/tab-utils"
import { tablatureUi } from "@/lib/tablature-ui"

type FretboardProps = {
  measures: TabMeasure[]
  highlightCursor: TabCursor
  tuningStrings: string[]
  fretCount?: number
  selectedTechnique: string | null
  pendingLinkString?: number | null
  onCellClick: (string: number, fret: number, stayInBeat: boolean) => void
}

export function Fretboard({
  measures,
  highlightCursor,
  tuningStrings,
  fretCount = DEFAULT_FRET_COUNT,
  selectedTechnique,
  pendingLinkString,
  onCellClick,
}: FretboardProps) {
  const frets = Array.from({ length: fretCount + 1 }, (_, i) => i)

  const activeBeat = useMemo(
    () => getBeatAt(measures, highlightCursor),
    [measures, highlightCursor]
  )

  const activeNoteIds = useMemo(
    () => new Set(activeBeat.notes.map((note) => note.id)),
    [activeBeat]
  )

  const notesByCell = useMemo(() => {
    const map = new Map<string, TabNote[]>()

    for (const note of collectAllNotes(measures)) {
      const key = `${note.string}-${note.fret}`
      const existing = map.get(key) ?? []
      map.set(key, [...existing, note])
    }

    return map
  }, [measures])

  return (
    <div className="w-full overflow-x-auto">
      <div
        className={cn(
          "inline-block min-w-full rounded-xl border border-border bg-[oklch(0.22_0.04_55)] p-4 shadow-inner",
          selectedTechnique && "ring-2 ring-primary/50",
          pendingLinkString && "ring-2 ring-primary/30"
        )}
      >
        <div className="mb-3 flex items-center justify-between px-1">
          <span className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
            {tablatureUi.fretboardTitle}
          </span>
          {selectedTechnique ? (
            <span className="text-xs text-primary">
              {tablatureUi.applyTechniqueHint}
            </span>
          ) : pendingLinkString ? (
            <span className="text-xs text-primary">
              {tablatureUi.pendingLinkHint}
            </span>
          ) : null}
        </div>

        <div className="relative">
          <div
            className="grid gap-0"
            style={{
              gridTemplateColumns: `48px repeat(${fretCount + 1}, minmax(44px, 1fr))`,
            }}
          >
            <div />
            {frets.map((fret) => (
              <div
                key={`num-${fret}`}
                className="pb-1 text-center font-mono text-[10px] text-muted-foreground"
              >
                {fret === 0 ? "○" : fret}
              </div>
            ))}
          </div>

          {Array.from({ length: STRING_COUNT }, (_, i) => {
            const stringNum = i + 1
            const label = tuningStrings[stringNum - 1]
            const isPendingString = pendingLinkString === stringNum

            return (
              <div
                key={stringNum}
                className="grid items-center gap-0"
                style={{
                  gridTemplateColumns: `48px repeat(${fretCount + 1}, minmax(44px, 1fr))`,
                }}
              >
                <div className="flex items-center gap-1 pr-2">
                  <span
                    className={cn(
                      "font-mono text-xs font-semibold",
                      isPendingString ? "text-primary" : "text-primary"
                    )}
                  >
                    {label}
                  </span>
                </div>

                {frets.map((fret) => {
                  const cellNotes = notesByCell.get(`${stringNum}-${fret}`) ?? []
                  const isNut = fret === 0
                  const isActive = cellNotes.some((note) => activeNoteIds.has(note.id))
                  const displayNote = cellNotes[0]

                  return (
                    <button
                      key={`${stringNum}-${fret}`}
                      type="button"
                      onClick={(event) =>
                        onCellClick(stringNum, fret, event.shiftKey)
                      }
                      className={cn(
                        "group relative flex h-11 items-center justify-center border-b border-foreground/15 transition-colors",
                        !isNut && "border-l border-foreground/10",
                        isNut && "border-r-2 border-r-foreground/40",
                        isActive && "bg-primary/10",
                        isPendingString && "bg-primary/5",
                        "hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                      )}
                      aria-label={tablatureUi.stringAria(
                        label,
                        fret === 0 ? "open" : fret
                      )}
                    >
                      <span
                        className={cn(
                          "pointer-events-none absolute inset-x-1 top-1/2 h-px -translate-y-1/2",
                          stringNum <= 2
                            ? "bg-foreground/50"
                            : stringNum <= 4
                              ? "bg-foreground/40"
                              : "bg-foreground/30"
                        )}
                        style={{ height: stringNum >= 5 ? 2 : 1 }}
                      />

                      {displayNote ? (
                        <span
                          className={cn(
                            "relative z-10 flex size-7 items-center justify-center rounded-full font-mono text-xs font-bold shadow-md transition-transform group-hover:scale-110",
                            isActive
                              ? "bg-primary text-primary-foreground ring-2 ring-primary/40"
                              : "bg-primary/70 text-primary-foreground/90",
                            displayNote.technique &&
                              isLinkedTechnique(displayNote.technique) &&
                              "ring-2 ring-primary-foreground/40"
                          )}
                        >
                          {fret}
                        </span>
                      ) : null}
                    </button>
                  )
                })}
              </div>
            )
          })}
        </div>

        <p className="mt-3 text-center text-[11px] text-muted-foreground">
          {tablatureUi.fretboardHelp}
        </p>
      </div>
    </div>
  )
}
