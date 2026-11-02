"use client";

import {
  Alert,
  Box,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button as MuiButton,
  FormControl,
  TextField as MuiTextField,
  Typography,
} from "@mui/material";
import { format, useMask } from "@react-input/mask";
import { Pencil } from "lucide-react";
import {
  useCallback,
  useRef,
  useState,
  type ChangeEvent,
  type ReactNode,
} from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useWatch } from "react-hook-form";
import {
  formatCalendarDate,
  formatSchoolDateTime,
  fromSchoolDateTimeInputValue,
  toCalendarDateInputValue,
  toSchoolDateTimeInputValue,
} from "@/lib/date-format";
import {
  BooleanField,
  BooleanInput,
  Create,
  Datagrid,
  DeleteButton,
  DeleteWithConfirmButton,
  Edit,
  EditButton,
  FunctionField,
  List,
  NumberField,
  NumberInput,
  ReferenceInput,
  SaveButton,
  SearchInput,
  SelectInput,
  SimpleForm,
  TextField,
  TextInput,
  Toolbar as AdminToolbar,
  ValidationError,
  required,
  useRecordContext,
  useInput,
  useRedirect,
  useResourceContext,
} from "react-admin";

const listStyles = {
  width: "100%",
  maxWidth: 1440,
  mx: "auto",
  px: { xs: 1.5, sm: 3, lg: 5 },
  pt: { xs: 1.5, sm: 3 },
  pb: { xs: 3, sm: 5 },
  minWidth: 0,
  "& .RaList-main": { minWidth: 0, width: "100%" },
  "& .RaList-content": {
    backgroundColor: "#131e28",
    boxShadow: "none",
    border: "1px solid #293b4b",
    borderRadius: 2.5,
    maxWidth: "100%",
    minWidth: 0,
    overflowX: "auto",
    overscrollBehaviorX: "contain",
    WebkitOverflowScrolling: "touch",
    scrollbarWidth: "thin",
    scrollbarColor: "#526b80 #131e28",
    "& .MuiTableContainer-root": {
      maxWidth: "100%",
      overflowX: "auto",
      overscrollBehaviorX: "contain",
      WebkitOverflowScrolling: "touch",
    },
  },
  "& .RaList-actions": {
    alignItems: "center",
    flexWrap: "wrap",
    gap: 2,
    mb: 2.5,
    p: { xs: 1.25, sm: 2.5 },
    backgroundColor: "#131e28",
    border: "1px solid #293b4b",
    borderRadius: 2.5,
    minWidth: 0,
  },
  "& .RaFilterForm-root": {
    flex: "1 1 100%",
    minWidth: 0,
    width: "100%",
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
    borderRadius: "6px",
    backgroundColor: "#0f1922",
  },
  "& .RaList-actions .RaTopToolbar": {
    flex: "1 1 100%",
    justifyContent: "flex-start",
    width: "100%",
    p: 0,
  },
  "& .RaList-actions > span": {
    display: "none",
  },
  "@media (max-width: 899.95px)": {
    "&& .RaList-actions .RaCreateButton-floating": {
      position: "static !important",
      inset: "auto !important",
      zIndex: "auto !important",
      transform: "none !important",
      width: "auto",
      minWidth: 0,
      height: 40,
      minHeight: 40,
      p: "0 14px",
      borderRadius: "6px",
      boxShadow: "none !important",
      gap: 1,
      "&::after": {
        content: "attr(aria-label)",
        fontSize: "0.875rem",
        fontWeight: 600,
        whiteSpace: "nowrap",
      },
    },
  },
  "@media (max-width: 600px)": {
    "&& .RaList-actions": {
      display: "grid !important",
      gridTemplateColumns: "minmax(0, 1fr)",
      alignItems: "stretch",
      gap: 1,
      mb: 1.5,
      p: 1.25,
    },
    "& .RaFilterForm-root": { flex: "1 1 auto", width: "100%" },
    "& .RaFilterForm-filterFormInput": { minWidth: 0, width: "100%" },
    "& .RaList-actions .RaTopToolbar": {
      justifyContent: "flex-start",
      width: "100%",
    },
    "& .RaList-actions .RaTopToolbar .MuiIconButton-root": {
      width: "auto",
      height: 40,
      border: "1px solid #344c60",
      borderRadius: "6px",
      px: 1.75,
      gap: 1,
      "&::after": {
        content: "attr(aria-label)",
        fontSize: "0.875rem",
        fontWeight: 600,
        whiteSpace: "nowrap",
      },
    },
    "& .RaList-main > .MuiTablePagination-root": {
      display: "flex",
      maxWidth: "100%",
      overflowX: "auto",
    },
    "& .RaList-main > .MuiTablePagination-root .MuiTablePagination-toolbar": {
      flexWrap: "wrap",
      justifyContent: "center",
      gap: 0.5,
      px: 0.5,
    },
    "& .RaList-main > .MuiTablePagination-root .MuiTablePagination-displayedRows": {
      flex: "1 0 100%",
      textAlign: "center",
      m: 0,
    },
  },
};

