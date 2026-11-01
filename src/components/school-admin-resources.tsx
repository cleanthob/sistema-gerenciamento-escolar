"use client";

import {
  Box,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button as MuiButton,
  FormControl,
  FormHelperText,
  TextField as MuiTextField,
  Typography,
} from "@mui/material";
import { format, useMask } from "@react-input/mask";
import { useCallback, useRef, useState, type ChangeEvent } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useWatch } from "react-hook-form";
import {
  BooleanField,
  BooleanInput,
  Create,
  Datagrid,
  DateField,
  DateInput,
  DeleteWithConfirmButton,
  Edit,
  EditButton,
  FunctionField,
  List,
  NumberField,
  NumberInput,
  ReferenceInput,
  SearchInput,
  SelectInput,
  SimpleForm,
  TextField,
  TextInput,
  required,
  useRecordContext,
  useInput,
} from "react-admin";

const listStyles = {
  width: "100%",
  maxWidth: 1440,
  mx: "auto",
  px: { xs: 2, sm: 3, lg: 5 },
  pt: { xs: 2, sm: 3 },
  pb: { xs: 3, sm: 5 },
  "& .RaList-main": { minWidth: 0 },
  "& .RaList-content": {
    backgroundColor: "#131e28",
    boxShadow: "none",
    border: "1px solid #293b4b",
    borderRadius: 2.5,
    overflowX: "auto",
  },
  "& .RaList-actions": {
    alignItems: "center",
    flexWrap: "wrap",
    gap: 2,
    mb: 2.5,
    p: { xs: 1.5, sm: 2.5 },
    backgroundColor: "#131e28",
    border: "1px solid #293b4b",
    borderRadius: 2.5,
  },
  "& .RaFilterForm-root": {
    flex: "1 1 320px",
    minWidth: 0,
    p: 0,
  },
  "& .RaList-toolbar": {
    alignItems: "center",
    flexWrap: "wrap",
    gap: 1.5,
  },
  "& .RaFilterForm-filterFormInput": {
    width: "100%",
    minWidth: { xs: "100%", sm: 280 },
  },
  "& .RaFilterForm-filterFormInput .MuiFormControl-root": {
    width: "100%",
    mt: 0,
  },
  "& .RaFilterForm-filterFormInput .MuiInputBase-root": {
    minHeight: 48,
    borderRadius: 2,
    backgroundColor: "#0f1922",
  },
  "& .RaList-actions .RaTopToolbar": {
    flexShrink: 0,
    p: 0,
  },
};

const gridStyles = {
  minWidth: 720,
  "& .MuiTableCell-root": {
    px: { xs: 1.5, sm: 2 },
    py: 1.5,
    whiteSpace: "nowrap",
  },
  "& .MuiTableHead-root .MuiTableCell-root": {
    backgroundColor: "#172431",
    color: "#b8c9d6",
    fontSize: "0.72rem",
    fontWeight: 700,
    letterSpacing: "0.06em",
    textTransform: "uppercase",
  },
  "& .MuiTableCell-root:nth-of-type(1)": {
    whiteSpace: "normal",
    minWidth: 150,
  },
};

const studentStatusChoices = [
  { id: "ACTIVE", name: "Ativo" },
  { id: "INACTIVE", name: "Inativo" },
];

function searchFilters(placeholder: string) {
  return [
    <SearchInput
      key="q"
      source="q"
      alwaysOn
      placeholder={placeholder}
    />,
  ];
}

export function StaffList() {
  return (
    <List
      title="Equipe escolar"
      perPage={10}
      sort={{ field: "name", order: "ASC" }}
      filters={searchFilters("Buscar por nome, e-mail ou setor")}
      sx={listStyles}
    >
      <Datagrid bulkActionButtons={false} sx={gridStyles}>
        <TextField source="name" label="Nome" />
        <FunctionField
          label="Perfil"
          render={(record) => roleLabel(record.role)}
        />
        <TextField
          source="department"
          label="Setor"
          emptyText="Não informado"
        />
        <TextField source="email" label="E-mail" />
        <TextField source="phone" label="Telefone" emptyText="Não informado" />
        <FunctionField
          label="Situação"
          render={(record) => (
            <Chip
              size="small"
              label={record.active ? "Ativo" : "Inativo"}
              color={record.active ? "success" : "default"}
            />
          )}
        />
      </Datagrid>
    </List>
  );
}

