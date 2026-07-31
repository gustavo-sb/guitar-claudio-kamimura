import type { Metadata } from "next"
import { Bebas_Neue, Geist_Mono, Inter } from "next/font/google"
import "./globals.css"
import { cn } from "@/lib/utils"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
})

const display = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display",
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Claudio Kamimura | Aulas de Guitarra e Violão",
  description:
    "Professor de guitarra e violão em São Paulo. Aulas particulares e online com método direto — agende sua aula experimental.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="pt-BR"
      className={cn(
        "dark h-full antialiased font-sans",
        inter.variable,
        display.variable,
        geistMono.variable
      )}
    >
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  )
}
