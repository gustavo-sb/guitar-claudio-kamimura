import { Check, MapPin, Monitor } from "lucide-react"
import { pricing, whatsappUrl } from "@/lib/content"
import { Reveal } from "@/components/landing/reveal"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { cn } from "@/lib/utils"

export function Pricing() {
  return (
    <section id="valores" className="section-pad relative bg-card">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <Reveal>
          <p className="section-kicker">Valores</p>
          <h2 className="section-title">
            Semanal, quinzenal
            <br />
            <span className="text-primary">ou avulsa</span>
          </h2>
          <p className="mt-4 max-w-lg text-muted-foreground">
            Escolha a frequência que cabe na sua rotina. Todas as aulas podem ser
            presenciais ou remotas — o valor é o mesmo.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            <Badge variant="secondary" className="gap-1.5 px-3 py-1">
              <MapPin className="size-3.5" />
              Presencial
            </Badge>
            <Badge variant="secondary" className="gap-1.5 px-3 py-1">
              <Monitor className="size-3.5" />
              Remota
            </Badge>
          </div>
        </Reveal>

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {pricing.map((plan, i) => (
            <Reveal key={plan.id} delayMs={i * 100}>
              <Card
                className={cn(
                  "h-full",
                  plan.highlight && "ring-2 ring-primary/60"
                )}
              >
                <CardHeader>
                  <div className="flex items-start justify-between gap-3">
                    <CardDescription className="tracking-[0.2em] uppercase">
                      {plan.mode}
                    </CardDescription>
                    {plan.highlight ? <Badge>Mais pedido</Badge> : null}
                  </div>
                  <CardTitle className="font-display text-3xl tracking-wide uppercase">
                    {plan.name}
                  </CardTitle>
                  <p className="mt-2 flex flex-wrap items-baseline gap-x-1 gap-y-0.5">
                    <span className="font-display text-5xl tracking-wide text-primary">
                      {plan.price}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {plan.period}
                    </span>
                  </p>
                  <p className="text-xs text-muted-foreground">{plan.priceNote}</p>
                </CardHeader>
                <CardContent className="flex-1">
                  <ul className="space-y-3">
                    {plan.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-start gap-2.5 text-sm text-muted-foreground"
                      >
                        <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full"
                    variant={plan.highlight ? "default" : "outline"}
                    render={
                      <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      />
                    }
                  >
                    Quero este formato
                  </Button>
                </CardFooter>
              </Card>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
