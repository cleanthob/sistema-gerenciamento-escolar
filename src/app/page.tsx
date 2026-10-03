import heroImage from "@/assets/images/hero.jpg";
import logoImage from "@/assets/images/logo.svg";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="relative isolate flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#f3f6ef] px-5 py-12 text-center text-[#183b35] before:absolute before:inset-0 before:-z-10 before:bg-[radial-gradient(ellipse_at_15%_10%,rgba(221,239,177,0.72),transparent_32%),radial-gradient(ellipse_at_90%_90%,rgba(242,133,105,0.2),transparent_28%)]">
      <header className="mb-8 flex flex-col items-center gap-4 sm:mb-10">
        <Image
          src={logoImage}
          alt="Sistema Escolar"
          className="h-auto w-[132px]"
          priority
        />
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#527068]">
          Portal da comunidade escolar
        </p>
      </header>

      <section className="flex w-full max-w-4xl flex-col items-center">
        <h1 className="max-w-2xl text-4xl font-semibold leading-tight text-[#183b35] sm:text-5xl">
          Aprender abre caminhos.
        </h1>
        <p className="mt-4 max-w-xl text-base leading-7 text-[#527068] sm:text-lg">
          Um espaço para alunos e professores seguirem juntos em cada etapa da
          jornada escolar.
        </p>

        <div className="mt-8 flex w-full flex-col justify-center gap-3 sm:w-auto sm:flex-row">
          <Link
            href="/login"
            className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#174f43] px-7 text-sm font-semibold text-white transition-colors hover:bg-[#103d34] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#174f43]"
          >
            Sou aluno
          </Link>
          <Link
            href="/login/admin"
            className="inline-flex min-h-12 items-center justify-center rounded-full border border-[#b7c9bf] bg-white/70 px-7 text-sm font-semibold text-[#183b35] transition-colors hover:border-[#e88a6f] hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#e88a6f]"
          >
            Sou professor
          </Link>
        </div>

        <div className="mt-10 w-full overflow-hidden rounded-lg border border-white/80 shadow-[0_24px_70px_-38px_rgba(24,59,53,0.55)] sm:mt-12">
          <Image
            src={heroImage}
            alt="Livros, lápis de cor e uma maçã sobre uma mesa de estudos"
            className="h-[240px] w-full object-cover object-center sm:h-[340px] lg:h-[390px]"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 896px"
            priority
          />
        </div>
      </section>
    </main>
  );
}
