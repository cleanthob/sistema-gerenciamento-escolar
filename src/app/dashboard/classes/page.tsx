import { lessons } from "../data";

export default function ClassesPage() {
  return (
    <main className="mx-auto w-full max-w-330 px-4 py-7 sm:px-7 sm:py-9 lg:px-10">
      <header className="mb-7">
        <p className="text-sm font-medium text-[#7a8c83]">Agenda escolar</p>
        <h1 className="mt-1 text-2xl font-semibold text-[#203b34] sm:text-3xl">
          Aulas do dia
        </h1>
        <p className="mt-2 text-sm text-[#718179]">
          Confira os horários, disciplinas e salas.
        </p>
      </header>

      <section className="rounded-lg border border-[#e1e8df] bg-white p-5 sm:p-6">
        <div className="flex items-center justify-between gap-3 border-b border-[#edf1ec] pb-4">
          <div>
            <h2 className="text-lg font-semibold text-[#203b34]">
              Grade diária
            </h2>
            <p className="mt-1 text-sm text-[#718179]">
              Quatro aulas programadas.
            </p>
          </div>
          <span className="rounded-md bg-[#f3f6f1] px-3 py-1.5 text-xs font-medium text-[#62756b]">
            Turma 8º B
          </span>
        </div>
        <ol className="divide-y divide-[#edf1ec]">
          {lessons.map((lesson, index) => (
            <li key={lesson.time} className="flex gap-4 py-5 first:pt-5">
              <div className="w-14 shrink-0 pt-0.5 text-right">
                <p className="text-sm font-semibold tabular-nums text-[#324c42]">
                  {lesson.time}
                </p>
                <p className="mt-1 text-[11px] text-[#98a49d]">
                  {index === lessons.length - 1
                    ? "16:20"
                    : lessons[index + 1].time}
                </p>
              </div>
              <span
                aria-hidden="true"
                className={`mt-1 h-11 w-1 shrink-0 rounded-full ${lesson.color}`}
              />
              <div className="min-w-0 flex-1">
                <h3 className="text-sm font-semibold text-[#29483e]">
                  {lesson.subject}
                </h3>
                <p className="mt-1 text-xs text-[#718179]">{lesson.teacher}</p>
                <p className="mt-1 text-xs text-[#87958e]">{lesson.room}</p>
              </div>
              <span className="hidden self-start rounded-full bg-[#f3f6f1] px-2.5 py-1 text-[11px] font-medium text-[#62756b] sm:inline-flex">
                {index === 0 ? "1ª aula" : `${index + 1}ª aula`}
              </span>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-5 rounded-lg border border-[#dce8df] bg-[#edf5ed] p-5 sm:p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#668273]">
          Situação disciplinar
        </p>
        <h2 className="mt-1 text-lg font-semibold text-[#244b3d]">
          Sem ocorrências ativas
        </h2>
        <p className="mt-2 text-sm leading-6 text-[#5f786b]">
          Nenhuma punição ou suspensão registrada neste período.
        </p>
      </section>
    </main>
  );
}