const gridStyles = {
  width: "100%",
  minWidth: { xs: 640, sm: 720 },
  "& .MuiTableCell-root": {
    px: { xs: 1, sm: 2 },
    py: { xs: 1.25, sm: 1.5 },
    whiteSpace: "nowrap",
    fontSize: { xs: "0.78rem", sm: "0.875rem" },
  },
  "& .MuiTableHead-root .MuiTableCell-root": {
    backgroundColor: "#172431",
    color: "#b8c9d6",
    fontSize: { xs: "0.65rem", sm: "0.72rem" },
    fontWeight: 700,
    letterSpacing: "0.06em",
    textTransform: "uppercase",
  },
  "& .MuiTableCell-root:nth-of-type(1)": {
    whiteSpace: "normal",
    minWidth: { xs: 112, sm: 150 },
  },
};

const studentStatusChoices = [
  { id: "ACTIVE", name: "Ativo" },
  { id: "INACTIVE", name: "Inativo" },
];

const paymentStatusChoices = [
  { id: "PENDING", name: "Pendente" },
  { id: "PAID", name: "Pago" },
  { id: "WAIVED", name: "Dispensado" },
];

const formStyles = {
  "& > .MuiStack-root": {
    display: "grid",
    gridTemplateColumns: { xs: "minmax(0, 1fr)", sm: "repeat(2, minmax(0, 1fr))" },
    alignItems: "start",
    columnGap: { xs: 2, sm: 2.5 },
    rowGap: { xs: 2.25, sm: 2.5 },
    p: { xs: 2, sm: 3 },
  },
  "& .MuiFormControl-root": {
    width: "100%",
    maxWidth: "100%",
    m: 0,
    minWidth: 0,
  },
  "& .MuiFormControl-root.MuiFormControl-fullWidth": {
    gridColumn: "1 / -1",
  },
  "& .MuiFormControl-root:has(textarea), & .MuiFormControl-root:has(.MuiFormControlLabel-root)": {
    gridColumn: "1 / -1",
  },
  "& .MuiInputLabel-root": {
    position: "static",
    display: "block",
    maxWidth: "100%",
    mb: 0.75,
    color: "#b8c9d6",
    fontSize: "0.875rem",
    fontWeight: 600,
    lineHeight: 1.4,
    transform: "none",
    transformOrigin: "top left",
    "&.Mui-focused": { color: "#75baf2" },
    "&.Mui-error": { color: "#f28b82" },
  },
  "& .MuiOutlinedInput-notchedOutline legend": {
    display: "none",
  },
  "& .MuiFormControlLabel-root": {
    ml: 0,
    alignItems: "center",
  },
  "& .MuiFormHelperText-root": {
    ml: 0,
    mt: 0.75,
    lineHeight: 1.5,
  },
  "& .MuiInputBase-root": { minWidth: 0 },
  "& .MuiInputBase-root:not(.MuiInputBase-multiline)": {
    height: 48,
    alignItems: "center",
  },
  "& .MuiInputBase-input:not(textarea)": {
    padding: "10px 14px",
    textAlign: "left",
    "&::placeholder": {
      color: "transparent",
      opacity: 0,
    },
  },
  "& textarea.MuiInputBase-input": {
    padding: "12px 14px",
    textAlign: "left",
    "&::placeholder": {
      color: "transparent",
      opacity: 0,
    },
  },
  "& .MuiSelect-select": {
    display: "flex",
    alignItems: "center",
    padding: "10px 14px",
  },
};

