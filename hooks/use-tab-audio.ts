"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { TabAudioEngine } from "@/lib/tab-audio"
import type { TabBeat, TabNote } from "@/lib/tab-types"

export function useTabAudio() {
  const engineRef = useRef<TabAudioEngine | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [playingBeatIndex, setPlayingBeatIndex] = useState<number | null>(null)

  const getEngine = useCallback(() => {
    if (!engineRef.current) {
      engineRef.current = new TabAudioEngine()
    }
    return engineRef.current
  }, [])

  useEffect(() => {
    return () => {
      engineRef.current?.stopPlayback()
    }
  }, [])

  const previewNote = useCallback(
    async (stringNum: number, fret: number, openNote: string) => {
      const engine = getEngine()
      await engine.ensureContext()
      engine.playPreview(stringNum, fret, openNote)
    },
    [getEngine]
  )

  const previewTabNote = useCallback(
    async (note: TabNote, tuningStrings: string[]) => {
      const engine = getEngine()
      await engine.ensureContext()
      engine.playNote(note, tuningStrings)
    },
    [getEngine]
  )

  const playTablature = useCallback(
    async (beats: TabBeat[], tuningStrings: string[]) => {
      const engine = getEngine()
      const hasNotes = beats.some((beat) => beat.notes.length > 0)
      if (!hasNotes) return

      setIsPlaying(true)
      await engine.playBeats(beats, tuningStrings, setPlayingBeatIndex)
      setIsPlaying(false)
      setPlayingBeatIndex(null)
    },
    [getEngine]
  )

  const stopPlayback = useCallback(() => {
    getEngine().stopPlayback()
    setIsPlaying(false)
    setPlayingBeatIndex(null)
  }, [getEngine])

  return {
    isPlaying,
    playingBeatIndex,
    previewNote,
    previewTabNote,
    playTablature,
    stopPlayback,
  }
}
