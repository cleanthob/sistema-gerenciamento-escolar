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
import { navigation } from "@/constants/student";
import { getInitialsFromName } from "@/utils/utils";
import { Logout01Icon } from "@hugeicons/core-free-icons";

import { HugeiconsIcon } from "@hugeicons/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [student, setStudent] = useState<StudentProfile | null>(null);

  useEffect(() => {
    let active = true;
    fetch("/api/auth/session")
      .then((response) => (response.ok ? response.json() : Promise.reject()))
      .then((payload) => {
        if (active) setStudent(payload.user);
      })
      .catch(() => {
        if (active) router.replace("/unauthorized");
      });
    return () => {
      active = false;
    };
  }, [router]);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/login");
    router.refresh();
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
                title={student?.name ?? "Perfil do aluno"}
                className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#e8f1e9] text-[11px] font-semibold text-[#205b49]"
              >
                {student ? getInitialsFromName(student.name) : "…"}
              </span>
              <div className="min-w-0 group-data-[collapsible=icon]:hidden">
                <p className="truncate text-sm font-semibold text-[#29483e]">
                  {student?.name ?? "Carregando perfil"}
                </p>
                <p className="mt-1 truncate text-xs text-[#82918a]">
                  {student
                    ? `${student.grade} · Turma ${student.className}`
                    : " "}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={logout}
              title="Sair da conta"
              className="mt-2 inline-flex min-h-9 w-full items-center gap-2 rounded-md px-2 text-xs font-medium text-[#527068] hover:bg-[#f2f5f1] hover:text-[#174f43] group-data-[collapsible=icon]:h-8 group-data-[collapsible=icon]:min-h-8 group-data-[collapsible=icon]:w-8 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0"
            >
              <HugeiconsIcon icon={Logout01Icon} strokeWidth={1.8} />
              <span className="group-data-[collapsible=icon]:hidden">
                Sair da conta
              </span>
            </button>
          </SidebarFooter>
          <SidebarRail />
        </Sidebar>
        <SidebarInset className="min-h-svh min-w-0 bg-[#f4f6f1]">
          <header className="sticky top-0 z-20 flex h-16 items-center justify-between gap-3 border-b border-[#e1e8df] bg-white/95 px-3 backdrop-blur sm:px-6">
            <div className="flex min-w-0 items-center gap-3">
              <SidebarTrigger className="shrink-0 text-[#52685e]" />
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-[#29483e]">
                  Portal do estudante
                </p>
                <p className="hidden truncate text-xs text-[#82918a] sm:block">
                  {navigation.find((item) => item.href === pathname)?.label ??
                    "Área acadêmica"}
                </p>
              </div>
            </div>
          </header>
          <div className="min-w-0 flex-1">{children}</div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
