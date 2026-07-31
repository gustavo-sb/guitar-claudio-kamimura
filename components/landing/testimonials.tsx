import { testimonials } from "@/lib/content"
import { Reveal } from "@/components/landing/reveal"
import { Separator } from "@/components/ui/separator"

export function Testimonials() {
  return (
    <section id="depoimentos" className="section-pad relative">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <Reveal>
          <p className="section-kicker">Depoimentos</p>
          <h2 className="section-title">
            O que os alunos
            <span className="text-primary"> dizem</span>
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-10 md:grid-cols-3 md:gap-8">
          {testimonials.map((item, i) => (
            <Reveal key={item.name} delayMs={i * 100}>
              <blockquote className="relative">
                <Separator className="mb-8 bg-primary/40" />
                <span
                  className="font-display absolute top-2 left-0 text-5xl leading-none text-primary/40"
                  aria-hidden
                >
                  “
                </span>
                <p className="text-base leading-relaxed text-muted-foreground md:text-lg">
                  {item.quote}
                </p>
                <footer className="mt-6">
                  <cite className="not-italic">
                    <span className="block font-display text-lg tracking-wide text-foreground uppercase">
                      {item.name}
                    </span>
                    <span className="mt-1 block text-xs tracking-[0.2em] text-muted-foreground uppercase">
                      {item.role}
                    </span>
                  </cite>
                </footer>
              </blockquote>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
