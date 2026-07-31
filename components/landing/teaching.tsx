import { teachingPillars } from "@/lib/content"
import { Reveal } from "@/components/landing/reveal"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

export function Teaching() {
  return (
    <section id="ensino" className="section-pad relative bg-card">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <Reveal>
          <p className="section-kicker">Estilo de ensino</p>
          <h2 className="section-title max-w-2xl">
            Método direto.
            <span className="text-primary"> Resultado audível.</span>
          </h2>
          <p className="mt-4 max-w-xl text-muted-foreground">
            Cada aula tem um objetivo claro: sair tocando melhor do que entrou —
            com repertório real e técnica que sustenta o show.
          </p>
        </Reveal>

        <Separator className="mt-12" />

        <ol className="grid gap-0 sm:grid-cols-2">
          {teachingPillars.map((pillar, i) => (
            <Reveal key={pillar.title} delayMs={i * 80}>
              <li className="group border-border py-8 pr-6 sm:border-t sm:odd:border-r sm:odd:pr-10 sm:even:border-t sm:even:pl-10">
                <Badge variant="secondary">{String(i + 1).padStart(2, "0")}</Badge>
                <h3 className="mt-4 font-display text-2xl tracking-wide text-foreground uppercase transition-colors group-hover:text-primary md:text-3xl">
                  {pillar.title}
                </h3>
                <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground md:text-base">
                  {pillar.description}
                </p>
              </li>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  )
}
