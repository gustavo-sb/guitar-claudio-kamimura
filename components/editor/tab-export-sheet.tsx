"use client"

import { TabStaff } from "@/components/editor/tab-staff"
import { FretboardExport } from "@/components/editor/fretboard-export"
import type { TabSongMetadata } from "@/lib/tab-metadata"
import type { TabMeasure } from "@/lib/tab-types"
import { tablatureUi } from "@/lib/tablature-ui"

type TabExportSheetProps = {
  measures: TabMeasure[]
  metadata: TabSongMetadata
  tuningStrings: string[]
}

export function TabExportSheet({
  measures,
  metadata,
  tuningStrings,
}: TabExportSheetProps) {
  const hasContent = measures.some((measure) =>
    measure.beats.some((beat) => beat.notes.length > 0)
  )

  if (!hasContent) return null

  return (
    <>
      <TabStaff
        measures={measures}
        metadata={metadata}
        tuningStrings={tuningStrings}
        variant="export"
      />

      <div className="mt-8 border-t border-black/15 pt-6">
        <h3 className="mb-3 text-xs font-semibold tracking-wider text-black/60 uppercase">
          {tablatureUi.exportFretboardTitle}
        </h3>
        <FretboardExport measures={measures} tuningStrings={tuningStrings} />
      </div>
    </>
  )
}
