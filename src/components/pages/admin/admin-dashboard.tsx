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
  const cards = overview
    ? [
        {
          label: "Alunos ativos",
          value: overview.activeStudents,
          note: `${overview.totalStudents} matrículas cadastradas`,
          color: "#39a0ed",
        },
        {
          label: "Equipe ativa",
          value: overview.activeStaff,
          note: `${overview.totalStaff} contas de equipe`,
          color: "#82aeca",
        },
        {
          label: "Frequência registrada",
          value:
            overview.attendanceRate === null
              ? "—"
              : `${overview.attendanceRate}%`,
          note: `${overview.attendanceCount} registros neste ano`,
          color: "#e0b45f",
        },
        {
          label: "Contato pendente",
          value: overview.pendingGuardianCalls,
          note: "Responsáveis a contatar",
          color: "#df896c",
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
        },
        {
          label: "Faltas de hoje",
          count: overview.absentToday,
          note: "Registros de ausência",
          color: "#e0b45f",
        },
        {
          label: "Mensalidades vencidas",
          count: overview.overduePayments,
          note: "Pendentes após o vencimento",
          color: "#82aeca",
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
        pb: { xs: 3, md: 5 },
      }}
    >
      <Box
        sx={{
          px: { xs: 2, sm: 3, lg: 4 },
          py: { xs: 2.5, sm: 4 },
          bgcolor: "#172b3b",
          color: "#fff",
          borderBottom: "4px solid #df896c",
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
                color: "#b8ddf8",
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
            <Typography variant="body2" sx={{ mt: 1, color: "#b8ddf8" }}>
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
            bgcolor: "#131e28",
            border: "1px solid #293b4b",
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
                    xs: index % 2 === 0 ? "1px solid #293b4b" : "none",
                    lg: index < cards.length - 1 ? "1px solid #293b4b" : "none",
                  },
                  borderBottom: {
                    xs: index < 2 ? "1px solid #293b4b" : "none",
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
                    color: "#df896c",
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
                  Frequência por mês
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                  Percentual de presenças e atrasos nos registros do mês.
                  Faltas justificadas não entram no cálculo.
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Média do ano{" "}
                <Box component="strong" sx={{ color: "#39a0ed", ml: 0.5 }}>
                  {overview?.attendanceRate == null
                    ? "—"
                    : `${overview.attendanceRate}%`}
                </Box>
              </Typography>
            </Stack>
            <Box
              sx={{
                border: "1px solid #293b4b",
                borderRadius: 1,
                bgcolor: "#131e28",
                p: { xs: 2, sm: 3 },
              }}
            >
              {overview?.months.some((month) => month.value !== null) ? (
                <Box
                  role="img"
                  aria-label={`Frequência mensal dos últimos seis meses. ${overview.months
                    .map((item) =>
                      item.value === null
                        ? `${item.month}: sem registros`
                        : `${item.month}: ${item.value}% em ${item.records} registros`,
                    )
                    .join("; ")}.`}
                >
                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: "36px minmax(0, 1fr)",
                      gap: 1,
                      height: { xs: 210, sm: 250 },
                    }}
                  >
                    <Stack sx={{ height: "100%", pb: 0.5, justifyContent: "space-between" }}>
                      {[100, 75, 50, 25, 0].map((tick) => (
                        <Typography
                          key={tick}
                          variant="caption"
                          sx={{
                            color: "#9fb3c3",
                            fontSize: { xs: 10, sm: 11 },
                            lineHeight: 1,
                          }}
                        >
                          {tick}%
                        </Typography>
                      ))}
                    </Stack>
                    <Box
                      sx={{
                        position: "relative",
                        minWidth: 0,
                        height: "100%",
                        borderBottom: "1px solid #526b80",
                        background:
                          "repeating-linear-gradient(to bottom, #344c60 0, #344c60 1px, transparent 1px, transparent 25%)",
                      }}
                    >
                      <Box
                        sx={{
                          position: "absolute",
                          inset: 0,
                          display: "grid",
                          gridTemplateColumns: `repeat(${overview.months.length}, minmax(0, 1fr))`,
                          gap: { xs: 0.5, sm: 1 },
                          px: { xs: 0.25, sm: 1 },
                        }}
                      >
                        {overview.months.map((item, index) => (
                          <Box
                            key={`${item.month}-${index}`}
                            title={
                              item.value === null
                                ? `${item.month}: sem registros`
                                : `${item.month}: ${item.value}% de frequência em ${item.records} registros`
                            }
                            sx={{
                              position: "relative",
                              minWidth: 0,
                              height: "100%",
                            }}
                          >
                            {item.value !== null ? (
                              <>
                                <Typography
                                  variant="caption"
                                  sx={{
                                    position: "absolute",
                                    left: "50%",
                                    bottom: `calc(${item.value}% + 6px)`,
                                    transform: "translate(-50%, 50%)",
                                    color: "#e6f0f8",
                                    fontSize: { xs: 10, sm: 11 },
                                    fontWeight: 700,
                                    whiteSpace: "nowrap",
                                  }}
                                >
                                  {item.value}%
                                </Typography>
                                <Box
                                  sx={{
                                    position: "absolute",
                                    bottom: 0,
                                    left: "50%",
                                    transform: "translateX(-50%)",
                                    width: "min(68%, 38px)",
                                    height: `${item.value}%`,
                                    minHeight: 2,
                                    borderRadius: "4px 4px 0 0",
                                    background:
                                      "linear-gradient(180deg, #75baf2 0%, #39a0ed 100%)",
                                    boxShadow: "0 0 16px rgb(57 160 237 / 18%)",
                                  }}
                                />
                              </>
                            ) : (
                              <Typography
                                variant="caption"
                                sx={{
                                  position: "absolute",
                                  left: "50%",
                                  bottom: 6,
                                  transform: "translateX(-50%)",
                                  color: "#9fb3c3",
                                  fontSize: 10,
                                }}
                              >
                                —
                              </Typography>
                            )}
                          </Box>
                        ))}
                      </Box>
                    </Box>
                  </Box>
                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: "36px minmax(0, 1fr)",
                      gap: 1,
                      mt: 1,
                    }}
                  >
                    <Box />
                    <Box
                      sx={{
                        display: "grid",
                        gridTemplateColumns: `repeat(${overview.months.length}, minmax(0, 1fr))`,
                        gap: { xs: 0.5, sm: 1 },
                        px: { xs: 0.25, sm: 1 },
                      }}
                    >
                      {overview.months.map((item, index) => (
                        <Stack
                          key={`${item.month}-label-${index}`}
                          spacing={0.25}
                          sx={{ minWidth: 0, alignItems: "center" }}
                        >
                          <Typography
                            variant="caption"
                            sx={{
                              color: "#dce8f1",
                              fontSize: { xs: 10, sm: 12 },
                              fontWeight: 600,
                              textTransform: "capitalize",
                            }}
                          >
                            {item.month.replace(".", "")}
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{
                              color: "#9fb3c3",
                              fontSize: { xs: 9, sm: 10 },
                              whiteSpace: "nowrap",
                            }}
                          >
                            {item.records} {item.records === 1 ? "registro" : "registros"}
                          </Typography>
                        </Stack>
                      ))}
                    </Box>
                  </Box>
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
                sx={{ mb: 1.5, color: "#e5eee8", fontWeight: 700 }}
              >
                Itens para revisar
              </Typography>
              <Stack
                divider={<Divider flexItem />}
                sx={{
                  borderTop: "1px solid #e1e8df",
                  borderBottom: "1px solid #293b4b",
                  bgcolor: "#131e28",
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
                        sx={{ color: "#dce8df", fontWeight: 700 }}
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
                color: "#df896c",
                fontWeight: 700,
                letterSpacing: "0.12em",
              }}
            >
              OPERAÇÃO ESCOLAR
            </Typography>
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
                    borderBottom: "1px solid #2b3a31",
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
                bgcolor: "#3a241e",
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  color: "#f0ad91",
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                }}
              >
                ORIGEM DOS DADOS
              </Typography>
              <Typography variant="body2" sx={{ mt: 0.5, color: "#d7a28e" }}>
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
