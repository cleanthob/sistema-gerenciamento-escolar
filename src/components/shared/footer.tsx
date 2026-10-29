export default function Footer() {
  return (
    <footer className="border-t border-[#dbe5d8] bg-[#f3f6ef]/80 px-5 py-6 text-center text-sm text-[#527068] backdrop-blur-sm">
      © {new Date().getFullYear()} Sistema Escolar. Todos os direitos
      reservados.
    </footer>
  );
}
