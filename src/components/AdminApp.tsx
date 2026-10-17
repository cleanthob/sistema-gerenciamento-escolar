"use client";

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
  UserGroupIcon,
  UserMultipleIcon,
  Wallet01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Box,
  Chip,
  CircularProgress,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import { createTheme } from "@mui/material/styles";
import polyglotI18nProvider from "ra-i18n-polyglot";
import portugueseMessages from "ra-language-pt-br";
import { useEffect, useState, type ReactNode } from "react";
import { Admin, Resource } from "react-admin";
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";
import { adminDataProvider } from "./school-admin-data-provider";
import {
  AttendanceCreate,
  AttendanceEdit,
  AttendanceList,
  GradeCreate,
  GradeList,
  IncidentCreate,
  IncidentEdit,
  IncidentList,
  LessonCreate,
  LessonList,
  PaymentCreate,
  PaymentList,
  StaffList,
  StudentCreate,
  StudentEdit,
  StudentList,
} from "./school-admin-resources";
import Loading from "@/app/loading";

const i18nProvider = polyglotI18nProvider(() => portugueseMessages, "pt");
const navigation = [
  { label: "Visão geral", href: "/", icon: Home01Icon },
  { label: "Equipe escolar", href: "/users", icon: UserGroupIcon },
  { label: "Alunos", href: "/students", icon: UserMultipleIcon },
  { label: "Presença", href: "/attendance", icon: ChartColumnIcon },
  { label: "Notas", href: "/grades", icon: BookOpen01Icon },
  { label: "Aulas", href: "/lessons", icon: Calendar03Icon },
  { label: "Pagamentos", href: "/payments", icon: Wallet01Icon },
  { label: "Ocorrências", href: "/incidents", icon: BookOpen01Icon },
];

type Overview = {
  activeStudents: number;
  totalStudents: number;
  activeStaff: number;
  totalStaff: number;
  attendanceRate: number | null;
  attendanceCount: number;
  averageGrade: number | null;
  pendingGuardianCalls: number;
  absentToday: number;
  overduePayments: number;
  months: { month: string; value: number | null }[];
  lessonsToday: {
    id: string;
    subject: string;
    teacher: string;
    room: string;
    startsAt: string;
    studentName: string;
    className: string;
  }[];
};

type AccountProfile = { name: string; role: string };

