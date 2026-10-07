import Link from "next/link";

export default function NotFound() {
  return (
    <main className="relative isolate flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#f3f6ef] px-5 py-12 text-center text-[#183b35] before:absolute before:inset-0 before:-z-10 before:bg-[radial-gradient(ellipse_at_15%_10%,rgba(221,239,177,0.72),transparent_32%),radial-gradient(ellipse_at_90%_90%,rgba(242,133,105,0.2),transparent_28%)]">
      <div className="flex max-w-md flex-col items-center">
        <span className="text-8xl font-semibold tracking-tight text-[#174f43] sm:text-9xl">
          404
        </span>

        <h1 className="mt-4 text-2xl font-semibold text-[#183b35] sm:text-3xl">
          Página não encontrada
        </h1>

        <p className="mt-3 text-sm leading-6 text-[#527068] sm:text-base">
          A página que você está procurando não existe ou foi removida.
        </p>

        <Link
          href="/"
          className="mt-8 inline-flex min-h-12 items-center justify-center rounded-full bg-[#174f43] px-7 text-sm font-semibold text-white transition-colors hover:bg-[#103d34] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#174f43]"
        >
          Voltar para o início
        </Link>
      </div>
    </main>
  );
}
