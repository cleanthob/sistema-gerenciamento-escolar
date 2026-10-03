"use client";

import logoImage from "@/assets/images/logo.svg";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  BookOpen01Icon,
  Calendar03Icon,
  ChartColumnIcon,
  Home01Icon,
  Logout01Icon,
  Wallet01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

const navigation = [
  { label: "Visão geral", href: "/dashboard", icon: Home01Icon },
  { label: "Notas", href: "/dashboard/grades", icon: BookOpen01Icon },
  { label: "Pagamentos", href: "/dashboard/payments", icon: Wallet01Icon },
  { label: "Frequência", href: "/dashboard/attendance", icon: ChartColumnIcon },
  { label: "Aulas do dia", href: "/dashboard/classes", icon: Calendar03Icon },
];

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const currentPage = navigation.find((item) => item.href === pathname);

  if (pathname === "/dashboard") {
    return <SidebarProvider>{children}</SidebarProvider>;
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-svh w-full bg-[#f4f6f1] text-[#203b34]">
        <Sidebar collapsible="icon" className="border-r border-[#e1e8df]">
          <SidebarHeader className="items-center px-4 py-5 group-data-[collapsible=icon]:px-2">
            <Link
              href="/"
              aria-label="Sistema Escolar, página inicial"
              className="flex min-h-10 w-full items-center group-data-[collapsible=icon]:justify-center"
            >
              <Image
                src={logoImage}
                alt="Sistema Escolar"
                className="h-auto w-34.5 group-data-[collapsible=icon]:hidden"
                priority
              />
              <span className="hidden size-8 items-center justify-center rounded-md bg-[#174f43] text-xs font-semibold text-white group-data-[collapsible=icon]:inline-flex">
                SE
              </span>
            </Link>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel className="px-2 text-[11px] font-semibold uppercase tracking-[0.12em]">
                Área do estudante
              </SidebarGroupLabel>
              <SidebarMenu>
                {navigation.map((item) => (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      render={<Link href={item.href} />}
                      isActive={pathname === item.href}
                      tooltip={item.label}
                      className="h-10 px-3 text-sm data-active:bg-[#e8f1e9] data-active:text-[#205b49]"
                    >
                      <HugeiconsIcon icon={item.icon} strokeWidth={1.8} />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter className="border-t border-[#e1e8df] p-4 group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:px-2">
            <div className="flex min-w-0 items-center gap-3 group-data-[collapsible=icon]:justify-center">
              <span
                title="Ana Beatriz Costa, 8º ano, Turma B"
                className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#e8f1e9] text-[11px] font-semibold text-[#205b49]"
              >
                AB
              </span>
              <div className="min-w-0 group-data-[collapsible=icon]:hidden">
                <p className="truncate text-sm font-semibold text-[#29483e]">
                  Ana Beatriz Costa
                </p>
                <p className="mt-1 truncate text-xs text-[#82918a]">
                  8º ano · Turma B
                </p>
              </div>
            </div>
            <Link
              href="/login"
              title="Sair da conta"
              className="mt-2 inline-flex min-h-9 w-full items-center gap-2 rounded-md px-2 text-xs font-medium text-[#527068] hover:bg-[#f2f5f1] hover:text-[#174f43] group-data-[collapsible=icon]:h-8 group-data-[collapsible=icon]:min-h-8 group-data-[collapsible=icon]:w-8 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0"
            >
              <HugeiconsIcon icon={Logout01Icon} strokeWidth={1.8} />
              <span className="group-data-[collapsible=icon]:hidden">
                Sair da conta
              </span>
            </Link>
          </SidebarFooter>
          <SidebarRail />
        </Sidebar>

        <SidebarInset className="min-h-svh bg-[#f4f6f1]">
          <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-[#e1e8df] bg-white/95 px-4 backdrop-blur sm:px-7">
            <div className="flex items-center gap-3">
              <SidebarTrigger className="text-[#52685e]" />
              <div>
                <p className="text-sm font-semibold text-[#29483e]">
                  Portal do estudante
                </p>
                <p className="hidden text-xs text-[#82918a] sm:block">
                  {currentPage?.label}
                </p>
              </div>
            </div>
            <span className="shrink-0 rounded-full border border-[#ead7c9] bg-[#fff7f0] px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-widest text-[#a45c40] sm:px-3">
              <span className="sm:hidden">Demo</span>
              <span className="hidden sm:inline">Dados demonstrativos</span>
            </span>
          </header>
          {children}
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
