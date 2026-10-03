import { prisma } from "@/lib/prisma";
import { requireStudent } from "@/lib/student-dashboard";

export default async function GradesPage() {
  const student = await requireStudent();
  const grades = await prisma.grade.findMany({
    where: { studentId: student.id },
    orderBy: [{ term: "desc" }, { recordedAt: "desc" }],
  });
  const average = grades.length
    ? grades.reduce(
        (sum, grade) => sum + (grade.score / grade.maxScore) * 10,
        0,
      ) / grades.length
    : null;

  return (
    <main className="mx-auto w-full max-w-330 px-4 py-7 sm:px-7 sm:py-9 lg:px-10">
      <header className="mb-7">
        <p className="text-sm font-medium text-[#7a8c83]">
          Desempenho acadêmico · {student.grade} · Turma {student.className}
        </p>
        <h1 className="mt-1 text-2xl font-semibold text-[#203b34] sm:text-3xl">
          Notas
        </h1>
        <p className="mt-2 text-sm text-[#718179]">
          Avaliações lançadas pela equipe escolar.
        </p>
      </header>

      <section className="rounded-lg border border-[#e1e8df] bg-white p-5 sm:p-6">
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-[#edf1ec] pb-5">
          <div>
            <p className="text-sm text-[#718179]">Média geral registrada</p>
            <p className="mt-1 text-3xl font-semibold text-[#203b34]">
              {average === null
                ? "—"
                : average.toLocaleString("pt-BR", { maximumFractionDigits: 1 })}
              <span className="ml-1 text-sm font-medium text-[#84928b]">
                {average === null ? "Sem notas" : "/ 10"}
              </span>
            </p>
          </div>
          <p className="text-sm text-[#718179]">{grades.length} avaliações</p>
        </div>
        {grades.length ? (
          <div className="mt-5 space-y-6">
            {grades.map((grade) => (
              <article key={grade.id}>
                <div className="mb-2 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h2 className="text-sm font-semibold text-[#324c42]">
                      {grade.subject}
                    </h2>
                    <p className="mt-1 text-xs text-[#87958e]">
                      {grade.activity} · {grade.term} ·{" "}
                      {new Intl.DateTimeFormat("pt-BR").format(
                        grade.recordedAt,
                      )}
                    </p>
                  </div>
                  <p className="text-sm font-semibold text-[#203b34]">
                    {grade.score.toLocaleString("pt-BR")}
                    <span className="font-normal text-[#87958e]">
                      {" "}
                      / {grade.maxScore.toLocaleString("pt-BR")}
                    </span>
                  </p>
                </div>
                <div
                  role="progressbar"
                  aria-label={`Nota de ${grade.subject}`}
                  aria-valuemin={0}
                  aria-valuemax={grade.maxScore}
                  aria-valuenow={grade.score}
                  className="h-2 overflow-hidden rounded-full bg-[#edf1ec]"
                >
                  <div
                    className="h-full rounded-full bg-[#43806c]"
                    style={{
                      width: `${Math.max(0, Math.min(100, (grade.score / grade.maxScore) * 100))}%`,
                    }}
                  />
                </div>
              </article>
            ))}
          </div>
        ) : (
          <p className="py-8 text-center text-sm text-[#718179]">
            Ainda não há notas lançadas para sua matrícula.
          </p>
        )}
      </section>
    </main>
  );
}