function AdminLayout({ children }: { children: ReactNode }) {
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

function AdminDashboard() {
  const [overview, setOverview] = useState<Overview | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    fetch("/api/admin/overview")
      .then(async (response) => {
        const payload = await response.json();
        if (!response.ok)
          throw new Error(
            payload.error ?? "Não foi possível carregar os indicadores.",
          );
        return payload.data as Overview;
      })
      .then((data) => {
        if (active) setOverview(data);
      })
      .catch((reason: unknown) => {
        if (active)
          setError(
            reason instanceof Error
              ? reason.message
              : "Falha ao carregar indicadores.",
          );
      });
    return () => {
      active = false;
    };
  }, []);

  const today = new Date();
  const cards = overview
    ? [
        {
          label: "Alunos ativos",
          value: overview.activeStudents,
          note: `${overview.totalStudents} matrículas cadastradas`,
          color: "#28705b",
        },
        {
          label: "Equipe ativa",
          value: overview.activeStaff,
          note: `${overview.totalStaff} contas de equipe`,
          color: "#567b96",
        },
        {
          label: "Frequência registrada",
          value:
            overview.attendanceRate === null
              ? "—"
              : `${overview.attendanceRate}%`,
          note: `${overview.attendanceCount} registros neste ano`,
          color: "#bb8a38",
        },
        {
          label: "Contato pendente",
          value: overview.pendingGuardianCalls,
          note: "Responsáveis a contatar",
          color: "#b65b40",
        },
      ]
    : [];
  const followUps = overview
    ? [
        {
          label: "Contato com responsáveis pendente",
          count: overview.pendingGuardianCalls,
          note: "Ocorrências que exigem contato",
          color: "#b65b40",
        },
        {
          label: "Faltas de hoje",
          count: overview.absentToday,
          note: "Registros de ausência",
          color: "#bb8a38",
        },
        {
          label: "Mensalidades vencidas",
          count: overview.overduePayments,
          note: "Pendentes após o vencimento",
          color: "#567b96",
        },
      ]
    : [];

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 1440,
        mx: "auto",
        px: { xs: 0, sm: 3, lg: 5 },
        pb: { xs: 3, md: 5 },
      }}
    >
      <Box
        sx={{
          px: { xs: 2.5, sm: 3, lg: 4 },
          py: { xs: 3, sm: 4 },
          bgcolor: "#174f43",
          color: "#fff",
          borderBottom: "4px solid #c16a4b",
        }}
      >
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          sx={{
            maxWidth: 1360,
            mx: "auto",
            justifyContent: "space-between",
            alignItems: { xs: "flex-start", sm: "center" },
          }}
        >
          <Box>
            <Typography
              variant="overline"
              sx={{
                color: "#d4e5d9",
                fontWeight: 700,
                letterSpacing: "0.14em",
              }}
            >
              {new Intl.DateTimeFormat("pt-BR", { dateStyle: "full" }).format(
                today,
              )}
            </Typography>
            <Typography
              variant="h4"
              sx={{ mt: 0.5, fontWeight: 700, fontSize: { xs: 28, sm: 34 } }}
            >
              Resumo da escola
            </Typography>
            <Typography variant="body2" sx={{ mt: 1, color: "#d4e5d9" }}>
              Indicadores calculados a partir dos registros do banco.
            </Typography>
          </Box>
          <Chip
            label={String(today.getFullYear())}
            sx={{
              bgcolor: "rgba(255,255,255,0.12)",
              color: "#fff",
              border: "1px solid rgba(255,255,255,0.24)",
              fontWeight: 700,
            }}
          />
        </Stack>
      </Box>
      <Box
        sx={{ px: { xs: 2, sm: 3, lg: 4 }, pt: 3, maxWidth: 1440, mx: "auto" }}
      >
        {error ? (
          <Typography role="alert" color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        ) : null}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "repeat(2, minmax(0, 1fr))",
              lg: "repeat(4, minmax(0, 1fr))",
            },
            bgcolor: "#fff",
            border: "1px solid #e1e8df",
            borderRadius: 1,
          }}
        >
          {overview ? (
            cards.map((item, index) => (
              <Box
                key={item.label}
                sx={{
                  minWidth: 0,
                  px: { xs: 2, sm: 2.5 },
                  py: 2.5,
                  borderRight: {
                    xs: index % 2 === 0 ? "1px solid #e8ede7" : "none",
                    lg: index < cards.length - 1 ? "1px solid #e8ede7" : "none",
                  },
                  borderBottom: {
                    xs: index < 2 ? "1px solid #e8ede7" : "none",
                    lg: "none",
                  },
                }}
              >
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ display: "block", fontWeight: 600 }}
                >
                  {item.label}
                </Typography>
                <Typography
                  sx={{
                    mt: 1,
                    color: item.color,
                    fontSize: { xs: 25, sm: 30 },
                    fontWeight: 750,
                    lineHeight: 1.1,
                  }}
                >
                  {item.value}
                </Typography>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ display: { xs: "none", sm: "block" }, mt: 1 }}
                >
                  {item.note}
                </Typography>
              </Box>
            ))
          ) : (
            <Box sx={{ gridColumn: "1 / -1", py: 4, textAlign: "center" }}>
              {error ? (
                <Typography color="text.secondary">
                  Indicadores indisponíveis.
                </Typography>
              ) : (
                <CircularProgress size={24} />
              )}
            </Box>
          )}
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              lg: "minmax(0, 1.6fr) minmax(300px, 0.8fr)",
            },
            gap: { xs: 3, lg: 4 },
            mt: 4,
          }}
        >
          <Box
            component="section"
            aria-labelledby="attendance-title"
            sx={{ minWidth: 0 }}
          >
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={1}
              sx={{
                mb: 2,
                justifyContent: "space-between",
                alignItems: { xs: "flex-start", sm: "flex-end" },
              }}
            >
              <Box>
                <Typography
                  variant="overline"
                  sx={{
                    color: "#b65b40",
                    fontWeight: 700,
                    letterSpacing: "0.12em",
                  }}
                >
                  INDICADOR ACADÊMICO
                </Typography>
                <Typography
                  id="attendance-title"
                  variant="h6"
                  sx={{ color: "#203b34", fontWeight: 700 }}
                >
                  Frequência por mês
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Média atual{" "}
                <Box component="strong" sx={{ color: "#174f43", ml: 0.5 }}>
                  {overview?.attendanceRate == null
                    ? "—"
                    : `${overview.attendanceRate}%`}
                </Box>
              </Typography>
            </Stack>
            <Box
              sx={{
                border: "1px solid #e1e8df",
                borderRadius: 1,
                bgcolor: "#fff",
                p: { xs: 2, sm: 3 },
              }}
            >
              {overview?.months.some((month) => month.value !== null) ? (
                <Box
                  role="img"
                  aria-label="Gráfico mensal de frequência calculado a partir do banco"
                  sx={{
                    display: "grid",
                    gridTemplateColumns: `repeat(${overview.months.length}, minmax(0, 1fr))`,
                    alignItems: "end",
                    gap: 1,
                    height: { xs: 220, sm: 270 },
                    borderBottom: "1px solid #e5ebe4",
                    pt: 2,
                  }}
                >
                  {overview.months.map((item, index) => (
                    <Stack
                      key={`${item.month}-${index}`}
                      spacing={1}
                      sx={{
                        height: "100%",
                        minWidth: 0,
                        alignItems: "center",
                        justifyContent: "flex-end",
                      }}
                    >
                      <Typography
                        variant="caption"
                        sx={{ color: "#657970", fontSize: 11, fontWeight: 700 }}
                      >
                        {item.value === null ? "—" : `${item.value}%`}
                      </Typography>
                      <Box
                        sx={{
                          width: "min(100%, 38px)",
                          height:
                            item.value === null
                              ? 2
                              : `${Math.max(item.value, 2)}%`,
                          bgcolor: item.value === null ? "#e8ede7" : "#78a48e",
                          borderRadius: "4px 4px 0 0",
                        }}
                      />
                      <Typography variant="caption" sx={{ color: "#82918a" }}>
                        {item.month}
                      </Typography>
                    </Stack>
                  ))}
                </Box>
              ) : (
                <Typography
                  color="text.secondary"
                  sx={{ py: 10, textAlign: "center" }}
                >
                  {overview
                    ? "O gráfico aparecerá após os primeiros registros de presença."
                    : "Carregando registros de presença…"}
                </Typography>
              )}
            </Box>
            <Box
              component="section"
              aria-labelledby="followups-title"
              sx={{ mt: 4 }}
            >
              <Typography
                variant="overline"
                sx={{
                  color: "#b65b40",
                  fontWeight: 700,
                  letterSpacing: "0.12em",
                }}
              >
                ACOMPANHAMENTO
              </Typography>
              <Typography
                id="followups-title"
                variant="h6"
                sx={{ mb: 1.5, color: "#203b34", fontWeight: 700 }}
              >
                Itens para revisar
              </Typography>
              <Stack
                divider={<Divider flexItem />}
                sx={{
                  borderTop: "1px solid #e1e8df",
                  borderBottom: "1px solid #e1e8df",
                  bgcolor: "#fff",
                  px: 2,
                }}
              >
                {followUps.map((item) => (
                  <Stack
                    key={item.label}
                    direction="row"
                    spacing={2}
                    sx={{ py: 1.75, alignItems: "center" }}
                  >
                    <Box
                      sx={{
                        width: 3,
                        alignSelf: "stretch",
                        borderRadius: 3,
                        bgcolor: item.color,
                      }}
                    />
                    <Box sx={{ minWidth: 0, flex: 1 }}>
                      <Typography
                        variant="body2"
                        sx={{ color: "#29483e", fontWeight: 700 }}
                      >
                        {item.label}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {item.note}
                      </Typography>
                    </Box>
                    <Typography
                      sx={{ color: item.color, fontSize: 20, fontWeight: 750 }}
                    >
                      {item.count}
                    </Typography>
                  </Stack>
                ))}
              </Stack>
            </Box>
          </Box>
          <Box
            component="aside"
            aria-labelledby="schedule-title"
            sx={{ minWidth: 0 }}
          >
            <Typography
              variant="overline"
              sx={{
                color: "#b65b40",
                fontWeight: 700,
                letterSpacing: "0.12em",
              }}
            >
              OPERAÇÃO ESCOLAR
            </Typography>
            <Typography
              id="schedule-title"
              variant="h6"
              sx={{ color: "#203b34", fontWeight: 700 }}
            >
              Aulas de hoje
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mt: 0.5, mb: 2 }}
            >
              {overview?.lessonsToday.length
                ? `${overview.lessonsToday.length} aula(s) consultada(s) no banco`
                : "Nenhuma aula cadastrada para hoje"}
            </Typography>
            <Stack sx={{ borderTop: "1px solid #e1e8df" }}>
              {overview?.lessonsToday.map((item) => (
                <Stack
                  key={item.id}
                  direction="row"
                  spacing={1.5}
                  sx={{
                    py: 2,
                    borderBottom: "1px solid #e1e8df",
                    alignItems: "flex-start",
                  }}
                >
                  <Box sx={{ width: 46, flexShrink: 0, pt: 0.25 }}>
                    <Typography
                      sx={{ color: "#52685e", fontSize: 12, fontWeight: 700 }}
                    >
                      {new Intl.DateTimeFormat("pt-BR", {
                        timeStyle: "short",
                      }).format(new Date(item.startsAt))}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      width: 3,
                      flexShrink: 0,
                      bgcolor: "#28705b",
                      borderRadius: 2,
                    }}
                  />
                  <Box sx={{ minWidth: 0 }}>
                    <Typography
                      variant="body2"
                      sx={{ color: "#29483e", fontWeight: 700 }}
                    >
                      {item.subject}
                    </Typography>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ display: "block", mt: 0.5 }}
                    >
                      {item.studentName} · {item.className} · {item.room}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {item.teacher}
                    </Typography>
                  </Box>
                </Stack>
              ))}
            </Stack>
            <Box
              sx={{
                mt: 3,
                p: 2,
                borderLeft: "3px solid #c16a4b",
                bgcolor: "#fff4ef",
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  color: "#9b5038",
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                }}
              >
                ORIGEM DOS DADOS
              </Typography>
              <Typography variant="body2" sx={{ mt: 0.5, color: "#704b3e" }}>
                Indicadores calculados a partir dos registros atuais do banco
                escolar.
              </Typography>
            </Box>
          </Box>
        </Box>
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{
            display: "block",
            mt: 4,
            textAlign: { xs: "left", sm: "right" },
          }}
        >
          Painel administrativo · Sistema Escolar
        </Typography>
      </Box>
    </Box>
  );
}

const adminTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#174f43",
      dark: "#103d34",
      light: "#43806c",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#b65b40",
      dark: "#873f2c",
      light: "#d48768",
      contrastText: "#ffffff",
    },
    background: { default: "#f3f6ef", paper: "#ffffff" },
    text: { primary: "#203b34", secondary: "#687b71" },
    divider: "#e1e8df",
  },
  shape: { borderRadius: 8 },
  typography: {
    fontFamily: "var(--font-sans), sans-serif",
    button: { fontWeight: 600, textTransform: "none" },
    h1: { fontWeight: 650 },
    h2: { fontWeight: 650 },
    h3: { fontWeight: 650 },
    h4: { fontWeight: 650 },
    h5: { fontWeight: 650 },
    h6: { fontWeight: 650 },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: { body: { backgroundColor: "#f3f6ef" } },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "#ffffff",
          color: "#203b34",
          boxShadow: "none",
          borderBottom: "1px solid #e1e8df",
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: "#ffffff",
          borderRight: "1px solid #e1e8df",
          backgroundImage: "linear-gradient(180deg, #ffffff 0%, #fbfcf9 100%)",
          boxSizing: "border-box",
          width: "min(280px, calc(100vw - 1rem))",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          boxShadow: "none",
          border: "1px solid #e1e8df",
        },
      },
    },
    MuiButton: {
      styleOverrides: { root: { borderRadius: 6, fontWeight: 600 } },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          "&:nth-of-type(even)": { backgroundColor: "#fbfcf9" },
          "&:hover": { backgroundColor: "#f1f6f0" },
        },
      },
    },
    MuiTableCell: { styleOverrides: { root: { borderColor: "#e8ede7" } } },
  },
});

