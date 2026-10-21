import heroImage from "@/assets/images/hero.jpg";
import logoImage from "@/assets/images/logo.svg";
import { StudentLoginForm } from "@/components/auth-forms";
import Image from "next/image";
import Link from "next/link";

export default function Login() {
  return (
    <main className="relative isolate flex min-h-screen items-center justify-center overflow-hidden bg-[#f3f6ef] px-4 py-8 text-[#183b35] before:absolute before:inset-0 before:-z-10 before:bg-[radial-gradient(ellipse_at_10%_10%,rgba(221,239,177,0.7),transparent_35%),radial-gradient(ellipse_at_95%_90%,rgba(242,133,105,0.18),transparent_30%)] sm:px-8">
      <div className="w-full max-w-5xl">
        <Link
          href="/"
          className="mb-4 inline-flex min-h-10 items-center text-sm font-medium text-[#527068] transition-colors hover:text-[#174f43] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#174f43]"
        >
          Voltar ao início
        </Link>
        <section className="grid w-full overflow-hidden rounded-lg border border-[#dce6dc] bg-white shadow-[0_28px_80px_-42px_rgba(24,59,53,0.45)] md:min-h-[560px] md:grid-cols-[1.05fr_0.95fr]">
          <div className="relative min-h-44 overflow-hidden bg-[#174f43] md:min-h-full">
            <Image
              src={heroImage}
              alt="Materiais escolares sobre uma mesa de estudos"
              fill
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#102f2a]/85 via-[#174f43]/15 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-6 text-white sm:p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#dcebbd]">
                Portal do aluno
              </p>
              <p className="mt-2 max-w-sm text-2xl font-semibold leading-tight sm:text-3xl">
                Sua jornada escolar, em um só lugar.
              </p>
            </div>
          </div>

          <div className="flex flex-col justify-center px-6 py-9 sm:px-12 sm:py-12">
            <Image
              src={logoImage}
              alt="Sistema Escolar"
              className="mb-10 h-auto w-[132px]"
              priority
            />
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#648177]">
              Acesso do estudante
            </p>
            <h1 className="mt-2 text-3xl font-semibold leading-tight text-[#183b35]">
              Que bom ter você aqui.
            </h1>
            <p className="mt-2 text-sm leading-6 text-[#647b73]">
              Entre com seus dados escolares para continuar.
            </p>

            <StudentLoginForm />

            <p className="mt-8 border-t border-[#e7ede7] pt-5 text-center text-sm text-[#647b73]">
              Acesso administrativo?{" "}
              <Link
                href="/login/admin"
                className="font-semibold text-[#28705b] underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#174f43]"
              >
                Entrar como professor
              </Link>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
