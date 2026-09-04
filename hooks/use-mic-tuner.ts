"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import {
  centsToNeedle,
  detectPitch,
  isInTune,
  type DetectedPitch,
} from "@/lib/pitch-detect"

export type MicTunerStatus =
  | "idle"
  | "requesting"
  | "listening"
  | "denied"
  | "error"

export type MicTunerReading = DetectedPitch & {
  needle: number
  inTune: boolean
  volume: number
}

export function useMicTuner() {
  const [status, setStatus] = useState<MicTunerStatus>("idle")
  const [reading, setReading] = useState<MicTunerReading | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const contextRef = useRef<AudioContext | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const frameRef = useRef<number | null>(null)
  const bufferRef = useRef<Float32Array | null>(null)
  const smoothCentsRef = useRef(0)
  const lastNoteRef = useRef<string | null>(null)

  const stop = useCallback(() => {
    if (frameRef.current !== null) {
      cancelAnimationFrame(frameRef.current)
      frameRef.current = null
    }

    streamRef.current?.getTracks().forEach((track) => track.stop())
    streamRef.current = null

    void contextRef.current?.close()
    contextRef.current = null
    analyserRef.current = null
    bufferRef.current = null
    setReading(null)
    setStatus("idle")
  }, [])

  useEffect(() => () => stop(), [stop])

  const tick = useCallback(() => {
    const analyser = analyserRef.current
    const context = contextRef.current
    const buffer = bufferRef.current
    if (!analyser || !context || !buffer) return

    analyser.getFloatTimeDomainData(buffer as Float32Array<ArrayBuffer>)

    let volume = 0
    for (let i = 0; i < buffer.length; i++) {
      const sample = buffer[i] ?? 0
      volume += sample * sample
    }
    volume = Math.sqrt(volume / buffer.length)

    const detected = detectPitch(buffer, context.sampleRate)

    if (!detected || volume < 0.012) {
      setReading((prev) =>
        prev
          ? {
              ...prev,
              volume,
              clarity: Math.max(0, prev.clarity - 0.08),
            }
          : null
      )
      frameRef.current = requestAnimationFrame(tick)
      return
    }

    if (lastNoteRef.current !== detected.note) {
      smoothCentsRef.current = detected.cents
      lastNoteRef.current = detected.note
    } else {
      smoothCentsRef.current =
        smoothCentsRef.current * 0.72 + detected.cents * 0.28
    }

    const cents = smoothCentsRef.current
    setReading({
      ...detected,
      cents,
      needle: centsToNeedle(cents),
      inTune: isInTune(cents),
      volume,
    })

    frameRef.current = requestAnimationFrame(tick)
  }, [])

  const start = useCallback(async () => {
    if (status === "listening" || status === "requesting") return

    setStatus("requesting")
    setErrorMessage(null)

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false,
        },
      })

      const context = new AudioContext()
      const source = context.createMediaStreamSource(stream)
      const analyser = context.createAnalyser()
      analyser.fftSize = 4096
      analyser.smoothingTimeConstant = 0
      source.connect(analyser)

      streamRef.current = stream
      contextRef.current = context
      analyserRef.current = analyser
      bufferRef.current = new Float32Array(analyser.fftSize)
      smoothCentsRef.current = 0
      lastNoteRef.current = null

      setStatus("listening")
      frameRef.current = requestAnimationFrame(tick)
    } catch (error) {
      const denied =
        error instanceof DOMException &&
        (error.name === "NotAllowedError" || error.name === "PermissionDeniedError")
      setStatus(denied ? "denied" : "error")
      setErrorMessage(
        denied
          ? "Permissão do microfone negada."
          : "Não foi possível acessar o microfone."
      )
    }
  }, [status, tick])

  return {
    status,
    reading,
    errorMessage,
    start,
    stop,
    isListening: status === "listening",
  }
}
