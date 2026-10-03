import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f3f6ef] px-5 py-12 text-[#203b34]">
      <section className="w-full max-w-md border-l-4 border-[#b65b40] bg-white p-7 shadow-[0_20px_55px_-38px_rgba(32,59,52,0.45)] sm:p-9">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#a45c40]">
          Acesso restrito
        </p>
        <h1 className="mt-3 text-2xl font-semibold">Acesso não autorizado</h1>
        <p className="mt-3 text-sm leading-6 text-[#687b71]">
          Esta área é exclusiva para o perfil correspondente. Entre com a conta
          correta para continuar.
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Link
            href="/login"
            className="inline-flex min-h-10 items-center rounded-md bg-[#174f43] px-4 text-sm font-semibold text-white hover:bg-[#103d34]"
          >
            Login do aluno
          </Link>
          <Link
            href="/login/admin"
            className="inline-flex min-h-10 items-center rounded-md border border-[#d9e3da] px-4 text-sm font-semibold text-[#29483e] hover:bg-[#f4f6f1]"
          >
            Login administrativo
          </Link>
        </div>
      </section>
    </main>
  );
}
