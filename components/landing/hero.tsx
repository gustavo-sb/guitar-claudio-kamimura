import { Button } from "@/components/ui/button"
import { site, whatsappUrl } from "@/lib/content"
import { ArrowDownRight } from "lucide-react"
import Image from "next/image"

export function Hero() {
  return (
    <section
      id="topo"
      className="relative isolate flex min-h-svh flex-col justify-end overflow-hidden"
    >
      <Image
        src="https://images.unsplash.com/photo-1564186763535-ebb21ef5277f?auto=format&fit=crop&w=2400&q=80"
        alt="Guitarra elétrica Stratocaster sobre amplificador"
        fill
        priority
        className="animate-hero-drift scale-105 object-cover object-[center_40%]"
        sizes="100vw"
      />

      <div className="absolute inset-0 bg-stage" aria-hidden />
      <div className="absolute inset-0 bg-vignette" aria-hidden />
      <div className="noise-layer" aria-hidden />

      <div className="amp-glow" aria-hidden />
      <div className="string-lines" aria-hidden>
        {Array.from({ length: 6 }).map((_, i) => (
          <span key={i} style={{ animationDelay: `${i * 0.35}s` }} />
        ))}
      </div>

      <div className="relative z-10 mx-auto w-full max-w-6xl px-5 pb-16 pt-32 md:px-8 md:pb-24">
        <p className="animate-rise-in mb-4 text-xs font-medium tracking-[0.35em] text-primary uppercase opacity-0 [animation-delay:120ms]">
          {site.role} · {site.city}
        </p>

        <h1 className="animate-rise-in font-display max-w-4xl text-[clamp(3.25rem,12vw,8.5rem)] leading-[0.88] tracking-[0.02em] text-foreground uppercase opacity-0 [text-shadow:0_2px_40px_rgba(0,0,0,0.55)] [animation-delay:220ms]">
          Claudio
          <br />
          <span className="text-primary [text-shadow:0_0_40px_color-mix(in_oklch,var(--primary)_35%,transparent)]">
            Kamimura
          </span>
        </h1>

        <p className="animate-rise-in mt-6 max-w-md text-base leading-relaxed text-muted-foreground opacity-0 md:text-lg [animation-delay:360ms]">
          {site.tagline}
        </p>

        <div className="animate-rise-in mt-10 flex flex-wrap items-center gap-3 opacity-0 [animation-delay:480ms]">
          <Button
            size="lg"
            render={
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" />
            }
          >
            Agendar aula experimental
            <ArrowDownRight data-icon="inline-end" />
          </Button>
          <Button size="lg" variant="outline" render={<a href="#galeria" />}>
            Ver performances
          </Button>
        </div>
      </div>
    </section>
  )
}
