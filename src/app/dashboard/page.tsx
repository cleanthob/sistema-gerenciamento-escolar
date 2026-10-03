import logoImage from "@/assets/images/logo.svg";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  BookOpen01Icon,
  Calendar03Icon,
  ChartColumnIcon,
  Home01Icon,
  Logout01Icon,
  Wallet01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Image from "next/image";
import Link from "next/link";

const navigation = [
  { label: "Visão geral", href: "/dashboard", icon: Home01Icon },
  { label: "Notas", href: "/dashboard/grades", icon: BookOpen01Icon },
  { label: "Pagamentos", href: "/dashboard/payments", icon: Wallet01Icon },
  { label: "Frequência", href: "/dashboard/attendance", icon: ChartColumnIcon },
  { label: "Aulas do dia", href: "/dashboard/classes", icon: Calendar03Icon },
];

const grades = [
  { subject: "Matemática", activity: "Prova bimestral", score: 8.7 },
  { subject: "Língua Portuguesa", activity: "Redação", score: 9.2 },
  { subject: "Ciências", activity: "Trabalho em grupo", score: 7.8 },
  { subject: "História", activity: "Avaliação mensal", score: 8.9 },
];

const attendance = [
  { month: "Mai", value: 94 },
  { month: "Jun", value: 97 },
  { month: "Jul", value: 91 },
  { month: "Ago", value: 98 },
  { month: "Set", value: 95 },
  { month: "Out", value: 96 },
];

const lessons = [
  {
    time: "08:00",
    subject: "Matemática",
    room: "Sala 12",
    color: "bg-[#28705b]",
  },
  {
    time: "09:50",
    subject: "Ciências",
    room: "Laboratório",
    color: "bg-[#c16a4b]",
  },
  {
    time: "13:00",
    subject: "História",
    room: "Sala 08",
    color: "bg-[#567b96]",
  },
  {
    time: "14:50",
    subject: "Educação Física",
    room: "Quadra",
    color: "bg-[#bb8a38]",
  },
];