const formPageStyles = {
  width: "100%",
  maxWidth: 1440,
  mx: "auto",
  p: { xs: 1.5, sm: 3, lg: 5 },
};

function AdminForm({ children }: { children: ReactNode }) {
  return (
    <SimpleForm
      sx={formStyles}
      toolbar={<AdminFormToolbar />}
    >
      {children}
    </SimpleForm>
  );
}

function AdminFormToolbar() {
  const resource = useResourceContext();
  const redirect = useRedirect();

  return (
    <AdminToolbar
      sx={{
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "center",
        flexWrap: "wrap",
        gap: 1.5,
        px: { xs: 2, sm: 3 },
        py: 1.5,
        borderTop: "1px solid #293b4b",
        "& > .MuiButton-root, & > .MuiIconButton-root": {
          minHeight: 40,
          borderRadius: "6px",
          fontSize: "0.875rem",
          fontWeight: 600,
        },
        "&.RaToolbar-mobileToolbar": {
          position: "static",
          bottom: "auto",
          left: "auto",
          right: "auto",
          width: "100%",
          boxSizing: "border-box",
          zIndex: "auto",
          flexWrap: "wrap",
          justifyContent: "flex-end",
          alignItems: "center",
          gap: 1,
          px: 2,
          py: 1.5,
          backgroundColor: "#131e28",
          borderTop: "1px solid #293b4b",
          "& > .MuiButton-root": {
            minHeight: 40,
            px: 1.75,
            borderRadius: "6px",
            fontSize: "0.875rem",
            fontWeight: 600,
            whiteSpace: "nowrap",
          },
          "& .MuiIconButton-root": {
            width: "auto",
            minWidth: 40,
            height: 40,
            minHeight: 40,
            border: "1px solid #344c60",
            borderRadius: "6px",
            px: 1.75,
            gap: 0.75,
            "&::after": {
              content: "attr(aria-label)",
              fontSize: "0.875rem",
              fontWeight: 600,
              whiteSpace: "nowrap",
            },
          },
        },
      }}
    >
      <MuiButton
        type="button"
        variant="outlined"
        onClick={() => redirect("list", resource)}
      >
        Cancelar
      </MuiButton>
      <DeleteButton resource={resource} />
      <SaveButton />
    </AdminToolbar>
  );
}

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
      title="Alunos(as)"
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
        <TextField source="name" label="Aluno(a)" />
        <CalendarDateField source="createdAt" label="Inscrição na escola" />
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
          confirmTitle="Arquivar aluno(a)"
          confirmContent="A matrícula será desativada. O histórico escolar será preservado."
          mutationMode="pessimistic"
        />
      </Datagrid>
    </List>
  );
}

export function StudentCreate() {
  return (
    <Create
      title="Cadastrar aluno(a)"
      redirect="list"
      mutationMode="pessimistic"
      sx={formPageStyles}
    >
      <AdminForm>
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
        <TextInput source="email" label="E-mail do(a) aluno(a)" type="email" />
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
          helperText="O(A) aluno(a) deverá trocar esta senha no primeiro acesso."
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
      </AdminForm>
    </Create>
  );
}

export function StudentEdit() {
  return (
    <Edit
      title="Editar cadastro do(a) aluno(a)"
      mutationMode="pessimistic"
      sx={formPageStyles}
    >
      <AdminForm>
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
        <CalendarDateInput
          source="createdAt"
          label="Inscrição na escola"
          requiredField
          helperText="A data controla a partir de quando os registros do(a) aluno(a) podem ser feitos."
        />
        <TextInput source="email" label="E-mail do(a) aluno(a)" type="email" />
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
      </AdminForm>
    </Edit>
  );
}

function MaskedPhoneInput({ source }: { source: string }) {
  const { field, fieldState } = useInput({
    source,
    validate: required("Informe o telefone do responsável."),
  });
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
      helperText={
        fieldState.error?.message ? (
          <ValidationError error={fieldState.error.message} />
        ) : undefined
      }
      slotProps={{ htmlInput: { inputMode: "numeric", autoComplete: "tel" } }}
    />
  );
}

