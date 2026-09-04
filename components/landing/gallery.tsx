"use client"

import { Reveal } from "@/components/landing/reveal"
import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { galleryItems } from "@/lib/content"
import { cn } from "@/lib/utils"
import { Play } from "lucide-react"
import Image from "next/image"
import { useState } from "react"

type GalleryItem = (typeof galleryItems)[number]

function GalleryCard({
  item,
  className,
  playSize = "icon",
  onOpen,
}: {
  item: GalleryItem
  className?: string
  playSize?: "icon-sm" | "icon" | "icon-lg"
  onOpen: (item: GalleryItem) => void
}) {
  const playClass =
    playSize === "icon-lg"
      ? "size-16"
      : playSize === "icon"
        ? "size-10"
        : "size-8"

  return (
    <button
      type="button"
      onClick={() => onOpen(item)}
      className={cn(
        "group relative block w-full overflow-hidden rounded-4xl text-left ring-1 ring-foreground/10",
        className
      )}
    >
      <Image
        src={item.image}
        alt={item.title}
        fill
        className="object-cover transition-transform duration-500 group-hover:scale-105"
        sizes="(max-width: 768px) 100vw, 50vw"
      />
      <div className="absolute inset-0 bg-linear-to-t from-background via-background/25 to-transparent" />
      <div className="absolute inset-0 flex items-center justify-center">
        <span
          className={cn(
            buttonVariants({ size: playSize, variant: "secondary" }),
            "pointer-events-none rounded-full backdrop-blur-sm transition-transform duration-300 group-hover:scale-110",
            playClass
          )}
          aria-hidden
        >
          <Play
            className={cn(
              "ml-0.5 fill-current",
              playSize === "icon-lg" ? "size-6" : playSize === "icon" ? "size-4" : "size-3.5"
            )}
          />
        </span>
      </div>
      <div className="absolute right-0 bottom-0 left-0 space-y-1 p-4 md:p-5">
        <Badge variant="secondary">{item.kind}</Badge>
        <p className="font-display text-xl tracking-wide text-foreground uppercase md:text-2xl">
          {item.title}
        </p>
      </div>
    </button>
  )
}

export function Gallery() {
  const [videoItem, setVideoItem] = useState<GalleryItem | null>(null)
  const [featured, ...rest] = galleryItems
  const sideItems = rest.slice(0, 3)
  const bottomItems = rest.slice(3)

  return (
    <section id="galeria" className="section-pad relative overflow-hidden">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <Reveal>
          <p className="section-kicker">Galeria</p>
          <h2 className="section-title">
            Aulas &amp; <span className="text-primary">palco</span>
          </h2>
          <p className="mt-4 max-w-lg text-muted-foreground">
            Performances, bastidores e momentos de aula — clique em um card para
            assistir.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-4 md:grid-cols-12 md:gap-5">
          {featured ? (
            <Reveal className="md:col-span-7">
              <GalleryCard
                item={featured}
                playSize="icon-lg"
                className="aspect-16/11"
                onOpen={setVideoItem}
              />
            </Reveal>
          ) : null}

          <div className="grid grid-cols-2 gap-4 md:col-span-5 md:grid-cols-1 md:gap-5">
            {sideItems.map((item, i) => (
              <Reveal key={item.title} delayMs={i * 90}>
                <GalleryCard
                  item={item}
                  playSize="icon-sm"
                  className="aspect-16/10 md:aspect-auto md:min-h-28"
                  onOpen={setVideoItem}
                />
              </Reveal>
            ))}
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-5">
          {bottomItems.map((item, i) => (
            <Reveal key={item.title} delayMs={i * 90}>
              <GalleryCard
                item={item}
                className="aspect-4/3"
                onOpen={setVideoItem}
              />
            </Reveal>
          ))}
        </div>
      </div>

      <Dialog
        open={Boolean(videoItem)}
        onOpenChange={(open) => {
          if (!open) setVideoItem(null)
        }}
      >
        <DialogContent className="gap-3 overflow-hidden p-3 sm:max-w-3xl">
          <DialogHeader className="pr-10">
            <DialogTitle className="font-display text-lg tracking-wide uppercase">
              {videoItem?.title}
            </DialogTitle>
            <DialogDescription>{videoItem?.kind}</DialogDescription>
          </DialogHeader>
          {videoItem ? (
            <div className="aspect-video overflow-hidden rounded-3xl bg-black">
              <iframe
                src={`${videoItem.videoUrl}?autoplay=1`}
                title={videoItem.title}
                className="size-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </section>
  )
}
