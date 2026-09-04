"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { navLinks, site, whatsappUrl } from "@/lib/content"
import { cn } from "@/lib/utils"

function isExternalNav(href: string) {
  return href.startsWith("/")
}

export function Header() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : ""
    return () => {
      document.body.style.overflow = ""
    }
  }, [open])

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-[background,border,backdrop-filter] duration-300",
        scrolled || open
          ? "border-b border-border bg-background/90 backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      )}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 md:h-20 md:px-8">
        <a href="#topo" className="relative z-10">
          <span className="font-display text-xl tracking-[0.08em] text-foreground uppercase md:text-2xl">
            {site.name.split(" ")[0]}
            <span className="text-primary">{" "}{site.name.split(" ").slice(1).join(" ")}</span>
          </span>
        </a>

        <nav className="hidden items-center gap-6 lg:flex">
          {navLinks.map((link) =>
            isExternalNav(link.href) ? (
              <Link
                key={link.href}
                href={link.href}
                className="text-xs font-medium tracking-[0.16em] text-muted-foreground uppercase transition-colors hover:text-foreground"
              >
                {link.label}
              </Link>
            ) : (
              <a
                key={link.href}
                href={link.href}
                className="text-xs font-medium tracking-[0.16em] text-muted-foreground uppercase transition-colors hover:text-foreground"
              >
                {link.label}
              </a>
            )
          )}
          <Button
            size="sm"
            render={
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" />
            }
          >
            Aula experimental
          </Button>
        </nav>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="relative z-10 lg:hidden"
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X /> : <Menu />}
        </Button>
      </div>

      <div
        className={cn(
          "fixed inset-0 top-16 bg-background/98 px-5 pt-8 transition-[opacity,visibility] duration-300 lg:hidden",
          open ? "visible opacity-100" : "invisible opacity-0"
        )}
      >
        <nav className="flex flex-col gap-5">
          {navLinks.map((link) =>
            isExternalNav(link.href) ? (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="font-display text-3xl tracking-wide text-foreground uppercase"
              >
                {link.label}
              </Link>
            ) : (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="font-display text-3xl tracking-wide text-foreground uppercase"
              >
                {link.label}
              </a>
            )
          )}
          <Button
            className="mt-4 w-fit"
            onClick={() => setOpen(false)}
            render={
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" />
            }
          >
            Aula experimental
          </Button>
        </nav>
      </div>
    </header>
  )
}
