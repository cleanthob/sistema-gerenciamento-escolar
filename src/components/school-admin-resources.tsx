"use client";

import { Chip } from "@mui/material";
import fakeDataProvider from "ra-data-fakerest";
import {
  BooleanField,
  BooleanInput,
  Create,
  Datagrid,
  DateField,
  DateInput,
  Edit,
  EditButton,
  FunctionField,
  List,
  SearchInput,
  SelectInput,
  SimpleForm,
  TextField,
  TextInput,
  required,
} from "react-admin";

const staffMembers = [
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

const students = [
  {
    id: 1,
    name: "Ana Beatriz Costa",
    registration: "2026001",
    grade: "8º ano",
    className: "8º B",
    status: "Ativo",
    guardianName: "Marcos Costa",
    guardianPhone: "(11) 98812-4501",
    guardianEmail: "marcos.costa@email.com",
  },
  {
    id: 2,
    name: "Lucas Mendes Rocha",
    registration: "2026002",
    grade: "7º ano",
    className: "7º A",
    status: "Ativo",
    guardianName: "Paula Mendes",
    guardianPhone: "(11) 98812-4502",
    guardianEmail: "paula.mendes@email.com",
  },
  {
    id: 3,
    name: "Sofia Almeida Santos",
    registration: "2026003",
    grade: "9º ano",
    className: "9º C",
    status: "Acompanhamento",
    guardianName: "Renato Santos",
    guardianPhone: "(11) 98812-4503",
    guardianEmail: "renato.santos@email.com",
  },
  {
    id: 4,
    name: "Miguel Ferreira Lima",
    registration: "2026004",
    grade: "6º ano",
    className: "6º B",
    status: "Ativo",
    guardianName: "Carla Ferreira",
    guardianPhone: "(11) 98812-4504",
    guardianEmail: "carla.ferreira@email.com",
  },
  {
    id: 5,
    name: "Isabela Nunes Martins",
    registration: "2026005",
    grade: "8º ano",
    className: "8º A",
    status: "Ativo",
    guardianName: "João Martins",
    guardianPhone: "(11) 98812-4505",
    guardianEmail: "joao.martins@email.com",
  },
  {
    id: 6,
    name: "Pedro Henrique Alves",
    registration: "2026006",
    grade: "7º ano",
    className: "7º B",
    status: "Acompanhamento",
    guardianName: "Luciana Alves",
    guardianPhone: "(11) 98812-4506",
    guardianEmail: "luciana.alves@email.com",
  },
];

const attendance = [
  {
    id: 1,
    studentName: "Ana Beatriz Costa",
    registration: "2026001",
    date: "2026-10-03",
    className: "8º B",
    status: "Presente",
    note: "",
  },
  {
    id: 2,
    studentName: "Lucas Mendes Rocha",
    registration: "2026002",
    date: "2026-10-03",
    className: "7º A",
    status: "Atraso",
    note: "Chegada às 08:18",
  },
  {
    id: 3,
    studentName: "Sofia Almeida Santos",
    registration: "2026003",
    date: "2026-10-03",
    className: "9º C",
    status: "Falta",
    note: "Aguardando justificativa",
  },
  {
    id: 4,
    studentName: "Miguel Ferreira Lima",
    registration: "2026004",
    date: "2026-10-03",
    className: "6º B",
    status: "Presente",
    note: "",
  },
  {
    id: 5,
    studentName: "Isabela Nunes Martins",
    registration: "2026005",
    date: "2026-10-03",
    className: "8º A",
    status: "Presente",
    note: "",
  },
  {
    id: 6,
    studentName: "Pedro Henrique Alves",
    registration: "2026006",
    date: "2026-10-03",
    className: "7º B",
    status: "Falta",
    note: "",
  },
];

const incidents = [
  {
    id: 1,
    studentName: "Sofia Almeida Santos",
    registration: "2026003",
    type: "Advertência",
    reason: "Ocorrências recorrentes de atraso",
    startDate: "2026-10-02",
    endDate: "",
    guardianContactRequired: true,
    guardianContactStatus: "Pendente",
    guardianPhone: "(11) 98812-4503",
    notes: "Coordenação deve realizar contato.",
  },
  {
    id: 2,
    studentName: "Pedro Henrique Alves",
    registration: "2026006",
    type: "Suspensão",
    reason: "Suspensão definida pela direção",
    startDate: "2026-10-05",
    endDate: "2026-10-06",
    guardianContactRequired: true,
    guardianContactStatus: "Contatado",
    guardianPhone: "(11) 98812-4506",
    notes: "Responsável comunicado por telefone.",
  },
];

export const schoolDataProvider = fakeDataProvider({
  users: staffMembers,
  students,
  attendance,
  incidents,
});

const statusChoices = [
  { id: "Ativo", name: "Ativo" },
  { id: "Acompanhamento", name: "Acompanhamento" },
];

const studentChoices = students.map(({ name }) => ({ id: name, name }));

export function StaffList() {
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
      <Datagrid rowClick="edit" bulkActionButtons={false} sx={gridStyles}>
        <TextField source="name" label="Nome" />
        <TextField source="role" label="Função" />
        <TextField source="department" label="Setor" />
        <TextField source="email" label="E-mail" />
        <TextField source="phone" label="Telefone" />
        <TextField source="status" label="Situação" />
        <EditButton />
      </Datagrid>
    </List>
  );
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
              label={record.status}
              size="small"
              color={record.status === "Ativo" ? "success" : "warning"}
            />
          )}
        />
        <TextField source="guardianName" label="Responsável" />
        <EditButton />
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
        <SelectInput
          source="grade"
          label="Ano escolar"
          validate={required()}
          choices={gradeChoices}
        />
        <TextInput source="className" label="Turma" validate={required()} />
        <SelectInput
          source="status"
          label="Situação"
          defaultValue="Ativo"
          choices={statusChoices}
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
        <SelectInput
          source="grade"
          label="Ano escolar"
          validate={required()}
          choices={gradeChoices}
        />
        <TextInput source="className" label="Turma" validate={required()} />
        <SelectInput source="status" label="Situação" choices={statusChoices} />
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

