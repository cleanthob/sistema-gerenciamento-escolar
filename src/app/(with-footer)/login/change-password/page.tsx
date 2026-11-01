import {
  LogoutButton,
  StudentChangePasswordForm,
} from "@/components/pages/login/auth-forms";

export default function ChangePasswordPage() {
  return (
    <main className="auth-page flex items-center justify-center text-[#e5eee8]">
      <section className="auth-panel w-full max-w-lg p-6 sm:p-9">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#91c6aa]">
          Primeiro acesso
        </p>
        <h1 className="mt-2 text-2xl font-semibold">Crie sua senha pessoal</h1>
        <p className="mt-2 text-sm leading-6 text-[#a0b2a7]">
          Por segurança, a senha temporária precisa ser trocada antes de acessar
          o painel.
        </p>
        <StudentChangePasswordForm />
        <div className="mt-6 flex justify-center border-t border-[#2b3a31] pt-4">
          <LogoutButton />
        </div>
      </section>
    </main>
  );
}
