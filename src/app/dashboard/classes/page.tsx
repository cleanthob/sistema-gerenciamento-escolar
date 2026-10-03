import { prisma } from "@/lib/prisma";
import { requireStudent } from "@/lib/student-dashboard";
import { SanctionType } from "@prisma/client";

export default async function ClassesPage() {
  const student = await requireStudent();
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const end = new Date(start.getTime() + 24 * 60 * 60 * 1000);
  const [lessons, sanctions] = await Promise.all([
    prisma.lesson.findMany({
      where: { studentId: student.id, startsAt: { gte: start, lt: end } },
      orderBy: { startsAt: "asc" },
    }),
    prisma.sanction.findMany({
      where: { studentId: student.id },
      orderBy: { startsAt: "desc" },
    }),
  ]);
  const activeSuspension = sanctions.find(
    (item) =>
      item.type === SanctionType.SUSPENSION &&
      item.startsAt <= now &&
      (!item.endsAt || item.endsAt >= now),
  );

  return (
    <main className="mx-auto w-full max-w-330 px-4 py-7 sm:px-7 sm:py-9 lg:px-10">
      <header className="mb-7">
        <p className="text-sm font-medium text-[#7a8c83]">
          Agenda escolar · {student.grade} · Turma {student.className}
        </p>
        <h1 className="mt-1 text-2xl font-semibold text-[#203b34] sm:text-3xl">
          Aulas do dia
        </h1>
        <p className="mt-2 text-sm text-[#718179]">
          Horários e salas cadastrados pela escola para hoje.
        </p>
      </header>
      <section className="rounded-lg border border-[#e1e8df] bg-white p-5 sm:p-6">
        <div className="flex items-center justify-between gap-3 border-b border-[#edf1ec] pb-4">
          <div>
            <h2 className="text-lg font-semibold text-[#203b34]">
              Grade diária
            </h2>
            <p className="mt-1 text-sm text-[#718179]">
              {lessons.length
                ? `${lessons.length} aula(s) cadastrada(s) para hoje.`
                : "Nenhuma aula cadastrada para hoje."}
            </p>
          </div>
        </div>
        {lessons.length ? (
          <ol className="divide-y divide-[#edf1ec]">
            {lessons.map((lesson) => (
              <li key={lesson.id} className="flex gap-4 py-5">
                <div className="w-14 shrink-0 pt-0.5 text-right">
                  <p className="text-sm font-semibold tabular-nums text-[#324c42]">
                    {new Intl.DateTimeFormat("pt-BR", {
                      timeStyle: "short",
                    }).format(lesson.startsAt)}
                  </p>
                  <p className="mt-1 text-[11px] text-[#98a49d]">
                    {new Intl.DateTimeFormat("pt-BR", {
                      timeStyle: "short",
                    }).format(lesson.endsAt)}
                  </p>
                </div>
                <span
                  aria-hidden="true"
                  className="mt-1 h-11 w-1 shrink-0 rounded-full bg-[#28705b]"
                />
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-semibold text-[#29483e]">
                    {lesson.subject}
                  </h3>
                  <p className="mt-1 text-xs text-[#718179]">
                    {lesson.teacher}
                  </p>
                  <p className="mt-1 text-xs text-[#87958e]">{lesson.room}</p>
                </div>
              </li>
            ))}
          </ol>
        ) : (
          <p className="py-10 text-center text-sm text-[#718179]">
            Quando a escola adicionar sua grade, as aulas aparecerão aqui.
          </p>
        )}
      </section>
      <section
        className={`mt-5 rounded-lg border p-5 sm:p-6 ${activeSuspension ? "border-[#efd8cc] bg-[#fff3ed]" : "border-[#dce8df] bg-[#edf5ed]"}`}
      >
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#668273]">
          Situação disciplinar
        </p>
        <h2 className="mt-1 text-lg font-semibold text-[#244b3d]">
          {activeSuspension
            ? "Suspensão ativa"
            : sanctions.length
              ? "Sem suspensão ativa"
              : "Sem ocorrências registradas"}
        </h2>
        <p className="mt-2 text-sm leading-6 text-[#5f786b]">
          {activeSuspension
            ? activeSuspension.reason
            : sanctions.length
              ? `${sanctions.length} ocorrência(s) registrada(s).`
              : "Não há punições ou suspensões cadastradas para sua matrícula."}
        </p>
      </section>
    </main>
  );
}
