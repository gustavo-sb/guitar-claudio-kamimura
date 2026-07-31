import { Header } from "@/components/landing/header"
import { Hero } from "@/components/landing/hero"
import { Bio } from "@/components/landing/bio"
import { Teaching } from "@/components/landing/teaching"
import { Gallery } from "@/components/landing/gallery"
import { Pricing } from "@/components/landing/pricing"
import { Testimonials } from "@/components/landing/testimonials"
import { InstagramFeed } from "@/components/landing/instagram"
import { FinalCta } from "@/components/landing/final-cta"
import { Footer } from "@/components/landing/footer"

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <Hero />
        <Bio />
        <Teaching />
        <Gallery />
        <Pricing />
        <Testimonials />
        <InstagramFeed />
        <FinalCta />
      </main>
      <Footer />
    </>
  )
}
