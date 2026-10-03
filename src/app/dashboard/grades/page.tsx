import { grades } from "../data";

export default function GradesPage() {
  return (
    <main className="mx-auto w-full max-w-330 px-4 py-7 sm:px-7 sm:py-9 lg:px-10">
      <header className="mb-7">
        <p className="text-sm font-medium text-[#7a8c83]">
          Desempenho acadêmico
        </p>
        <h1 className="mt-1 text-2xl font-semibold text-[#203b34] sm:text-3xl">
          Notas
        </h1>
        <p className="mt-2 text-sm text-[#718179]">
          Resultados e avaliações do 2º bimestre.
        </p>
      </header>

      <section className="rounded-lg border border-[#e1e8df] bg-white p-5 sm:p-6">
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-[#edf1ec] pb-5">
          <div>
            <p className="text-sm text-[#718179]">Média geral</p>
            <p className="mt-1 text-3xl font-semibold text-[#203b34]">
              8,7
              <span className="ml-1 text-sm font-medium text-[#84928b]">
                / 10
              </span>
            </p>
          </div>
          <p className="text-sm text-[#718179]">4 avaliações registradas</p>
        </div>
        <div className="mt-5 space-y-6">
          {grades.map((grade) => (
            <article key={grade.subject}>
              <div className="mb-2 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-sm font-semibold text-[#324c42]">
                    {grade.subject}
                  </h2>
                  <p className="mt-1 text-xs text-[#87958e]">
                    {grade.activity} · {grade.date}
                  </p>
                </div>
                <p className="text-sm font-semibold text-[#203b34]">
                  {grade.score.toFixed(1).replace(".", ",")}
                  <span className="font-normal text-[#87958e]"> / 10</span>
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
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