function CalendarDateInput({
  source,
  label,
  requiredField = false,
  helperText,
}: {
  source: string;
  label: string;
  requiredField?: boolean;
  helperText?: string;
}) {
  const { field, fieldState } = useInput({
    source,
    validate: requiredField ? required() : undefined,
  });

  return (
    <MuiTextField
      name={field.name}
      label={label}
      type="date"
      value={toCalendarDateInputValue(field.value)}
      onChange={(event) => {
        const value = event.target.value;
        field.onChange(value ? `${value}T00:00:00.000Z` : null);
      }}
      onBlur={field.onBlur}
      error={Boolean(fieldState.error)}
      helperText={
        fieldState.error?.message ? (
          <ValidationError error={fieldState.error.message} />
        ) : (
          helperText
        )
      }
      fullWidth
      slotProps={{ htmlInput: { required: requiredField } }}
    />
  );
}

function SchoolDateTimeInput({
  source,
  label,
  requiredField = false,
}: {
  source: string;
  label: string;
  requiredField?: boolean;
}) {
  const { field, fieldState } = useInput({
    source,
    validate: requiredField ? required() : undefined,
  });

  return (
    <MuiTextField
      name={field.name}
      label={label}
      type="datetime-local"
      value={toSchoolDateTimeInputValue(field.value)}
      onChange={(event) => {
        const value = event.target.value;
        const date = value ? fromSchoolDateTimeInputValue(value) : null;
        field.onChange(date?.toISOString() ?? "");
      }}
      onBlur={field.onBlur}
      error={Boolean(fieldState.error)}
      helperText={
        fieldState.error?.message ?? "Horários no fuso de Brasília (São Paulo)."
      }
      fullWidth
      slotProps={{ htmlInput: { required: requiredField } }}
    />
  );
}

function CalendarDateField({
  source,
  label,
  showTime = false,
}: {
  source: string;
  label: string;
  showTime?: boolean;
}) {
  const record = useRecordContext();
  const value = record?.[source];
  const display =
    typeof value === "string" || value instanceof Date
      ? showTime
        ? formatSchoolDateTime(value)
        : formatCalendarDate(value)
      : "";

  return <FunctionField label={label} render={() => display} />;
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
    <Avatar className={className} aria-label={name || "Aluno(a)"}>
      {photoUrl ? <AvatarImage src={photoUrl} alt={name || "Aluno(a)"} /> : null}
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
        setUploadError("O navegador não conseguiu processar este arquivo de imagem.");
      } else {
        field.onChange(reader.result);
      }
      setReading(false);
    };
    reader.onerror = () => {
      setUploadError("O arquivo de imagem não pôde ser lido. Selecione-o novamente.");
      setReading(false);
    };
    reader.readAsDataURL(file);
  }

  return (
    <FormControl error={Boolean(uploadError || fieldState.error)} fullWidth>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 1,
          width: "100%",
          p: { xs: 1.5, sm: 2 },
          border: "1px solid #293b4b",
          borderRadius: 2,
          backgroundColor: "#0f1922",
        }}
      >
        <MuiButton
          component="button"
          type="button"
          aria-label={
            photoUrl ? "Alterar foto do(a) aluno(a)" : "Adicionar foto do(a) aluno(a)"
          }
          title="Clique para escolher uma foto"
          disabled={reading}
          onClick={() => inputRef.current?.click()}
          sx={{
            position: "relative",
            minWidth: 0,
            p: 0,
            borderRadius: "50%",
            "&:hover .photo-edit-overlay, &:focus-visible .photo-edit-overlay": {
              opacity: 1,
            },
            "@media (hover: none)": {
              "& .photo-edit-overlay": { opacity: 1 },
            },
          }}
        >
          <StudentAvatar
            name={typeof name === "string" ? name : record?.name}
            photoUrl={photoUrl}
            className="size-16"
          />
          <Box
            className="photo-edit-overlay"
            aria-hidden="true"
            sx={{
              position: "absolute",
              inset: 0,
              display: "grid",
              placeItems: "center",
              borderRadius: "50%",
              backgroundColor: "rgba(7, 21, 33, 0.62)",
              color: "#fff",
              opacity: 0,
              transition: "opacity 160ms ease",
            }}
          >
            <Pencil size={20} />
          </Box>
        </MuiButton>
        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          hidden
          onChange={handleFileChange}
        />
        {uploadError || fieldState.error?.message ? (
          <Alert severity="error" sx={{ width: "100%", mt: 0.5 }}>
            {uploadError || fieldState.error?.message}
          </Alert>
        ) : null}
      </Box>
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
        setError(
          result.error ??
            "O servidor não conseguiu redefinir a senha deste(a) aluno(a). Tente novamente.",
        );
      else {
        setTemporaryPassword(result.temporaryPassword);
        setOpen(true);
      }
    } catch {
      setError(
        "Não foi possível conectar ao serviço de redefinição de senha. Verifique sua conexão e tente novamente.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <MuiButton
        size="small"
        type="button"
        aria-label={`Resetar senha de ${record?.name ?? "aluno(a)"}`}
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
      title="Presença dos(as) alunos(as)"
      perPage={10}
      sort={{ field: "date", order: "DESC" }}
      filters={searchFilters("Buscar por aluno(a), turma ou observação")}
      sx={listStyles}
    >
      <Datagrid rowClick="edit" bulkActionButtons={false} sx={gridStyles}>
        <TextField source="student.name" label="Aluno(a)" />
        <TextField source="student.registration" label="Matrícula" />
        <CalendarDateField source="date" label="Data" />
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
      label="Aluno(a)"
      perPage={100}
      sort={{ field: "name", order: "ASC" }}
    >
      <SelectInput
        optionText="name"
        validate={required()}
        fullWidth
        label="Aluno(a)"
      />
    </ReferenceInput>
  );
}

