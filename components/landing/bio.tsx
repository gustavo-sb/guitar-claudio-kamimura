import { bio } from "@/lib/content"
import { Reveal } from "@/components/landing/reveal"
import { Separator } from "@/components/ui/separator"

export function Bio() {
  return (
    <section id="bio" className="section-pad relative overflow-hidden">
      <div className="slash-accent" aria-hidden />
      <div className="mx-auto grid max-w-6xl gap-12 px-5 md:grid-cols-[1fr_1.4fr] md:gap-16 md:px-8">
        <Reveal>
          <p className="section-kicker">Bio</p>
          <h2 className="section-title">
            Estrada, palco
            <br />
            <span className="text-primary">&amp; sala de aula</span>
          </h2>
          <div className="mt-10 flex gap-10">
            <div>
              <p className="font-display text-5xl tracking-wide text-foreground">
                {bio.years}
              </p>
              <p className="mt-1 text-xs tracking-[0.2em] text-muted-foreground uppercase">
                anos ensinando
              </p>
            </div>
            <Separator orientation="vertical" className="h-auto min-h-14" />
            <div>
              <p className="font-display text-5xl tracking-wide text-foreground">
                {bio.students}
              </p>
              <p className="mt-1 text-xs tracking-[0.2em] text-muted-foreground uppercase">
                alunos formados
              </p>
            </div>
          </div>
        </Reveal>

        <div className="space-y-6">
          {bio.paragraphs.map((paragraph, i) => (
            <Reveal key={i} delayMs={i * 100}>
              <p className="text-lg leading-relaxed text-muted-foreground md:text-xl">
                {paragraph}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
