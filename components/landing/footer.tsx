import Link from "next/link"
import { InstagramIcon } from "@/components/landing/instagram-icon"
import { navLinks, site, whatsappUrl } from "@/lib/content"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

function isExternalNav(href: string) {
  return href.startsWith("/")
}

export function Footer() {
  return (
    <footer className="bg-background">
      <Separator />
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-5 py-12 md:flex-row md:items-start md:justify-between md:px-8">
        <div>
          <p className="font-display text-2xl tracking-[0.08em] text-foreground uppercase">
            {site.name}
          </p>
          <p className="mt-2 max-w-xs text-sm text-muted-foreground">
            {site.role} · {site.city}
          </p>
        </div>

        <nav className="flex flex-wrap gap-x-6 gap-y-3">
          {navLinks.map((link) =>
            isExternalNav(link.href) ? (
              <Link
                key={link.href}
                href={link.href}
                className="text-xs tracking-[0.18em] text-muted-foreground uppercase transition-colors hover:text-foreground"
              >
                {link.label}
              </Link>
            ) : (
              <a
                key={link.href}
                href={link.href}
                className="text-xs tracking-[0.18em] text-muted-foreground uppercase transition-colors hover:text-foreground"
              >
                {link.label}
              </a>
            )
          )}
        </nav>

        <div className="flex flex-col items-start gap-2">
          <Button
            variant="link"
            className="h-auto px-0"
            render={
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" />
            }
          >
            WhatsApp · aula experimental
          </Button>
          <Button
            variant="link"
            className="h-auto px-0"
            render={
              <a
                href={site.instagram}
                target="_blank"
                rel="noopener noreferrer"
              />
            }
          >
            <InstagramIcon data-icon="inline-start" />
            {site.instagramHandle}
          </Button>
        </div>
      </div>

      <Separator />
      <p className="mx-auto max-w-6xl px-5 py-5 text-xs text-muted-foreground md:px-8">
        © {new Date().getFullYear()} {site.name}. Conteúdo ilustrativo —
        substitua bio, valores e mídia pelos dados reais.
      </p>
    </footer>
  )
}
