"use client";

import {
  Box,
  Chip,
  CircularProgress,
  Divider,
  Stack,
  Typography,
} from "@mui/material";

import { useEffect, useState } from "react";

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
