import type { Metadata } from "next"
import Link from "next/link"
import { site, whatsappUrl } from "@/lib/content"

export const metadata: Metadata = {
  title: "Política de privacidade | Claudio Kamimura",
  description:
    "Como este site trata dados pessoais: contato pelo WhatsApp, microfone do afinador, tablatura e vídeos.",
}

const updatedAt = "1º de outubro de 2026"

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-5 py-4 md:px-8">
          <Link
            href="/"
            className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
          >
            Voltar ao site
          </Link>
          <p className="font-display text-lg tracking-wide uppercase">{site.name}</p>
        </div>
      </header>

      <main className="mx-auto max-w-3xl space-y-8 px-5 py-10 md:px-8 md:py-14">
        <div>
          <h1 className="font-display text-4xl tracking-wide uppercase">
            Política de privacidade
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Atualizada em {updatedAt}. Vale para o site de {site.name}, professor
            de guitarra e violão em {site.city}.
          </p>
        </div>

        <section className="space-y-3 text-sm leading-relaxed text-muted-foreground">
          <h2 className="font-display text-2xl tracking-wide text-foreground uppercase">
            Quem é o responsável
          </h2>
          <p>
            O controlador dos dados é {site.name}, em {site.city}. Para pedir
            acesso, correção ou exclusão, escreva para{" "}
            <a
              href={`mailto:${site.email}`}
              className="text-foreground underline-offset-4 hover:underline"
            >
              {site.email}
            </a>{" "}
            ou fale pelo{" "}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground underline-offset-4 hover:underline"
            >
              WhatsApp
            </a>
            . Pedidos de confirmação e acesso são respondidos em até 15 dias,
            como prevê a LGPD.
          </p>
        </section>

        <section className="space-y-3 text-sm leading-relaxed text-muted-foreground">
          <h2 className="font-display text-2xl tracking-wide text-foreground uppercase">
            O que este site não faz
          </h2>
          <p>
            Não há cadastro, login, newsletter nem pagamento aqui. Não vendemos
            dados e não usamos cookies de publicidade ou ferramentas de
            analytics. A contratação da aula é combinada pelo WhatsApp. Os
            valores publicados no site são a oferta atual.
          </p>
        </section>

        <section className="space-y-3 text-sm leading-relaxed text-muted-foreground">
          <h2 className="font-display text-2xl tracking-wide text-foreground uppercase">
            Dados que podem ser tratados
          </h2>
          <ul className="list-disc space-y-3 pl-5">
            <li>
              <span className="text-foreground">Acesso ao site.</span> O serviço
              que hospeda as páginas pode registrar IP, data, horário e endereço
              da página para manter o site no ar e proteger contra abuso. Essa
              base é o legítimo interesse e a segurança da aplicação. Esses
              registros não são usados para anúncio.
            </li>
            <li>
              <span className="text-foreground">WhatsApp e Instagram.</span> Os
              botões abrem esses serviços. A conversa passa a ser tratada por
              eles e por {site.name}, para responder e agendar aulas. A base é o
              seu pedido de contato, como etapa anterior a um contrato. As
              mensagens ficam no aplicativo até serem apagadas ou até você pedir
              a exclusão do que estiver com o professor.
            </li>
            <li>
              <span className="text-foreground">Afinador.</span> O microfone só
              é ligado se você autorizar no navegador. O áudio serve para
              detectar a nota, no próprio aparelho. Ele não é gravado, guardado
              nem enviado a um servidor. Você pode revogar a permissão nas
              configurações do navegador.
            </li>
            <li>
              <span className="text-foreground">Tablatura.</span> O que você
              escreve fica na memória do navegador durante a visita. Não há
              conta nem cópia no servidor. Ao atualizar ou fechar a página, o
              conteúdo pode se perder. PNG e PDF são gerados no seu aparelho.
            </li>
            <li>
              <span className="text-foreground">Vídeos.</span> O player do
              YouTube só carrega quando você abre um item da galeria, no modo de
              privacidade (youtube-nocookie). Nesse momento o Google pode
              receber seu IP e gravar cookies próprios. A política do YouTube
              passa a valer para essa reprodução.
            </li>
          </ul>
        </section>

        <section className="space-y-3 text-sm leading-relaxed text-muted-foreground">
          <h2 className="font-display text-2xl tracking-wide text-foreground uppercase">
            Cookies
          </h2>
          <p>
            Este site não grava cookies de rastreamento. Cookies de terceiros
            podem aparecer somente depois que você abre um vídeo. Por isso não
            há banner pedindo consentimento para publicidade: não há esse tipo
            de cookie na navegação comum.
          </p>
        </section>

        <section className="space-y-3 text-sm leading-relaxed text-muted-foreground">
          <h2 className="font-display text-2xl tracking-wide text-foreground uppercase">
            Menores de idade
          </h2>
          <p>
            Aula para quem tem menos de 18 anos deve ser pedida ou autorizada
            por um responsável. O site não solicita dados de crianças.
          </p>
        </section>

        <section className="space-y-3 text-sm leading-relaxed text-muted-foreground">
          <h2 className="font-display text-2xl tracking-wide text-foreground uppercase">
            Seus direitos
          </h2>
          <p>
            Pela Lei nº 13.709/2018 você pode pedir confirmação do tratamento,
            acesso, correção, eliminação, informação sobre com quem os dados
            foram compartilhados e revogação do consentimento do microfone. Se
            a resposta não resolver, a autoridade é a ANPD (
            <a
              href="https://www.gov.br/anpd"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground underline-offset-4 hover:underline"
            >
              www.gov.br/anpd
            </a>
            ).
          </p>
        </section>
      </main>
    </div>
  )
}
