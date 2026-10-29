import {
  BookOpen01Icon,
  Calendar03Icon,
  ChartColumnIcon,
  Home01Icon,
  UserGroupIcon,
  UserMultipleIcon,
  Wallet01Icon,
} from "@hugeicons/core-free-icons";
import polyglotI18nProvider from "ra-i18n-polyglot";
import portugueseMessages from "ra-language-pt-br";

export const i18nProvider = polyglotI18nProvider(
  () => portugueseMessages,
  "pt",
);

export const navigationAdminPage = [
  {
    label: "Visão geral",
    description: "Acompanhe os principais indicadores e informações da escola.",
    href: "/",
    icon: Home01Icon,
  },
  {
    label: "Equipe escolar",
    description: "Gerencie os usuários e os acessos da equipe escolar.",
    href: "/users",
    icon: UserGroupIcon,
  },
  {
    label: "Alunos",
    description: "Cadastre alunos e consulte seus dados escolares.",
    href: "/students",
    icon: UserMultipleIcon,
  },
  {
    label: "Presença",
    description: "Acompanhe a frequência e as faltas dos alunos.",
    href: "/attendance",
    icon: ChartColumnIcon,
  },
  {
    label: "Notas",
    description: "Consulte e gerencie notas e avaliações escolares.",
    href: "/grades",
    icon: BookOpen01Icon,
  },
  {
    label: "Aulas",
    description: "Consulte e organize as aulas e seus horários.",
    href: "/lessons",
    icon: Calendar03Icon,
  },
  {
    label: "Pagamentos",
    description: "Acompanhe os pagamentos e as pendências financeiras.",
    href: "/payments",
    icon: Wallet01Icon,
  },
  {
    label: "Ocorrências",
    description: "Registre e consulte ocorrências relacionadas aos alunos.",
    href: "/incidents",
    icon: BookOpen01Icon,
  },
];
