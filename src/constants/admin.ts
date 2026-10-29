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

export const navigation = [
  { label: "Visão geral", href: "/", icon: Home01Icon },
  { label: "Equipe escolar", href: "/users", icon: UserGroupIcon },
  { label: "Alunos", href: "/students", icon: UserMultipleIcon },
  { label: "Presença", href: "/attendance", icon: ChartColumnIcon },
  { label: "Notas", href: "/grades", icon: BookOpen01Icon },
  { label: "Aulas", href: "/lessons", icon: Calendar03Icon },
  { label: "Pagamentos", href: "/payments", icon: Wallet01Icon },
  { label: "Ocorrências", href: "/incidents", icon: BookOpen01Icon },
] as const;
