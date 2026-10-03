import { attendance } from "../data";

export default function AttendancePage() {
  return (
    <main className="mx-auto w-full max-w-330 px-4 py-7 sm:px-7 sm:py-9 lg:px-10">
      <header className="mb-7">
        <p className="text-sm font-medium text-[#7a8c83]">
          Acompanhamento escolar
        </p>
        <h1 className="mt-1 text-2xl font-semibold text-[#203b34] sm:text-3xl">
          Frequência
        </h1>
        <p className="mt-2 text-sm text-[#718179]">
          Presenças registradas ao longo do ano letivo.
        </p>
      </header>

      <section className="grid gap-3 sm:grid-cols-3">
        <article className="rounded-lg border border-[#e1e8df] bg-white p-5">
          <p className="text-sm text-[#718179]">Frequência acumulada</p>
          <p className="mt-3 text-3xl font-semibold text-[#203b34]">96%</p>
        </article>
        <article className="rounded-lg border border-[#e1e8df] bg-white p-5">
          <p className="text-sm text-[#718179]">Presenças</p>
          <p className="mt-3 text-3xl font-semibold text-[#28705b]">142</p>
        </article>
        <article className="rounded-lg border border-[#e1e8df] bg-white p-5">
          <p className="text-sm text-[#718179]">Faltas</p>
          <p className="mt-3 text-3xl font-semibold text-[#a45c40]">6</p>
        </article>
      </section>

      <section className="mt-5 rounded-lg border border-[#e1e8df] bg-white p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#82918a]">
              Frequência por mês
            </p>
            <h2 className="mt-1 text-lg font-semibold text-[#203b34]">
              Presença mensal
            </h2>
          </div>
          <div className="text-right">
            <p className="text-2xl font-semibold text-[#203b34]">96%</p>
            <p className="text-xs text-[#82918a]">média no período</p>
          </div>
        </div>
        <div
          role="img"
          aria-label="Gráfico de colunas da frequência mensal: maio 94%, junho 97%, julho 91%, agosto 98%, setembro 95%, outubro 96%."
          className="mt-7"
        >
          <div className="relative h-56 border-b border-[#e5ebe4]">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 flex flex-col justify-between"
            >
              <div className="border-t border-dashed border-[#e8ede7]" />
              <div className="border-t border-dashed border-[#e8ede7]" />
              <div className="border-t border-dashed border-[#e8ede7]" />
              <div className="border-t border-dashed border-[#e8ede7]" />
            </div>
            <div className="absolute inset-0 flex items-end justify-around gap-3 px-2 sm:px-8">
              {attendance.map((item, index) => (
                <div
                  key={item.month}
                  className="relative flex h-full flex-1 flex-col items-center justify-end gap-2"
                >
                  <span className="text-xs font-medium text-[#687d73]">
                    {item.value}%
                  </span>
                  <div className="flex h-[78%] w-full max-w-14 items-end overflow-hidden rounded-t-sm bg-[#eff3ee]">
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
          <div className="mt-8 flex flex-wrap items-center justify-between gap-2 text-xs text-[#82918a]">
            <span>Presença mensal</span>
            <span>Mínimo esperado: 75%</span>
          </div>
        </div>
      </section>
    </main>
  );
}
