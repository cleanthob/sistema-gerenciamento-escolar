export default function Footer() {
  return (
    <footer className="border-t border-[#293830] bg-[#0d1411]/80 px-5 py-6 text-center text-sm text-[#a0b2a7] backdrop-blur-sm">
      © {new Date().getFullYear()} Sistema Escolar. Todos os direitos
      reservados.
    </footer>
  );
}
