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
  ChartColumnIcon,
  Home01Icon,
  UserGroupIcon,
  UserMultipleIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import { createTheme } from "@mui/material/styles";
import {
  Admin,
  List,
  Pagination,
  Resource,
  SearchInput,
  useListContext,
} from "react-admin";
import { Link as RouterLink, useLocation } from "react-router-dom";
import {
  AttendanceCreate,
  AttendanceEdit,
  AttendanceList,
  IncidentCreate,
  IncidentEdit,
  IncidentList,
  schoolDataProvider,
  StudentCreate,
  StudentEdit,
  StudentList,
} from "./school-admin-resources";
import polyglotI18nProvider from "ra-i18n-polyglot";
import portugueseMessages from "ra-language-pt-br";

type StaffMember = {
  id: number;
  name: string;
  role: string;
  department: string;
  email: string;
  phone: string;
  status: "Ativo" | "Afastado";
  initials: string;
  color: string;
};

const i18nProvider = polyglotI18nProvider(() => portugueseMessages, "pt");

const staffMembers: StaffMember[] = [
  {
    id: 1,
    name: "Mariana Oliveira",
    role: "Diretora",
    department: "Direção",
    email: "mariana.oliveira@escola.edu.br",
    phone: "(11) 3456-7801",
    status: "Ativo",
    initials: "MO",
    color: "#28705b",
  },
  {
    id: 2,
    name: "Rafael Santos",
    role: "Coordenador pedagógico",
    department: "Coordenação",
    email: "rafael.santos@escola.edu.br",
    phone: "(11) 3456-7802",
    status: "Ativo",
    initials: "RS",
    color: "#567b96",
  },
  {
    id: 3,
    name: "Camila Ferreira",
    role: "Professora de Matemática",
    department: "Ensino Fundamental II",
    email: "camila.ferreira@escola.edu.br",
    phone: "(11) 3456-7803",
    status: "Ativo",
    initials: "CF",
    color: "#b65b40",
  },
  {
    id: 4,
    name: "João Pedro Lima",
    role: "Professor de Ciências",
    department: "Ensino Fundamental II",
    email: "joao.lima@escola.edu.br",
    phone: "(11) 3456-7804",
    status: "Ativo",
    initials: "JL",
    color: "#bb8a38",
  },
  {
    id: 5,
    name: "Renata Almeida",
    role: "Professora de Língua Portuguesa",
    department: "Ensino Fundamental II",
    email: "renata.almeida@escola.edu.br",
    phone: "(11) 3456-7805",
    status: "Afastado",
    initials: "RA",
    color: "#736c8b",
  },
  {
    id: 6,
    name: "Bruno Costa",
    role: "Orientador educacional",
    department: "Orientação",
    email: "bruno.costa@escola.edu.br",
    phone: "(11) 3456-7806",
    status: "Ativo",
    initials: "BC",
    color: "#43806c",
  },
  {
    id: 7,
    name: "Lúcia Martins",
    role: "Secretária escolar",
    department: "Secretaria",
    email: "lucia.martins@escola.edu.br",
    phone: "(11) 3456-7807",
    status: "Ativo",
    initials: "LM",
    color: "#c16a4b",
  },
  {
    id: 8,
    name: "André Carvalho",
    role: "Professor de História",
    department: "Ensino Fundamental II",
    email: "andre.carvalho@escola.edu.br",
    phone: "(11) 3456-7808",
    status: "Ativo",
    initials: "AC",
    color: "#567b96",
  },
  {
    id: 9,
    name: "Patrícia Nunes",
    role: "Psicóloga escolar",
    department: "Apoio ao estudante",
    email: "patricia.nunes@escola.edu.br",
    phone: "(11) 3456-7809",
    status: "Ativo",
    initials: "PN",
    color: "#b65b40",
  },
];

const dataProvider = schoolDataProvider;

