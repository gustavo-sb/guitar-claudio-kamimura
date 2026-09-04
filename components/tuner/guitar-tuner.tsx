"use client"

import { TunerGauge } from "@/components/tuner/tuner-gauge"
import { Button } from "@/components/ui/button"
import { useMicTuner } from "@/hooks/use-mic-tuner"
import { useTunerAudio } from "@/hooks/use-tuner-audio"
import {
  getDefaultTuningId,
  getTunerTuningById,
  getTuningsForInstrument,
  STRING_LABELS,
  TUNER_INSTRUMENTS,
  type TunerInstrument,
} from "@/lib/tuner-constants"
import { tunerUi } from "@/lib/tuner-ui"
import { cn } from "@/lib/utils"
import { ChevronLeft, Mic, MicOff, Music2, Pause, Play } from "lucide-react"
import Link from "next/link"
import { useMemo, useState } from "react"

export function GuitarTuner() {
  const [instrument, setInstrument] = useState<TunerInstrument>("guitar")
  const [tuningId, setTuningId] = useState(getDefaultTuningId("guitar"))
  const { status, reading, errorMessage, start, stop, isListening } =
    useMicTuner()
  const {
    activeString,
    isPlayingAll,
    playString,
    playAllStrings,
    stop: stopReference,
    getStringFrequency,
  } = useTunerAudio()

  const tunings = useMemo(
    () => getTuningsForInstrument(instrument),
    [instrument]
  )
  const tuning = getTunerTuningById(tuningId)

  // Display strings thick→thin (6ª to 1ª) like Cifra Club suggestion order reversed for guitarists who start from low E, but Cifra shows E6ª A5ª... from thick. Our strings array is high→low index 0=1ª. Map to 6→1 for chips.
  const stringTargets = tuning.strings.map((note, index) => ({
    stringNum: index + 1,
    note,
    label: STRING_LABELS[index],
  }))

  const handleInstrumentChange = (next: TunerInstrument) => {
    stopReference()
    setInstrument(next)
    setTuningId(getDefaultTuningId(next))
  }

  const handleTuningChange = (id: string) => {
    stopReference()
    setTuningId(id)
  }

  return (
    <div className="tuner-page min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-3 md:px-8">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon-sm"
              render={<Link href="/" />}
              aria-label={tunerUi.backToSite}
            >
              <ChevronLeft />
            </Button>
            <h1 className="font-display text-lg tracking-wide uppercase md:text-xl">
              {tunerUi.pageTitle}
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant={isListening ? "default" : "outline"}
              size="sm"
              onClick={() => {
                if (isListening) stop()
                else void start()
              }}
            >
              {isListening ? <MicOff /> : <Mic />}
              <span className="hidden sm:inline">
                {isListening ? tunerUi.stopMic : tunerUi.startMic}
              </span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              render={<Link href="/tablature" />}
            >
              <Music2 />
              <span className="hidden sm:inline">{tunerUi.openToTablature}</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-8 px-5 py-6 md:px-8 md:py-10">
        <section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
          <div className="space-y-4">
            <TunerGauge reading={reading} listening={isListening} />

            {!isListening ? (
              <div className="flex justify-center">
                <Button
                  type="button"
                  size="lg"
                  onClick={() => void start()}
                  className="min-w-56"
                >
                  <Mic />
                  {tunerUi.startMic}
                </Button>
              </div>
            ) : null}

            {status === "denied" || status === "error" ? (
              <div className="rounded-3xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                <p className="font-medium">
                  {status === "denied" ? tunerUi.deniedTitle : tunerUi.errorBody}
                </p>
                {status === "denied" ? (
                  <p className="mt-1 opacity-90">{tunerUi.deniedBody}</p>
                ) : null}
                {errorMessage && status === "error" ? (
                  <p className="mt-1 opacity-90">{errorMessage}</p>
                ) : null}
              </div>
            ) : null}
          </div>

          <div className="space-y-6">
            <div className="rounded-4xl border border-border bg-card p-5 md:p-6">
              <h2 className="font-display text-xl tracking-wide text-foreground uppercase">
                {tunerUi.stepsTitle}
              </h2>
              <ol className="mt-4 space-y-3 text-sm text-muted-foreground">
                <li>
                  <span className="font-medium text-foreground">1.</span>{" "}
                  {tunerUi.step1}
                </li>
                <li>
                  <span className="font-medium text-foreground">2.</span>{" "}
                  {tunerUi.step2}
                </li>
                <li>
                  <span className="font-medium text-foreground">3.</span>{" "}
                  {tunerUi.step3}
                </li>
              </ol>
              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                <p className="rounded-2xl bg-amber-500/10 px-3 py-2 text-sm text-amber-300">
                  {tunerUi.stepFlat}
                </p>
                <p className="rounded-2xl bg-sky-500/10 px-3 py-2 text-sm text-sky-300">
                  {tunerUi.stepSharp}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <h2 className="text-sm font-medium text-foreground">
                {tunerUi.instrumentTitle}
              </h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {TUNER_INSTRUMENTS.map((item) => {
                  const selected = instrument === item.id
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleInstrumentChange(item.id)}
                      className={cn(
                        "rounded-3xl border px-4 py-3 text-left transition-colors",
                        selected
                          ? "border-primary bg-primary/10 ring-2 ring-primary/30"
                          : "border-border bg-card hover:bg-muted/40"
                      )}
                    >
                      <p className="font-display text-lg tracking-wide text-foreground uppercase">
                        {item.label}
                      </p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {item.description}
                      </p>
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="space-y-3">
              <label
                htmlFor="tuner-tuning"
                className="text-sm font-medium text-foreground"
              >
                {tunerUi.tuningTitle}
              </label>
              <select
                id="tuner-tuning"
                value={tuningId}
                onChange={(event) => handleTuningChange(event.target.value)}
                className={cn(
                  "h-10 w-full rounded-lg border border-input bg-card px-3 font-mono text-sm text-foreground",
                  "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 focus-visible:outline-none"
                )}
              >
                {tunings.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="text-sm font-medium text-foreground">
                {tunerUi.stringsTitle}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {tunerUi.stringsHint}
              </p>
            </div>
            <Button
              type="button"
              variant={isPlayingAll ? "default" : "outline"}
              size="sm"
              onClick={() => {
                if (isPlayingAll) {
                  stopReference()
                  return
                }
                void playAllStrings([...tuning.strings])
              }}
              title={tunerUi.playAllHint}
            >
              {isPlayingAll ? <Pause /> : <Play />}
              {isPlayingAll ? tunerUi.stopPlayback : tunerUi.playAll}
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6">
            {[...stringTargets].reverse().map((item) => {
              const frequency = getStringFrequency(item.stringNum, item.note)
              const active = activeString === item.stringNum
              const matchesReading =
                reading &&
                reading.note.replace("#", "#") === item.note.replace("b", "b") &&
                // rough match by note name ignoring enharmonics for display highlight
                normalizeNote(reading.note) === normalizeNote(item.note)

              return (
                <button
                  key={`${tuning.id}-${item.stringNum}`}
                  type="button"
                  onClick={() => void playString(item.stringNum, item.note)}
                  className={cn(
                    "rounded-3xl border px-3 py-4 text-center transition-colors",
                    active || matchesReading
                      ? "border-primary bg-primary/15 ring-2 ring-primary/25"
                      : "border-border bg-card hover:bg-muted/35"
                  )}
                >
                  <p className="text-[11px] text-muted-foreground">
                    {item.note}
                    {item.label}
                  </p>
                  <p className="mt-1 font-display text-3xl tracking-wide text-foreground uppercase">
                    {item.note}
                  </p>
                  <p className="mt-1 font-mono text-[11px] text-muted-foreground">
                    {frequency.toFixed(1)} {tunerUi.frequencyLabel}
                  </p>
                </button>
              )
            })}
          </div>
        </section>
      </main>
    </div>
  )
}

function normalizeNote(note: string): string {
  const map: Record<string, string> = {
    Db: "C#",
    Eb: "D#",
    Gb: "F#",
    Ab: "G#",
    Bb: "A#",
  }
  return map[note] ?? note
}
