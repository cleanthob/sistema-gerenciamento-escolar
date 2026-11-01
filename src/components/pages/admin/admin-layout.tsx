"use client";

import Loading from "@/app/loading";
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { navigationAdminPage } from "@/constants/admin";
import { Logout01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

import Image from "next/image";
import { useEffect, useState, type ReactNode } from "react";
import { Link as RouterLink, useLocation } from "react-router-dom";

function matchesAdminRoute(currentPath: string, href: string) {
  return href === "/"
    ? currentPath === "/"
    : currentPath === href || currentPath.startsWith(`${href}/`);
}

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const currentPath = pathname.replace(/\/+$/, "") || "/";

  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [profile, setProfile] = useState<AccountProfile | null>(null);

  useEffect(() => {
    let active = true;
    fetch("/api/auth/session")
      .then((response) => (response.ok ? response.json() : Promise.reject()))
      .then((payload) => {
        if (active) setProfile(payload.user);
        setLoading(false);
      })
      .catch(() => {
        if (active) router.push("/unauthorized");
        setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [router]);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });

    router.push("/");
  }

  if (loading) return <Loading />;

  return (
    <SidebarProvider>
      <div className="flex min-h-svh w-full bg-[#0d1411] text-[#e5eee8]">
        <Sidebar collapsible="icon" className="border-r border-[#293830]">
          <SidebarHeader className="items-center px-4 py-5 group-data-[collapsible=icon]:px-2">
            <RouterLink
              to="/"
              aria-label="Sistema Escolar, visão geral"
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
            </RouterLink>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel className="px-2 text-[11px] font-semibold uppercase tracking-[0.12em]">
                Administração
              </SidebarGroupLabel>
              <SidebarMenu>
                <TooltipProvider>
                  {navigationAdminPage.map((item) => {
                    const isCurrent = matchesAdminRoute(
                      currentPath,
                      item.href,
                    );

                    return (
                      <SidebarMenuItem key={item.href}>
                        <Tooltip>
                          <TooltipTrigger
                            render={
                              <RouterLink
                                to={item.href}
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
                title={profile?.name ?? "Conta administrativa"}
                className="size-8 bg-[#22372c] text-[11px] font-semibold text-[#b7ddc6]"
              >
                <AvatarFallback>
                  {profile?.name
                  ? profile.name
                      .split(/\s+/)
                      .slice(0, 2)
                      .map((part) => part[0])
                      .join("")
                      .toLocaleUpperCase("pt-BR")
                    : "…"}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 group-data-[collapsible=icon]:hidden">
                <p className="truncate text-sm font-semibold text-[#dce8df]">
                  {profile?.name ?? "Carregando conta"}
                </p>
                <p className="truncate text-xs text-[#a0b2a7]">
                  {profile?.role ?? " "}
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
        <SidebarInset
          className="min-h-svh min-w-0 bg-[#0d1411]"
        >
          <header className="sticky top-0 z-20 flex h-16 items-center justify-between gap-3 border-b border-[#293830] bg-[#121b16]/95 px-3 backdrop-blur sm:px-6">
            <div className="flex min-w-0 items-center gap-3">
              <SidebarTrigger className="shrink-0 text-[#a0b2a7]" />
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-[#dce8df]">
                  Painel administrativo
                </p>
                <p className="hidden truncate text-xs text-[#a0b2a7] sm:block">
                  {navigationAdminPage.find(
                    (item) => matchesAdminRoute(currentPath, item.href),
                  )?.label ?? "Painel administrativo"}
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
