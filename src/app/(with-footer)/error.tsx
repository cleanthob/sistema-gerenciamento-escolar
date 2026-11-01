"use client";

import { RefreshCw } from "lucide-react";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Erro na aplicação:", error);
  }, [error]);

  return (
    <main className="auth-page relative isolate flex flex-col items-center justify-center overflow-hidden text-center text-[#e5eee8]">
      <div className="flex max-w-md flex-col items-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#22372c] text-[#91c6aa]">
          <RefreshCw size={30} strokeWidth={1.8} />
        </div>

        <h1 className="mt-6 text-2xl font-semibold text-[#e5eee8] sm:text-3xl">
          Não foi possível exibir esta página.
        </h1>

        <p className="mt-3 text-sm leading-6 text-[#a0b2a7] sm:text-base">
          A página encontrou um erro inesperado. Tente recarregá-la; se o
          problema continuar, contate o suporte
          {error.digest ? ` e informe o código ${error.digest}` : ""}.
        </p>

        <button
          onClick={() => reset()}
          className="mt-8 inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#63b392] px-7 text-sm font-semibold text-[#0d1913] transition-colors hover:bg-[#91c6aa] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#63b392]"
        >
          <RefreshCw size={16} />
          Tentar novamente
        </button>
      </div>
    </main>
  );
}
