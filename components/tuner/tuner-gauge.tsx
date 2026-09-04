"use client"

import type { MicTunerReading } from "@/hooks/use-mic-tuner"
import { tunerUi } from "@/lib/tuner-ui"
import { cn } from "@/lib/utils"

type TunerGaugeProps = {
  reading: MicTunerReading | null
  listening: boolean
}

export function TunerGauge({ reading, listening }: TunerGaugeProps) {
  const needle = reading?.needle ?? 0
  const rotation = needle * 55
  const inTune = reading?.inTune ?? false
  const hasSignal = Boolean(reading && reading.clarity > 0.45 && reading.volume > 0.012)

  let guidance: string = tunerUi.waitingNote
  if (hasSignal && reading) {
    if (inTune) guidance = tunerUi.inTune
    else if (reading.cents < 0) guidance = tunerUi.tighten
    else guidance = tunerUi.loosen
  } else if (listening) {
    guidance = tunerUi.playStringHint
  }

  return (
    <div className="relative mx-auto w-full max-w-xl">
      <div
        className={cn(
          "relative overflow-hidden rounded-[2rem] border bg-card px-4 pb-8 pt-10 shadow-xl ring-1 ring-foreground/5 md:px-8",
          inTune && hasSignal
            ? "border-emerald-500/50 ring-emerald-500/20"
            : "border-border"
        )}
      >
        <div className="mb-2 flex items-center justify-between px-2 text-xs font-medium tracking-wide text-muted-foreground uppercase">
          <span className={cn(hasSignal && reading && reading.cents < -5 && "text-amber-400")}>
            {tunerUi.tighten}
          </span>
          <span className={cn(inTune && hasSignal && "text-emerald-400")}>
            {tunerUi.centered}
          </span>
          <span className={cn(hasSignal && reading && reading.cents > 5 && "text-sky-400")}>
            {tunerUi.loosen}
          </span>
        </div>

        <div className="relative mx-auto aspect-2/1 w-full max-w-md">
          <svg viewBox="0 0 320 170" className="size-full" aria-hidden>
            <defs>
              <linearGradient id="tuner-arc" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="oklch(0.75 0.15 75)" />
                <stop offset="45%" stopColor="oklch(0.78 0.18 145)" />
                <stop offset="55%" stopColor="oklch(0.78 0.18 145)" />
                <stop offset="100%" stopColor="oklch(0.72 0.14 230)" />
              </linearGradient>
            </defs>

            <path
              d="M 30 150 A 130 130 0 0 1 290 150"
              fill="none"
              stroke="currentColor"
              strokeWidth="18"
              className="text-muted/40"
              strokeLinecap="round"
            />
            <path
              d="M 30 150 A 130 130 0 0 1 290 150"
              fill="none"
              stroke="url(#tuner-arc)"
              strokeWidth="10"
              strokeLinecap="round"
              opacity="0.9"
            />

            {/* center mark */}
            <line
              x1="160"
              y1="28"
              x2="160"
              y2="48"
              stroke="currentColor"
              strokeWidth="3"
              className="text-emerald-400"
            />

            {/* tick marks */}
            {[-40, -20, 20, 40].map((cent) => {
              const needlePos = cent / 50
              const deg = -90 + needlePos * 55
              const rad = (deg * Math.PI) / 180
              const x1 = 160 + Math.cos(rad) * 112
              const y1 = 150 + Math.sin(rad) * 112
              const x2 = 160 + Math.cos(rad) * 128
              const y2 = 150 + Math.sin(rad) * 128
              return (
                <line
                  key={cent}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke="currentColor"
                  strokeWidth="2"
                  className="text-foreground/35"
                />
              )
            })}

            <g
              style={{
                transformOrigin: "160px 150px",
                transform: `rotate(${rotation}deg)`,
                transition: "transform 80ms linear",
              }}
            >
              <line
                x1="160"
                y1="150"
                x2="160"
                y2="42"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                className={cn(
                  inTune && hasSignal ? "text-emerald-400" : "text-primary"
                )}
              />
              <circle
                cx="160"
                cy="150"
                r="8"
                className={cn(
                  inTune && hasSignal ? "fill-emerald-400" : "fill-primary"
                )}
              />
            </g>
          </svg>

          <div className="absolute inset-x-0 bottom-2 flex flex-col items-center">
            <p
              className={cn(
                "font-display text-6xl tracking-wide md:text-7xl",
                inTune && hasSignal
                  ? "text-emerald-400"
                  : hasSignal
                    ? "text-foreground"
                    : "text-muted-foreground/50"
              )}
            >
              {hasSignal && reading ? reading.note : "—"}
            </p>
            {hasSignal && reading ? (
              <p className="mt-1 font-mono text-sm text-muted-foreground">
                {reading.frequency.toFixed(1)} Hz ·{" "}
                {reading.cents >= 0 ? "+" : ""}
                {reading.cents.toFixed(0)} cents
              </p>
            ) : (
              <p className="mt-1 text-sm text-muted-foreground">
                {listening ? tunerUi.listening : tunerUi.micOff}
              </p>
            )}
          </div>
        </div>

        <p
          className={cn(
            "mt-4 text-center font-display text-2xl tracking-wide uppercase md:text-3xl",
            inTune && hasSignal
              ? "text-emerald-400"
              : hasSignal && reading && reading.cents < 0
                ? "text-amber-400"
                : hasSignal && reading && reading.cents > 0
                  ? "text-sky-400"
                  : "text-muted-foreground"
          )}
        >
          {guidance}
        </p>
      </div>
    </div>
  )
}
