import { InstagramIcon } from "@/components/landing/instagram-icon"
import { Reveal } from "@/components/landing/reveal"
import { Button } from "@/components/ui/button"
import { instagramPosts, site } from "@/lib/content"
import Image from "next/image"

export function InstagramFeed() {
  return (
    <section id="instagram" className="section-pad relative bg-card">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="section-kicker">Instagram</p>
              <h2 className="section-title">
                Nos bastidores
                <span className="text-primary"> do dia a dia</span>
              </h2>
              <p className="mt-4 max-w-md text-muted-foreground">
                Riffs, dicas e momentos de aula. Siga{" "}
                <span className="text-foreground">{site.instagramHandle}</span> — o
                feed abaixo é um preview até conectarmos o perfil oficial.
              </p>
            </div>
            <Button
              variant="outline"
              render={
                <a
                  href={site.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                />
              }
            >
              <InstagramIcon data-icon="inline-start" />
              Seguir no Instagram
            </Button>
          </div>
        </Reveal>

        <div className="mt-12 grid gap-4 sm:grid-cols-3">
          {instagramPosts.map((post, i) => (
            <Reveal key={post.caption} delayMs={i * 90}>
              <a
                href={site.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative block aspect-square overflow-hidden rounded-4xl ring-1 ring-foreground/10"
              >
                <Image
                  src={post.image}
                  alt={post.caption}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, 33vw"
                />
                <div className="absolute inset-0 flex items-end bg-linear-to-t from-background/90 via-background/20 to-transparent p-4 opacity-100 transition-opacity md:opacity-0 md:group-hover:opacity-100">
                  <p className="text-sm text-foreground/90">{post.caption}</p>
                </div>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