function roleLabel(role: string) {
  const labels: Record<string, string> = {
    ADMIN: "Administrador",
    DIRECTOR: "Direção",
    TEACHER: "Professor(a)",
  };
  return labels[role] ?? role;
}

export function StudentList() {
  return (
    <List
      title="Alunos"
      perPage={10}
      sort={{ field: "name", order: "ASC" }}
      filters={searchFilters("Buscar por nome ou matrícula")}
      sx={listStyles}
    >
      <Datagrid rowClick="edit" bulkActionButtons={false} sx={gridStyles}>
        <FunctionField
          label="Foto"
          render={(record) => (
            <StudentAvatar name={record.name} photoUrl={record.photoUrl} />
          )}
        />
        <TextField source="registration" label="Matrícula" />
        <TextField source="name" label="Aluno" />
        <TextField source="grade" label="Ano" />
        <TextField source="className" label="Turma" />
        <FunctionField
          label="Situação"
          render={(record) => (
            <Chip
              label={record.status === "ACTIVE" ? "Ativo" : "Inativo"}
              size="small"
              color={record.status === "ACTIVE" ? "success" : "default"}
            />
          )}
        />
        <TextField source="guardianName" label="Responsável" />
        <EditButton />
        <ResetStudentPasswordButton />
        <DeleteWithConfirmButton
          label="Arquivar"
          confirmTitle="Arquivar aluno"
          confirmContent="A matrícula será desativada. O histórico escolar será preservado."
          mutationMode="pessimistic"
        />
      </Datagrid>
    </List>
  );
}

export function StudentCreate() {
  return (
    <Create title="Cadastrar aluno">
      <SimpleForm>
        <StudentPhotoInput />
        <TextInput
          source="name"
          label="Nome completo"
          validate={required()}
          fullWidth
        />
        <TextInput
          source="registration"
          label="Matrícula"
          validate={required()}
        />
        <TextInput source="email" label="E-mail do aluno" type="email" />
        <TextInput source="grade" label="Ano escolar" validate={required()} />
        <TextInput source="className" label="Turma" validate={required()} />
        <SelectInput
          source="status"
          label="Situação"
          defaultValue="ACTIVE"
          choices={studentStatusChoices}
        />
        <TextInput
          source="initialPassword"
          label="Senha temporária inicial"
          type="password"
          validate={required()}
          helperText="O aluno deverá trocar esta senha no primeiro acesso."
        />
        <TextInput
          source="guardianName"
          label="Nome do responsável"
          validate={required()}
          fullWidth
        />
        <MaskedPhoneInput source="guardianPhone" />
        <TextInput
          source="guardianEmail"
          label="E-mail do responsável"
          type="email"
        />
      </SimpleForm>
    </Create>
  );
}

export function StudentEdit() {
  return (
    <Edit title="Editar cadastro do aluno">
      <SimpleForm>
        <StudentPhotoInput />
        <TextInput
          source="name"
          label="Nome completo"
          validate={required()}
          fullWidth
        />
        <TextInput
          source="registration"
          label="Matrícula"
          validate={required()}
        />
        <TextInput source="email" label="E-mail do aluno" type="email" />
        <TextInput source="grade" label="Ano escolar" validate={required()} />
        <TextInput source="className" label="Turma" validate={required()} />
        <SelectInput
          source="status"
          label="Situação"
          choices={studentStatusChoices}
        />
        <TextInput
          source="guardianName"
          label="Nome do responsável"
          validate={required()}
          fullWidth
        />
        <MaskedPhoneInput source="guardianPhone" />
        <TextInput
          source="guardianEmail"
          label="E-mail do responsável"
          type="email"
        />
      </SimpleForm>
    </Edit>
  );
}

