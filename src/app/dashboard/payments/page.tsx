import { prisma } from "@/lib/prisma";
import { requireStudent } from "@/lib/student-dashboard";
import { PaymentStatus } from "@prisma/client";

function money(amountInCents: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(amountInCents / 100);
}

function paymentStatus(status: PaymentStatus) {
  if (status === PaymentStatus.PAID)
    return { label: "Pago", styles: "bg-[#eaf2e9] text-[#28705b]" };
  if (status === PaymentStatus.WAIVED)
    return { label: "Dispensado", styles: "bg-[#f1f4ef] text-[#62756b]" };
  return { label: "Pendente", styles: "bg-[#fff3ed] text-[#9b5038]" };
}

export default async function PaymentsPage() {
  const student = await requireStudent();
  const payments = await prisma.payment.findMany({
    where: { studentId: student.id },
    orderBy: { dueDate: "desc" },
  });
  const today = new Date();
  const todayStart = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  );
  const overdue = payments.filter(
    (payment) =>
      payment.status === PaymentStatus.PENDING &&
      new Date(
        payment.dueDate.getFullYear(),
        payment.dueDate.getMonth(),
        payment.dueDate.getDate(),
      ) < todayStart,
  );
  const upcoming = payments
    .filter(
      (payment) =>
        payment.status === PaymentStatus.PENDING &&
        payment.dueDate >= todayStart,
    )
    .sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime())[0];

  return (
    <main className="mx-auto w-full max-w-330 px-4 py-7 sm:px-7 sm:py-9 lg:px-10">
      <header className="mb-7">
        <p className="text-sm font-medium text-[#7a8c83]">Resumo financeiro</p>
        <h1 className="mt-1 text-2xl font-semibold text-[#203b34] sm:text-3xl">
          Pagamentos
        </h1>
        <p className="mt-2 text-sm text-[#718179]">
          Mensalidades registradas para sua matrícula.
        </p>
      </header>
      <section className="grid gap-3 sm:grid-cols-2">
        <article className="rounded-lg border border-[#e1e8df] bg-white p-5">
          <p className="text-sm text-[#718179]">Próximo vencimento</p>
          <p className="mt-3 text-2xl font-semibold text-[#203b34]">
            {upcoming
              ? new Intl.DateTimeFormat("pt-BR", {
                  dateStyle: "medium",
                }).format(upcoming.dueDate)
              : "—"}
          </p>
          <p className="mt-1 text-sm text-[#718179]">
            {upcoming ? money(upcoming.amount) : "Nenhum vencimento pendente"}
          </p>
        </article>
        <article
          className={`rounded-lg border p-5 ${overdue.length ? "border-[#efd8cc] bg-[#fff3ed]" : "border-[#dce8df] bg-[#edf5ed]"}`}
        >
          <p className="text-sm text-[#668273]">Situação da conta</p>
          <p className="mt-3 text-2xl font-semibold text-[#244b3d]">
            {overdue.length
              ? `${overdue.length} vencido(s)`
              : payments.length
                ? "Sem atraso registrado"
                : "Sem dados financeiros"}
          </p>
          <p className="mt-1 text-sm text-[#5f786b]">
            {payments.length
              ? "Situação conforme os pagamentos cadastrados pela escola."
              : "A escola ainda não cadastrou mensalidades."}
          </p>
        </article>
      </section>
      <section className="mt-5 rounded-lg border border-[#e1e8df] bg-white p-5 sm:p-6">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-[#203b34]">
            Histórico de pagamentos
          </h2>
          <p className="mt-1 text-sm text-[#718179]">
            Registros financeiros associados à sua matrícula.
          </p>
        </div>
        {payments.length ? (
          <div className="divide-y divide-[#edf1ec]">
            {payments.map((payment) => {
              const status = paymentStatus(payment.status);
              return (
                <article
                  key={payment.id}
                  className="flex flex-wrap items-center justify-between gap-3 py-4 first:pt-2 last:pb-2"
                >
                  <div className="min-w-40 flex-1">
                    <h3 className="text-sm font-semibold text-[#324c42]">
                      {payment.reference || "Mensalidade"}
                    </h3>
                    <p className="mt-1 text-xs text-[#87958e]">
                      Vencimento{" "}
                      {new Intl.DateTimeFormat("pt-BR").format(payment.dueDate)}
                      {payment.paidAt
                        ? ` · Pago em ${new Intl.DateTimeFormat("pt-BR").format(payment.paidAt)}`
                        : ""}
                    </p>
                  </div>
                  <p className="text-sm font-semibold text-[#203b34]">
                    {money(payment.amount)}
                  </p>
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-semibold ${status.styles}`}
                  >
                    {status.label}
                  </span>
                </article>
              );
            })}
          </div>
        ) : (
          <p className="py-8 text-center text-sm text-[#718179]">
            Nenhum pagamento foi cadastrado para sua matrícula.
          </p>
        )}
      </section>
    </main>
  );
}