export default function AdminApp() {
  return (
    <Admin
      i18nProvider={i18nProvider}
      dataProvider={adminDataProvider}
      theme={adminTheme}
      title="Sistema Escolar"
      dashboard={AdminDashboard}
      layout={AdminLayout}
    >
      <Resource
        name="users"
        list={StaffList}
        recordRepresentation="name"
        options={{ label: "Equipe escolar" }}
      />
      <Resource
        name="students"
        list={StudentList}
        create={StudentCreate}
        edit={StudentEdit}
        recordRepresentation="name"
        options={{ label: "Alunos" }}
      />
      <Resource
        name="attendance"
        list={AttendanceList}
        create={AttendanceCreate}
        edit={AttendanceEdit}
        options={{ label: "Presença" }}
      />
      <Resource
        name="grades"
        list={GradeList}
        create={GradeCreate}
        options={{ label: "Notas" }}
      />
      <Resource
        name="lessons"
        list={LessonList}
        create={LessonCreate}
        options={{ label: "Aulas" }}
      />
      <Resource
        name="payments"
        list={PaymentList}
        create={PaymentCreate}
        options={{ label: "Pagamentos" }}
      />
      <Resource
        name="incidents"
        list={IncidentList}
        create={IncidentCreate}
        edit={IncidentEdit}
        options={{ label: "Punições e responsáveis" }}
      />
    </Admin>
  );
}