const adminNavigation = [
  { label: "Visão geral", href: "/", icon: Home01Icon },
  { label: "Equipe escolar", href: "/users", icon: UserGroupIcon },
  { label: "Alunos", href: "/students", icon: UserMultipleIcon },
  { label: "Presença", href: "/attendance", icon: ChartColumnIcon },
  {
    label: "Punições e responsáveis",
    href: "/incidents",
    icon: BookOpen01Icon,
  },
];

const listStyles = {
  "& .RaList-main": { minWidth: 0 },
  "& .RaList-content": {
    backgroundColor: "transparent",
    boxShadow: "none",
    overflowX: "auto",
  },
  "& .RaList-actions": { alignItems: "center", flexWrap: "wrap", gap: 1 },
  "& .RaList-toolbar": { alignItems: "center", flexWrap: "wrap", gap: 1 },
};

function StaffDirectory() {
  const { data = [], isPending, total } = useListContext<StaffMember>();

  if (isPending) {
    return (
      <CircularProgress
        size={28}
        sx={{ display: "block", mx: "auto", my: 6 }}
      />
    );
  }

  return (
    <Box sx={{ px: { xs: 0, sm: 1 }, pb: 2 }}>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "minmax(0, 1fr)",
            sm: "repeat(2, minmax(0, 1fr))",
            xl: "repeat(3, minmax(0, 1fr))",
          },
          gap: { xs: 1.5, sm: 2 },
        }}
      >
        {data.map((member) => (
          <Card key={member.id} sx={{ minWidth: 0, borderRadius: 1.5 }}>
            <CardContent
              sx={{
                p: { xs: 2, sm: 2.5 },
                "&:last-child": { pb: { xs: 2, sm: 2.5 } },
              }}
            >
              <Stack
                direction="row"
                spacing={1.5}
                sx={{ alignItems: "flex-start" }}
              >
                <Avatar
                  sx={{
                    width: 42,
                    height: 42,
                    flexShrink: 0,
                    bgcolor: member.color,
                    fontSize: 13,
                    fontWeight: 700,
                  }}
                >
                  {member.initials}
                </Avatar>
                <Box sx={{ minWidth: 0, flex: 1 }}>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      color: "#203b34",
                      fontWeight: 700,
                      overflowWrap: "anywhere",
                    }}
                  >
                    {member.name}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 0.25, overflowWrap: "anywhere" }}
                  >
                    {member.role}
                  </Typography>
                </Box>
                <Chip
                  label={member.status}
                  size="small"
                  sx={{
                    height: 23,
                    flexShrink: 0,
                    bgcolor: member.status === "Ativo" ? "#eaf2e9" : "#fff3ed",
                    color: member.status === "Ativo" ? "#205b49" : "#9b5038",
                    fontSize: 10,
                    fontWeight: 700,
                  }}
                />
              </Stack>
              <Divider sx={{ my: 2 }} />
              <Typography
                variant="caption"
                sx={{ display: "block", color: "#52685e", fontWeight: 600 }}
              >
                {member.department}
              </Typography>
              <Typography
                component="a"
                href={`mailto:${member.email}`}
                variant="body2"
                sx={{
                  display: "block",
                  mt: 1.25,
                  color: "#28705b",
                  overflowWrap: "anywhere",
                  textDecoration: "none",
                  "&:hover": { textDecoration: "underline" },
                }}
              >
                {member.email}
              </Typography>
              <Stack
                direction="row"
                spacing={1}
                sx={{
                  mt: 1.5,
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Typography variant="caption" color="text.secondary">
                  {member.phone}
                </Typography>
                <Button
                  component="a"
                  href={`mailto:${member.email}`}
                  size="small"
                  sx={{
                    minWidth: 0,
                    px: 1,
                    color: "#28705b",
                    whiteSpace: "nowrap",
                  }}
                >
                  Enviar e-mail
                </Button>
              </Stack>
            </CardContent>
          </Card>
        ))}
      </Box>
      {data.length === 0 && (
        <Typography sx={{ py: 6, textAlign: "center" }} color="text.secondary">
          Nenhum membro encontrado para essa busca.
        </Typography>
      )}
      <Pagination rowsPerPageOptions={[6, 9, 18]} sx={{ mt: 2 }} />
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ display: "block", mt: 1, textAlign: "right" }}
      >
        {total ?? 0} membros · dados demonstrativos
      </Typography>
    </Box>
  );
}

