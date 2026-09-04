"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import {
  getNoteFrequency,
  midiToFrequency,
  getOpenStringMidi,
  TabAudioEngine,
} from "@/lib/tab-audio"

export function useTunerAudio() {
  const engineRef = useRef<TabAudioEngine | null>(null)
  const [activeString, setActiveString] = useState<number | null>(null)
  const [isPlayingAll, setIsPlayingAll] = useState(false)
  const sequenceTokenRef = useRef(0)

  const getEngine = useCallback(() => {
    if (!engineRef.current) {
      engineRef.current = new TabAudioEngine()
    }
    return engineRef.current
  }, [])

  useEffect(() => {
    return () => {
      sequenceTokenRef.current += 1
      engineRef.current?.stopPlayback()
    }
  }, [])

  const playString = useCallback(
    async (stringNum: number, openNote: string, duration = 1.4) => {
      sequenceTokenRef.current += 1
      setIsPlayingAll(false)

      const engine = getEngine()
      await engine.ensureContext()
      setActiveString(stringNum)
      engine.playFrequency(getNoteFrequency(stringNum, 0, openNote), {
        duration,
      })

      window.setTimeout(() => {
        setActiveString((current) => (current === stringNum ? null : current))
      }, duration * 1000)
    },
    [getEngine]
  )

  const playAllStrings = useCallback(
    async (tuningStrings: string[]) => {
      const token = ++sequenceTokenRef.current
      const engine = getEngine()
      await engine.ensureContext()
      setIsPlayingAll(true)

      // Low 6th → high 1st
      for (let stringNum = 6; stringNum >= 1; stringNum--) {
        if (token !== sequenceTokenRef.current) return

        const openNote = tuningStrings[stringNum - 1] ?? "E"
        setActiveString(stringNum)
        engine.playFrequency(getNoteFrequency(stringNum, 0, openNote), {
          duration: 0.85,
        })
        await new Promise((resolve) => setTimeout(resolve, 900))
      }

      if (token === sequenceTokenRef.current) {
        setActiveString(null)
        setIsPlayingAll(false)
      }
    },
    [getEngine]
  )

  const stop = useCallback(() => {
    sequenceTokenRef.current += 1
    getEngine().stopPlayback()
    setActiveString(null)
    setIsPlayingAll(false)
  }, [getEngine])

  return {
    activeString,
    isPlayingAll,
    playString,
    playAllStrings,
    stop,
    getStringFrequency: (stringNum: number, openNote: string) =>
      midiToFrequency(getOpenStringMidi(stringNum, openNote)),
  }
}
