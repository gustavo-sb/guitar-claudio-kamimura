"use client"

import type { TabStringNotation } from "@/lib/tab-notation"
import { cn } from "@/lib/utils"

type TabNoteGlyphProps = {
  notation: TabStringNotation
  className?: string
}

export function TabNoteGlyph({ notation, className }: TabNoteGlyphProps) {
  if (notation.kind === "empty" || notation.kind === "link-target") {
    return null
  }

  if (notation.kind === "fret") {
    return (
      <span className={cn("text-[11px] font-semibold tabular-nums", className)}>
        {notation.fret}
      </span>
    )
  }

  if (notation.kind === "linked") {
    return (
      <LinkedGlyph
        technique={notation.technique}
        originFret={notation.originFret}
        destFret={notation.destFret}
        className={className}
      />
    )
  }

  if (notation.kind === "linked-pending") {
    return (
      <LinkedGlyph
        technique={notation.technique}
        originFret={notation.originFret}
        destFret="?"
        pending
        className={className}
      />
    )
  }

  return (
    <ArtifactGlyph
      fret={notation.fret}
      artifact={notation.artifact}
      className={className}
    />
  )
}

function LinkedGlyph({
  technique,
  originFret,
  destFret,
  pending = false,
  className,
}: {
  technique: "hammer-on" | "pull-off" | "slide-up" | "slide-down"
  originFret: string
  destFret: string
  pending?: boolean
  className?: string
}) {
  const isSlide = technique === "slide-up" || technique === "slide-down"
  const slideDown = technique === "slide-down"

  if (isSlide) {
    return (
      <span
        className={cn(
          "relative inline-flex items-center gap-px text-[11px] font-semibold tabular-nums",
          className
        )}
      >
      <span>{originFret}</span>
      <svg
        viewBox="0 0 14 16"
        className="h-4 w-3.5 shrink-0 text-foreground"
        aria-hidden
      >
        <line
          x1="1"
          y1={slideDown ? "3" : "13"}
          x2="13"
          y2={slideDown ? "13" : "3"}
          stroke="currentColor"
          strokeWidth="1.35"
          strokeLinecap="round"
          strokeDasharray={pending ? "2 2" : undefined}
        />
      </svg>
      <span className={cn(pending && "text-muted-foreground/60")}>{destFret}</span>
      </span>
    )
  }

  return (
    <span className={cn("inline-flex flex-col items-center", className)}>
      <span className="flex items-baseline gap-0.5 text-[11px] font-semibold tabular-nums">
        <span>{originFret}</span>
        <span className={cn(pending && "text-muted-foreground/60")}>{destFret}</span>
      </span>
      <svg viewBox="0 0 28 8" className="h-1.5 w-7 text-foreground" aria-hidden>
        <path
          d="M 2 6 Q 14 1 26 6"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.35"
          strokeLinecap="round"
          strokeDasharray={pending ? "2 2" : undefined}
        />
      </svg>
    </span>
  )
}

function ArtifactGlyph({
  fret,
  artifact,
  className,
}: {
  fret: string
  artifact: "vibrato" | "bend" | "tap" | "harmonic" | "palm-mute"
  className?: string
}) {
  return (
    <span className={cn("relative inline-flex flex-col items-center", className)}>
      {artifact === "tap" ? (
        <span className="mb-0.5 text-[9px] font-bold leading-none tracking-tight">T</span>
      ) : artifact === "vibrato" ? (
        <svg viewBox="0 0 28 8" className="mb-0.5 h-2 w-7 text-foreground" aria-hidden>
          <path
            d="M1 4 C3 1, 5 7, 7 4 S11 1, 13 4 S17 7, 19 4 S21 1, 23 4"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.25"
            strokeLinecap="round"
          />
        </svg>
      ) : artifact === "bend" ? (
        <span className="relative mb-0.5 flex h-3.5 w-6 items-end justify-center">
          <svg viewBox="0 0 22 18" className="h-3.5 w-6 text-foreground" aria-hidden>
            <path
              d="M 2 16 Q 9 2 18 5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.25"
              strokeLinecap="round"
            />
            <path
              d="M 16 4 L 18 5 L 16.5 6.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.1"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="absolute -top-0.5 left-1/2 -translate-x-1/2 text-[7px] leading-none">
            ½
          </span>
        </span>
      ) : artifact === "harmonic" ? (
        <span className="mb-0.5 text-[8px] font-semibold leading-none">&lt;&gt;</span>
      ) : artifact === "palm-mute" ? (
        <span className="mb-0.5 text-[7px] font-semibold leading-none">PM</span>
      ) : null}

      <span className="text-[11px] font-semibold tabular-nums">{fret}</span>
    </span>
  )
}

export function notationHasVisibleContent(notation: TabStringNotation): boolean {
  return (
    notation.kind !== "empty" &&
    notation.kind !== "link-target"
  )
}

export function notationPrimaryNote(notation: TabStringNotation) {
  if (notation.kind === "empty") return undefined
  return notation.note
}
