"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import type { TabSongMetadata } from "@/lib/tab-metadata"
import { exportElementAsPng, printExportSheet, slugifyFilename } from "@/lib/tab-export"
import { hasAnyNotes } from "@/lib/tab-document"
import type { TabMeasure } from "@/lib/tab-types"
import { tablatureUi } from "@/lib/tablature-ui"
import { ChevronDown, Image, Printer } from "lucide-react"
import { cn } from "@/lib/utils"

type TabExportMenuProps = {
  measures: TabMeasure[]
  metadata: TabSongMetadata
  exportRef: React.RefObject<HTMLDivElement | null>
}

export function TabExportMenu({
  measures,
  metadata,
  exportRef,
}: TabExportMenuProps) {
  const [open, setOpen] = useState(false)
  const [exporting, setExporting] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  const canExport = hasAnyNotes(measures)

  useEffect(() => {
    if (!open) return

    const onPointerDown = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false)
    }

    document.addEventListener("mousedown", onPointerDown)
    document.addEventListener("keydown", onKeyDown)
    return () => {
      document.removeEventListener("mousedown", onPointerDown)
      document.removeEventListener("keydown", onKeyDown)
    }
  }, [open])

  const handleExportImage = useCallback(async () => {
    const node = exportRef.current
    if (!node) return

    setExporting(true)
    setOpen(false)

    try {
      const filename = `${slugifyFilename(metadata.title || tablatureUi.defaultTitle)}.png`
      await exportElementAsPng(node, filename)
    } catch {
      window.alert(tablatureUi.exportImageError)
    } finally {
      setExporting(false)
    }
  }, [exportRef, metadata.title])

  const handlePrint = useCallback(() => {
    setOpen(false)
    printExportSheet()
  }, [])

  return (
    <div ref={menuRef} className="relative">
      <Button
        type="button"
        size="sm"
        disabled={!canExport || exporting}
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => setOpen((value) => !value)}
      >
        <Printer />
        <span className="hidden sm:inline">
          {exporting ? tablatureUi.exportingImage : tablatureUi.export}
        </span>
        <ChevronDown className={cn("size-3.5 transition-transform", open && "rotate-180")} />
      </Button>

      {open ? (
        <div
          role="menu"
          className="absolute right-0 top-[calc(100%+0.35rem)] z-50 min-w-48 overflow-hidden rounded-xl border border-border bg-popover p-1 shadow-lg"
        >
          <button
            type="button"
            role="menuitem"
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm hover:bg-muted"
            onClick={() => void handleExportImage()}
          >
            <Image className="size-4" />
            {tablatureUi.exportImage}
          </button>
          <button
            type="button"
            role="menuitem"
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm hover:bg-muted"
            onClick={handlePrint}
          >
            <Printer className="size-4" />
            {tablatureUi.exportPrint}
          </button>
        </div>
      ) : null}
    </div>
  )
}
