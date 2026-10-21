import { cn } from "@/lib/utils";
import "@/styles/globals.css";
import type { Metadata } from "next";
import { Nunito } from "next/font/google";

const nunito = Nunito({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL!),

  title: {
    default: "Sistema Escolar | Gestão Escolar Online",
    template: "%s | Sistema Escolar",
  },

  description:
    "Gerencie informações escolares em uma plataforma web intuitiva. Consulte notas, horários, comunicados e outras informações acadêmicas em um só lugar.",

  applicationName: "Sistema Escolar",

  keywords: [
    "sistema escolar",
    "gestão escolar",
    "plataforma educacional",
    "gerenciamento escolar",
    "informações acadêmicas",
    "notas escolares",
    "horários escolares",
  ],

  openGraph: {
    title: "Sistema Escolar | Gestão Escolar Online",
    description:
      "Uma plataforma web para facilitar o acesso a informações acadêmicas, notas, horários e comunicados escolares.",
    siteName: "Sistema Escolar",
    locale: "pt_BR",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Sistema Escolar | Gestão Escolar Online",
    description:
      "Acesse informações acadêmicas, notas, horários e comunicados em uma plataforma escolar.",
  },

  robots: {
    index: true,
    follow: true,
  },

  category: "education",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      suppressHydrationWarning
      className={cn("h-full", "antialiased", "font-sans", nunito.variable)}
    >
      <body className="flex min-h-screen flex-col">
        <main>{children}</main>
      </body>
    </html>
  );
}
