import { evaluateAdmission } from "@/lib/admission";
import { prisma } from "@/lib/prisma";
import { requireStudent } from "@/lib/student-dashboard";
import { formatCurrencyBRL, formatGrade } from "@/utils/utils";
import { AttendanceStatus, PaymentStatus, SanctionType } from "@prisma/client";
import Link from "next/link";

export default async function Dashboard() {
  const student = await requireStudent();
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const tomorrow = new Date(todayStart.getTime() + 24 * 60 * 60 * 1000);
  const schoolYearStart = new Date(now.getFullYear(), 0, 1);

  const [grades, attendance, payments, lessons, sanctions] = await Promise.all([
    prisma.grade.findMany({
      where: { studentId: student.id },
      orderBy: { recordedAt: "desc" },
      take: 10,
    }),
    prisma.attendance.findMany({
      where: { studentId: student.id, date: { gte: schoolYearStart } },
      orderBy: { date: "desc" },
    }),
    prisma.payment.findMany({
      where: { studentId: student.id },
      orderBy: { dueDate: "desc" },
    }),
    prisma.lesson.findMany({
      where: {
        studentId: student.id,
        startsAt: { gte: todayStart, lt: tomorrow },
      },
      orderBy: { startsAt: "asc" },
    }),
    prisma.sanction.findMany({
      where: { studentId: student.id },
      orderBy: { startsAt: "desc" },
    }),
  ]);

  const graded = grades.filter((grade) => grade.maxScore > 0);
  const average = graded.length
    ? graded.reduce(
        (sum, grade) => sum + (grade.score / grade.maxScore) * 10,
        0,
      ) / graded.length
    : null;
  const countedAttendance = attendance.filter(
    (item) => item.status !== AttendanceStatus.EXCUSED,
  );
  const attendanceRate = countedAttendance.length
    ? Math.round(
        (countedAttendance.filter(
          (item) =>
            item.status === AttendanceStatus.PRESENT ||
            item.status === AttendanceStatus.LATE,
        ).length /
          countedAttendance.length) *
          100,
      )
    : null;
  const pendingPayments = payments.filter(
    (payment) => payment.status === PaymentStatus.PENDING,
  );
  const nextPayment = payments.find(
    (payment) =>
      payment.status === PaymentStatus.PENDING && payment.dueDate >= todayStart,
  );
  const admission = evaluateAdmission({
    status: student.status,
    payments: pendingPayments,
    suspensions: sanctions.filter(
      (item) => item.type === SanctionType.SUSPENSION,
    ),
    checkedAt: now,
  });
  const activeSuspension = admission.activeSuspensions[0];
  const months = Array.from({ length: 6 }, (_, index) => {
    const date = new Date(now.getFullYear(), now.getMonth() - 5 + index, 1);
    const monthRecords = attendance.filter(
      (item) =>
        item.date.getFullYear() === date.getFullYear() &&
        item.date.getMonth() === date.getMonth() &&
        item.status !== AttendanceStatus.EXCUSED,
    );
    const present = monthRecords.filter(
      (item) =>
        item.status === AttendanceStatus.PRESENT ||
        item.status === AttendanceStatus.LATE,
    ).length;
    return {
      label: new Intl.DateTimeFormat("pt-BR", { month: "short" }).format(date),
      rate: monthRecords.length
        ? Math.round((present / monthRecords.length) * 100)
        : null,
    };
  });
  const latestPayment = payments[0];

  return (
    <main className="mx-auto w-full max-w-330 px-4 py-7 sm:px-7 sm:py-9 lg:px-10">
      <div className="mb-7 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-medium text-[#7a8c83]">
            Olá, {student.name}
          </p>
          <h1 className="mt-1 text-2xl font-semibold text-[#203b34] sm:text-3xl">
            Seu resumo escolar
          </h1>
          <p className="mt-2 text-sm text-[#718179]">
            {student.grade} · Turma {student.className}
          </p>
        </div>
        <p className="text-sm font-medium text-[#73847b]">
          Ano letivo {now.getFullYear()}
        </p>
      </div>

      <section
        aria-label="Indicadores escolares"
        className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4"
      >
        <article className="rounded-lg border border-[#e1e8df] bg-white p-5">
          <p className="text-sm text-[#718179]">Média geral registrada</p>
          <p className="mt-3 text-3xl font-semibold text-[#203b34]">
            {average === null
              ? "—"
              : average.toLocaleString("pt-BR", { maximumFractionDigits: 1 })}
            <span className="ml-1 text-sm font-medium text-[#84928b]">
              {average === null ? "Sem notas" : "/ 10"}
            </span>
          </p>
        </article>
        <article className="rounded-lg border border-[#e1e8df] bg-white p-5">
          <p className="text-sm text-[#718179]">Frequência no ano</p>
          <p className="mt-3 text-3xl font-semibold text-[#203b34]">
            {attendanceRate === null ? "—" : `${attendanceRate}%`}
          </p>
          <p className="mt-1 text-xs text-[#718179]">
            {countedAttendance.length} registros
          </p>
        </article>
        <article className="rounded-lg border border-[#e1e8df] bg-white p-5">
          <p className="text-sm text-[#718179]">Próximo pagamento</p>
          <p className="mt-3 text-2xl font-semibold text-[#203b34]">
            {nextPayment ? formatCurrencyBRL(nextPayment.amount) : "—"}
          </p>
          <p className="mt-1 text-xs text-[#718179]">
            {nextPayment
              ? `Vencimento ${new Intl.DateTimeFormat("pt-BR").format(nextPayment.dueDate)}`
              : payments.length
                ? "Nenhum pagamento pendente"
                : "Nenhuma mensalidade cadastrada"}
          </p>
        </article>
        <article className="rounded-lg border border-[#e1e8df] bg-white p-5">
          <p className="text-sm text-[#718179]">Aulas de hoje</p>
          <p className="mt-3 text-2xl font-semibold text-[#203b34]">
            {lessons.length}
          </p>
          <p className="mt-1 text-xs text-[#718179]">
            {lessons.length
              ? `Próxima: ${lessons[0].subject}`
              : "Nenhuma aula cadastrada para hoje"}
          </p>
        </article>
      </section>

      <div className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1.3fr)_minmax(300px,0.8fr)]">
        <div className="space-y-5">
          <section className="rounded-lg border border-[#e1e8df] bg-white p-5 sm:p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#82918a]">
                  Desempenho
                </p>
                <h2 className="mt-1 text-lg font-semibold text-[#203b34]">
                  Notas recentes
                </h2>
              </div>
              <Link
                href="/dashboard/grades"
                className="text-sm font-semibold text-[#28705b] hover:underline"
              >
                Ver notas
              </Link>
            </div>
            {grades.length ? (
              <div className="mt-5 space-y-4">
                {grades.slice(0, 4).map((grade) => (
                  <div key={grade.id}>
                    <div className="mb-2 flex items-center justify-between gap-4">
                      <div>
                        <p className="text-sm font-medium text-[#324c42]">
                          {grade.subject}
                        </p>
                        <p className="mt-0.5 text-xs text-[#87958e]">
                          {grade.activity} · {grade.term}
                        </p>
                      </div>
                      <p className="shrink-0 text-sm font-semibold text-[#203b34]">
                        {formatGrade(grade.score, grade.maxScore)}
                      </p>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-[#edf1ec]">
                      <div
                        className="h-full rounded-full bg-[#43806c]"
                        style={{
                          width: `${Math.max(0, Math.min(100, (grade.score / grade.maxScore) * 100))}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-5 text-sm text-[#718179]">
                Ainda não há notas lançadas.
              </p>
            )}
          </section>

          <section className="rounded-lg border border-[#e1e8df] bg-white p-5 sm:p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#82918a]">
                  Presença
                </p>
                <h2 className="mt-1 text-lg font-semibold text-[#203b34]">
                  Frequência mensal
                </h2>
              </div>
              <div className="text-right">
                <p className="text-2xl font-semibold text-[#203b34]">
                  {attendanceRate === null ? "—" : `${attendanceRate}%`}
                </p>
                <p className="text-xs text-[#82918a]">no ano letivo</p>
              </div>
            </div>
            {attendance.length ? (
              <div
                role="img"
                aria-label="Gráfico de colunas da frequência mensal calculada a partir dos registros"
                className="mt-6"
              >
                <div className="relative h-48 border-b border-[#e5ebe4]">
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 flex flex-col justify-between"
                  >
                    <div className="border-t border-dashed border-[#e8ede7]" />
                    <div className="border-t border-dashed border-[#e8ede7]" />
                    <div className="border-t border-dashed border-[#e8ede7]" />
                  </div>
                  <div className="absolute inset-0 flex items-end justify-around gap-3 px-2 sm:px-8">
                    {months.map((item, index) => (
                      <div
                        key={`${item.label}-${index}`}
                        className="relative flex h-full flex-1 flex-col items-center justify-end gap-2"
                      >
                        <span className="text-[11px] font-medium text-[#687d73]">
                          {item.rate === null ? "—" : `${item.rate}%`}
                        </span>
                        <div className="flex h-[78%] w-full max-w-12 items-end overflow-hidden rounded-t-sm bg-[#eff3ee]">
                          <div
                            className={`w-full rounded-t-sm ${index === months.length - 1 ? "bg-[#c16a4b]" : "bg-[#78a48e]"}`}
                            style={{ height: `${item.rate ?? 0}%` }}
                          />
                        </div>
                        <span className="absolute -bottom-6 text-xs text-[#82918a]">
                          {item.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                <p className="mt-8 text-xs text-[#82918a]">
                  {attendance.length} presenças registradas · ausências
                  justificadas não entram no cálculo
                </p>
              </div>
            ) : (
              <p className="mt-5 text-sm text-[#718179]">
                O gráfico será preenchido quando a escola registrar sua
                frequência.
              </p>
            )}
          </section>
        </div>

        <div className="space-y-5">
          <section className="rounded-lg border border-[#e1e8df] bg-white p-5 sm:p-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#82918a]">
                  Financeiro
                </p>
                <h2 className="mt-1 text-lg font-semibold text-[#203b34]">
                  Pagamentos
                </h2>
              </div>
              <Link
                href="/dashboard/payments"
                className="text-sm font-semibold text-[#28705b] hover:underline"
              >
                Histórico
              </Link>
            </div>
            {admission.overduePayments.length ? (
              <div className="mt-5 rounded-md bg-[#fff3ed] p-4">
                <p className="text-sm font-semibold text-[#9b5038]">
                  {admission.overduePayments.length} mensalidade(s) vencida(s)
                </p>
                <p className="mt-1 text-xs text-[#8e6253]">
                  Consulte o histórico para ver os vencimentos pendentes.
                </p>
              </div>
            ) : latestPayment ? (
              <div className="mt-5 rounded-md bg-[#f5f7f3] p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-medium text-[#324c42]">
                    Pagamento mais recente
                  </p>
                  <p className="text-sm font-semibold text-[#203b34]">
                    {formatCurrencyBRL(latestPayment.amount)}
                  </p>
                </div>
                <p className="mt-2 text-xs text-[#82918a]">
                  Vencimento{" "}
                  {new Intl.DateTimeFormat("pt-BR").format(
                    latestPayment.dueDate,
                  )}{" "}
                  ·{" "}
                  {latestPayment.status === "PAID"
                    ? "Pago"
                    : latestPayment.status === "WAIVED"
                      ? "Dispensado"
                      : "Pendente"}
                </p>
              </div>
            ) : (
              <p className="mt-5 text-sm text-[#718179]">
                Nenhuma mensalidade cadastrada.
              </p>
            )}
          </section>

          <section className="rounded-lg border border-[#e1e8df] bg-white p-5 sm:p-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#82918a]">
                  Agenda
                </p>
                <h2 className="mt-1 text-lg font-semibold text-[#203b34]">
                  Aulas de hoje
                </h2>
              </div>
              <Link
                href="/dashboard/classes"
                className="text-sm font-semibold text-[#28705b] hover:underline"
              >
                Ver grade
              </Link>
            </div>
            {lessons.length ? (
              <ol className="mt-5 space-y-4">
                {lessons.map((lesson) => (
                  <li key={lesson.id} className="flex items-center gap-3">
                    <span
                      aria-hidden="true"
                      className="h-9 w-1 shrink-0 rounded-full bg-[#28705b]"
                    />
                    <span className="w-12 shrink-0 text-xs font-semibold tabular-nums text-[#657970]">
                      {new Intl.DateTimeFormat("pt-BR", {
                        timeStyle: "short",
                      }).format(lesson.startsAt)}
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
            ) : (
              <p className="mt-5 text-sm text-[#718179]">
                Nenhuma aula cadastrada para hoje.
              </p>
            )}
          </section>

          <section
            className={`rounded-lg border p-5 sm:p-6 ${activeSuspension ? "border-[#efd8cc] bg-[#fff3ed]" : "border-[#dce8df] bg-[#edf5ed]"}`}
          >
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#668273]">
              Situação disciplinar
            </p>
            <h2 className="mt-1 text-lg font-semibold text-[#244b3d]">
              {activeSuspension ? "Suspensão ativa" : "Sem suspensão ativa"}
            </h2>
            <p className="mt-2 text-sm leading-6 text-[#5f786b]">
              {activeSuspension
                ? activeSuspension.reason
                : sanctions.length
                  ? `${sanctions.length} ocorrência(s) registrada(s).`
                  : "Nenhuma ocorrência registrada."}
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
