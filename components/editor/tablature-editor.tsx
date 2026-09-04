"use client"

import { Fretboard } from "@/components/editor/fretboard"
import { TabExportMenu } from "@/components/editor/tab-export-menu"
import { TabExportSheet } from "@/components/editor/tab-export-sheet"
import { TabMetadataFields } from "@/components/editor/tab-metadata-fields"
import { TabStaff } from "@/components/editor/tab-staff"
import { TechniqueToolbar } from "@/components/editor/technique-toolbar"
import {
  TuningSelector,
  getTuningById,
} from "@/components/editor/tuning-selector"
import { Button } from "@/components/ui/button"
import { useTabAudio } from "@/hooks/use-tab-audio"
import { createDemoSong } from "@/lib/tab-demo-song"
import {
  createInitialMeasures,
  createMeasure,
  cursorFromGlobal,
  ensureBeatSlot,
  flattenMeasures,
  getBeatAt,
  globalBeatIndex,
  hasAnyNotes,
} from "@/lib/tab-document"
import { DEFAULT_TAB_METADATA } from "@/lib/tab-metadata"
import type {
  SelectedNoteRef,
  TabCursor,
  TabMeasure,
  PendingLink,
  Technique,
} from "@/lib/tab-types"
import {
  applyTechnique,
  createId,
  findNoteInBeat,
  findNoteOnString,
  isLinkedTechnique,
} from "@/lib/tab-utils"
import { tablatureUi } from "@/lib/tablature-ui"
import {
  ChevronLeft,
  ChevronRight,
  FileMusic,
  Music2,
  Pause,
  Play,
  Plus,
  RotateCcw,
  Trash2,
} from "lucide-react"
import Link from "next/link"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"