export default function Dashboard() {
  return (
    <div className="flex min-h-svh w-full bg-[#f4f6f1] text-[#203b34]">
      <Sidebar collapsible="icon" className="border-r border-[#e1e8df]">
        <SidebarHeader className="items-center px-4 py-5 group-data-[collapsible=icon]:px-2">
          <Link
            href="/"
            aria-label="Sistema Escolar, página inicial"
            className="flex min-h-10 w-full items-center group-data-[collapsible=icon]:justify-center"
          >
            <Image
              src={logoImage}
              alt="Sistema Escolar"
              className="h-auto w-34.5 group-data-[collapsible=icon]:hidden"
              priority
            />
            <span className="hidden size-8 items-center justify-center rounded-md bg-[#174f43] text-xs font-semibold text-white group-data-[collapsible=icon]:inline-flex">
              SE
            </span>
          </Link>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel className="px-2 text-[11px] font-semibold uppercase tracking-[0.12em]">
              Área do estudante
            </SidebarGroupLabel>
            <SidebarMenu>
              {navigation.map((item, index) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    render={<Link href={item.href} />}
                    isActive={index === 0}
                    tooltip={item.label}
                    className="h-10 px-3 text-sm data-active:bg-[#e8f1e9] data-active:text-[#205b49]"
                  >
                    <HugeiconsIcon icon={item.icon} strokeWidth={1.8} />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter className="border-t border-[#e1e8df] p-4 group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:px-2">
          <div className="flex min-w-0 items-center gap-3 group-data-[collapsible=icon]:justify-center">
            <span
              title="Ana Beatriz Costa, 8º ano, Turma B"
              className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#e8f1e9] text-[11px] font-semibold text-[#205b49]"
            >
              AB
            </span>
            <div className="min-w-0 group-data-[collapsible=icon]:hidden">
              <p className="truncate text-sm font-semibold text-[#29483e]">
                Ana Beatriz Costa
              </p>
              <p className="mt-1 truncate text-xs text-[#82918a]">
                8º ano · Turma B
              </p>
            </div>
          </div>
          <Link
            href="/login"
            title="Sair da conta"
            className="mt-2 inline-flex min-h-9 w-full items-center gap-2 rounded-md px-2 text-xs font-medium text-[#527068] hover:bg-[#f2f5f1] hover:text-[#174f43] group-data-[collapsible=icon]:h-8 group-data-[collapsible=icon]:min-h-8 group-data-[collapsible=icon]:w-8 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0"
          >
            <HugeiconsIcon icon={Logout01Icon} strokeWidth={1.8} />
            <span className="group-data-[collapsible=icon]:hidden">
              Sair da conta
            </span>
          </Link>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>

      <SidebarInset className="min-h-svh bg-[#f4f6f1]">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-[#e1e8df] bg-white/95 px-4 backdrop-blur sm:px-7">
          <div className="flex items-center gap-3">
            <SidebarTrigger className="text-[#52685e]" />
            <div>
              <p className="text-sm font-semibold text-[#29483e]">
                Portal do estudante
              </p>
              <p className="hidden text-xs text-[#82918a] sm:block">
                Resumo acadêmico
              </p>
            </div>
          </div>
          <span className="shrink-0 rounded-full border border-[#ead7c9] bg-[#fff7f0] px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-widest text-[#a45c40] sm:px-3">
            <span className="sm:hidden">Demo</span>
            <span className="hidden sm:inline">Dados demonstrativos</span>
          </span>
        </header>

        <div className="mx-auto w-full max-w-330 px-4 py-7 sm:px-7 sm:py-9 lg:px-10">
          <div
            id="overview"
            className="mb-7 flex flex-col justify-between gap-3 sm:flex-row sm:items-end"
          >
            <div>
              <p className="text-sm font-medium text-[#7a8c83]">
                Olá, Ana Beatriz
              </p>
              <h1 className="mt-1 text-2xl font-semibold text-[#203b34] sm:text-3xl">
                Seu resumo escolar
              </h1>
              <p className="mt-2 text-sm text-[#718179]">
                Acompanhe seu desempenho e a rotina de hoje.
              </p>
            </div>
            <p className="text-sm font-medium text-[#73847b]">
              Ano letivo 2026
            </p>
          </div>

          <section
            aria-label="Indicadores escolares"
            className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4"
          >
            <article className="rounded-lg border border-[#e1e8df] bg-white p-5">
              <p className="text-sm text-[#718179]">Média geral</p>
              <div className="mt-3 flex items-end justify-between gap-3">
                <p className="text-3xl font-semibold">
                  8,7
                  <span className="ml-1 text-sm font-medium text-[#84928b]">
                    / 10
                  </span>
                </p>
                <span className="rounded-full bg-[#eaf2e9] px-2.5 py-1 text-xs font-semibold text-[#28705b]">
                  Bom desempenho
                </span>
              </div>
            </article>
            <article className="rounded-lg border border-[#e1e8df] bg-white p-5">
              <p className="text-sm text-[#718179]">Frequência</p>
              <div className="mt-3 flex items-end justify-between gap-3">
                <p className="text-3xl font-semibold">
                  96<span className="text-xl">%</span>
                </p>
                <span className="text-xs font-medium text-[#718179]">
                  Mínimo: 75%
                </span>
              </div>
            </article>
            <article className="rounded-lg border border-[#e1e8df] bg-white p-5">
              <p className="text-sm text-[#718179]">Mensalidade de outubro</p>
              <div className="mt-3 flex items-end justify-between gap-3">
                <p className="text-2xl font-semibold">R$ 680,00</p>
                <span className="rounded-full bg-[#eaf2e9] px-2.5 py-1 text-xs font-semibold text-[#28705b]">
                  Paga
                </span>
              </div>
            </article>
            <article className="rounded-lg border border-[#e1e8df] bg-white p-5">
              <p className="text-sm text-[#718179]">Próxima aula</p>
              <p className="mt-3 text-xl font-semibold">Matemática</p>
              <p className="mt-1 text-xs text-[#718179]">
                Hoje, às 08:00 · Sala 12
              </p>
            </article>
          </section>

          <div className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1.3fr)_minmax(300px,0.8fr)]">
            <div className="space-y-5">
              <section
                id="grades"
                className="rounded-lg border border-[#e1e8df] bg-white p-5 sm:p-6"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#82918a]">
                      Desempenho
                    </p>
                    <h2 className="mt-1 text-lg font-semibold">
                      Notas do bimestre
                    </h2>
                  </div>
                  <span className="rounded-md bg-[#f3f6f1] px-3 py-1.5 text-xs font-medium text-[#62756b]">
                    2º bimestre
                  </span>
                </div>
                <div className="mt-5 space-y-5">
                  {grades.map((grade) => (
                    <div key={grade.subject}>
                      <div className="mb-2 flex items-center justify-between gap-4">
                        <div>
                          <p className="text-sm font-medium text-[#324c42]">
                            {grade.subject}
                          </p>
                          <p className="mt-0.5 text-xs text-[#87958e]">
                            {grade.activity}
                          </p>
                        </div>
                        <p className="shrink-0 text-sm font-semibold text-[#203b34]">
                          {grade.score.toFixed(1).replace(".", ",")}
                          <span className="font-normal text-[#87958e]">
                            {" "}
                            / 10
                          </span>
                        </p>
                      </div>
                      <div
                        role="progressbar"
                        aria-label={`Nota de ${grade.subject}`}
                        aria-valuemin={0}
                        aria-valuemax={10}
                        aria-valuenow={grade.score}
                        className="h-2 overflow-hidden rounded-full bg-[#edf1ec]"
                      >
                        <div
                          className="h-full rounded-full bg-[#43806c]"
                          style={{ width: `${grade.score * 10}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section
                id="attendance"
                className="rounded-lg border border-[#e1e8df] bg-white p-5 sm:p-6"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#82918a]">
                      Presença
                    </p>
                    <h2 className="mt-1 text-lg font-semibold">
                      Frequência mensal
                    </h2>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-semibold">96%</p>
                    <p className="text-xs text-[#82918a]">média no período</p>
                  </div>
                </div>
                <div
                  role="img"
                  aria-label="Gráfico de colunas da frequência mensal: maio 94%, junho 97%, julho 91%, agosto 98%, setembro 95%, outubro 96%."
                  className="mt-6"
                >
                  <div className="relative h-44 border-b border-[#e5ebe4]">
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 flex flex-col justify-between"
                    >
                      <div className="border-t border-dashed border-[#e8ede7]" />
                      <div className="border-t border-dashed border-[#e8ede7]" />
                      <div className="border-t border-dashed border-[#e8ede7]" />
                    </div>
                    <div className="absolute inset-0 flex items-end justify-around gap-3 px-2 sm:px-8">
                      {attendance.map((item, index) => (
                        <div
                          key={item.month}
                          className="relative flex h-full flex-1 flex-col items-center justify-end gap-2 pb-0"
                        >
                          <span className="text-[11px] font-medium text-[#687d73]">
                            {item.value}%
                          </span>
                          <div className="flex h-[78%] w-full max-w-12 items-end overflow-hidden rounded-t-sm bg-[#eff3ee]">
                            <div
                              className={`w-full rounded-t-sm ${index === attendance.length - 1 ? "bg-[#c16a4b]" : "bg-[#78a48e]"}`}
                              style={{ height: `${item.value}%` }}
                            />
                          </div>
                          <span className="absolute -bottom-6 text-xs text-[#82918a]">
                            {item.month}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <p className="mt-8 text-xs text-[#82918a]">
                    Presença registrada por mês · mínimo esperado: 75%
                  </p>
                </div>
              </section>
            </div>

            <div className="space-y-5">
              <section
                id="payments"
                className="rounded-lg border border-[#e1e8df] bg-white p-5 sm:p-6"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#82918a]">
                      Financeiro
                    </p>
                    <h2 className="mt-1 text-lg font-semibold">Pagamentos</h2>
                  </div>
                  <span className="rounded-full bg-[#eaf2e9] px-2.5 py-1 text-xs font-semibold text-[#28705b]">
                    Em dia
                  </span>
                </div>
                <div className="mt-5 rounded-md bg-[#f5f7f3] p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-medium text-[#324c42]">
                      Mensalidade · Outubro
                    </p>
                    <p className="text-sm font-semibold">R$ 680,00</p>
                  </div>
                  <p className="mt-2 text-xs text-[#82918a]">
                    Pagamento confirmado em 02/10/2026
                  </p>
                </div>
                <div className="mt-4 flex items-center justify-between border-t border-[#edf1ec] pt-4 text-xs">
                  <span className="text-[#82918a]">Próximo vencimento</span>
                  <span className="font-medium text-[#52685e]">10/11/2026</span>
                </div>
              </section>

              <section
                id="classes"
                className="rounded-lg border border-[#e1e8df] bg-white p-5 sm:p-6"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#82918a]">
                      Agenda
                    </p>
                    <h2 className="mt-1 text-lg font-semibold">
                      Aulas de hoje
                    </h2>
                  </div>
                  <span className="rounded-md bg-[#f3f6f1] px-2.5 py-1 text-xs font-medium text-[#62756b]">
                    4 aulas
                  </span>
                </div>
                <ol className="mt-5 space-y-4">
                  {lessons.map((lesson) => (
                    <li
                      key={`${lesson.time}-${lesson.subject}`}
                      className="flex items-center gap-3"
                    >
                      <span
                        aria-hidden="true"
                        className={`h-9 w-1 shrink-0 rounded-full ${lesson.color}`}
                      />
                      <span className="w-12 shrink-0 text-xs font-semibold tabular-nums text-[#657970]">
                        {lesson.time}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-medium text-[#324c42]">
                          {lesson.subject}
                        </span>
                        <span className="mt-0.5 block text-xs text-[#87958e]">
                          {lesson.room}
                        </span>
                      </span>
                    </li>
                  ))}
                </ol>
              </section>

              <section
                aria-labelledby="discipline-title"
                className="rounded-lg border border-[#dce8df] bg-[#edf5ed] p-5 sm:p-6"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#668273]">
                  Situação disciplinar
                </p>
                <h2
                  id="discipline-title"
                  className="mt-1 text-lg font-semibold text-[#244b3d]"
                >
                  Sem ocorrências ativas
                </h2>
                <p className="mt-2 text-sm leading-6 text-[#5f786b]">
                  Nenhuma punição ou suspensão registrada neste período.
                </p>
              </section>
            </div>
          </div>
        </div>
      </SidebarInset>
    </div>
  );
}
