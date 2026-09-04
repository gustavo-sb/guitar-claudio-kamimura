"use client"

import { TECHNIQUES } from "@/lib/tab-constants"
import type { PendingLink, SelectedNoteRef, Technique } from "@/lib/tab-types"
import { isLinkedTechnique } from "@/lib/tab-utils"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { tablatureUi } from "@/lib/tablature-ui"

type TechniqueToolbarProps = {
  selected: Technique | null
  selectedNote?: SelectedNoteRef | null
  pendingLink?: PendingLink | null
  onSelect: (technique: Technique | null) => void
  onApplyToSelectedNote: (technique: Technique) => void
}

export function TechniqueToolbar({
  selected,
  selectedNote,
  pendingLink,
  onSelect,
  onApplyToSelectedNote,
}: TechniqueToolbarProps) {
  const hint = pendingLink
    ? tablatureUi.pendingLinkHint
    : selectedNote
      ? tablatureUi.selectedNoteHint
      : selected && isLinkedTechnique(selected)
        ? tablatureUi.applyTechniqueHint
        : tablatureUi.techniquesHint

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-foreground">
          {tablatureUi.techniquesTitle}
        </h3>
        {(selected || selectedNote || pendingLink) && (
          <Button
            type="button"
            variant="ghost"
            size="xs"
            onClick={() => onSelect(null)}
          >
            {tablatureUi.cancel}
          </Button>
        )}
      </div>
      <div className="flex flex-wrap gap-2.5">
        {TECHNIQUES.map((tech) => {
          const isLinked = isLinkedTechnique(tech.id)
          const linkedReady = isLinked && Boolean(selectedNote)

          return (
            <Button
              key={tech.id}
              type="button"
              variant={selected === tech.id ? "default" : "outline"}
              size="sm"
              disabled={Boolean(pendingLink)}
              onClick={() => {
                if (selectedNote) {
                  onApplyToSelectedNote(tech.id)
                  return
                }

                onSelect(selected === tech.id ? null : tech.id)
              }}
              className={cn(
                "font-mono",
                selected === tech.id && "ring-2 ring-primary/40",
                linkedReady && "border-primary/50"
              )}
              title={tech.label}
            >
              <span className="text-primary">{tech.symbol}</span>
              <span className="ml-1.5 text-xs font-sans">{tech.label}</span>
            </Button>
          )
        })}
      </div>
      <p className="text-[11px] text-muted-foreground">{hint}</p>
    </div>
  )
}
