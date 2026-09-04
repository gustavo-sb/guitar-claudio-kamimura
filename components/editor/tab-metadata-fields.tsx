"use client"

import type { TabSongMetadata } from "@/lib/tab-metadata"
import { tablatureUi } from "@/lib/tablature-ui"

type TabMetadataFieldsProps = {
  metadata: TabSongMetadata
  onChange: (metadata: TabSongMetadata) => void
}

export function TabMetadataFields({
  metadata,
  onChange,
}: TabMetadataFieldsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <div className="sm:col-span-2">
        <label htmlFor="tab-title" className="mb-1 block text-xs text-muted-foreground">
          {tablatureUi.titleLabel}
        </label>
        <input
          id="tab-title"
          type="text"
          value={metadata.title}
          onChange={(e) => onChange({ ...metadata, title: e.target.value })}
          placeholder={tablatureUi.titlePlaceholder}
          className="w-full rounded-lg border border-input bg-card px-3 py-2 font-display text-lg tracking-wide text-foreground uppercase focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 focus-visible:outline-none"
        />
      </div>

      <div className="sm:col-span-2">
        <label htmlFor="tab-artist" className="mb-1 block text-xs text-muted-foreground">
          {tablatureUi.artistLabel}
        </label>
        <input
          id="tab-artist"
          type="text"
          value={metadata.artist}
          onChange={(e) => onChange({ ...metadata, artist: e.target.value })}
          placeholder={tablatureUi.artistPlaceholder}
          className="w-full rounded-lg border border-input bg-card px-3 py-2 text-sm focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 focus-visible:outline-none"
        />
      </div>

      <div>
        <label htmlFor="tab-bpm" className="mb-1 block text-xs text-muted-foreground">
          {tablatureUi.bpmLabel}
        </label>
        <input
          id="tab-bpm"
          type="number"
          min={40}
          max={300}
          value={metadata.bpm}
          onChange={(e) =>
            onChange({ ...metadata, bpm: Number(e.target.value) || 120 })
          }
          className="w-full rounded-lg border border-input bg-card px-3 py-2 font-mono text-sm focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 focus-visible:outline-none"
        />
      </div>

      <div>
        <label htmlFor="tab-time" className="mb-1 block text-xs text-muted-foreground">
          {tablatureUi.timeLabel}
        </label>
        <div className="flex items-center gap-2">
          <input
            id="tab-time-num"
            type="number"
            min={1}
            max={16}
            value={metadata.timeSignature.numerator}
            onChange={(e) =>
              onChange({
                ...metadata,
                timeSignature: {
                  ...metadata.timeSignature,
                  numerator: Number(e.target.value) || 4,
                },
              })
            }
            className="w-full rounded-lg border border-input bg-card px-3 py-2 font-mono text-sm focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 focus-visible:outline-none"
          />
          <span className="text-muted-foreground">/</span>
          <input
            id="tab-time"
            type="number"
            min={1}
            max={16}
            value={metadata.timeSignature.denominator}
            onChange={(e) =>
              onChange({
                ...metadata,
                timeSignature: {
                  ...metadata.timeSignature,
                  denominator: Number(e.target.value) || 4,
                },
              })
            }
            className="w-full rounded-lg border border-input bg-card px-3 py-2 font-mono text-sm focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 focus-visible:outline-none"
          />
        </div>
      </div>
    </div>
  )
}
