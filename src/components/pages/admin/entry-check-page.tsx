"use client";

import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { formatCurrencyBRL } from "@/utils/utils";
import { formatCalendarDate, formatSchoolTime } from "@/lib/date-format";
import { useState, type FormEvent } from "react";

type EntryCheckResult = {
  student: {
    name: string;
    registration: string;
    className: string;
    enrolledAt: string;
  };
  canEnter: boolean;
  decision: "LIBERADO" | "BLOQUEADO";
  reasons: string[];
  overduePayments: { amount: number; dueDate: string }[];
  activeSuspensions: {
    reason: string;
    startsAt: string;
    endsAt: string | null;
  }[];
  checkedAt: string;
};

type ApiResponse = EntryCheckResult & { error?: string };

function formatDate(value: string) {
  return formatCalendarDate(value);
}

export default function EntryCheckPage() {
  const [registration, setRegistration] = useState("");
  const [result, setResult] = useState<EntryCheckResult | null>(null);
  const [error, setError] = useState("");
  const [checking, setChecking] = useState(false);

  async function checkEntry(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const normalizedRegistration = registration.trim().toUpperCase();
    if (!normalizedRegistration) {
      setError("Informe a matrícula do(a) aluno(a).");
      setResult(null);
      return;
    }

    setChecking(true);
    setError("");
    setResult(null);
    try {
      const response = await fetch("/api/entry/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ registration: normalizedRegistration }),
      });
      const payload = (await response.json()) as ApiResponse;
      if (!response.ok) {
        setError(
          payload.error ??
            "Não foi possível verificar a situação deste(a) aluno(a). Tente novamente.",
        );
        return;
      }
      setResult(payload);
    } catch (reason) {
      setError(
        reason instanceof TypeError
          ? "Não foi possível conectar ao sistema. Verifique a conexão e tente novamente."
          : "Ocorreu um erro ao verificar a entrada. Tente novamente.",
      );
    } finally {
      setChecking(false);
    }
  }

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 960,
        mx: "auto",
        p: { xs: 2, sm: 3, lg: 4 },
      }}
    >
      <Stack spacing={3}>
        <Box>
          <Typography
            variant="overline"
            sx={{ color: "#75baf2", fontWeight: 700, letterSpacing: "0.1em" }}
          >
            ACESSO À ESCOLA
          </Typography>
          <Typography variant="h4" sx={{ mt: 0.5, fontWeight: 700 }}>
            Controle de entrada
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 1, maxWidth: 680 }}>
            Consulte a matrícula antes de permitir a entrada. A decisão
            considera a situação da matrícula, mensalidades vencidas e
            suspensões ativas.
          </Typography>
        </Box>

        <Paper
          component="form"
          onSubmit={checkEntry}
          sx={{
            p: { xs: 2, sm: 3 },
            borderRadius: 2,
            bgcolor: "#131e28",
          }}
        >
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            sx={{ alignItems: { sm: "flex-end" } }}
          >
            <TextField
              fullWidth
              label="Matrícula do(a) aluno(a)"
              value={registration}
              onChange={(event) =>
                setRegistration(event.target.value.toUpperCase())
              }
              slotProps={{
                htmlInput: { maxLength: 30, autoComplete: "off" },
              }}
              disabled={checking}
            />
            <Button
              type="submit"
              variant="contained"
              disabled={checking || !registration.trim()}
              sx={{
                minWidth: { sm: 190 },
                minHeight: 48,
                whiteSpace: "nowrap",
                alignSelf: "center",
              }}
            >
              {checking ? (
                <Stack
                  direction="row"
                  spacing={1}
                  sx={{ alignItems: "center" }}
                >
                  <CircularProgress size={18} color="inherit" />
                  <span>Consultando</span>
                </Stack>
              ) : (
                "Verificar entrada"
              )}
            </Button>
          </Stack>
        </Paper>

        {error ? <Alert severity="error">{error}</Alert> : null}

        {result ? (
          <Paper
            role="status"
            aria-live="polite"
            sx={{
              overflow: "hidden",
              borderRadius: 2,
              borderColor: result.canEnter ? "#2e765a" : "#8a403b",
              bgcolor: "#131e28",
            }}
          >
            <Box
              sx={{
                p: { xs: 2, sm: 3 },
                bgcolor: result.canEnter ? "#16352c" : "#3a211f",
                borderBottom: "1px solid",
                borderColor: result.canEnter ? "#2e765a" : "#8a403b",
              }}
            >
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={1.5}
                sx={{
                  justifyContent: "space-between",
                  alignItems: { sm: "center" },
                }}
              >
                <Box>
                  <Typography
                    variant="overline"
                    sx={{
                      color: result.canEnter ? "#91c6aa" : "#f0ad91",
                      fontWeight: 700,
                      letterSpacing: "0.1em",
                    }}
                  >
                    DECISÃO DE ACESSO
                  </Typography>
                  <Typography
                    variant="h4"
                    sx={{
                      mt: 0.25,
                      color: result.canEnter ? "#b7ddc6" : "#ffc1b0",
                      fontWeight: 800,
                    }}
                  >
                    ALUNO(A) {result.canEnter ? "LIBERADO(A)" : "BLOQUEADO(A)"}
                  </Typography>
                </Box>
                <Chip
                  label={`Verificado às ${formatSchoolTime(result.checkedAt)}`}
                  sx={{
                    color: "#dce8f1",
                    bgcolor: "rgba(12, 20, 28, 0.45)",
                  }}
                />
              </Stack>
            </Box>

            <Stack spacing={2.5} sx={{ p: { xs: 2, sm: 3 } }}>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  {result.student.name}
                </Typography>
                <Typography color="text.secondary">
                  Matrícula {result.student.registration} · Turma{" "}
                  {result.student.className}
                </Typography>
                <Typography color="text.secondary" sx={{ mt: 0.5 }}>
                  Inscrição na escola: {formatDate(result.student.enrolledAt)}
                </Typography>
              </Box>

              {result.canEnter ? (
                <Alert severity="success">
                  Situação regular. O(A) aluno(a) está liberado(a) para entrar
                  neste momento.
                </Alert>
              ) : (
                <Alert severity="error">
                  Não permita a entrada. Regularize a situação com a
                  administração escolar.
                </Alert>
              )}

              {result.reasons.length ? (
                <Box>
                  <Typography
                    variant="subtitle2"
                    sx={{ mb: 1, fontWeight: 700 }}
                  >
                    Motivos do bloqueio
                  </Typography>
                  <Stack component="ul" spacing={0.75} sx={{ m: 0, pl: 2.5 }}>
                    {result.reasons.map((reason) => (
                      <Typography
                        component="li"
                        key={reason}
                        color="text.primary"
                      >
                        {reason}
                      </Typography>
                    ))}
                  </Stack>
                </Box>
              ) : null}

              {result.overduePayments.length ? (
                <Box>
                  <Typography
                    variant="subtitle2"
                    sx={{ mb: 1, fontWeight: 700 }}
                  >
                    Mensalidades vencidas
                  </Typography>
                  <Stack spacing={0.5}>
                    {result.overduePayments.map((payment) => (
                      <Typography
                        key={`${payment.dueDate}-${payment.amount}`}
                        color="text.secondary"
                      >
                        {formatCurrencyBRL(payment.amount)} · vencimento{" "}
                        {formatDate(payment.dueDate)}
                      </Typography>
                    ))}
                  </Stack>
                </Box>
              ) : null}

              {result.activeSuspensions.length ? (
                <Box>
                  <Typography
                    variant="subtitle2"
                    sx={{ mb: 1, fontWeight: 700 }}
                  >
                    Suspensão ativa
                  </Typography>
                  <Stack spacing={0.5}>
                    {result.activeSuspensions.map((suspension) => (
                      <Typography
                        key={`${suspension.startsAt}-${suspension.reason}`}
                        color="text.secondary"
                      >
                        {suspension.reason} · de{" "}
                        {formatDate(suspension.startsAt)}
                        {suspension.endsAt
                          ? ` até ${formatDate(suspension.endsAt)}`
                          : " sem data de término"}
                      </Typography>
                    ))}
                  </Stack>
                </Box>
              ) : null}
            </Stack>
          </Paper>
        ) : null}
      </Stack>
    </Box>
  );
}
