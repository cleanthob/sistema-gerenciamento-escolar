export default function Loading() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0d1411]">
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#293830] border-t-[#39a0ed]" />

        <p className="text-sm font-medium text-[#a0b2a7]">Carregando...</p>
      </div>
    </main>
  );
}
