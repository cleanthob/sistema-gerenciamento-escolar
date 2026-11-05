import heroImage from "@/assets/images/hero.jpg";
import logoImage from "@/assets/images/school-logo.svg";
import { StaffLoginForm } from "@/components/pages/login/auth-forms";
import BackButton from "@/components/shared/back-button";
import Image from "next/image";
import Link from "next/link";

export default function Admin() {
  return (
    <main className="auth-page relative isolate flex items-center justify-center overflow-hidden text-[#e5eee8]">
      <div className="w-full max-w-5xl">
        <BackButton />
        <section className="auth-panel grid w-full md:min-h-[560px] md:grid-cols-[1.05fr_0.95fr]">
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
              className="mb-10 h-auto w-[160px]"
              priority
            />
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#f0ad91]">
              Acesso administrativo
            </p>
            <h1 className="mt-2 text-3xl font-semibold leading-tight text-[#e5eee8]">
              Área do professor
            </h1>
            <p className="mt-2 text-sm leading-6 text-[#a0b2a7]">
              Use seu e-mail institucional para acessar o sistema.
            </p>

            <StaffLoginForm />

            <p className="mt-8 border-t border-[#2b3a31] pt-5 text-center text-sm text-[#a0b2a7]">
              É estudante?{" "}
              <Link
                href="/login"
                className="font-semibold text-[#91c6aa] underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#63b392]"
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
