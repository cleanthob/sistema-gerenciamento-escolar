import { ArrowLeft } from "lucide-react";
import Link from "next/link";

type BackButtonProps = {
  text?: string;
  href?: string;
};

export default function BackButton({
  text = "Voltar",
  href = "/",
}: BackButtonProps) {
  return (
    <Link
      href={href}
      className="group/button mb-2 inline-flex h-9 shrink-0 items-center justify-center gap-1.5 whitespace-nowrap rounded-md border border-transparent bg-[#39a0ed] px-4 text-xs font-semibold text-[#071521] transition-all outline-none hover:bg-[#75baf2] focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 active:translate-y-px"
    >
      <ArrowLeft size={14} />
      {text}
    </Link>
  );
}