export function AttendanceCreate() {
  return (
    <Create title="Registrar presença" redirect="list" sx={formPageStyles}>
      <AdminForm>
        <StudentReference />
        <CalendarDateInput source="date" label="Data" requiredField />
        <TextInput source="subject" label="Disciplina" />
        <SelectInput
          source="status"
          label="Registro"
          validate={required()}
          choices={attendanceChoices}
        />
        <TextInput source="note" label="Observação" multiline fullWidth />
      </AdminForm>
    </Create>
  );
}

export function AttendanceEdit() {
  return (
    <Edit title="Editar registro de presença" sx={formPageStyles}>
      <AdminForm>
        <CalendarDateInput source="date" label="Data" requiredField />
        <TextInput source="subject" label="Disciplina" />
        <SelectInput
          source="status"
          label="Registro"
          validate={required()}
          choices={attendanceChoices}
        />
        <TextInput source="note" label="Observação" multiline fullWidth />
      </AdminForm>
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
      filters={searchFilters("Buscar por aluno(a) ou motivo")}
      sx={listStyles}
    >
      <Datagrid rowClick="edit" bulkActionButtons={false} sx={gridStyles}>
        <TextField source="student.name" label="Aluno(a)" />
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
        <CalendarDateField source="startsAt" label="Início" />
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
    <Create title="Registrar ocorrência" redirect="list" sx={formPageStyles}>
      <AdminForm>
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
        <CalendarDateInput
          source="startsAt"
          label="Data de início"
          requiredField
        />
        <CalendarDateInput source="endsAt" label="Fim da suspensão" />
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
      </AdminForm>
    </Create>
  );
}

export function IncidentEdit() {
  return (
    <Edit title="Editar ocorrência" sx={formPageStyles}>
      <AdminForm>
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
        <CalendarDateInput
          source="startsAt"
          label="Data de início"
          requiredField
        />
        <CalendarDateInput source="endsAt" label="Fim da suspensão" />
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
      </AdminForm>
    </Edit>
  );
}