function StaffList() {
  return (
    <List
      title="Equipe escolar"
      perPage={6}
      sort={{ field: "name", order: "ASC" }}
      filters={[
        <SearchInput
          key="q"
          source="q"
          alwaysOn
          placeholder="Nome, função ou setor"
        />,
      ]}
      sx={listStyles}
    >
      <StaffDirectory />
    </List>
  );
}

const summary = [
  {
    label: "Alunos cadastrados",
    value: "6",
    note: "Cadastros demonstrativos",
    color: "#28705b",
  },
  {
    label: "Equipe escolar",
    value: String(staffMembers.length),
    note: "Direção, docentes e apoio",
    color: "#567b96",
  },
  {
    label: "Frequência média",
    value: "93,8%",
    note: "+ 1,2% em relação ao mês passado",
    color: "#bb8a38",
  },
  {
    label: "Contato com responsável",
    value: "1",
    note: "Responsável aguarda contato",
    color: "#b65b40",
  },
];

const schedule = [
  {
    time: "08:00",
    title: "Início das aulas",
    detail: "12 turmas · período da manhã",
    status: "Em andamento",
    color: "#28705b",
  },
  {
    time: "10:30",
    title: "Reunião pedagógica",
    detail: "Coordenação · Sala de reuniões",
    status: "Próxima",
    color: "#567b96",
  },
  {
    time: "14:00",
    title: "Atendimento às famílias",
    detail: "Plantão · Bloco administrativo",
    status: "Agendada",
    color: "#b65b40",
  },
];

const monthlyAttendance = [
  { month: "Mai", value: 92 },
  { month: "Jun", value: 95 },
  { month: "Jul", value: 89 },
  { month: "Ago", value: 97 },
  { month: "Set", value: 94 },
  { month: "Out", value: 96 },
];

const followUps = [
  {
    label: "Responsável aguarda contato",
    count: "1",
    note: "Ocorrência disciplinar pendente",
    color: "#b65b40",
  },
  {
    label: "Faltas registradas hoje",
    count: "2",
    note: "Verifique justificativas",
    color: "#bb8a38",
  },
  {
    label: "Alunos em acompanhamento",
    count: "2",
    note: "Revisar frequência e ocorrências",
    color: "#567b96",
  },
];

