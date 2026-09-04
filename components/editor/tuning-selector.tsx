"use client"

import { cn } from "@/lib/utils"
import { TUNINGS } from "@/lib/tab-constants"
import type { Tuning } from "@/lib/tab-types"
import { tablatureUi } from "@/lib/tablature-ui"

type TuningSelectorProps = {
  value: string
  onChange: (tuningId: string) => void
}

export function TuningSelector({ value, onChange }: TuningSelectorProps) {
  const current = TUNINGS.find((t) => t.id === value) ?? TUNINGS[0]

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
      <label htmlFor="tuning-select" className="text-sm font-medium text-foreground">
        {tablatureUi.tuningLabel}
      </label>
      <select
        id="tuning-select"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          "h-9 rounded-lg border border-input bg-card px-3 font-mono text-sm text-foreground",
          "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 focus-visible:outline-none"
        )}
      >
        {TUNINGS.map((tuning) => (
          <option key={tuning.id} value={tuning.id}>
            {tuning.name}
          </option>
        ))}
      </select>
      <div className="flex gap-1.5">
        {current.strings.map((note, i) => (
          <span
            key={`${current.id}-${i}`}
            className="flex size-8 items-center justify-center rounded-md bg-secondary font-mono text-xs font-semibold text-secondary-foreground"
          >
            {note}
          </span>
        ))}
      </div>
    </div>
  )
}

export function getTuningById(id: string): Tuning {
  return TUNINGS.find((t) => t.id === id) ?? TUNINGS[0]
}
