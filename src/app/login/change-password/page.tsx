import {
  LogoutButton,
  StudentChangePasswordForm,
} from "@/components/auth-forms";

export default function ChangePasswordPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f3f6ef] px-4 py-10 text-[#183b35]">
      <section className="w-full max-w-lg border border-[#dce6dc] bg-white p-6 shadow-[0_28px_80px_-42px_rgba(24,59,53,0.45)] sm:p-9">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#648177]">
          Primeiro acesso
        </p>
        <h1 className="mt-2 text-2xl font-semibold">Crie sua senha pessoal</h1>
        <p className="mt-2 text-sm leading-6 text-[#647b73]">
          Por segurança, a senha temporária precisa ser trocada antes de acessar
          o painel.
        </p>
        <StudentChangePasswordForm />
        <div className="mt-6 flex justify-center border-t border-[#e7ede7] pt-4">
          <LogoutButton />
        </div>
      </section>
    </main>
  );
}
