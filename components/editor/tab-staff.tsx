"use client"

import { useMemo } from "react"
import { STRING_COUNT } from "@/lib/tab-constants"
import {
  beatContentWidth,
  globalBeatIndex,
  layoutMeasureSystems,
  measureContentWidth,
  PRINT_SYSTEM_WIDTH_PX,
  SCREEN_SYSTEM_WIDTH_PX,
} from "@/lib/tab-document"
import type { TabSongMetadata } from "@/lib/tab-metadata"
import { resolveStringNotation } from "@/lib/tab-notation"
import type { SelectedNoteRef, TabCursor, TabMeasure } from "@/lib/tab-types"
import { findNoteOnString } from "@/lib/tab-utils"
import { tablatureUi } from "@/lib/tablature-ui"
import { cn } from "@/lib/utils"
import {
  notationHasVisibleContent,
  notationPrimaryNote,
  TabNoteGlyph,
} from "@/components/editor/tab-note-glyph"

const STRING_LABELS = ["e", "B", "G", "D", "A", "E"] as const

type TabStaffBaseProps = {
  measures: TabMeasure[]
  metadata: TabSongMetadata
  tuningStrings: string[]
}

type TabStaffInteractiveProps = TabStaffBaseProps & {
  variant?: "interactive"
  highlightCursor: TabCursor
  highlightGlobalBeat: number
  isPlaying?: boolean
  selectedTechnique: string | null
  selectedNote?: SelectedNoteRef | null
  onCursorSelect: (cursor: TabCursor) => void
  onNoteClick: (cursor: TabCursor, string: number) => void
}

type TabStaffExportProps = TabStaffBaseProps & {
  variant: "export"
}

export type TabStaffProps = TabStaffInteractiveProps | TabStaffExportProps

