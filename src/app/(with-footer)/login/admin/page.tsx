import heroImage from "@/assets/images/hero.jpg";
import logoImage from "@/assets/images/logo.svg";
import { StaffLoginForm } from "@/components/pages/login/auth-forms";
import Image from "next/image";
import Link from "next/link";

export default function Admin() {
  return (
    <main className="relative isolate flex min-h-screen items-center justify-center overflow-hidden bg-[#f5f3ed] px-4 py-8 text-[#263c38] before:absolute before:inset-0 before:-z-10 before:bg-[radial-gradient(ellipse_at_90%_8%,rgba(242,133,105,0.2),transparent_34%),radial-gradient(ellipse_at_5%_95%,rgba(221,239,177,0.65),transparent_32%)] sm:px-8">
      <div className="w-full max-w-5xl">
        <Link
          href="/"
          className="mb-4 inline-flex min-h-10 items-center text-sm font-medium text-[#687b71] transition-colors hover:text-[#174f43] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#174f43]"
        >
          Voltar ao início
        </Link>
        <section className="grid w-full overflow-hidden rounded-lg border border-[#e7ddd2] bg-white shadow-[0_28px_80px_-42px_rgba(54,57,44,0.35)] md:min-h-[560px] md:grid-cols-[1.05fr_0.95fr]">
          <div className="relative min-h-44 overflow-hidden bg-[#8d523d] md:min-h-full">
            <Image
              src={heroImage}
              alt="Materiais escolares sobre uma mesa de estudos"
              fill
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#35271f]/85 via-[#744631]/20 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-6 text-white sm:p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#f4c8a9]">
                Área da equipe
              </p>
              <p className="mt-2 max-w-sm text-2xl font-semibold leading-tight sm:text-3xl">
                Acompanhe e organize a vida escolar.
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
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#a46448]">
              Acesso administrativo
            </p>
            <h1 className="mt-2 text-3xl font-semibold leading-tight text-[#263c38]">
              Área do professor
            </h1>
            <p className="mt-2 text-sm leading-6 text-[#727b70]">
              Use seu e-mail institucional para acessar o sistema.
            </p>

            <StaffLoginForm />

            <p className="mt-8 border-t border-[#eee9e2] pt-5 text-center text-sm text-[#727b70]">
              É estudante?{" "}
              <Link
                href="/login"
                className="font-semibold text-[#28705b] underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#174f43]"
              >
                Acesse por aqui
              </Link>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
