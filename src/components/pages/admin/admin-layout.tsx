"use client";

import Loading from "@/app/loading";
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
import { HugeiconsIcon } from "@hugeicons/react";

import { useEffect, useState, type ReactNode } from "react";
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
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
        if (active) navigate("/unauthorized");
        setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [navigate]);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    navigate("/login/admin");
  }

  if (loading) return <Loading />;

  return (
    <SidebarProvider>
      <div className="flex min-h-svh w-full min-w-0 bg-[#f3f6ef] text-[#203b34]">
        <Sidebar collapsible="icon" className="border-r border-[#e1e8df]">
          <SidebarHeader className="items-center px-4 py-5 group-data-[collapsible=icon]:px-2">
            <RouterLink
              to="/"
              aria-label="Sistema Escolar, visão geral"
              className="flex min-h-10 w-full items-center group-data-[collapsible=icon]:justify-center"
            >
              <span className="group-data-[collapsible=icon]:hidden">
                <span className="block text-sm font-bold text-[#174f43]">
                  SISTEMA
                </span>
                <span className="block text-xs font-medium text-[#718179]">
                  ESCOLAR
                </span>
              </span>
              <span className="hidden size-8 items-center justify-center rounded-md bg-[#174f43] text-xs font-bold text-white group-data-[collapsible=icon]:inline-flex">
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
                {navigation.map((item) => (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      render={<RouterLink to={item.href} />}
                      isActive={
                        item.href === "/"
                          ? pathname === "/"
                          : pathname.startsWith(item.href)
                      }
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
                title={profile?.name ?? "Conta administrativa"}
                className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#e8f1e9] text-[11px] font-semibold text-[#205b49]"
              >
                {profile?.name
                  ? profile.name
                      .split(/\s+/)
                      .slice(0, 2)
                      .map((part) => part[0])
                      .join("")
                      .toLocaleUpperCase("pt-BR")
                  : "…"}
              </span>
              <div className="min-w-0 group-data-[collapsible=icon]:hidden">
                <p className="truncate text-sm font-semibold text-[#29483e]">
                  {profile?.name ?? "Carregando conta"}
                </p>
                <p className="truncate text-xs text-[#82918a]">
                  {profile?.role ?? " "}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={logout}
              title="Sair da conta"
              className="mt-2 inline-flex min-h-9 w-full items-center gap-2 rounded-md px-2 text-xs font-medium text-[#527068] hover:bg-[#f2f5f1] hover:text-[#174f43] group-data-[collapsible=icon]:hidden"
            >
              Sair da conta
            </button>
          </SidebarFooter>
          <SidebarRail />
        </Sidebar>
        <SidebarInset
          className="min-h-svh min-w-0 overflow-x-hidden bg-[#f3f6ef]}"
          style={{ backgroundColor: "#f3f6ef" }}
        >
          <header className="sticky top-0 z-20 flex h-16 min-w-0 items-center justify-between gap-3 border-b border-[#e1e8df] bg-white/95 px-3 backdrop-blur sm:px-6">
            <div className="flex min-w-0 items-center gap-2 sm:gap-3">
              <SidebarTrigger className="shrink-0 text-[#52685e]" />
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-[#29483e]">
                  Sistema Escolar
                </p>
                <p className="hidden truncate text-xs text-[#82918a] sm:block">
                  {navigation.find(
                    (item) =>
                      item.href === pathname ||
                      (item.href !== "/" && pathname.startsWith(item.href)),
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
