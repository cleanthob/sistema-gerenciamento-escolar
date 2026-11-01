import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <main className="auth-page flex items-center justify-center text-[#e5eee8]">
      <section className="auth-panel w-full max-w-md border-l-4 border-[#df896c] p-7 sm:p-9">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#f0ad91]">
          Acesso restrito
        </p>
        <h1 className="mt-3 text-2xl font-semibold">Acesso não autorizado</h1>
        <p className="mt-3 text-sm leading-6 text-[#a0b2a7]">
          Esta área é exclusiva para o perfil correspondente. Entre com a conta
          correta para continuar.
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Link
            href="/login"
            className="inline-flex min-h-10 items-center rounded-md bg-[#63b392] px-4 text-sm font-semibold text-[#0d1913] hover:bg-[#91c6aa]"
          >
            Login do(a) aluno(a)
          </Link>
          <Link
            href="/login/admin"
            className="inline-flex min-h-10 items-center rounded-md border border-[#34463a] px-4 text-sm font-semibold text-[#dce8df] hover:bg-[#1c2922]"
          >
            Login administrativo
          </Link>
        </div>
      </section>
    </main>
  );
}
