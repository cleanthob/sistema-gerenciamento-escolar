import heroImage from "@/assets/images/hero.jpg";
import logoImage from "@/assets/images/school-logo.svg";
import { StudentLoginForm } from "@/components/pages/login/auth-forms";
import BackButton from "@/components/shared/back-button";
import Image from "next/image";
import Link from "next/link";

export default function Login() {
  return (
    <main className="auth-page relative isolate flex items-center justify-center overflow-hidden text-[#e5eee8]">
      <div className="w-full max-w-5xl">
        <section className="auth-panel grid w-full md:min-h-[560px] md:grid-cols-[1.05fr_0.95fr]">
          <div className="relative min-h-44 overflow-hidden bg-[#172b3b] md:min-h-full">
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
                Portal do(a) aluno(a)
              </p>
              <p className="mt-2 max-w-sm text-2xl font-semibold leading-tight sm:text-3xl">
                Sua jornada escolar, em um só lugar.
              </p>
            </div>
          </div>

          <div className="relative flex flex-col justify-center px-6 py-9 sm:px-12 sm:py-12">
            <div className="absolute right-6 top-5 z-20">
              <BackButton />
            </div>
            <Image
              src={logoImage}
              alt="Sistema Escolar"
              className="mb-10 h-auto w-[160px]"
              priority
            />
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#91c6aa]">
              Acesso do estudante
            </p>
            <h1 className="mt-2 text-3xl font-semibold leading-tight text-[#e5eee8]">
              Que bom ter você aqui.
            </h1>
            <p className="mt-2 text-sm leading-6 text-[#a0b2a7]">
              Entre com seus dados escolares para continuar.
            </p>

            <StudentLoginForm />

            <p className="mt-8 border-t border-[#2b3a31] pt-5 text-center text-sm text-[#a0b2a7]">
              Acesso administrativo?{" "}
              <Link
                href="/login/admin"
                className="font-semibold text-[#91c6aa] underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#63b392]"
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
