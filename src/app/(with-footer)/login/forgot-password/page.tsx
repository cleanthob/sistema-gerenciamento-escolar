import BackButton from "@/components/shared/back-button";
import Link from "next/link";

export default function ForgotPasswordPage() {
  return (
    <main className="auth-page flex items-center justify-center text-[#e5eee8]">
      <section className="auth-panel w-full max-w-md p-6 sm:p-9">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#91c6aa]">
          Recuperação de acesso
        </p>
        <h1 className="mt-2 text-2xl font-semibold">Fale com a secretaria</h1>
        <p className="mt-3 text-sm leading-6 text-[#a0b2a7]">
          Para proteger os dados do(a) aluno(a), a redefinição deve ser
          solicitada à equipe escolar. A secretaria poderá confirmar a
          identidade do responsável e emitir uma senha temporária.
        </p>
        <BackButton text="Voltar ao login" />
      </section>
    </main>
  );
}
