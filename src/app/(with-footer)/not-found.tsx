import BackButton from "../../components/shared/back-button";

export default function NotFound() {
  return (
    <main className="auth-page relative isolate flex flex-col items-center justify-center overflow-hidden text-center text-[#e5eee8]">
      <div className="flex max-w-md flex-col items-center">
        <span className="text-8xl font-semibold tracking-tight text-[#91c6aa] sm:text-9xl">
          404
        </span>

        <h1 className="mt-4 text-2xl font-semibold text-[#e5eee8] sm:text-3xl">
          Página não encontrada
        </h1>

        <p className="mt-3 text-sm leading-6 text-[#a0b2a7] sm:text-base">
          A página que você está procurando não existe ou foi removida.
        </p>

        <BackButton />
      </div>
    </main>
  );
}
