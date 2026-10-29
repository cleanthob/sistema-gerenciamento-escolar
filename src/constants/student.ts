import {
  BookOpen01Icon,
  Calendar03Icon,
  ChartColumnIcon,
  Home01Icon,
  Logout01Icon,
  Wallet01Icon,
} from "@hugeicons/core-free-icons";

export const navigation = [
  { label: "Visão geral", href: "/dashboard", icon: Home01Icon },
  { label: "Notas", href: "/dashboard/grades", icon: BookOpen01Icon },
  { label: "Pagamentos", href: "/dashboard/payments", icon: Wallet01Icon },
  { label: "Frequência", href: "/dashboard/attendance", icon: ChartColumnIcon },
  { label: "Aulas do dia", href: "/dashboard/classes", icon: Calendar03Icon },
];
