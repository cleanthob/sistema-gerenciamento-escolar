export default function Loading() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f3f6ef]">
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#dbe5d8] border-t-[#174f43]" />

        <p className="text-sm font-medium text-[#527068]">Carregando...</p>
      </div>
    </main>
  );
}
