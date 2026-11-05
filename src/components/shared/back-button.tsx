import Link from "next/link";
import { Button } from "../ui/button";

type BackButtonProps = {
  text?: string;
};

export default function BackButton({ text = "Voltar" }: BackButtonProps) {
  return (
    <Link
      href="/"
      className="mt-8 inline-flex min-h-12 items-center justify-center rounded-full bg-[#63b392] px-7 text-sm font-semibold text-[#0d1913] transition-colors hover:bg-[#91c6aa] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#63b392]"
      passHref
    >
      <Button>{text}</Button>
    </Link>
  );
}
