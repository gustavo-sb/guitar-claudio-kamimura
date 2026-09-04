export const tunerUi = {
  pageTitle: "Afinador",
  backToSite: "Voltar ao site",
  instrumentTitle: "Instrumento",
  tuningTitle: "Afinação",
  stringsTitle: "Cordas de referência",
  stringsHint:
    "Toque uma corda perto do microfone. O ponteiro mostra se precisa apertar ou soltar.",
  playAll: "Ouvir referência",
  stopPlayback: "Parar",
  playAllHint: "Toca as notas de referência da afinação escolhida",
  frequencyLabel: "Hz",
  stringLabel: (n: number) => `${n}ª corda`,
  openToTablature: "Abrir tablatura",
  startMic: "Ativar microfone",
  stopMic: "Desativar microfone",
  listening: "Ouvindo…",
  micOff: "Microfone desativado",
  waitingNote: "Aguardando nota",
  playStringHint: "Toque uma corda",
  tighten: "Apertar",
  loosen: "Soltar",
  inTune: "Afinado",
  centered: "No centro",
  stepsTitle: "Como afinar",
  step1: "Ative o microfone quando o navegador pedir permissão.",
  step2: "Aproxime o instrumento do microfone e toque uma corda.",
  step3: "Ajuste a tarraxa até o ponteiro ficar no centro (verde).",
  stepFlat: "Nota baixa → aperte a corda",
  stepSharp: "Nota alta → solte a corda",
  deniedTitle: "Microfone bloqueado",
  deniedBody:
    "Permita o acesso ao microfone nas configurações do navegador e tente de novo.",
  errorBody: "Não foi possível iniciar o afinador. Verifique o microfone.",
} as const

export const tunerMeta = {
  title: "Afinador de Guitarra e Violão | Claudio Kamimura",
  description:
    "Afinador online com microfone para guitarra e violão. Veja em tempo real se precisa apertar ou soltar a corda.",
} as const
