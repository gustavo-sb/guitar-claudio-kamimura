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

function inlineNodeStyles(source: Element, target: Element) {
  if (!(target instanceof HTMLElement) || !(source instanceof HTMLElement)) return

  const computed = window.getComputedStyle(source)

  for (const key of computed) {
    target.style.setProperty(
      key,
      computed.getPropertyValue(key),
      computed.getPropertyPriority(key)
    )
  }

  for (let i = 0; i < source.children.length; i++) {
    const sourceChild = source.children[i]
    const targetChild = target.children[i]
    if (sourceChild && targetChild) {
      inlineNodeStyles(sourceChild, targetChild)
    }
  }
}

/** Captures a DOM node as PNG using SVG foreignObject (no extra dependencies). */
export async function exportElementAsPng(
  element: HTMLElement,
  filename: string
): Promise<void> {
  const previousStyle = {
    position: element.style.position,
    left: element.style.left,
    top: element.style.top,
    zIndex: element.style.zIndex,
    opacity: element.style.opacity,
    pointerEvents: element.style.pointerEvents,
  }

  element.style.position = "fixed"
  element.style.left = "0"
  element.style.top = "0"
  element.style.zIndex = "9999"
  element.style.opacity = "1"
  element.style.pointerEvents = "none"

  await new Promise<void>((resolve) => {
    requestAnimationFrame(() => resolve())
  })

  const width = element.offsetWidth
  const height = element.offsetHeight

  if (width === 0 || height === 0) {
    Object.assign(element.style, previousStyle)
    throw new Error("Export area has no visible size")
  }

  const clone = element.cloneNode(true) as HTMLElement
  clone.setAttribute("xmlns", "http://www.w3.org/1999/xhtml")
  inlineNodeStyles(element, clone)

  const serialized = new XMLSerializer().serializeToString(clone)
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
  <foreignObject width="100%" height="100%">
    ${serialized}
  </foreignObject>
</svg>`

  const blob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" })
  const url = URL.createObjectURL(blob)

  try {
    const image = await loadImage(url)
    const scale = 2
    const canvas = document.createElement("canvas")
    canvas.width = width * scale
    canvas.height = height * scale

    const ctx = canvas.getContext("2d")
    if (!ctx) throw new Error("Canvas not supported")

    ctx.scale(scale, scale)
    ctx.fillStyle = "#ffffff"
    ctx.fillRect(0, 0, width, height)
    ctx.drawImage(image, 0, 0, width, height)

    const link = document.createElement("a")
    link.download = filename.endsWith(".png") ? filename : `${filename}.png`
    link.href = canvas.toDataURL("image/png")
    link.click()
  } finally {
    URL.revokeObjectURL(url)
    Object.assign(element.style, previousStyle)
  }
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve(image)
    image.onerror = () => reject(new Error("Failed to render export image"))
    image.src = src
  })
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
