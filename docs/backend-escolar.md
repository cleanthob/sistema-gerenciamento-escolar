# Documentação do backend do sistema escolar

Este documento descreve a API, as regras de negócio e a configuração do backend do sistema escolar. O projeto foi construído com Next.js, Prisma e SQLite em ambiente local, com autenticação baseada em cookies e sessão JWT.

## Visão geral

O sistema atende três perfis principais:

- Administração/escola: diretoria, professores e equipe escolar
- Alunos: acesso ao painel pessoal com informações acadêmicas e financeiras
- Autenticação centralizada por sessão, com controle de perfil e acesso por rota

A aplicação combina:

- Frontend em Next.js + React Admin para gestão escolar
- Backend em rotas de API dentro de `src/app/api`
- Persistência em Prisma com SQLite para desenvolvimento local
- Autorização baseada em papel (`ADMIN`, `DIRECTOR`, `TEACHER`, `STUDENT`)

## Stack e arquitetura

- Next.js 16
- React 19
- Prisma ORM
- SQLite (desenvolvimento/local)
- JWT assinado em cookie
- bcryptjs para hash de senhas

Estrutura relevante:

- `src/app/api` — rotas da API
- `src/lib/auth.ts` — criação e validação de sessão JWT
- `src/lib/prisma.ts` — cliente Prisma
- `prisma/schema.prisma` — modelos e enums
- `prisma/seeds` — dados iniciais e usuário administrador

## Requisitos locais

- Node.js 20+
- npm
- SQLite local (via Prisma)

## Configuração do ambiente

1. Copie o arquivo `.env.example` para `.env`.
2. Gere um segredo forte para a sessão e defina `AUTH_SECRET`.
3. Defina também `DATABASE_URL`, `ADMIN_EMAIL`, `ADMIN_NAME` e `ADMIN_PASSWORD`.

Exemplo rápido:

```bash
cp .env.example .env
node -e "console.log(require('crypto').randomBytes(32).toString('base64url'))"
```

O valor gerado deve ser usado em `AUTH_SECRET`.

Importante:

- `ADMIN_PASSWORD` deve ter no mínimo 12 caracteres.
- A conta administrativa não existe por padrão; ela é criada via seed.
- O SQLite local (`dev.db`) não deve ser versionado.

## Inicialização

```bash
npm install
npm run db:generate
npm run db:migrate
npm run db:seed:admin
npm run dev
```

Se a intenção for popular dados extra de demonstração, também é possível executar:

```bash
npm run db:seed:mock
```

## Credenciais iniciais

A seed cria um usuário administrador com os valores definidos em `.env`:

- `ADMIN_EMAIL`
- `ADMIN_NAME`
- `ADMIN_PASSWORD`

O papel do usuário será `ADMIN`.

## Modelos principais

### `User`

Representa contas internas da escola, como administração e professores.

Campos principais:

- `id`
- `email`
- `name`
- `photoUrl`
- `passwordHash`
- `role`
- `department`
- `phone`
- `active`

### `Student`

Representa o cadastro do aluno.

Campos principais:

- `registration`
- `name`
- `grade`
- `className`
- `status`
- `guardianName`
- `guardianPhone`
- `guardianEmail`
- `passwordHash`
- `mustChangePassword`

### `Payment`

Controle financeiro do aluno.

- `amount` em centavos
- `dueDate`
- `paidAt`
- `status` (`PENDING`, `PAID`, `WAIVED`)

### `Attendance`

Presença do aluno em atividades ou aulas.

- `date`
- `subject`
- `status` (`PRESENT`, `ABSENT`, `LATE`, `EXCUSED`)

### `Grade`

Notas e avaliações.

- `subject`
- `activity`
- `score`
- `maxScore`
- `term`

### `Lesson`

Agenda de aulas.

- `subject`
- `teacher`
- `room`
- `startsAt`
- `endsAt`

### `Sanction`

Advertências e suspensões.

- `type` (`WARNING`, `SUSPENSION`)
- `startsAt`
- `endsAt`
- `guardianContactRequired`
- `guardianContactStatus`

## Autenticação e autorização

A sessão é criada em `src/lib/auth.ts` e armazenada em cookie com as seguintes propriedades:

- `httpOnly: true`
- `sameSite: "lax"`
- duração de 8 horas
- assinatura JWT com `HS256`

O payload inclui:

- `sub` (identidade do usuário)
- `role`
- `name`
- `mustChangePassword`

A validação de sessão ocorre via `jwtVerify()` e a autenticação é feita por cookie, nunca por query string ou header público.

### Perfis permitidos