function SchoolLayout({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation();
  const activeItem = adminNavigation.find((item) => item.href === pathname);

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
                {adminNavigation.map((item) => (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      render={<RouterLink to={item.href} />}
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
                title="Administração escolar"
                className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#e8f1e9] text-[11px] font-semibold text-[#205b49]"
              >
                AD
              </span>
              <div className="min-w-0 group-data-[collapsible=icon]:hidden">
                <p className="truncate text-sm font-semibold text-[#29483e]">
                  Administração
                </p>
                <p className="truncate text-xs text-[#82918a]">
                  Equipe gestora
                </p>
              </div>
            </div>
            <RouterLink
              to="/"
              className="mt-2 inline-flex min-h-9 items-center gap-2 rounded-md px-2 text-xs font-medium text-[#527068] hover:bg-[#f2f5f1] hover:text-[#174f43] group-data-[collapsible=icon]:hidden"
            >
              Painel da escola
            </RouterLink>
          </SidebarFooter>
          <SidebarRail />
        </Sidebar>

        <SidebarInset className="min-h-svh min-w-0 overflow-x-hidden bg-[#f3f6ef]">
          <header className="sticky top-0 z-20 flex h-16 min-w-0 items-center justify-between gap-3 border-b border-[#e1e8df] bg-white/95 px-3 backdrop-blur sm:px-6">
            <div className="flex min-w-0 items-center gap-2 sm:gap-3">
              <SidebarTrigger className="shrink-0 text-[#52685e]" />
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-[#29483e]">
                  Sistema Escolar
                </p>
                <p className="hidden truncate text-xs text-[#82918a] sm:block">
                  {activeItem?.label ?? "Painel administrativo"}
                </p>
              </div>
            </div>
            <Chip
              label={
                <>
                  <span className="sm:hidden">Demo</span>
                  <span className="hidden sm:inline">Dados demonstrativos</span>
                </>
              }
              size="small"
              sx={{
                flexShrink: 0,
                bgcolor: "#fff3ed",
                color: "#9b5038",
                border: "1px solid #efd8cc",
                fontWeight: 600,
                "& .MuiChip-label": { px: { xs: 1, sm: 1.5 } },
              }}
            />
          </header>
          <div className="min-w-0 flex-1">{children}</div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}

function AdminDashboard() {
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
              SEGUNDA-FEIRA · 5 OUTUBRO 2026
            </Typography>
            <Typography
              variant="h4"
              sx={{ mt: 0.5, fontWeight: 700, fontSize: { xs: 28, sm: 34 } }}
            >
              Bom dia, equipe.
            </Typography>
            <Typography variant="body2" sx={{ mt: 1, color: "#d4e5d9" }}>
              Aqui está o panorama da escola para começar o dia.
            </Typography>
          </Box>
          <Chip
            label="ANO LETIVO 2026"
            sx={{
              bgcolor: "rgba(255,255,255,0.12)",
              color: "#fff",
              border: "1px solid rgba(255,255,255,0.24)",
              fontWeight: 700,
              letterSpacing: "0.06em",
            }}
          />
        </Stack>
      </Box>

      <Box
        sx={{ px: { xs: 2, sm: 3, lg: 4 }, pt: 3, maxWidth: 1440, mx: "auto" }}
      >
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
          {summary.map((item, index) => (
            <Box
              key={item.label}
              sx={{
                minWidth: 0,
                px: { xs: 2, sm: 2.5 },
                py: 2.5,
                borderRight: {
                  xs: index % 2 === 0 ? "1px solid #e8ede7" : "none",
                  lg: index < summary.length - 1 ? "1px solid #e8ede7" : "none",
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
          ))}
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
                  94,8%
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
              <Box
                role="img"
                aria-label="Gráfico de colunas da frequência escolar mensal"
                sx={{
                  position: "relative",
                  height: { xs: 220, sm: 270 },
                  display: "flex",
                  alignItems: "stretch",
                }}
              >
                <Stack
                  aria-hidden="true"
                  sx={{
                    position: "absolute",
                    inset: "0 0 27px",
                    pointerEvents: "none",
                    justifyContent: "space-between",
                  }}
                >
                  {[100, 75, 50, 25].map((tick) => (
                    <Box
                      key={tick}
                      sx={{
                        position: "relative",
                        borderTop: "1px dashed #e7ede6",
                      }}
                    >
                      <Typography
                        sx={{
                          position: "absolute",
                          right: "calc(100% + 8px)",
                          top: -9,
                          color: "#91a097",
                          fontSize: 10,
                        }}
                      >
                        {tick}%
                      </Typography>
                    </Box>
                  ))}
                </Stack>
                <Stack
                  direction="row"
                  spacing={1}
                  sx={{
                    position: "relative",
                    width: "100%",
                    pl: 4,
                    pb: 0,
                    alignItems: "flex-end",
                    justifyContent: "space-around",
                  }}
                >
                  {monthlyAttendance.map((item, index) => (
                    <Stack
                      key={item.month}
                      spacing={1}
                      sx={{
                        height: "100%",
                        flex: 1,
                        minWidth: 0,
                        alignItems: "center",
                        justifyContent: "flex-end",
                      }}
                    >
                      <Typography
                        variant="caption"
                        sx={{ color: "#657970", fontSize: 11, fontWeight: 700 }}
                      >
                        {item.value}%
                      </Typography>
                      <Box
                        sx={{
                          width: "min(100%, 38px)",
                          height: `${item.value}%`,
                          minHeight: 30,
                          bgcolor:
                            index === monthlyAttendance.length - 1
                              ? "#c16a4b"
                              : "#78a48e",
                          borderRadius: "4px 4px 0 0",
                          transition: "height 250ms ease",
                        }}
                      />
                      <Typography
                        variant="caption"
                        sx={{
                          color: "#82918a",
                          position: "absolute",
                          bottom: 0,
                          transform: "translateY(22px)",
                        }}
                      >
                        {item.month}
                      </Typography>
                    </Stack>
                  ))}
                </Stack>
              </Box>
              <Stack
                direction="row"
                spacing={1}
                sx={{ mt: 4, alignItems: "center" }}
              >
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    bgcolor: "#78a48e",
                  }}
                />
                <Typography variant="caption" color="text.secondary">
                  Presença registrada
                </Typography>
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    bgcolor: "#c16a4b",
                    ml: 1,
                  }}
                />
                <Typography variant="caption" color="text.secondary">
                  Mês atual
                </Typography>
              </Stack>
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
              Agenda de hoje
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mt: 0.5, mb: 2 }}
            >
              Atividades e compromissos
            </Typography>
            <Stack sx={{ borderTop: "1px solid #e1e8df" }}>
              {schedule.map((item, index) => (
                <Stack
                  key={item.time}
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
                      sx={{
                        color: "#52685e",
                        fontSize: 12,
                        fontWeight: 700,
                        fontVariantNumeric: "tabular-nums",
                      }}
                    >
                      {item.time}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      width: 3,
                      flexShrink: 0,
                      bgcolor: item.color,
                      borderRadius: 2,
                    }}
                  />
                  <Box sx={{ minWidth: 0 }}>
                    <Typography
                      variant="body2"
                      sx={{ color: "#29483e", fontWeight: 700 }}
                    >
                      {item.title}
                    </Typography>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ display: "block", mt: 0.5 }}
                    >
                      {item.detail}
                    </Typography>
                    <Chip
                      label={item.status}
                      size="small"
                      sx={{
                        mt: 1,
                        height: 22,
                        bgcolor: index === 0 ? "#eaf2e9" : "#f1f4ef",
                        color: index === 0 ? "#205b49" : "#62756b",
                        fontSize: 10,
                        fontWeight: 600,
                      }}
                    />
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
                AVISO
              </Typography>
              <Typography variant="body2" sx={{ mt: 0.5, color: "#704b3e" }}>
                Dados ilustrativos. Conecte a API escolar para exibir
                informações atualizadas.
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
    background: {
      default: "#f3f6ef",
      paper: "#ffffff",
    },
    text: {
      primary: "#203b34",
      secondary: "#687b71",
    },
    divider: "#e1e8df",
  },
  shape: {
    borderRadius: 8,
  },
  typography: {
    fontFamily: "var(--font-sans), sans-serif",
    button: {
      fontWeight: 600,
      textTransform: "none",
    },
    h1: { fontWeight: 650 },
    h2: { fontWeight: 650 },
    h3: { fontWeight: 650 },
    h4: { fontWeight: 650 },
    h5: { fontWeight: 650 },
    h6: { fontWeight: 650 },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: "#f3f6ef",
        },
      },
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
      styleOverrides: {
        root: {
          borderRadius: 6,
          fontWeight: 600,
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          "&:nth-of-type(even)": { backgroundColor: "#fbfcf9" },
          "&:hover": { backgroundColor: "#f1f6f0" },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderColor: "#e8ede7",
        },
      },
    },
  },
});

const AdminApp = () => (
  <Admin
    i18nProvider={i18nProvider}
    dataProvider={dataProvider}
    theme={adminTheme}
    title="Sistema Escolar"
    dashboard={AdminDashboard}
    layout={SchoolLayout}
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
      name="incidents"
      list={IncidentList}
      create={IncidentCreate}
      edit={IncidentEdit}
      options={{ label: "Punições e responsáveis" }}
    />
  </Admin>
);

export default AdminApp;