const gradeChoices = [
  { id: "6º ano", name: "6º ano" },
  { id: "7º ano", name: "7º ano" },
  { id: "8º ano", name: "8º ano" },
  { id: "9º ano", name: "9º ano" },
];

export function AttendanceList() {
  return (
    <List
      title="Presença dos alunos"
      perPage={10}
      sort={{ field: "date", order: "DESC" }}
      filters={[
        <SearchInput
          key="q"
          source="q"
          alwaysOn
          placeholder="Aluno, matrícula ou turma"
        />,
      ]}
      sx={listStyles}
    >
      <Datagrid rowClick="edit" bulkActionButtons={false} sx={gridStyles}>
        <TextField source="studentName" label="Aluno" />
        <TextField source="registration" label="Matrícula" />
        <DateField source="date" label="Data" />
        <TextField source="className" label="Turma" />
        <FunctionField
          label="Registro"
          render={(record) => (
            <Chip
              label={record.status}
              size="small"
              color={
                record.status === "Presente"
                  ? "success"
                  : record.status === "Falta"
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

export function AttendanceCreate() {
  return (
    <Create title="Registrar presença">
      <SimpleForm>
        <SelectInput
          source="studentName"
          label="Aluno"
          choices={studentChoices}
          validate={required()}
          fullWidth
        />
        <TextInput
          source="registration"
          label="Matrícula"
          validate={required()}
        />
        <DateInput source="date" label="Data" validate={required()} />
        <TextInput source="className" label="Turma" validate={required()} />
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
        <SelectInput
          source="studentName"
          label="Aluno"
          choices={studentChoices}
          validate={required()}
          fullWidth
        />
        <TextInput
          source="registration"
          label="Matrícula"
          validate={required()}
        />
        <DateInput source="date" label="Data" validate={required()} />
        <TextInput source="className" label="Turma" validate={required()} />
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

const attendanceChoices = [
  { id: "Presente", name: "Presente" },
  { id: "Falta", name: "Falta" },
  { id: "Atraso", name: "Atraso" },
];

export function IncidentList() {
  return (
    <List
      title="Ocorrências disciplinares"
      perPage={10}
      sort={{ field: "startDate", order: "DESC" }}
      filters={[
        <SearchInput
          key="q"
          source="q"
          alwaysOn
          placeholder="Aluno, matrícula ou ocorrência"
        />,
      ]}
      sx={listStyles}
    >
      <Datagrid rowClick="edit" bulkActionButtons={false} sx={gridStyles}>
        <TextField source="studentName" label="Aluno" />
        <TextField source="registration" label="Matrícula" />
        <FunctionField
          label="Medida"
          render={(record) => (
            <Chip
              label={record.type}
              size="small"
              color={record.type === "Suspensão" ? "error" : "warning"}
            />
          )}
        />
        <TextField source="reason" label="Motivo" />
        <DateField source="startDate" label="Início" />
        <BooleanField
          source="guardianContactRequired"
          label="Chamar responsável"
        />
        <FunctionField
          label="Contato"
          render={(record) => (
            <Chip
              label={record.guardianContactStatus}
              size="small"
              color={
                record.guardianContactStatus === "Contatado"
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

export function IncidentCreate() {
  return (
    <Create title="Registrar ocorrência">
      <SimpleForm>
        <SelectInput
          source="studentName"
          label="Aluno"
          choices={studentChoices}
          validate={required()}
          fullWidth
        />
        <TextInput
          source="registration"
          label="Matrícula"
          validate={required()}
        />
        <SelectInput
          source="type"
          label="Medida disciplinar"
          validate={required()}
          choices={incidentChoices}
        />
        <TextInput
          source="reason"
          label="Motivo / descrição"
          validate={required()}
          multiline
          fullWidth
        />
        <DateInput
          source="startDate"
          label="Data de início"
          validate={required()}
        />
        <DateInput source="endDate" label="Fim da suspensão" />
        <BooleanInput
          source="guardianContactRequired"
          label="É necessário chamar o responsável?"
          defaultValue
        />
        <SelectInput
          source="guardianContactStatus"
          label="Situação do contato"
          defaultValue="Pendente"
          choices={contactChoices}
        />
        <TextInput
          source="guardianPhone"
          label="Telefone do responsável"
          validate={required()}
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
          source="studentName"
          label="Aluno"
          choices={studentChoices}
          validate={required()}
          fullWidth
        />
        <TextInput
          source="registration"
          label="Matrícula"
          validate={required()}
        />
        <SelectInput
          source="type"
          label="Medida disciplinar"
          validate={required()}
          choices={incidentChoices}
        />
        <TextInput
          source="reason"
          label="Motivo / descrição"
          validate={required()}
          multiline
          fullWidth
        />
        <DateInput
          source="startDate"
          label="Data de início"
          validate={required()}
        />
        <DateInput source="endDate" label="Fim da suspensão" />
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
          source="guardianPhone"
          label="Telefone do responsável"
          validate={required()}
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

const incidentChoices = [
  { id: "Advertência", name: "Advertência" },
  { id: "Suspensão", name: "Suspensão" },
];

const contactChoices = [
  { id: "Pendente", name: "Pendente" },
  { id: "Contatado", name: "Responsável contatado" },
  { id: "Dispensado", name: "Contato dispensado" },
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
  "& .RaList-actionsToolbar": { flexWrap: "wrap" },
};

const gridStyles = {
  minWidth: 720,
  "& .MuiTableCell-root": { whiteSpace: "nowrap" },
  "& .MuiTableCell-root:nth-of-type(1)": {
    whiteSpace: "normal",
    minWidth: 150,
  },
};
