"use client";

import { Box, Chip, CircularProgress, Stack, Typography } from "@mui/material";
import {
  ArrowUpRight,
  CalendarDays,
  ClipboardCheck,
  GraduationCap,
  UsersRound,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";

export default function AdminDashboard() {
  const [overview, setOverview] = useState<Overview | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    fetch("/api/admin/overview")
      .then(async (response) => {
        const payload = await response.json();
        if (!response.ok)
          throw new Error(
            payload.error ??
              "O servidor não conseguiu consultar os indicadores do painel. Tente recarregar a página.",
          );
        return payload.data as Overview;
      })
      .then((data) => {
        if (active) setOverview(data);
      })
      .catch((reason: unknown) => {
        if (active)
          setError(
            reason instanceof Error &&
              !(reason instanceof TypeError || reason instanceof SyntaxError)
              ? reason.message
              : "Não foi possível consultar os indicadores do painel. Verifique sua conexão e recarregue a página.",
          );
      });
    return () => {
      active = false;
    };
  }, []);

  const today = new Date();
  const formatCount = (value: number) =>
    new Intl.NumberFormat("pt-BR").format(value);
  const cards = overview
    ? [
        {
          label: "Alunos(as) ativos(as)",
          value: formatCount(overview.activeStudents),
          note: `${formatCount(overview.totalStudents)} no total · ${formatCount(
            overview.totalStudents - overview.activeStudents,
          )} inativos`,
          color: "#39a0ed",
          href: "/students",
          icon: GraduationCap,
        },
        {
          label: "Equipe ativa",
          value: formatCount(overview.activeStaff),
          note: `${formatCount(overview.totalStaff)} contas · ${formatCount(
            overview.totalStaff - overview.activeStaff,
          )} inativas`,
          color: "#82aeca",
          href: "/users",
          icon: UsersRound,
        },
        {
          label: "Frequência média",
          value:
            overview.attendanceRate === null
              ? "—"
              : `${overview.attendanceRate}%`,
          note: `${formatCount(overview.attendanceCount)} registros neste ano`,
          color: "#e0b45f",
          href: "/attendance",
          icon: ClipboardCheck,
        },
        {
          label: "Média das notas",
          value:
            overview.averageGrade === null
              ? "—"
              : `${overview.averageGrade.toLocaleString("pt-BR", {
                  minimumFractionDigits: 1,
                  maximumFractionDigits: 1,
                })} / 10`,
          note: "Considerando as avaliações lançadas",
          color: "#91c6aa",
          href: "/grades",
          icon: ClipboardCheck,
        },
      ]
    : [];
  const followUps = overview
    ? [
        {
          label: "Contato com responsáveis pendente",
          count: overview.pendingGuardianCalls,
          note: "Ocorrências que exigem contato",
          color: "#df896c",
          href: "/incidents",
          action: "Ver ocorrências",
        },
        {
          label: "Faltas de hoje",
          count: overview.absentToday,
          note: "Registros de ausência",
          color: "#e0b45f",
          href: "/attendance",
          action: "Ver presenças",
        },
        {
          label: "Mensalidades vencidas",
          count: overview.overduePayments,
          note: "Pendentes após o vencimento",
          color: "#82aeca",
          href: "/payments",
          action: "Ver pagamentos",
        },
      ]
    : [];

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 1440,
        mx: "auto",
        px: { xs: 1.5, sm: 3, lg: 5 },
        pt: { xs: 2, sm: 3 },
        pb: { xs: 3, md: 5 },
      }}
    >
      <Box
        sx={{
          px: { xs: 2, sm: 3 },
          py: { xs: 2, sm: 2.5 },
          border: "1px solid #293b4b",
          borderRadius: 2,
          bgcolor: "#131e28",
        }}
      >
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          sx={{
            justifyContent: "space-between",
            alignItems: { xs: "flex-start", sm: "center" },
          }}
        >
          <Box>
            <Typography
              variant="overline"
              sx={{
                color: "#75baf2",
                fontWeight: 700,
                letterSpacing: "0.1em",
              }}
            >
              PAINEL ADMINISTRATIVO
            </Typography>
            <Typography
              variant="h4"
              sx={{
                mt: 0.25,
                color: "#e6f0f8",
                fontWeight: 700,
                fontSize: { xs: 27, sm: 34 },
              }}
            >
              Visão geral da escola
            </Typography>
            <Typography variant="body2" sx={{ mt: 0.75, color: "#9fb3c3" }}>
              Indicadores acadêmicos e operacionais da escola.
            </Typography>
          </Box>
          <Chip
            label={new Intl.DateTimeFormat("pt-BR", {
              dateStyle: "medium",
            }).format(today)}
            size="small"
            sx={{
              bgcolor: "#1b3042",
              color: "#b8ddf8",
              border: "1px solid #344c60",
              fontWeight: 700,
            }}
          />
        </Stack>
      </Box>
      <Box sx={{ pt: { xs: 2.5, sm: 3 } }}>
        {error ? (
          <Typography role="alert" color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        ) : null}
        <Box component="section" aria-labelledby="indicators-title">
          <Typography
            id="indicators-title"
            variant="h6"
            sx={{ mb: 1.5, color: "#e5eee8", fontWeight: 700 }}
          >
            Indicadores principais
          </Typography>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "repeat(2, minmax(0, 1fr))",
                lg: "repeat(4, minmax(0, 1fr))",
              },
              gap: { xs: 1.25, sm: 2 },
            }}
          >
            {overview ? (
              cards.map((item) => (
                <Box
                  component={RouterLink}
                  to={item.href}
                  key={item.label}
                  sx={{
                    minWidth: 0,
                    p: { xs: 1.75, sm: 2.25 },
                    border: "1px solid #293b4b",
                    borderRadius: 1.5,
                    bgcolor: "#131e28",
                    color: "inherit",
                    textDecoration: "none",
                    transition:
                      "border-color 150ms ease, background-color 150ms ease, transform 150ms ease",
                    "&:hover": {
                      borderColor: item.color,
                      bgcolor: "#172735",
                      transform: "translateY(-2px)",
                    },
                    "&:focus-visible": {
                      outline: "2px solid #39a0ed",
                      outlineOffset: 2,
                    },
                  }}
                >
                  <Stack
                    direction="row"
                    sx={{
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      gap: 1,
                    }}
                  >
                    <Box
                      sx={{
                        display: "grid",
                        placeItems: "center",
                        width: 36,
                        height: 36,
                        borderRadius: 1,
                        bgcolor: `${item.color}1f`,
                        color: item.color,
                      }}
                    >
                      <item.icon size={19} aria-hidden="true" />
                    </Box>
                    <ArrowUpRight
                      size={16}
                      color="#8298a8"
                      aria-hidden="true"
                    />
                  </Stack>
                  <Typography
                    variant="body2"
                    sx={{ mt: 2, color: "#b9c9d5", fontWeight: 600 }}
                  >
                    {item.label}
                  </Typography>
                  <Typography
                    sx={{
                      mt: 0.5,
                      color: item.color,
                      fontSize: { xs: 25, sm: 30 },
                      fontWeight: 750,
                      lineHeight: 1.1,
                      overflowWrap: "anywhere",
                    }}
                  >
                    {item.value}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      display: "block",
                      mt: 1,
                      color: "#9fb3c3",
                      lineHeight: 1.5,
                    }}
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
        </Box>

        <Box
          component="section"
          aria-labelledby="followups-title"
          sx={{ mt: { xs: 3, sm: 4 } }}
        >
          <Stack
            direction={{ xs: "column", sm: "row" }}
            sx={{
              justifyContent: "space-between",
              alignItems: { xs: "flex-start", sm: "flex-end" },
              mb: 1.5,
            }}
          >
            <Box>
              <Typography
                variant="overline"
                sx={{
                  color: "#df896c",
                  fontWeight: 700,
                  letterSpacing: "0.12em",
                }}
              >
                ACOMPANHAMENTO
              </Typography>
              <Typography
                id="followups-title"
                variant="h6"
                sx={{ color: "#e5eee8", fontWeight: 700 }}
              >
                O que precisa de atenção?
              </Typography>
            </Box>
          </Stack>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                md: "repeat(3, minmax(0, 1fr))",
              },
              gap: 1.25,
            }}
          >
            {followUps.map((item) => (
              <Box
                component={RouterLink}
                to={item.href}
                key={item.label}
                sx={{
                  display: "flex",
                  gap: 1.5,
                  alignItems: "center",
                  minWidth: 0,
                  p: 2,
                  border: "1px solid #293b4b",
                  borderRadius: 1.5,
                  bgcolor: "#131e28",
                  color: "inherit",
                  textDecoration: "none",
                  "&:hover": { borderColor: item.color, bgcolor: "#172735" },
                  "&:focus-visible": {
                    outline: "2px solid #39a0ed",
                    outlineOffset: 2,
                  },
                }}
              >
                <Box
                  sx={{
                    display: "grid",
                    placeItems: "center",
                    width: 44,
                    height: 44,
                    flexShrink: 0,
                    borderRadius: 1.25,
                    bgcolor: `${item.color}1f`,
                    color: item.color,
                    fontSize: 20,
                    fontWeight: 750,
                  }}
                >
                  {formatCount(item.count)}
                </Box>
                <Box sx={{ minWidth: 0, flex: 1 }}>
                  <Typography
                    variant="body2"
                    sx={{ color: "#dce8df", fontWeight: 700 }}
                  >
                    {item.label}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ display: "block", mt: 0.25, color: "#9fb3c3" }}
                  >
                    {item.count === 0 ? "Nenhum item pendente" : item.note}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      display: "block",
                      mt: 0.5,
                      color: item.color,
                      fontWeight: 700,
                    }}
                  >
                    {item.action}
                  </Typography>
                </Box>
                <ArrowUpRight size={16} color="#8298a8" aria-hidden="true" />
              </Box>
            ))}
          </Box>
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              lg: "minmax(0, 1.6fr) minmax(300px, 0.8fr)",
            },
            gap: { xs: 3, lg: 4 },
            mt: { xs: 3, sm: 4 },
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
                mb: 1.5,
                justifyContent: "space-between",
                alignItems: { xs: "flex-start", sm: "flex-end" },
              }}
            >
              <Box>
                <Typography
                  variant="overline"
                  sx={{
                    color: "#75baf2",
                    fontWeight: 700,
                    letterSpacing: "0.12em",
                  }}
                >
                  INDICADOR ACADÊMICO
                </Typography>
                <Typography
                  id="attendance-title"
                  variant="h6"
                  sx={{ color: "#e5eee8", fontWeight: 700 }}
                >
                  Frequência mensal · {today.getFullYear()}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 0.5 }}
                >
                  Cada barra mostra a frequência do mês em uma escala de 0% a
                  100%. Faltas justificadas não entram no cálculo.
                </Typography>
              </Box>
            </Stack>
            <Box
              sx={{
                border: "1px solid #293b4b",
                borderRadius: 1.5,
                bgcolor: "#131e28",
                p: { xs: 2, sm: 3 },
              }}
            >
              {overview ? (
                <Box
                  component="ul"
                  aria-label={`Frequência mensal de janeiro a dezembro de ${today.getFullYear()}`}
                  sx={{
                    display: "grid",
                    gridTemplateColumns: {
                      xs: "repeat(2, minmax(0, 1fr))",
                      sm: "repeat(3, minmax(0, 1fr))",
                      lg: "repeat(4, minmax(0, 1fr))",
                    },
                    gap: { xs: 1, sm: 1.5 },
                    m: 0,
                    p: 0,
                    listStyle: "none",
                  }}
                >
                  {overview.months.map((item, index) => (
                    <Box
                      component="li"
                      key={`${item.month}-${index}`}
                      sx={{
                        minWidth: 0,
                        p: { xs: 1.25, sm: 1.75 },
                        border: "1px solid #293b4b",
                        borderRadius: 1.25,
                        bgcolor: "#0f1922",
                      }}
                    >
                      <Stack
                        direction="row"
                        sx={{
                          justifyContent: "space-between",
                          alignItems: "baseline",
                          gap: 1,
                          mb: 1.25,
                        }}
                      >
                        <Typography
                          variant="body2"
                          sx={{
                            color: "#dce8f1",
                            fontWeight: 600,
                            textTransform: "capitalize",
                          }}
                        >
                          {item.month.replace(".", "")}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            color: item.value === null ? "#71879a" : "#75baf2",
                            fontWeight: 700,
                            whiteSpace: "nowrap",
                          }}
                        >
                          {item.value === null ? "—" : `${item.value}%`}
                        </Typography>
                      </Stack>
                      <Box
                        role={item.value === null ? undefined : "progressbar"}
                        aria-label={
                          item.value === null
                            ? undefined
                            : `Frequência em ${item.month}`
                        }
                        aria-valuemin={item.value === null ? undefined : 0}
                        aria-valuemax={item.value === null ? undefined : 100}
                        aria-valuenow={item.value ?? undefined}
                        sx={{
                          height: 8,
                          overflow: "hidden",
                          borderRadius: 999,
                          bgcolor: "#293b4b",
                        }}
                      >
                        {item.value !== null ? (
                          <Box
                            sx={{
                              width: `${item.value}%`,
                              height: "100%",
                              borderRadius: 999,
                              bgcolor: "#39a0ed",
                              transition: "width 250ms ease",
                            }}
                          />
                        ) : null}
                      </Box>
                      <Typography
                        variant="caption"
                        sx={{
                          display: "block",
                          mt: 0.75,
                          color: "#9fb3c3",
                        }}
                      >
                        {item.value === null
                          ? "Sem dados"
                          : `${formatCount(item.records)} ${
                              item.records === 1 ? "registro" : "registros"
                            }`}
                      </Typography>
                    </Box>
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
          </Box>
          <Box
            component="aside"
            aria-labelledby="schedule-title"
            sx={{
              minWidth: 0,
              p: { xs: 2, sm: 2.5 },
              border: "1px solid #293b4b",
              borderRadius: 1.5,
              bgcolor: "#131e28",
            }}
          >
            <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
              <CalendarDays size={16} color="#75baf2" aria-hidden="true" />
              <Typography
                variant="overline"
                sx={{
                  color: "#75baf2",
                  fontWeight: 700,
                  letterSpacing: "0.12em",
                }}
              >
                OPERAÇÃO ESCOLAR
              </Typography>
            </Stack>
            <Typography
              id="schedule-title"
              variant="h6"
              sx={{ color: "#e5eee8", fontWeight: 700 }}
            >
              Aulas de hoje
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mt: 0.5, mb: 2 }}
            >
              {overview?.lessonsToday.length
                ? `${formatCount(overview.lessonsToday.length)} ${
                    overview.lessonsToday.length === 1 ? "aula" : "aulas"
                  } na agenda`
                : "Não há aulas programadas para hoje."}
            </Typography>
            <Stack sx={{ borderTop: "1px solid #344c60" }}>
              {overview?.lessonsToday.map((item) => (
                <Stack
                  key={item.id}
                  direction="row"
                  spacing={1.5}
                  sx={{
                    py: 2,
                    borderBottom: "1px solid #293b4b",
                    alignItems: "flex-start",
                  }}
                >
                  <Box sx={{ width: 46, flexShrink: 0, pt: 0.25 }}>
                    <Typography
                      sx={{ color: "#a0b2a7", fontSize: 12, fontWeight: 700 }}
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
                      bgcolor: "#39a0ed",
                      borderRadius: 2,
                    }}
                  />
                  <Box sx={{ minWidth: 0 }}>
                    <Typography
                      variant="body2"
                      sx={{ color: "#dce8df", fontWeight: 700 }}
                    >
                      {item.subject}
                    </Typography>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ display: "block", mt: 0.5 }}
                    >
                      {item.studentName} · Turma {item.className} · Sala{" "}
                      {item.room}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {item.teacher}
                    </Typography>
                  </Box>
                </Stack>
              ))}
            </Stack>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
