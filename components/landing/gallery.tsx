"use client"

import { Reveal } from "@/components/landing/reveal"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { galleryItems } from "@/lib/content"
import { cn } from "@/lib/utils"
import { Play } from "lucide-react"
import Image from "next/image"
import { useState } from "react"

export function Gallery() {
  const [active, setActive] = useState(0)
  const current = galleryItems[active] ?? galleryItems[0]

  return (
    <section id="galeria" className="section-pad relative overflow-hidden">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <Reveal>
          <p className="section-kicker">Galeria</p>
          <h2 className="section-title">
            Aulas &amp; <span className="text-primary">palco</span>
          </h2>
          <p className="mt-4 max-w-lg text-muted-foreground">
            Performances, bastidores e momentos de aula. Em breve, vídeos reais
            do Claudio e dos alunos.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-4 md:grid-cols-12 md:gap-5">
          <Reveal className="md:col-span-7">
            <button
              type="button"
              onClick={() => setActive(0)}
              className="group relative block aspect-16/11 w-full overflow-hidden rounded-4xl text-left ring-1 ring-foreground/10"
            >
              <Image
                src={current.image}
                alt={current.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 60vw"
              />
              <div className="absolute inset-0 bg-linear-to-t from-background via-background/20 to-transparent" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Button
                  size="icon-lg"
                  variant="secondary"
                  className="pointer-events-none size-16 rounded-full backdrop-blur-sm transition-transform duration-300 group-hover:scale-110"
                  tabIndex={-1}
                >
                  <Play className="ml-0.5 size-6 fill-current" />
                </Button>
              </div>
              <div className="absolute right-0 bottom-0 left-0 space-y-2 p-6">
                <Badge variant="secondary">{current.kind}</Badge>
                <p className="font-display text-3xl tracking-wide text-foreground uppercase">
                  {current.title}
                </p>
              </div>
            </button>
          </Reveal>

          <div className="grid grid-cols-2 gap-4 md:col-span-5 md:grid-cols-1 md:gap-5">
            {galleryItems.slice(1, 4).map((item, i) => {
              const index = i + 1
              return (
                <Reveal key={item.title} delayMs={i * 90}>
                  <button
                    type="button"
                    onClick={() => setActive(index)}
                    className={cn(
                      "group relative block aspect-16/10 w-full overflow-hidden rounded-4xl text-left ring-1 ring-foreground/10 md:aspect-auto md:min-h-28",
                      active === index && "ring-2 ring-primary"
                    )}
                  >
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 50vw, 30vw"
                    />
                    <div className="absolute inset-0 bg-background/40 transition-colors group-hover:bg-background/20" />
                    <div className="absolute right-0 bottom-0 left-0 space-y-1 p-3 md:p-4">
                      <Badge variant="outline" className="bg-background/50 backdrop-blur-sm">
                        {item.kind}
                      </Badge>
                      <p className="font-display text-lg tracking-wide text-foreground uppercase md:text-xl">
                        {item.title}
                      </p>
                    </div>
                  </button>
                </Reveal>
              )
            })}
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-5">
          {galleryItems.slice(4).map((item, i) => (
            <Reveal key={item.title} delayMs={i * 90}>
              <button
                type="button"
                onClick={() => setActive(i + 4)}
                className={cn(
                  "group relative block aspect-4/3 w-full overflow-hidden rounded-4xl text-left ring-1 ring-foreground/10",
                  active === i + 4 && "ring-2 ring-primary"
                )}
              >
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-background/35 transition-colors group-hover:bg-background/15" />
                <div className="absolute right-0 bottom-0 left-0 space-y-1 p-4">
                  <Badge variant="outline" className="bg-background/50 backdrop-blur-sm">
                    {item.kind}
                  </Badge>
                  <p className="font-display text-xl tracking-wide text-foreground uppercase">
                    {item.title}
                  </p>
                </div>
              </button>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