export function TabStaff(props: TabStaffProps) {
  const { measures, metadata, tuningStrings, variant = "interactive" } = props
  const isExport = variant === "export"

  const systems = useMemo(
    () =>
      layoutMeasureSystems(
        measures,
        isExport ? PRINT_SYSTEM_WIDTH_PX : SCREEN_SYSTEM_WIDTH_PX
      ),
    [isExport, measures]
  )

  const printSystems = useMemo(
    () => layoutMeasureSystems(measures, PRINT_SYSTEM_WIDTH_PX),
    [measures]
  )

  const isHighlighted =
    !isExport && "highlightCursor" in props
      ? (measureIndex: number, beatIndex: number) => {
          if (props.isPlaying) {
            return (
              globalBeatIndex(measures, measureIndex, beatIndex) ===
              props.highlightGlobalBeat
            )
          }
          return (
            props.highlightCursor.measureIndex === measureIndex &&
            props.highlightCursor.beatIndex === beatIndex
          )
        }
      : () => false

  const hasContent = measures.some((m) => m.beats.some((b) => b.notes.length > 0))

  return (
    <div
      className={cn(
        "tab-staff-print w-full",
        isExport
          ? "bg-white p-0 text-black"
          : "rounded-xl border border-border bg-card p-4 md:p-6"
      )}
    >
      <TabStaffHeader
        metadata={metadata}
        tuningStrings={tuningStrings}
        exportMode={isExport}
      />

      {!hasContent ? (
        <p
          className={cn(
            "py-8 text-center text-sm",
            isExport ? "text-black/60" : "text-muted-foreground"
          )}
        >
          {tablatureUi.tabStaffEmpty}
        </p>
      ) : isExport ? (
        <div className="space-y-10">
          {systems.map((system) => (
            <TabSystemExport
              key={`export-sys-${system.systemIndex}`}
              system={system}
              measures={measures}
            />
          ))}
        </div>
      ) : (
        <>
          <div className="tab-staff-screen space-y-10 print:hidden">
            {systems.map((system) => (
              <TabSystemInteractive
                key={`screen-sys-${system.systemIndex}`}
                system={system}
                measures={measures}
                isHighlighted={isHighlighted}
                isPlaying={"isPlaying" in props ? (props.isPlaying ?? false) : false}
                selectedTechnique={
                  "selectedTechnique" in props ? props.selectedTechnique : null
                }
                selectedNote={"selectedNote" in props ? props.selectedNote : null}
                onCursorSelect={
                  "onCursorSelect" in props ? props.onCursorSelect : () => {}
                }
                onNoteClick={"onNoteClick" in props ? props.onNoteClick : () => {}}
              />
            ))}
          </div>

          <div className="tab-staff-print-layout hidden space-y-10 print:block">
            {printSystems.map((system) => (
              <TabSystemExport
                key={`print-sys-${system.systemIndex}`}
                system={system}
                measures={measures}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

function TabStaffHeader({
  metadata,
  tuningStrings,
  exportMode = false,
}: {
  metadata: TabSongMetadata
  tuningStrings: string[]
  exportMode?: boolean
}) {
  const { numerator, denominator } = metadata.timeSignature

  return (
    <div
      className={cn(
        "tab-staff-header mb-6 border-b pb-4",
        exportMode ? "border-black/20" : "border-border"
      )}
    >
      <h2
        className={cn(
          "font-display text-2xl tracking-wide uppercase",
          exportMode ? "text-black" : "text-foreground"
        )}
      >
        {metadata.title || tablatureUi.tabStaffDefaultTitle}
      </h2>
      {metadata.artist ? (
        <p
          className={cn(
            "mt-1 text-sm",
            exportMode ? "text-black/70" : "text-muted-foreground"
          )}
        >
          {metadata.artist}
        </p>
      ) : null}
      <div
        className={cn(
          "mt-2 flex flex-wrap gap-x-4 gap-y-1 font-mono text-xs",
          exportMode ? "text-black/65" : "text-muted-foreground"
        )}
      >
        <span>
          {tablatureUi.tuningPrefix} {tuningStrings.join(" ")}
        </span>
        <span>
          {tablatureUi.tempoPrefix} ♩ = {metadata.bpm}
        </span>
        <span>
          {tablatureUi.timePrefix} {numerator}/{denominator}
        </span>
      </div>
    </div>
  )
}

type TabSystemBaseProps = {
  system: ReturnType<typeof layoutMeasureSystems>[number]
  measures: TabMeasure[]
}

function TabSystemExport({ system, measures }: TabSystemBaseProps) {
  return (
    <div className="tab-system overflow-visible font-mono text-sm leading-none">
      <div className="mb-2 flex pl-6 pt-2">
        {system.items.map(({ measure, measureIndex }) => {
          const width = measureContentWidth(measures, measureIndex)
          return (
            <div
              key={`num-${measure.id}`}
              className="flex justify-center text-[10px] text-black/55"
              style={{ width }}
            >
              {measureIndex + 1}
            </div>
          )
        })}
      </div>

      {Array.from({ length: STRING_COUNT }, (_, index) => {
        const stringNum = index + 1

        return (
          <div key={stringNum} className="flex items-stretch">
            <span className="flex w-6 shrink-0 items-center pr-1 text-[11px] font-semibold text-black">
              {STRING_LABELS[index]}
            </span>

            {system.items.map(({ measure, measureIndex }, measurePos) => {
              const width = measureContentWidth(measures, measureIndex)

              return (
                <div
                  key={`${measure.id}-s${stringNum}`}
                  className="relative flex items-stretch"
                  style={{ width }}
                >
                  <span className="flex w-2 shrink-0 items-center justify-center text-black/45">
                    |
                  </span>

                  <div className="relative flex flex-1">
                    <span
                      className="pointer-events-none absolute inset-x-0 top-1/2 border-t border-black/45"
                      aria-hidden
                    />

                    {measure.beats.map((beat, beatIndex) => {
                      const notation = resolveStringNotation(
                        measures,
                        measureIndex,
                        beatIndex,
                        stringNum
                      )
                      const visible = notationHasVisibleContent(notation)
                      const cellWidth = beatContentWidth(
                        measures,
                        measureIndex,
                        beatIndex
                      )

                      return (
                        <div
                          key={beat.id}
                          style={{ width: cellWidth, minWidth: cellWidth }}
                          className="relative flex h-7 items-center justify-center overflow-visible px-0.5"
                        >
                          {visible ? (
                            <TabNoteGlyph
                              notation={notation}
                              className="relative z-10 text-black"
                            />
                          ) : null}
                        </div>
                      )
                    })}
                  </div>

                  {measurePos === system.items.length - 1 ? (
                    <span className="flex w-2 shrink-0 items-center justify-center text-black/45">
                      |
                    </span>
                  ) : null}
                </div>
              )
            })}
          </div>
        )
      })}
    </div>
  )
}

type TabSystemInteractiveProps = TabSystemBaseProps & {
  isHighlighted: (measureIndex: number, beatIndex: number) => boolean
  isPlaying: boolean
  selectedTechnique: string | null
  selectedNote?: SelectedNoteRef | null
  onCursorSelect: (cursor: TabCursor) => void
  onNoteClick: (cursor: TabCursor, string: number) => void
}

function TabSystemInteractive({
  system,
  measures,
  isHighlighted,
  isPlaying,
  selectedTechnique,
  selectedNote,
  onCursorSelect,
  onNoteClick,
}: TabSystemInteractiveProps) {
  return (
    <div className="tab-system overflow-visible font-mono text-sm leading-none">
      <div className="mb-2 flex pl-6 pt-2">
        {system.items.map(({ measure, measureIndex }) => {
          const width = measureContentWidth(measures, measureIndex)
          return (
            <div
              key={`num-${measure.id}`}
              className="flex justify-center text-[10px] text-muted-foreground"
              style={{ width }}
            >
              {measureIndex + 1}
            </div>
          )
        })}
      </div>

      {Array.from({ length: STRING_COUNT }, (_, index) => {
        const stringNum = index + 1

        return (
          <div key={stringNum} className="flex items-stretch">
            <span className="flex w-6 shrink-0 items-center pr-1 text-[11px] font-semibold text-primary">
              {STRING_LABELS[index]}
            </span>

            {system.items.map(({ measure, measureIndex }, measurePos) => {
              const width = measureContentWidth(measures, measureIndex)

              return (
                <div
                  key={`${measure.id}-s${stringNum}`}
                  className="flex items-stretch"
                  style={{ width }}
                >
                  <span className="flex w-2 shrink-0 items-center justify-center text-foreground/45">
                    |
                  </span>

                  <div className="flex flex-1">
                    {measure.beats.map((beat, beatIndex) => {
                      const notation = resolveStringNotation(
                        measures,
                        measureIndex,
                        beatIndex,
                        stringNum
                      )
                      const note = notationPrimaryNote(notation)
                      const beatNote = findNoteOnString(beat, stringNum)
                      const visible = notationHasVisibleContent(notation)
                      const highlighted = isHighlighted(measureIndex, beatIndex)
                      const cellWidth = beatContentWidth(
                        measures,
                        measureIndex,
                        beatIndex
                      )

                      const isSelectedNote =
                        selectedNote &&
                        selectedNote.string === stringNum &&
                        selectedNote.cursor.measureIndex === measureIndex &&
                        selectedNote.cursor.beatIndex === beatIndex &&
                        beatNote?.id === selectedNote.noteId

                      return (
                        <button
                          key={beat.id}
                          type="button"
                          onClick={() => {
                            onCursorSelect({ measureIndex, beatIndex })
                            if (beatNote) {
                              onNoteClick({ measureIndex, beatIndex }, stringNum)
                            }
                          }}
                          style={{ width: cellWidth, minWidth: cellWidth }}
                          className={cn(
                            "relative flex h-7 items-center justify-center overflow-visible px-0.5 transition-colors",
                            highlighted && "bg-primary/10",
                            isPlaying && highlighted && "ring-1 ring-inset ring-primary/40",
                            isSelectedNote && "ring-2 ring-inset ring-primary",
                            selectedTechnique && note && "cursor-crosshair"
                          )}
                        >
                          <span
                            className="pointer-events-none absolute inset-x-0 top-1/2 border-t border-dashed border-foreground/30"
                            aria-hidden
                          />
                          {visible ? (
                            <TabNoteGlyph
                              notation={notation}
                              className="relative z-10 text-foreground"
                            />
                          ) : null}
                        </button>
                      )
                    })}
                  </div>

                  {measurePos === system.items.length - 1 ? (
                    <span className="flex w-2 shrink-0 items-center justify-center text-foreground/45">
                      |
                    </span>
                  ) : null}
                </div>
              )
            })}
          </div>
        )
      })}
    </div>
  )
}