function MaskedPhoneInput({ source }: { source: string }) {
  const { field, fieldState } = useInput({ source, validate: required() });
  const { ref: fieldRef, ...inputField } = field;
  const phoneValue = String(inputField.value ?? "");
  const mask = getPhoneMask(phoneValue.replace(/\D/g, "").length);
  const inputRef = useMask({
    mask,
    replacement: { _: /\d/ },
    modify: ({ value, data, selectionStart, selectionEnd, inputType }) => {
      const selectedDigits = value
        .slice(selectionStart, selectionEnd)
        .replace(/\D/g, "").length;
      const remainingDigits = value.replace(/\D/g, "").length - selectedDigits;
      const insertedDigits =
        inputType === "insert" ? (data?.replace(/\D/g, "").length ?? 0) : 0;
      return { mask: getPhoneMask(remainingDigits + insertedDigits) };
    },
  });
  const setInputRef = useCallback(
    (input: HTMLInputElement | null) => {
      if (input) inputRef.current = input;
      fieldRef(input);
    },
    [fieldRef, inputRef],
  );

  return (
    <MuiTextField
      inputRef={setInputRef}
      name={inputField.name}
      label="Telefone do responsável"
      type="tel"
      value={format(phoneValue, { mask, replacement: { _: /\d/ } })}
      onChange={inputField.onChange}
      onBlur={inputField.onBlur}
      error={Boolean(fieldState.error)}
      helperText={fieldState.error?.message}
      slotProps={{ htmlInput: { inputMode: "numeric", autoComplete: "tel" } }}
    />
  );
}

function getPhoneMask(digitCount: number) {
  return digitCount > 10 ? "(__) _____-____" : "(__) ____-____";
}

function StudentAvatar({
  name,
  photoUrl,
  className,
}: {
  name?: string;
  photoUrl?: string | null;
  className?: string;
}) {
  const initials = (name ?? "")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join("")
    .toLocaleUpperCase("pt-BR");

  return (
    <Avatar className={className} aria-label={name || "Aluno"}>
      {photoUrl ? <AvatarImage src={photoUrl} alt={name || "Aluno"} /> : null}
      <AvatarFallback>{initials || "A"}</AvatarFallback>
    </Avatar>
  );
}

function StudentPhotoInput() {
  const { field, fieldState } = useInput({ source: "photoUrl" });
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploadError, setUploadError] = useState("");
  const [reading, setReading] = useState(false);
  const record = useRecordContext<{ name?: string }>();
  const name = useWatch({ name: "name" });
  const photoUrl = typeof field.value === "string" ? field.value : undefined;

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setUploadError("Selecione uma imagem PNG, JPG ou WebP.");
      return;
    }
    if (file.size > 1_000_000) {
      setUploadError("A foto deve ter no máximo 1 MB.");
      return;
    }

    setUploadError("");
    setReading(true);
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result !== "string") {
        setUploadError("Não foi possível carregar a foto.");
      } else {
        field.onChange(reader.result);
      }
      setReading(false);
    };
    reader.onerror = () => {
      setUploadError("Não foi possível carregar a foto.");
      setReading(false);
    };
    reader.readAsDataURL(file);
  }

  return (
    <FormControl error={Boolean(uploadError || fieldState.error)} fullWidth>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <StudentAvatar
          name={typeof name === "string" ? name : record?.name}
          photoUrl={photoUrl}
          className="size-16"
        />
        <Box>
          <input
            ref={inputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            hidden
            onChange={handleFileChange}
          />
          <MuiButton
            variant="outlined"
            disabled={reading}
            onClick={() => inputRef.current?.click()}
          >
            {reading ? "Carregando..." : "Selecionar foto"}
          </MuiButton>
          <Typography variant="caption" sx={{ display: "block" }}>
            PNG, JPG ou WebP · máximo de 1 MB
          </Typography>
          {photoUrl ? (
            <MuiButton
              size="small"
              onClick={() => {
                field.onChange("");
                setUploadError("");
              }}
            >
              Remover foto
            </MuiButton>
          ) : null}
        </Box>
      </Box>
      <FormHelperText>
        {uploadError || fieldState.error?.message || "Foto do aluno"}
      </FormHelperText>
    </FormControl>
  );
}

