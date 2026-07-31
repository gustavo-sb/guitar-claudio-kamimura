export const site = {
  name: "Claudio Kamimura",
  role: "Professor de Guitarra e Violão",
  tagline: "Técnica, groove e atitude — do primeiro acorde ao solo.",
  whatsapp: "5511980234364",
  whatsappMessage:
    "Olá Claudio! Quero agendar uma aula experimental de guitarra/violão.",
  instagram: "https://www.instagram.com/",
  instagramHandle: "@claudiokamimura",
  email: "aulas@claudiokamimura.com.br",
  city: "São Paulo",
} as const

export const whatsappUrl = `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(site.whatsappMessage)}`

export const navLinks = [
  { href: "#bio", label: "Bio" },
  { href: "#ensino", label: "Ensino" },
  { href: "#galeria", label: "Galeria" },
  { href: "#valores", label: "Valores" },
  { href: "#depoimentos", label: "Alunos" },
  { href: "#instagram", label: "Instagram" },
] as const

export const bio = {
  years: "15+",
  students: "200+",
  paragraphs: [
    "Claudio Kamimura é guitarrista, violonista e professor com mais de 15 anos de estrada entre palcos, estúdios e salas de aula. Formado em música e apaixonado por rock, blues e MPB, ele une rigor técnico com a liberdade que a música pede.",
    "Já acompanhou bandas locais, gravou sessões e desenvolveu um método próprio para quem quer evoluir de verdade — seja no primeiro C maior ou no solo que sempre quis tocar.",
  ],
} as const

export const teachingPillars = [
  {
    title: "Fundação sólida",
    description:
      "Acordes, ritmos, leitura e técnica sem enrolação. Você entende o porquê de cada movimento.",
  },
  {
    title: "Repertório que você ama",
    description:
      "Rock, blues, pop e MPB. As músicas que te motivam viram o material de estudo.",
  },
  {
    title: "Ouvido e groove",
    description:
      "Além das notas: timing, dinâmica e presença. Tocar é sentir, não só executar.",
  },
  {
    title: "Ritmo do aluno",
    description:
      "Aulas particulares no seu pace — presencial ou online, com acompanhamento entre encontros.",
  },
] as const

export const galleryItems = [
  {
    title: "Solo ao vivo",
    kind: "Performance",
    image:
      "https://images.unsplash.com/photo-1462965326201-d02e4f455804?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Aula de guitarra",
    kind: "Aula",
    image:
      "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Riff de rock",
    kind: "Performance",
    image:
      "https://images.unsplash.com/photo-1516924962500-2b4b3b99ea02?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Strat & amp",
    kind: "Gear",
    image:
      "https://images.unsplash.com/photo-1564186763535-ebb21ef5277f?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Estúdio de rock",
    kind: "Bastidores",
    image:
      "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Violão na prática",
    kind: "Aula",
    image:
      "https://images.unsplash.com/photo-1525201548942-d8732f6617a0?auto=format&fit=crop&w=1200&q=80",
  },
] as const

export const pricing = [
  {
    id: "semanal",
    name: "Semanal",
    mode: "1x por semana",
    price: "R$ 560",
    period: "/mês · 4 aulas",
    priceNote: "R$ 140 /aula",
    highlight: true,
    features: [
      "Presencial ou remota — você escolhe",
      "50 min por encontro",
      "Plano de estudos contínuo",
      "Prioridade de horário",
      "Feedback entre as aulas",
    ],
  },
  {
    id: "quinzenal",
    name: "Quinzenal",
    mode: "A cada 2 semanas",
    price: "R$ 300",
    period: "/mês · 2 aulas",
    priceNote: "R$ 150 /aula",
    highlight: false,
    features: [
      "Presencial ou remota — você escolhe",
      "50 min por encontro",
      "Ritmo mais flexível",
      "Material e tabs digitais",
      "Acompanhamento entre encontros",
    ],
  },
  {
    id: "avulsa",
    name: "Avulsa",
    mode: "Sob demanda",
    price: "R$ 180",
    period: "/aula · 50 min",
    priceNote: "Sem pacote mensal",
    highlight: false,
    features: [
      "Presencial ou remota — você escolhe",
      "Agende quando precisar",
      "Ideal para reforço pontual",
      "Inclui aula experimental",
      "Sem compromisso de recorrência",
    ],
  },
] as const

export const testimonials = [
  {
    name: "Marina S.",
    role: "Aluna há 2 anos",
    quote:
      "Cheguei sem saber segurar a palheta. Hoje toco as músicas que sempre quis. O Claudio explica de um jeito que gruda.",
  },
  {
    name: "Pedro H.",
    role: "Aluno online",
    quote:
      "Mesmo à distância, as aulas são intensas. Saio de cada encontro com algo concreto pra treinar na semana.",
  },
  {
    name: "Lucas R.",
    role: "Iniciante rock",
    quote:
      "Método direto, sem enrolação. Em poucos meses já estava tocando com a banda dos amigos.",
  },
] as const

export const instagramPosts = [
  {
    caption: "Riff da semana — power chords com atitude",
    image:
      "https://images.unsplash.com/photo-1516924962500-2b4b3b99ea02?auto=format&fit=crop&w=800&q=80",
  },
  {
    caption: "Setup do dia — Strat e amp",
    image:
      "https://images.unsplash.com/photo-1564186763535-ebb21ef5277f?auto=format&fit=crop&w=800&q=80",
  },
  {
    caption: "Estúdio: guitarras na parede",
    image:
      "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=800&q=80",
  },
] as const