```ts
enum UserRole {
  ADMIN
  DIRECTOR
  TEACHER
  STUDENT
}
```

As rotas de API validam acesso por perfil e, quando necessário, também por identidade do próprio aluno.

## Rotas da API

| Método | Caminho | Acesso | Descrição |
| --- | --- | --- | --- |
| `POST` | `/api/auth/login` | Público | Login com `identifier`, `password` e `audience` (`STAFF` ou `STUDENT`) |
| `POST` | `/api/auth/logout` | Sessão atual | Finaliza sessão no navegador |
| `GET` | `/api/auth/session` | Sessão atual | Retorna perfil autenticado sem dados sensíveis |
| `GET` | `/api/students` | Direção/professor | Lista e busca alunos |
| `POST` | `/api/students` | Direção/professor | Cadastra aluno com senha inicial e troca obrigatória |
| `GET` | `/api/students/:id` | Direção/professor | Consulta cadastro |
| `PATCH` / `PUT` | `/api/students/:id` | Direção/professor | Atualiza campos enviados |
| `DELETE` | `/api/students/:id` | Direção/professor | Arquiva matrícula como inativa |
| `POST` | `/api/students/:id/reset-password` | Direção | Gera ou define senha temporária |
| `POST` | `/api/students/me/password` | Aluno autenticado | Troca a senha atual |
| `GET` | `/api/students/:id/status` | Equipe ou próprio aluno | Consulta status de presença, sanções e pagamentos |
| `POST` | `/api/entry/check` | Direção/professor | Verifica entrada por matrícula |
| `GET` / `POST` | `/api/attendance` | Equipe; alunos leem próprios dados | Lista e registra presença |
| `PATCH` | `/api/attendance/:id` | Equipe | Corrige presença |
| `GET` / `POST` | `/api/sanctions` | Equipe | Consulta e registra advertências/suspensões |
| `PATCH` | `/api/sanctions/:id` | Equipe | Atualiza ocorrência |
| `GET` / `POST` | `/api/payments` | Equipe; alunos leem próprios dados | Consulta e registra mensalidades |
| `PATCH` | `/api/payments?id=:id` | Direção | Atualiza status da mensalidade |
| `GET` / `POST` | `/api/grades` | Equipe; alunos leem próprias notas | Lista e registra notas |
| `GET` / `POST` | `/api/lessons` | Equipe; alunos leem próprias aulas | Consulta e agenda aulas |
| `GET` | `/api/staff` | Equipe escolar | Lista contas reais da equipe |
| `GET` | `/api/admin/overview` | Equipe escolar | Calcula indicadores e agenda |

Observações:

- Respostas de listagem seguem o padrão `{ data, total }`.
- Rotas administrativas sem autenticação retornam `401`.
- Quando o usuário não tem permissão, a API responde `403`.
- O campo `canEnter` pode ser falso quando a matrícula está inativa, há suspensão vigente ou pendência financeira.

## Regras de negócio relevantes

- Senhas são armazenadas como hash com `bcryptjs`.
- O aluno pode ser forçado a trocar a senha no primeiro login (`mustChangePassword`).
- Suspensão bloqueia entrada somente no intervalo de vigência.
- Advertências não bloqueiam entrada automaticamente.
- Excluir um aluno é feito de forma lógica para preservar histórico de presença, pagamentos e ocorrências.
- Quando um reset de senha é executado por direção, a senha temporária é devolvida em resposta única para uso seguro.

## Segurança e boas práticas

- O segredo `AUTH_SECRET` é obrigatório em produção e não deve ser compartilhado.
- Cookies de sessão são `HttpOnly` e `SameSite=Lax`.
- A sessão expira em 8 horas.
- `ADMIN` e `DIRECTOR` têm acesso administrativo; `STUDENT` fica restrito ao próprio portal.
- Para produção, recomenda-se:
  - trocar SQLite por PostgreSQL
  - configurar envio de email/SMS
  - limitar tentativas de login e reset
  - aplicar rate limiting e monitoramento

## Limites conhecidos

- A equipe está em modo de leitura para parte do cadastro de usuários e a criação/edição de usuários ainda depende de fluxos específicos e APIs próprias.
- Registros ainda não cadastrados podem resultar em listas ou gráficos vazios.
- O fluxo de recuperação de senha para alunos ainda depende de canal humano ou de provider externo configurado.

## Próximos passos sugeridos

1. Migrar banco para PostgreSQL em produção.
2. Implementar recuperação de senha por e-mail/SMS real.
3. Reforçar rate limiting e observabilidade.
4. Expandir APIs administrativas com criação e edição de usuários.
5. Adicionar testes automatizados para autenticação e regras de negócio.
