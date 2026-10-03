"use client";

import {
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button as MuiButton,
  Typography,
} from "@mui/material";
import { useState } from "react";
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
} from "react-admin";

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

const gridStyles = {
  minWidth: 720,
  "& .MuiTableCell-root": { whiteSpace: "nowrap" },
  "& .MuiTableCell-root:nth-of-type(1)": {
    whiteSpace: "normal",
    minWidth: 150,
  },
};

const studentStatusChoices = [
  { id: "ACTIVE", name: "Ativo" },
  { id: "INACTIVE", name: "Inativo" },
];

export function StaffList() {
  return (
    <List
      title="Equipe escolar"
      perPage={10}
      sort={{ field: "name", order: "ASC" }}
      filters={[
        <SearchInput
          key="q"
          source="q"
          alwaysOn
          placeholder="Nome, e-mail ou setor"
        />,
      ]}
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
      filters={[
        <SearchInput
          key="q"
          source="q"
          alwaysOn
          placeholder="Nome ou matrícula"
        />,
      ]}
      sx={listStyles}
    >
      <Datagrid rowClick="edit" bulkActionButtons={false} sx={gridStyles}>
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
        <TextInput
          source="guardianPhone"
          label="Telefone do responsável"
          validate={required()}
        />
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
        <TextInput
          source="guardianPhone"
          label="Telefone do responsável"
          validate={required()}
        />
        <TextInput
          source="guardianEmail"
          label="E-mail do responsável"
          type="email"
        />
      </SimpleForm>
    </Edit>
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
              bgcolor: "#f3f6ef",
              color: "#174f43",
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
      perPage={100}
      sort={{ field: "name", order: "ASC" }}
    >
      <SelectInput optionText="name" validate={required()} fullWidth />
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