export function PaymentList() {
  return (
    <List
      title="Mensalidades"
      perPage={10}
      sort={{ field: "dueDate", order: "DESC" }}
      filters={searchFilters("Buscar por aluno(a) ou matrícula")}
      sx={listStyles}
    >
      <Datagrid rowClick="edit" bulkActionButtons={false} sx={gridStyles}>
        <TextField source="student.name" label="Aluno(a)" />
        <TextField source="student.registration" label="Matrícula" />
        <NumberField source="amount" label="Valor (centavos)" />
        <CalendarDateField source="dueDate" label="Vencimento" />
        <CalendarDateField source="paidAt" label="Pago em" showTime />
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
        <EditButton />
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

export function PaymentEdit() {
  return (
    <Edit title="Editar mensalidade" sx={formPageStyles}>
      <AdminForm>
        <StudentReference />
        <NumberInput
          source="amount"
          label="Valor em centavos"
          min={1}
          validate={required()}
          helperText="Informe o valor como inteiro em centavos."
        />
        <CalendarDateInput
          source="dueDate"
          label="Vencimento"
          requiredField
        />
        <SelectInput
          source="status"
          label="Situação"
          validate={required()}
          choices={paymentStatusChoices}
        />
        <TextInput source="reference" label="Referência" />
      </AdminForm>
    </Edit>
  );
}

export function PaymentCreate() {
  return (
    <Create title="Registrar mensalidade" redirect="list" sx={formPageStyles}>
      <AdminForm>
        <StudentReference />
        <NumberInput
          source="amount"
          label="Valor em centavos"
          min={1}
          validate={required()}
          helperText="Informe o valor como inteiro em centavos."
        />
        <CalendarDateInput
          source="dueDate"
          label="Vencimento"
          requiredField
        />
        <TextInput source="reference" label="Referência" />
      </AdminForm>
    </Create>
  );
}

export function GradeList() {
  return (
    <List
      title="Notas lançadas"
      perPage={20}
      sort={{ field: "recordedAt", order: "DESC" }}
      filters={searchFilters("Buscar por aluno(a), disciplina ou avaliação")}
      sx={listStyles}
    >
      <Datagrid bulkActionButtons={false} sx={gridStyles}>
        <TextField source="student.name" label="Aluno(a)" />
        <TextField source="student.registration" label="Matrícula" />
        <TextField source="subject" label="Disciplina" />
        <TextField source="activity" label="Avaliação" />
        <NumberField source="score" label="Nota" />
        <NumberField source="maxScore" label="Máximo" />
        <TextField source="term" label="Período" />
        <CalendarDateField source="recordedAt" label="Lançada em" showTime />
      </Datagrid>
    </List>
  );
}

export function GradeCreate() {
  return (
    <Create title="Lançar nota" redirect="list" sx={formPageStyles}>
      <AdminForm>
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
      </AdminForm>
    </Create>
  );
}

export function LessonList() {
  return (
    <List
      title="Aulas programadas"
      perPage={20}
      sort={{ field: "startsAt", order: "ASC" }}
      filters={searchFilters("Buscar por aluno(a), disciplina ou professor")}
      sx={listStyles}
    >
      <Datagrid rowClick="edit" bulkActionButtons={false} sx={gridStyles}>
        <TextField source="student.name" label="Aluno(a)" />
        <TextField source="student.registration" label="Matrícula" />
        <TextField source="student.className" label="Turma" />
        <TextField source="subject" label="Disciplina" />
        <FunctionField
          label="Professor(a)"
          render={(record) => record.teacher || "Não informado"}
        />
        <TextField source="room" label="Sala" />
        <FunctionField
          label="Horário"
          render={(record) => {
            const start = record.startsAt
              ? formatSchoolDateTime(record.startsAt)
              : "—";
            const end = record.endsAt ? formatSchoolDateTime(record.endsAt) : "—";
            return `${start} · ${end}`;
          }}
        />
        <EditButton />
      </Datagrid>
    </List>
  );
}

export function LessonEdit() {
  return (
    <Edit title="Editar aula" sx={formPageStyles}>
      <AdminForm>
        <StudentReference />
        <TextInput source="subject" label="Disciplina" validate={required()} />
        <TextInput source="teacher" label="Professor" validate={required()} />
        <TextInput source="room" label="Sala" validate={required()} />
        <SchoolDateTimeInput
          source="startsAt"
          label="Início"
          requiredField
        />
        <SchoolDateTimeInput
          source="endsAt"
          label="Término"
          requiredField
        />
      </AdminForm>
    </Edit>
  );
}

export function LessonCreate() {
  return (
    <Create title="Programar aula" redirect="list" sx={formPageStyles}>
      <AdminForm>
        <StudentReference />
        <TextInput source="subject" label="Disciplina" validate={required()} />
        <TextInput source="teacher" label="Professor" validate={required()} />
        <TextInput source="room" label="Sala" validate={required()} />
        <SchoolDateTimeInput
          source="startsAt"
          label="Início"
          requiredField
        />
        <SchoolDateTimeInput
          source="endsAt"
          label="Término"
          requiredField
        />
      </AdminForm>
    </Create>
  );
}
