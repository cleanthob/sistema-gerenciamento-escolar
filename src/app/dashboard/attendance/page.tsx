import { prisma } from "@/lib/prisma";
import { requireStudent } from "@/lib/student-dashboard";
import { AttendanceStatus } from "@prisma/client";

export default async function AttendancePage() {
  const student = await requireStudent();
  const today = new Date();
  const records = await prisma.attendance.findMany({
    where: {
      studentId: student.id,
      date: { gte: new Date(today.getFullYear(), 0, 1) },
    },
    orderBy: { date: "desc" },
  });
  const counted = records.filter(
    (record) => record.status !== AttendanceStatus.EXCUSED,
  );
  const presentCount = counted.filter(
    (record) =>
      record.status === AttendanceStatus.PRESENT ||
      record.status === AttendanceStatus.LATE,
  ).length;
  const absentCount = counted.filter(
    (record) => record.status === AttendanceStatus.ABSENT,
  ).length;
  const rate = counted.length
    ? Math.round((presentCount / counted.length) * 100)
    : null;
  const months = Array.from({ length: 6 }, (_, index) => {
    const date = new Date(today.getFullYear(), today.getMonth() - 5 + index, 1);
    const monthly = records.filter(
      (record) =>
        record.date.getFullYear() === date.getFullYear() &&
        record.date.getMonth() === date.getMonth() &&
        record.status !== AttendanceStatus.EXCUSED,
    );
    const attended = monthly.filter(
      (record) =>
        record.status === AttendanceStatus.PRESENT ||
        record.status === AttendanceStatus.LATE,
    ).length;
    return {
      month: new Intl.DateTimeFormat("pt-BR", { month: "short" }).format(date),
      rate: monthly.length
        ? Math.round((attended / monthly.length) * 100)
        : null,
    };
  });

  return (
    <main className="mx-auto w-full max-w-330 px-4 py-7 sm:px-7 sm:py-9 lg:px-10">
      <header className="mb-7">
        <p className="text-sm font-medium text-[#7a8c83]">
          Acompanhamento escolar · {student.grade} · Turma {student.className}
        </p>
        <h1 className="mt-1 text-2xl font-semibold text-[#203b34] sm:text-3xl">
          Frequência
        </h1>
        <p className="mt-2 text-sm text-[#718179]">
          Presenças registradas pela escola neste ano letivo.
        </p>
      </header>
      <section className="grid gap-3 sm:grid-cols-3">
        <article className="rounded-lg border border-[#e1e8df] bg-white p-5">
          <p className="text-sm text-[#718179]">Frequência acumulada</p>
          <p className="mt-3 text-3xl font-semibold text-[#203b34]">
            {rate === null ? "—" : `${rate}%`}
          </p>
        </article>
        <article className="rounded-lg border border-[#e1e8df] bg-white p-5">
          <p className="text-sm text-[#718179]">Presenças</p>
          <p className="mt-3 text-3xl font-semibold text-[#28705b]">
            {presentCount}
          </p>
        </article>
        <article className="rounded-lg border border-[#e1e8df] bg-white p-5">
          <p className="text-sm text-[#718179]">Faltas</p>
          <p className="mt-3 text-3xl font-semibold text-[#a45c40]">
            {absentCount}
          </p>
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
            <p className="text-2xl font-semibold text-[#203b34]">
              {rate === null ? "—" : `${rate}%`}
            </p>
            <p className="text-xs text-[#82918a]">média registrada</p>
          </div>
        </div>
        {records.length ? (
          <div
            role="img"
            aria-label="Gráfico de colunas calculado a partir das presenças registradas"
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
                {months.map((item, index) => (
                  <div
                    key={`${item.month}-${index}`}
                    className="relative flex h-full flex-1 flex-col items-center justify-end gap-2"
                  >
                    <span className="text-xs font-medium text-[#687d73]">
                      {item.rate === null ? "—" : `${item.rate}%`}
                    </span>
                    <div className="flex h-[78%] w-full max-w-14 items-end overflow-hidden rounded-t-sm bg-[#eff3ee]">
                      <div
                        className={`w-full rounded-t-sm ${index === months.length - 1 ? "bg-[#c16a4b]" : "bg-[#78a48e]"}`}
                        style={{ height: `${item.rate ?? 0}%` }}
                      />
                    </div>
                    <span className="absolute -bottom-6 text-xs text-[#82918a]">
                      {item.month}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-8 flex flex-wrap justify-between gap-2 text-xs text-[#82918a]">
              <span>{records.length} registros no ano</span>
              <span>Faltas justificadas não reduzem a frequência</span>
            </div>
          </div>
        ) : (
          <p className="py-12 text-center text-sm text-[#718179]">
            O gráfico será preenchido após a escola registrar sua presença.
          </p>
        )}
      </section>
    </main>
  );
}
