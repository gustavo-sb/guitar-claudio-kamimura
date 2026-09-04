export const site = {
  name: "Claudio Kamimura",
  role: "Professor de Guitarra e Violão",
  tagline: "Técnica, groove e atitude — do primeiro acorde ao solo.",
  whatsapp: "5511980234364",
  whatsappMessage:
    "Olá Claudio! Quero agendar uma aula experimental de guitarra/violão.",
  instagram: "https://www.instagram.com/claudio_kamimura/",
  instagramHandle: "@claudio_kamimura",
  email: "aulas@claudio_kamimura.com.br",
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
    videoUrl: "https://www.youtube.com/embed/QRum2lHu4oM",
  },
  {
    title: "Pentatônica maior e menor",
    kind: "Dica",
    image:
      "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?auto=format&fit=crop&w=1200&q=80",
    videoUrl: "https://www.youtube.com/embed/TFdFFcsV2tg",
  },
  {
    title: "Arpejos com sweep",
    kind: "Técnica",
    image:
      "https://images.unsplash.com/photo-1516924962500-2b4b3b99ea02?auto=format&fit=crop&w=1200&q=80",
    videoUrl: "https://www.youtube.com/embed/BRUbSy_x3BU",
  },
  {
    title: "Tríades abertas",
    kind: "Harmonia",
    image:
      "https://images.unsplash.com/photo-1605618692258-6a0bf2dc44cd?auto=format&fit=crop&w=1200&q=80",
    videoUrl: "https://www.youtube.com/embed/oHCmp7MuSqI",
  },
  {
    title: "Inversão de acordes",
    kind: "Harmonia",
    image:
      "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1200&q=80",
    videoUrl: "https://www.youtube.com/embed/pe9XNkbuokY",
  },
  {
    title: "React Eli Soares",
    kind: "React",
    image:
      "https://images.unsplash.com/photo-1579797990179-4ca11c8b47fd?auto=format&fit=crop&w=1200&q=80",
    videoUrl: "https://www.youtube.com/embed/iMmnPUlS43w",
  },
  {
    title: "Dedilhado clássico",
    kind: "Aula",
    image:
      "https://images.unsplash.com/photo-1525201548942-d8732f6617a0?auto=format&fit=crop&w=1200&q=80",
    videoUrl: "https://www.youtube.com/embed/BvSA448Ukuc",
  },
] as const

export const pricing = [
  {
    id: "semanal",
    name: "Semanal",
    mode: "1x por semana",
    price: "R$ 320",
    period: "/mês · 4 aulas",
    priceNote: "R$ 80 /aula",
    highlight: true,
    features: [
      "Presencial ou remota — você escolhe",
      "60 min por encontro",
      "Plano de estudos contínuo",
      "Prioridade de horário",
      "Feedback entre as aulas",
    ],
  },
  {
    id: "quinzenal",
    name: "Quinzenal",
    mode: "A cada 2 semanas",
    price: "R$ 230",
    period: "/mês · 2 aulas",
    priceNote: "R$ 115 /aula",
    highlight: false,
    features: [
      "Presencial ou remota — você escolhe",
      "60 min por encontro",
      "Ritmo mais flexível",
      "Material e tabs digitais",
      "Acompanhamento entre encontros",
    ],
  },
  {
    id: "avulsa",
    name: "Avulsa",
    mode: "Sob demanda",
    price: "R$ 150",
    period: "/aula · 60 min",
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
      "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=800&q=80",
  },
  {
    caption: "Setup do dia — Strat e amp",
    image:
      "https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=800&q=80",
  },
  {
    caption: "Estúdio: guitarras na parede",
    image:
      "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=800&q=80",
  },
] as const
