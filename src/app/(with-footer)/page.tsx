import heroImage from "@/assets/images/hero.jpg";
import logoImage from "@/assets/images/school-logo.svg";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="home-page">
      <header className="home-nav">
        <Image
          src={logoImage}
          alt="Sistema Escolar"
          className="h-auto w-[148px]"
          priority
        />
      </header>

      <section className="home-entry" aria-labelledby="home-title">
        <div className="home-entry-image">
          <Image
            src={heroImage}
            alt="Livros e materiais preparados para um dia de estudos"
            fill
            priority
            sizes="(max-width: 760px) 100vw, 55vw"
          />
        </div>

        <div className="home-entry-content">
          <p className="home-eyebrow">Portal do(a) aluno(a)</p>
          <h1 id="home-title">
            A escola,
            <br />
            mais perto.
          </h1>
          <p className="home-intro">
            Consulte suas informações escolares em um só lugar.
          </p>
          <Link href="/login" className="home-login-link">
            Entrar <ArrowUpRight size={18} aria-hidden="true" />
          </Link>
        </div>
      </section>
    </main>
  );
}
