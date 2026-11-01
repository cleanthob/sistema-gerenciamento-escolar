"use client";

import logoImage from "@/assets/images/school-logo.svg";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { navigationStudentPage } from "@/constants/student";
import { getInitialsFromName } from "@/utils/utils";
import { Logout01Icon } from "@hugeicons/core-free-icons";

import { HugeiconsIcon } from "@hugeicons/react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const currentPath = pathname.replace(/\/+$/, "") || "/";
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

  useEffect(() => {
    function handlePhotoUpdate(event: Event) {
      if (!(event instanceof CustomEvent)) return;
      const photoUrl = event.detail;
      if (photoUrl !== null && typeof photoUrl !== "string") return;
      setStudent((current) => (current ? { ...current, photoUrl } : current));
    }

    window.addEventListener("student-photo-updated", handlePhotoUpdate);
    return () =>
      window.removeEventListener("student-photo-updated", handlePhotoUpdate);
  }, []);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/login");
    router.refresh();
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-svh w-full bg-[#0d1411] text-[#e5eee8]">
        <Sidebar collapsible="icon" className="border-r border-[#293830]">
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
              <span className="hidden size-8 items-center justify-center rounded-md bg-[#39a0ed] text-xs font-semibold text-[#071521] group-data-[collapsible=icon]:inline-flex">
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
                <TooltipProvider>
                  {navigationStudentPage.map((item) => {
                    const isCurrent =
                      item.href === "/dashboard"
                        ? currentPath === item.href
                        : currentPath === item.href ||
                          currentPath.startsWith(`${item.href}/`);

                    return (
                      <SidebarMenuItem key={item.href}>
                        <Tooltip>
                          <TooltipTrigger
                            render={
                              <Link
                                href={item.href}
                                aria-label={item.label}
                                aria-current={isCurrent ? "page" : undefined}
                                className={cn(
                                  "peer/menu-button group/menu-button flex h-10 w-full items-center gap-2 overflow-hidden rounded-md px-3 text-left text-sm outline-none transition-colors hover:bg-[#1b3042] hover:text-[#b8ddf8] focus-visible:ring-2 focus-visible:ring-[#39a0ed] group-data-[collapsible=icon]:size-8 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:gap-0 group-data-[collapsible=icon]:px-2 [&_svg]:size-4 [&_svg]:shrink-0",
                                  isCurrent
                                    ? "bg-[#1b3042] font-medium text-[#b8ddf8]"
                                    : "text-[#dce8f1]",
                                )}
                              />
                            }
                          >
                            <HugeiconsIcon icon={item.icon} strokeWidth={1.8} />
                            <span className="group-data-[collapsible=icon]:hidden">
                              {item.label}
                            </span>
                          </TooltipTrigger>

                          <TooltipContent side="right" className="max-w-64">
                            <p className="text-xs opacity-80">
                              {item.description}
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </SidebarMenuItem>
                    );
                  })}
                </TooltipProvider>
              </SidebarMenu>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter className="border-t border-[#293830] p-4 group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:px-2">
            <div className="flex min-w-0 items-center gap-3 group-data-[collapsible=icon]:justify-center">
              <Avatar
                title={student?.name ?? "Perfil do aluno"}
                className="size-8 bg-[#22372c] text-[11px] font-semibold text-[#b7ddc6]"
              >
                {student?.photoUrl ? (
                  <AvatarImage
                    src={student.photoUrl}
                    alt={`Foto de ${student.name}`}
                  />
                ) : null}
                <AvatarFallback>
                  {student ? getInitialsFromName(student.name) : "…"}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 group-data-[collapsible=icon]:hidden">
                <p className="truncate text-sm font-semibold text-[#dce8df]">
                  {student?.name ?? "Carregando perfil"}
                </p>
                <p className="mt-1 truncate text-xs text-[#a0b2a7]">
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
              className="mt-2 inline-flex min-h-9 w-full items-center gap-2 rounded-md px-2 text-xs font-medium text-[#a0b2a7] hover:bg-[#22372c] hover:text-[#91c6aa] group-data-[collapsible=icon]:h-8 group-data-[collapsible=icon]:min-h-8 group-data-[collapsible=icon]:w-8 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0"
            >
              <HugeiconsIcon icon={Logout01Icon} strokeWidth={1.8} />
              <span className="group-data-[collapsible=icon]:hidden">
                Sair da conta
              </span>
            </button>
          </SidebarFooter>
          <SidebarRail />
        </Sidebar>
        <SidebarInset className="min-h-svh min-w-0 bg-[#0d1411]">
          <header className="sticky top-0 z-20 flex h-16 items-center justify-between gap-3 border-b border-[#293830] bg-[#121b16]/95 px-3 backdrop-blur sm:px-6">
            <div className="flex min-w-0 items-center gap-3">
              <SidebarTrigger className="shrink-0 text-[#a0b2a7]" />
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-[#dce8df]">
                  Portal do estudante
                </p>
                <p className="hidden truncate text-xs text-[#a0b2a7] sm:block">
                  {navigationStudentPage.find(
                    (item) => item.href === currentPath,
                  )
                    ?.label ?? "Área acadêmica"}
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
