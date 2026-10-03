import { payments } from "../data";

export default function PaymentsPage() {
  return (
    <main className="mx-auto w-full max-w-330 px-4 py-7 sm:px-7 sm:py-9 lg:px-10">
      <header className="mb-7">
        <p className="text-sm font-medium text-[#7a8c83]">Resumo financeiro</p>
        <h1 className="mt-1 text-2xl font-semibold text-[#203b34] sm:text-3xl">
          Pagamentos
        </h1>
        <p className="mt-2 text-sm text-[#718179]">
          Consulte mensalidades, vencimentos e pagamentos confirmados.
        </p>
      </header>

      <section className="grid gap-3 sm:grid-cols-2">
        <article className="rounded-lg border border-[#e1e8df] bg-white p-5">
          <p className="text-sm text-[#718179]">Próximo vencimento</p>
          <p className="mt-3 text-2xl font-semibold text-[#203b34]">
            10 nov 2026
          </p>
          <p className="mt-1 text-sm text-[#718179]">
            Mensalidade de novembro · R$ 680,00
          </p>
        </article>
        <article className="rounded-lg border border-[#dce8df] bg-[#edf5ed] p-5">
          <p className="text-sm text-[#668273]">Situação da conta</p>
          <p className="mt-3 text-2xl font-semibold text-[#244b3d]">Em dia</p>
          <p className="mt-1 text-sm text-[#5f786b]">
            Nenhum pagamento em atraso.
          </p>
        </article>
      </section>

      <section className="mt-5 rounded-lg border border-[#e1e8df] bg-white p-5 sm:p-6">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-[#203b34]">
            Histórico de pagamentos
          </h2>
          <p className="mt-1 text-sm text-[#718179]">
            Mensalidades mais recentes.
          </p>
        </div>
        <div className="divide-y divide-[#edf1ec]">
          {payments.map((payment) => (
            <article
              key={payment.month}
              className="flex flex-wrap items-center justify-between gap-3 py-4 first:pt-2 last:pb-2"
            >
              <div className="min-w-40 flex-1">
                <h3 className="text-sm font-semibold text-[#324c42]">
                  Mensalidade · {payment.month}
                </h3>
                <p className="mt-1 text-xs text-[#87958e]">
                  Vencimento {payment.dueDate} · Pago em {payment.paidDate}
                </p>
              </div>
              <p className="text-sm font-semibold text-[#203b34]">
                {payment.amount}
              </p>
              <span className="rounded-full bg-[#eaf2e9] px-2.5 py-1 text-xs font-semibold text-[#28705b]">
                {payment.status}
              </span>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