export function TablatureEditor() {
  const exportRef = useRef<HTMLDivElement>(null)
  const [tuningId, setTuningId] = useState("standard")
  const [metadata, setMetadata] = useState(DEFAULT_TAB_METADATA)
  const [measures, setMeasures] = useState<TabMeasure[]>(createInitialMeasures)
  const [cursor, setCursor] = useState<TabCursor>({
    measureIndex: 0,
    beatIndex: 0,
  })
  const [selectedTechnique, setSelectedTechnique] = useState<Technique | null>(
    null
  )
  const [pendingLink, setPendingLink] = useState<PendingLink | null>(null)
  const [selectedNote, setSelectedNote] = useState<SelectedNoteRef | null>(null)
  const selectedNoteRef = useRef<SelectedNoteRef | null>(null)

  useEffect(() => {
    selectedNoteRef.current = selectedNote
  }, [selectedNote])

  const tuning = getTuningById(tuningId)
  const tuningStrings = useMemo(() => [...tuning.strings], [tuning.strings])
  const {
    isPlaying,
    playingBeatIndex,
    previewNote,
    previewTabNote,
    playTablature,
    stopPlayback,
  } = useTabAudio()

  const currentMeasure = measures[cursor.measureIndex]
  const pulseCount = currentMeasure?.beats.length ?? 0

  const addNoteAtCursor = useCallback(
    (target: TabCursor, string: number, fret: number, technique?: Technique) => {
      const newNote = {
        id: createId(),
        string,
        fret,
        technique,
      }

      setMeasures((prev) => {
        const next = ensureBeatSlot(prev, target)
        return next.map((measure, measureIndex) => {
          if (measureIndex !== target.measureIndex) return measure
          return {
            ...measure,
            beats: measure.beats.map((beat, beatIndex) => {
              if (beatIndex !== target.beatIndex) return beat
              return {
                ...beat,
                notes: [
                  ...beat.notes.filter((note) => note.string !== string),
                  newNote,
                ],
              }
            }),
          }
        })
      })
    },
    []
  )

  const updateBeatAt = useCallback(
    (target: TabCursor, updater: (beat: ReturnType<typeof getBeatAt>) => ReturnType<typeof getBeatAt>) => {
      setMeasures((prev) =>
        prev.map((measure, mIdx) => {
          if (mIdx !== target.measureIndex) return measure
          return {
            ...measure,
            beats: measure.beats.map((beat, bIdx) =>
              bIdx === target.beatIndex ? updater(beat) : beat
            ),
          }
        })
      )
    },
    []
  )

  const goToNextPulse = useCallback(() => {
    setMeasures((prev) => {
      const measure = prev[cursor.measureIndex]
      const nextBeat = cursor.beatIndex + 1

      if (measure && nextBeat < measure.beats.length) {
        setCursor({ ...cursor, beatIndex: nextBeat })
        return prev
      }

      const nextMeasure = cursor.measureIndex + 1
      if (nextMeasure < prev.length) {
        setCursor({ measureIndex: nextMeasure, beatIndex: 0 })
        return prev
      }

      setCursor({ measureIndex: nextMeasure, beatIndex: 0 })
      return [...prev, createMeasure()]
    })
  }, [cursor])

  const goToPreviousPulse = useCallback(() => {
    if (cursor.beatIndex > 0) {
      setCursor((c) => ({ ...c, beatIndex: c.beatIndex - 1 }))
      return
    }
    if (cursor.measureIndex > 0) {
      const prevMeasure = measures[cursor.measureIndex - 1]
      const lastBeat = Math.max(0, (prevMeasure?.beats.length ?? 1) - 1)
      setCursor({ measureIndex: cursor.measureIndex - 1, beatIndex: lastBeat })
    }
  }, [cursor, measures])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target
      if (
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target instanceof HTMLSelectElement
      ) {
        return
      }

      if (event.key === "ArrowRight") {
        event.preventDefault()
        goToNextPulse()
      }

      if (event.key === "ArrowLeft") {
        event.preventDefault()
        goToPreviousPulse()
      }
    }

    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [goToNextPulse, goToPreviousPulse])

  const advanceAfterNote = useCallback(
    (writeCursor: TabCursor, beatHadNotes: boolean) => {
      if (beatHadNotes) {
        const nextBeat = writeCursor.beatIndex + 1
        const measure = measures[writeCursor.measureIndex]

        if (measure && nextBeat < measure.beats.length) {
          setCursor({ ...writeCursor, beatIndex: nextBeat })
          return
        }

        const nextMeasure = writeCursor.measureIndex + 1
        setMeasures((prev) => {
          if (nextMeasure < prev.length) return prev
          return [...prev, createMeasure()]
        })
        setCursor({ measureIndex: nextMeasure, beatIndex: 0 })
        return
      }

      const nextBeat = writeCursor.beatIndex + 1
      setMeasures((prev) => ensureBeatSlot(prev, { ...writeCursor, beatIndex: nextBeat }))
      setCursor({ ...writeCursor, beatIndex: nextBeat })
    },
    [measures]
  )

  const completePendingLink = useCallback(
    (destCursor: TabCursor) => {
      if (!pendingLink) return

      updateBeatAt(pendingLink.originCursor, (currentBeat) => ({
        ...currentBeat,
        notes: currentBeat.notes.map((note) =>
          note.string === pendingLink.string &&
          note.fret === pendingLink.originFret
            ? { ...note, linkTarget: destCursor }
            : note
        ),
      }))
      setPendingLink(null)
    },
    [pendingLink, updateBeatAt]
  )

  const startPendingLink = useCallback(
    (
      originCursor: TabCursor,
      string: number,
      technique: Technique,
      originFret: number
    ) => {
      if (!isLinkedTechnique(technique)) return
      setPendingLink({
        originCursor,
        string,
        technique,
        originFret,
      })
    },
    []
  )

  const handleApplyToSelectedNote = useCallback(
    (technique: Technique) => {
      const noteCtx = selectedNoteRef.current
      if (!noteCtx) return

      const beat = getBeatAt(measures, noteCtx.cursor)
      const note = beat.notes.find((item) => item.id === noteCtx.noteId)

      if (!note) {
        setSelectedNote(null)
        return
      }

      updateBeatAt(noteCtx.cursor, (currentBeat) => ({
        ...currentBeat,
        notes: currentBeat.notes.map((currentNote) =>
          currentNote.id === note.id
            ? applyTechnique(currentNote, technique)
            : currentNote
        ),
      }))

      if (isLinkedTechnique(technique)) {
        startPendingLink(noteCtx.cursor, noteCtx.string, technique, note.fret)
      }

      setSelectedNote(null)
      setSelectedTechnique(null)
    },
    [measures, startPendingLink, updateBeatAt]
  )

  const handleTechniqueSelect = useCallback((technique: Technique | null) => {
    if (!technique) {
      setSelectedTechnique(null)
      setSelectedNote(null)
      setPendingLink(null)
      return
    }

    setSelectedTechnique(technique)
  }, [])

  const handleCellClick = useCallback(
    (string: number, fret: number, stayInBeat: boolean) => {
      void previewNote(string, fret, tuningStrings[string - 1] ?? "E")

      if (
        pendingLink &&
        string === pendingLink.string &&
        fret !== pendingLink.originFret
      ) {
        const beat = getBeatAt(measures, cursor)
        const existing = findNoteInBeat(beat, string, fret)

        if (!existing) {
          addNoteAtCursor(cursor, string, fret)
        }

        completePendingLink(cursor)
        return
      }

      const beat = getBeatAt(measures, cursor)
      const existing = findNoteInBeat(beat, string, fret)

      if (selectedTechnique && existing) {
        updateBeatAt(cursor, (currentBeat) => ({
          ...currentBeat,
          notes: currentBeat.notes.map((note) =>
            note.id === existing.id
              ? applyTechnique(note, selectedTechnique)
              : note
          ),
        }))
        startPendingLink(cursor, string, selectedTechnique, existing.fret)
        setSelectedTechnique(null)
        return
      }

      if (existing) {
        if (
          pendingLink &&
          pendingLink.string === string &&
          pendingLink.originFret === fret
        ) {
          setPendingLink(null)
        }

        if (selectedNote?.noteId === existing.id) {
          setSelectedNote(null)
        }

        updateBeatAt(cursor, (currentBeat) => ({
          ...currentBeat,
          notes: currentBeat.notes.filter((note) => note.id !== existing.id),
        }))
        return
      }

      const beatHasNotes = beat.notes.length > 0
      let writeCursor = { ...cursor }

      if (!stayInBeat && beatHasNotes) {
        const nextBeat = cursor.beatIndex + 1
        if (nextBeat < (measures[cursor.measureIndex]?.beats.length ?? 0)) {
          writeCursor = { ...cursor, beatIndex: nextBeat }
        } else {
          const nextMeasure = cursor.measureIndex + 1
          writeCursor = { measureIndex: nextMeasure, beatIndex: 0 }
        }
      }

      const newNote = {
        id: createId(),
        string,
        fret,
        technique: selectedTechnique ?? undefined,
      }

      setMeasures((prev) => {
        let next = ensureBeatSlot(prev, writeCursor)

        next = next.map((measure, measureIndex) => {
          if (measureIndex !== writeCursor.measureIndex) return measure
          return {
            ...measure,
            beats: measure.beats.map((beat, beatIndex) => {
              if (beatIndex !== writeCursor.beatIndex) return beat
              return {
                ...beat,
                notes: [
                  ...beat.notes.filter((note) => note.string !== string),
                  newNote,
                ],
              }
            }),
          }
        })

        if (!stayInBeat && !beatHasNotes) {
          const nextPulse = {
            ...writeCursor,
            beatIndex: writeCursor.beatIndex + 1,
          }
          next = ensureBeatSlot(next, nextPulse)
        }

        if (
          !stayInBeat &&
          beatHasNotes &&
          writeCursor.measureIndex >= next.length
        ) {
          next = [...next, createMeasure()]
        } else if (
          !stayInBeat &&
          beatHasNotes &&
          writeCursor.measureIndex === next.length
        ) {
          next = [...next, createMeasure()]
        }

        return next
      })

      if (selectedTechnique) {
        startPendingLink(writeCursor, string, selectedTechnique, fret)
        setSelectedTechnique(null)
      }

      if (!stayInBeat) {
        if (beatHasNotes) {
          setCursor(writeCursor)
        } else {
          advanceAfterNote(writeCursor, false)
        }
      }
    },
    [
      addNoteAtCursor,
      advanceAfterNote,
      completePendingLink,
      cursor,
      measures,
      pendingLink,
      previewNote,
      selectedNote,
      selectedTechnique,
      startPendingLink,
      tuningStrings,
      updateBeatAt,
    ]
  )

  const handleNoteClick = useCallback(
    (target: TabCursor, string: number) => {
      const beat = getBeatAt(measures, target)
      const note = findNoteOnString(beat, string)
      if (!note) return

      void previewTabNote(note, tuningStrings)

      if (
        pendingLink &&
        string === pendingLink.string &&
        note.fret !== pendingLink.originFret
      ) {
        completePendingLink(target)
        setSelectedNote(null)
        setCursor(target)
        return
      }

      if (pendingLink) {
        return
      }

      if (selectedTechnique) {
        updateBeatAt(target, (currentBeat) => ({
          ...currentBeat,
          notes: currentBeat.notes.map((currentNote) =>
            currentNote.id === note.id
              ? applyTechnique(currentNote, selectedTechnique)
              : currentNote
          ),
        }))
        startPendingLink(target, string, selectedTechnique, note.fret)
        setSelectedTechnique(null)
        return
      }

      setSelectedNote({
        cursor: target,
        string,
        noteId: note.id,
      })
    },
    [
      measures,
      pendingLink,
      previewTabNote,
      selectedTechnique,
      startPendingLink,
      tuningStrings,
      updateBeatAt,
      completePendingLink,
    ]
  )

  const highlightGlobalBeat =
    playingBeatIndex ?? globalBeatIndex(measures, cursor.measureIndex, cursor.beatIndex)

  const highlightCursor = isPlaying
    ? cursorFromGlobal(measures, playingBeatIndex ?? 0)
    : cursor

  const handlePlayTablature = () => {
    if (isPlaying) {
      stopPlayback()
      return
    }
    void playTablature(flattenMeasures(measures), tuningStrings)
  }

  const addMeasure = () => {
    setMeasures((prev) => [...prev, createMeasure()])
    setCursor({ measureIndex: measures.length, beatIndex: 0 })
  }

  const removeCurrentMeasure = () => {
    if (measures.length <= 1) {
      setMeasures(createInitialMeasures())
      setCursor({ measureIndex: 0, beatIndex: 0 })
      return
    }

    setMeasures((prev) => prev.filter((_, i) => i !== cursor.measureIndex))
    setCursor((c) => ({
      measureIndex: Math.max(0, c.measureIndex - 1),
      beatIndex: 0,
    }))
  }

  const clearAll = () => {
    stopPlayback()
    setMetadata({ ...DEFAULT_TAB_METADATA })
    setMeasures(createInitialMeasures())
    setCursor({ measureIndex: 0, beatIndex: 0 })
    setSelectedTechnique(null)
    setPendingLink(null)
    setSelectedNote(null)
  }

  const loadDemo = () => {
    stopPlayback()
    const demo = createDemoSong()
    setMetadata(demo.metadata)
    setMeasures(demo.measures)
    setCursor({ measureIndex: 0, beatIndex: 0 })
    setSelectedTechnique(null)
    setPendingLink(null)
    setSelectedNote(null)
  }

  return (
    <div className="tablature-editor min-h-screen bg-background">
      <header className="editor-toolbar sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-3 md:px-8">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon-sm"
              render={<Link href="/" />}
              aria-label={tablatureUi.backToSite}
            >
              <ChevronLeft />
            </Button>
            <h1 className="font-display text-lg tracking-wide uppercase md:text-xl">
              {tablatureUi.pageTitle}
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              render={<Link href="/afinacao" />}
            >
              <Music2 />
              <span className="hidden sm:inline">Afinação</span>
            </Button>
            <Button
              type="button"
              variant={isPlaying ? "default" : "outline"}
              size="sm"
              disabled={!hasAnyNotes(measures) && !isPlaying}
              onClick={handlePlayTablature}
              title={tablatureUi.playTablatureHint}
            >
              {isPlaying ? <Pause /> : <Play />}
              <span className="hidden sm:inline">
                {isPlaying ? tablatureUi.stopPlayback : tablatureUi.playTablature}
              </span>
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={loadDemo}
              title={tablatureUi.loadDemoHint}
            >
              <FileMusic />
              <span className="hidden sm:inline">{tablatureUi.loadDemo}</span>
            </Button>
            <Button type="button" variant="outline" size="sm" onClick={clearAll}>
              <RotateCcw />
              <span className="hidden sm:inline">{tablatureUi.clear}</span>
            </Button>
            <TabExportMenu
              measures={measures}
              metadata={metadata}
              exportRef={exportRef}
            />
          </div>
        </div>
      </header>

      <main className="editor-main mx-auto max-w-7xl space-y-6 px-5 py-6 md:px-8 md:py-8">
        <div className="editor-controls space-y-3">
          <TabMetadataFields metadata={metadata} onChange={setMetadata} />
        </div>

        <div className="editor-controls">
          <TuningSelector value={tuningId} onChange={setTuningId} />
        </div>

        <div className="editor-controls space-y-2">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm font-medium text-foreground">
              {tablatureUi.measure} {cursor.measureIndex + 1} · {tablatureUi.pulse}{" "}
              {cursor.beatIndex + 1}
              {pulseCount > 0 ? ` / ${pulseCount}` : ""}
            </span>
            <div className="flex items-center gap-1">
              <Button
                type="button"
                variant="outline"
                size="icon-sm"
                onClick={goToPreviousPulse}
                aria-label={tablatureUi.previousPulse}
              >
                <ChevronLeft />
              </Button>
              <Button
                type="button"
                variant="outline"
                size="icon-sm"
                onClick={goToNextPulse}
                aria-label={tablatureUi.nextPulse}
              >
                <ChevronRight />
              </Button>
            </div>
            <Button type="button" variant="outline" size="sm" onClick={addMeasure}>
              <Plus />
              {tablatureUi.newMeasure}
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={removeCurrentMeasure}
            >
              <Trash2 />
              {tablatureUi.removeMeasure}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">{tablatureUi.cursorHelp}</p>
          <p className="text-[11px] text-muted-foreground/80">
            {tablatureUi.cursorShortcuts}
          </p>
        </div>

        <div className="editor-controls">
          <TechniqueToolbar
            selected={selectedTechnique}
            selectedNote={selectedNote}
            pendingLink={pendingLink}
            onSelect={handleTechniqueSelect}
            onApplyToSelectedNote={handleApplyToSelectedNote}
          />
        </div>

        <Fretboard
          measures={measures}
          highlightCursor={highlightCursor}
          tuningStrings={tuningStrings}
          selectedTechnique={selectedTechnique}
          pendingLinkString={pendingLink?.string ?? null}
          onCellClick={handleCellClick}
        />

        <TabStaff
          measures={measures}
          metadata={metadata}
          tuningStrings={tuningStrings}
          highlightCursor={highlightCursor}
          highlightGlobalBeat={highlightGlobalBeat}
          isPlaying={isPlaying}
          selectedTechnique={selectedTechnique}
          selectedNote={selectedNote}
          onCursorSelect={setCursor}
          onNoteClick={handleNoteClick}
        />
      </main>

      <div
        ref={exportRef}
        className="tab-export-sheet pointer-events-none fixed left-[-10000px] top-0 z-[-1] w-198.5 bg-white p-8 text-black"
        aria-hidden
      >
        <TabExportSheet
          measures={measures}
          metadata={metadata}
          tuningStrings={tuningStrings}
        />
      </div>
    </div>
  )
}
