import {
  BookOpen01Icon,
  Calendar03Icon,
  ChartColumnIcon,
  Home01Icon,
  Wallet01Icon,
} from "@hugeicons/core-free-icons";

export const navigationStudentPage = [
  {
    label: "Visão geral",
    description: "Consulte um resumo das suas informações escolares.",
    href: "/dashboard",
    icon: Home01Icon,
  },
  {
    label: "Notas",
    description: "Consulte suas notas e acompanhe seu desempenho acadêmico.",
    href: "/dashboard/grades",
    icon: BookOpen01Icon,
  },
  {
    label: "Pagamentos",
    description: "Consulte seus pagamentos e eventuais pendências financeiras.",
    href: "/dashboard/payments",
    icon: Wallet01Icon,
  },
  {
    label: "Frequência",
    description: "Acompanhe sua frequência e consulte suas faltas.",
    href: "/dashboard/attendance",
    icon: ChartColumnIcon,
  },
  {
    label: "Aulas do dia",
    description: "Consulte as aulas programadas para o dia.",
    href: "/dashboard/classes",
    icon: Calendar03Icon,
  },
];
