import { ArrowUpRight } from "lucide-react"
import { site, whatsappUrl } from "@/lib/content"
import { Reveal } from "@/components/landing/reveal"
import { Button } from "@/components/ui/button"

export function FinalCta() {
  return (
    <section id="agendar" className="relative overflow-hidden py-24 md:py-32">
      <div className="cta-stage" aria-hidden />
      <div className="noise-layer" aria-hidden />

      <div className="relative z-10 mx-auto max-w-4xl px-5 text-center md:px-8">
        <Reveal>
          <p className="section-kicker justify-center">Pronto?</p>
          <h2 className="font-display text-[clamp(2.5rem,8vw,5.5rem)] leading-[0.92] tracking-[0.02em] text-foreground uppercase">
            Sua primeira
            <br />
            <span className="text-primary">aula experimental</span>
          </h2>
          <p className="mx-auto mt-6 max-w-md text-base text-muted-foreground md:text-lg">
            40 minutos para avaliar seu nível, alinhar objetivos e sentir se o
            método encaixa. Sem compromisso de pacote.
          </p>
          <Button
            size="lg"
            className="mt-10"
            render={
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" />
            }
          >
            Agendar no WhatsApp
            <ArrowUpRight data-icon="inline-end" />
          </Button>
          <p className="mt-5 text-sm text-muted-foreground">
            Ou escreva para{" "}
            <a
              href={`mailto:${site.email}`}
              className="text-foreground underline-offset-4 hover:underline"
            >
              {site.email}
            </a>
          </p>
        </Reveal>
      </div>
    </section>
  )
}
