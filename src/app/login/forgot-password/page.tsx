import Link from "next/link";

export default function ForgotPasswordPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f3f6ef] px-4 py-10 text-[#183b35]">
      <section className="w-full max-w-md border border-[#dce6dc] bg-white p-6 sm:p-9">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#648177]">
          Recuperação de acesso
        </p>
        <h1 className="mt-2 text-2xl font-semibold">Fale com a secretaria</h1>
        <p className="mt-3 text-sm leading-6 text-[#647b73]">
          Para proteger os dados do aluno, a redefinição deve ser solicitada à
          equipe escolar. A secretaria poderá confirmar a identidade do
          responsável e emitir uma senha temporária.
        </p>
        <Link
          href="/login"
          className="mt-7 inline-flex min-h-11 items-center rounded-md bg-[#174f43] px-5 text-sm font-semibold text-white hover:bg-[#103d34]"
        >
          Voltar ao login
        </Link>
      </section>
    </main>
  );
}
