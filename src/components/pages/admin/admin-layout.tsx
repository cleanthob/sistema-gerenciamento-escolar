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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { Pencil } from "lucide-react";
import { useRouter } from "next/navigation";

import Image from "next/image";
import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type ReactNode,
} from "react";
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
  const photoInputRef = useRef<HTMLInputElement>(null);
  const [photoBusy, setPhotoBusy] = useState(false);
  const [photoError, setPhotoError] = useState("");

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

  async function savePhoto(photoUrl: string) {
    setPhotoBusy(true);
    setPhotoError("");
    try {
      const response = await fetch("/api/admin/me/photo", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ photoUrl }),
      });
      const payload = (await response.json()) as {
        error?: string;
        photoUrl?: string | null;
      };
      if (!response.ok) {
        throw new Error(payload.error ?? "Não foi possível salvar a foto.");
      }
      setProfile((current) =>
        current ? { ...current, photoUrl: payload.photoUrl ?? null } : current,
      );
    } catch (reason) {
      setPhotoError(
        reason instanceof Error &&
          !(reason instanceof TypeError || reason instanceof SyntaxError)
          ? reason.message
          : "Não foi possível enviar a foto. Tente selecionar o arquivo novamente.",
      );
    } finally {
      setPhotoBusy(false);
    }
  }

  function handlePhotoChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setPhotoError("Selecione uma imagem PNG, JPG ou WebP.");
      return;
    }
    if (file.size > 1_000_000) {
      setPhotoError("A foto deve ter no máximo 1 MB.");
      return;
    }

    setPhotoError("");
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result !== "string") {
        setPhotoError("O navegador não conseguiu processar esta imagem.");
        return;
      }
      void savePhoto(reader.result);
    };
    reader.onerror = () =>
      setPhotoError("O arquivo não pôde ser lido. Selecione-o novamente.");
    reader.readAsDataURL(file);
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
              <button
                type="button"
                title="Alterar foto do perfil"
                aria-label="Alterar foto do perfil"
                disabled={photoBusy}
                onClick={() => photoInputRef.current?.click()}
                className="group/admin-photo relative size-8 shrink-0 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-[#39a0ed] disabled:cursor-wait"
              >
                <Avatar className="size-8 bg-[#22372c] text-[11px] font-semibold text-[#b7ddc6]">
                  {profile?.photoUrl ? (
                    <AvatarImage
                      src={profile.photoUrl}
                      alt={`Foto de ${profile.name}`}
                    />
                  ) : null}
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
                <span className="absolute inset-0 flex items-center justify-center rounded-full bg-[#071521]/65 text-white opacity-0 transition-opacity group-hover/admin-photo:opacity-100 group-focus-visible/admin-photo:opacity-100 [@media(hover:none)]:opacity-100">
                  <Pencil aria-hidden="true" className="size-3.5" />
                </span>
              </button>
              <input
                ref={photoInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp"
                hidden
                onChange={handlePhotoChange}
              />
              <div className="min-w-0 group-data-[collapsible=icon]:hidden">
                <p className="truncate text-sm font-semibold text-[#dce8df]">
                  {profile?.name ?? "Carregando conta"}
                </p>
              </div>
            </div>
            {photoError ? (
              <p
                role="alert"
                aria-live="assertive"
                className="mt-2 rounded-md border border-red-400/40 bg-red-950/40 px-2 py-1.5 text-xs text-red-200"
              >
                {photoError}
              </p>
            ) : null}
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