function ResetStudentPasswordButton() {
  const record = useRecordContext<{ id: string; name: string }>();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [temporaryPassword, setTemporaryPassword] = useState("");
  const [error, setError] = useState("");

  async function resetPassword() {
    if (!record) return;
    setLoading(true);
    setError("");
    try {
      const response = await fetch(
        `/api/students/${record.id}/reset-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: "{}",
        },
      );
      const result = await response.json();
      if (!response.ok)
        setError(result.error ?? "Não foi possível redefinir a senha.");
      else {
        setTemporaryPassword(result.temporaryPassword);
        setOpen(true);
      }
    } catch {
      setError("Falha de conexão ao redefinir a senha.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <MuiButton
        size="small"
        type="button"
        aria-label={`Resetar senha de ${record?.name ?? "aluno"}`}
        onClick={(event) => {
          event.stopPropagation();
          void resetPassword();
        }}
        disabled={loading}
      >
        {loading ? "Gerando..." : "Resetar senha"}
      </MuiButton>
      {error ? (
        <Typography color="error" variant="caption">
          {error}
        </Typography>
      ) : null}
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle>Senha temporária gerada</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary">
            Entregue esta senha a {record?.name} por um canal seguro. Ela será
            exibida somente agora e precisará ser trocada no próximo acesso.
          </Typography>
          <Typography
            component="code"
            sx={{
              display: "block",
              mt: 2,
              p: 1.5,
              bgcolor: "#151f1a",
              color: "#39a0ed",
              overflowWrap: "anywhere",
              fontSize: 16,
              fontWeight: 700,
            }}
          >
            {temporaryPassword}
          </Typography>
        </DialogContent>
        <DialogActions>
          <MuiButton onClick={() => setOpen(false)}>Fechar</MuiButton>
        </DialogActions>
      </Dialog>
    </>
  );
}

const attendanceChoices = [
  { id: "PRESENT", name: "Presente" },
  { id: "ABSENT", name: "Falta" },
  { id: "LATE", name: "Atraso" },
  { id: "EXCUSED", name: "Justificada" },
];

export function AttendanceList() {
  return (
    <List
      title="Presença dos alunos"
      perPage={10}
      sort={{ field: "date", order: "DESC" }}
      filters={searchFilters("Buscar por aluno, turma ou observação")}
      sx={listStyles}
    >
      <Datagrid rowClick="edit" bulkActionButtons={false} sx={gridStyles}>
        <TextField source="student.name" label="Aluno" />
        <TextField source="student.registration" label="Matrícula" />
        <DateField source="date" label="Data" />
        <TextField source="student.className" label="Turma" />
        <FunctionField
          label="Registro"
          render={(record) => (
            <Chip
              label={attendanceLabel(record.status)}
              size="small"
              color={
                record.status === "PRESENT"
                  ? "success"
                  : record.status === "ABSENT"
                    ? "error"
                    : "warning"
              }
            />
          )}
        />
        <TextField source="note" label="Observação" />
        <EditButton />
      </Datagrid>
    </List>
  );
}

function attendanceLabel(status: string) {
  return (
    (
      {
        PRESENT: "Presente",
        ABSENT: "Falta",
        LATE: "Atraso",
        EXCUSED: "Justificada",
      } as Record<string, string>
    )[status] ?? status
  );
}

function StudentReference() {
  return (
    <ReferenceInput
      source="studentId"
      reference="students"
      label="Aluno"
      perPage={100}
      sort={{ field: "name", order: "ASC" }}
    >
      <SelectInput
        optionText="name"
        validate={required()}
        fullWidth
        label="Aluno"
      />
    </ReferenceInput>
  );
}

export function AttendanceCreate() {
  return (
    <Create title="Registrar presença">
      <SimpleForm>
        <StudentReference />
        <DateInput source="date" label="Data" validate={required()} />
        <TextInput source="subject" label="Disciplina" />
        <SelectInput
          source="status"
          label="Registro"
          validate={required()}
          choices={attendanceChoices}
        />
        <TextInput source="note" label="Observação" multiline fullWidth />
      </SimpleForm>
    </Create>
  );
}

export function AttendanceEdit() {
  return (
    <Edit title="Editar registro de presença">
      <SimpleForm>
        <DateInput source="date" label="Data" validate={required()} />
        <TextInput source="subject" label="Disciplina" />
        <SelectInput
          source="status"
          label="Registro"
          validate={required()}
          choices={attendanceChoices}
        />
        <TextInput source="note" label="Observação" multiline fullWidth />
      </SimpleForm>
    </Edit>
  );
}

const sanctionTypeChoices = [
  { id: "WARNING", name: "Advertência" },
  { id: "SUSPENSION", name: "Suspensão" },
];
const contactChoices = [
  { id: "PENDING", name: "Pendente" },
  { id: "CONTACTED", name: "Responsável contatado" },
  { id: "NOT_REQUIRED", name: "Contato dispensado" },
];

export function IncidentList() {
  return (
    <List
      title="Ocorrências disciplinares"
      perPage={10}
      sort={{ field: "createdAt", order: "DESC" }}
      filters={searchFilters("Buscar por aluno ou motivo")}
      sx={listStyles}
    >
      <Datagrid rowClick="edit" bulkActionButtons={false} sx={gridStyles}>
        <TextField source="student.name" label="Aluno" />
        <TextField source="student.registration" label="Matrícula" />
        <FunctionField
          label="Medida"
          render={(record) => (
            <Chip
              label={record.type === "SUSPENSION" ? "Suspensão" : "Advertência"}
              size="small"
              color={record.type === "SUSPENSION" ? "error" : "warning"}
            />
          )}
        />
        <TextField source="reason" label="Motivo" />
        <DateField source="startsAt" label="Início" />
        <BooleanField
          source="guardianContactRequired"
          label="Chamar responsável"
        />
        <FunctionField
          label="Contato"
          render={(record) => (
            <Chip
              label={contactLabel(record.guardianContactStatus)}
              size="small"
              color={
                record.guardianContactStatus === "CONTACTED"
                  ? "success"
                  : "warning"
              }
            />
          )}
        />
        <EditButton />
      </Datagrid>
    </List>
  );
}

function contactLabel(status: string) {
  return (
    (
      {
        PENDING: "Pendente",
        CONTACTED: "Contatado",
        NOT_REQUIRED: "Dispensado",
      } as Record<string, string>
    )[status] ?? status
  );
}

export function IncidentCreate() {
  return (
    <Create title="Registrar ocorrência">
      <SimpleForm>
        <StudentReference />
        <SelectInput
          source="type"
          label="Medida disciplinar"
          validate={required()}
          choices={sanctionTypeChoices}
        />
        <TextInput
          source="reason"
          label="Motivo / descrição"
          validate={required()}
          multiline
          fullWidth
        />
        <DateInput
          source="startsAt"
          label="Data de início"
          validate={required()}
        />
        <DateInput source="endsAt" label="Fim da suspensão" />
        <BooleanInput
          source="guardianContactRequired"
          label="É necessário chamar o responsável?"
          defaultValue
        />
        <SelectInput
          source="guardianContactStatus"
          label="Situação do contato"
          defaultValue="PENDING"
          choices={contactChoices}
        />
        <TextInput
          source="notes"
          label="Observações do atendimento"
          multiline
          fullWidth
        />
      </SimpleForm>
    </Create>
  );
}

export function IncidentEdit() {
  return (
    <Edit title="Editar ocorrência">
      <SimpleForm>
        <SelectInput
          source="type"
          label="Medida disciplinar"
          validate={required()}
          choices={sanctionTypeChoices}
        />
        <TextInput
          source="reason"
          label="Motivo / descrição"
          validate={required()}
          multiline
          fullWidth
        />
        <DateInput
          source="startsAt"
          label="Data de início"
          validate={required()}
        />
        <DateInput source="endsAt" label="Fim da suspensão" />
        <BooleanInput
          source="guardianContactRequired"
          label="É necessário chamar o responsável?"
        />
        <SelectInput
          source="guardianContactStatus"
          label="Situação do contato"
          choices={contactChoices}
        />
        <TextInput
          source="notes"
          label="Observações do atendimento"
          multiline
          fullWidth
        />
      </SimpleForm>
    </Edit>
  );
}

export function PaymentList() {
  return (
    <List
      title="Mensalidades"
      perPage={10}
      sort={{ field: "dueDate", order: "DESC" }}
      filters={searchFilters("Buscar por aluno ou matrícula")}
      sx={listStyles}
    >
      <Datagrid bulkActionButtons={false} sx={gridStyles}>
        <TextField source="student.name" label="Aluno" />
        <TextField source="student.registration" label="Matrícula" />
        <NumberField source="amount" label="Valor (centavos)" />
        <DateField source="dueDate" label="Vencimento" />
        <DateField source="paidAt" label="Pago em" />
        <FunctionField
          label="Situação"
          render={(record) => (
            <Chip
              label={paymentLabel(record.status)}
              size="small"
              color={
                record.status === "PAID"
                  ? "success"
                  : record.status === "PENDING"
                    ? "warning"
                    : "default"
              }
            />
          )}
        />
      </Datagrid>
    </List>
  );
}

function paymentLabel(status: string) {
  return (
    (
      { PENDING: "Pendente", PAID: "Pago", WAIVED: "Dispensado" } as Record<
        string,
        string
      >
    )[status] ?? status
  );
}

export function PaymentCreate() {
  return (
    <Create title="Registrar mensalidade">
      <SimpleForm>
        <StudentReference />
        <NumberInput
          source="amount"
          label="Valor em centavos"
          min={1}
          validate={required()}
          helperText="Informe o valor como inteiro em centavos."
        />
        <DateInput source="dueDate" label="Vencimento" validate={required()} />
        <TextInput source="reference" label="Referência" />
      </SimpleForm>
    </Create>
  );
}

export function GradeList() {
  return (
    <List
      title="Notas lançadas"
      perPage={20}
      sort={{ field: "recordedAt", order: "DESC" }}
      filters={searchFilters("Buscar por aluno, disciplina ou avaliação")}
      sx={listStyles}
    >
      <Datagrid bulkActionButtons={false} sx={gridStyles}>
        <TextField source="student.name" label="Aluno" />
        <TextField source="student.registration" label="Matrícula" />
        <TextField source="subject" label="Disciplina" />
        <TextField source="activity" label="Avaliação" />
        <NumberField source="score" label="Nota" />
        <NumberField source="maxScore" label="Máximo" />
        <TextField source="term" label="Período" />
        <DateField source="recordedAt" label="Lançada em" />
      </Datagrid>
    </List>
  );
}

export function GradeCreate() {
  return (
    <Create title="Lançar nota">
      <SimpleForm>
        <StudentReference />
        <TextInput source="subject" label="Disciplina" validate={required()} />
        <TextInput source="activity" label="Avaliação" validate={required()} />
        <NumberInput
          source="score"
          label="Nota"
          min={0}
          validate={required()}
        />
        <NumberInput
          source="maxScore"
          label="Nota máxima"
          min={0.01}
          defaultValue={10}
          validate={required()}
        />
        <TextInput
          source="term"
          label="Bimestre / período"
          validate={required()}
        />
      </SimpleForm>
    </Create>
  );
}

export function LessonList() {
  return (
    <List
      title="Aulas programadas"
      perPage={20}
      sort={{ field: "startsAt", order: "ASC" }}
      filters={searchFilters("Buscar por aluno, disciplina ou professor")}
      sx={listStyles}
    >
      <Datagrid bulkActionButtons={false} sx={gridStyles}>
        <TextField source="student.name" label="Aluno" />
        <TextField source="student.className" label="Turma" />
        <TextField source="subject" label="Disciplina" />
        <TextField source="teacher" label="Professor" />
        <TextField source="room" label="Sala" />
        <DateField source="startsAt" label="Início" showTime />
        <DateField source="endsAt" label="Término" showTime />
      </Datagrid>
    </List>
  );
}

export function LessonCreate() {
  return (
    <Create title="Programar aula">
      <SimpleForm>
        <StudentReference />
        <TextInput source="subject" label="Disciplina" validate={required()} />
        <TextInput source="teacher" label="Professor" validate={required()} />
        <TextInput source="room" label="Sala" validate={required()} />
        <DateInput source="startsAt" label="Início" validate={required()} />
        <DateInput source="endsAt" label="Término" validate={required()} />
      </SimpleForm>
    </Create>
  );
}
