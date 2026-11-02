# Sistema de gerenciamento escolar

Aplicação escolar com painel administrativo e área do aluno, desenvolvida em Next.js com Prisma e SQLite em ambiente local.

## Objetivo

Gerenciar:

- cadastro e status de alunos
- presença e faltas
- notas e aulas
- pagamentos e pendências
- sanções e acompanhamento escolar
- autenticação por perfil de usuário

## Stack principal

- Next.js
- React
- Prisma ORM
- SQLite
- JWT em cookie
- bcryptjs
- React Admin

## Quick start

1. Instale as dependências:

```bash
npm install
```

2. Configure o ambiente:

```bash
cp .env.example .env
```

3. Defina as variáveis necessárias em `.env`:

```env
DATABASE_URL="file:./dev.db"
AUTH_SECRET="gere-um-segredo-forte"
ADMIN_EMAIL="admin@escola.edu.br"
ADMIN_NAME="Administrador"
ADMIN_PASSWORD="senha-forte-com-pelo-menos-12-caracteres"
```

4. Gere o cliente Prisma e aplique as migrações:

```bash
npm run db:generate
npm run db:migrate
```

5. Crie o administrador inicial:

```bash
npm run db:seed:admin
```

6. Inicie o ambiente de desenvolvimento:

```bash
npm run dev
```

## Documentação

- [Documentação do backend](./docs/backend-escolar.md)

## Scripts úteis

```bash
npm run dev
npm run build
npm run lint
npm run db:generate
npm run db:migrate
npm run db:seed:admin
npm run db:seed:mock
```

## Estrutura principal

```text
src/
  app/
  components/
  lib/
  styles/
prisma/
  schema.prisma
  seeds/
  migrations/
```

## Observações importantes

- O banco local SQLite fica em `prisma/dev.db`.
- A senha do administrador inicial é criada a partir do `.env` e não existe como valor fixo no código.
- O projeto ainda precisa de ajustes para produção, como migração para PostgreSQL e reforço de autenticação e monitoramento.
