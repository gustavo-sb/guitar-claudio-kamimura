import type { TabMeasure, TabNote } from "./tab-types"
import { collectAllNotes } from "./tab-document"

export { collectAllNotes }

export function usedFretRange(notes: TabNote[]): { min: number; max: number } {
  if (notes.length === 0) {
    return { min: 0, max: 12 }
  }

  const frets = notes.map((note) => note.fret)
  const min = Math.min(...frets)
  const max = Math.max(...frets)

  return {
    min: Math.max(0, min - 1),
    max: Math.max(12, max + 1),
  }
}

export function slugifyFilename(value: string): string {
  return (
    value
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "tablatura"
  )
}

/**
 * Rasterizes a DOM node to PNG.
 * Chrome taints a canvas when an SVG `<foreignObject>` is drawn into it, so
 * this uses a DOM renderer instead of that path.
 */
export async function exportElementAsPng(
  element: HTMLElement,
  filename: string
): Promise<void> {
  const width = element.offsetWidth
  const height = element.offsetHeight
  if (width === 0 || height === 0) {
    throw new Error("Export area has no visible size")
  }

  const { default: html2canvas } = await import("html2canvas-pro")
  const canvas = await html2canvas(element, {
    backgroundColor: "#ffffff",
    scale: 2,
    foreignObjectRendering: false,
    width,
    height,
    windowWidth: width,
    windowHeight: height,
    onclone: (_document, cloned) => {
      cloned.style.position = "static"
      cloned.style.left = "auto"
      cloned.style.top = "auto"
      cloned.style.zIndex = "auto"
      cloned.style.opacity = "1"
      cloned.style.transform = "none"
    },
  })

  const link = document.createElement("a")
  link.download = filename.endsWith(".png") ? filename : `${filename}.png`
  link.href = canvas.toDataURL("image/png")
  link.click()
}

export function printExportSheet(): void {
  document.body.classList.add("tab-export-printing")
  window.print()
  window.addEventListener(
    "afterprint",
    () => {
      document.body.classList.remove("tab-export-printing")
    },
    { once: true }
  )
}
