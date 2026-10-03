# Backend do sistema escolar

## Inicialização local

1. Copie `.env.example` para `.env`.
2. Gere um segredo de sessão com `node -e "console.log(require('crypto').randomBytes(32).toString('base64url'))"` e preencha `AUTH_SECRET` com o resultado.
3. Defina `BOOTSTRAP_ADMIN_EMAIL`, `BOOTSTRAP_ADMIN_NAME` e `BOOTSTRAP_ADMIN_PASSWORD` no `.env`. A senha inicial do administrador deve ter pelo menos 12 caracteres.
4. Execute `npm run db:migrate` e `npm run db:seed`.
5. Inicie com `npm run dev`.

As credenciais administrativas só são criadas pelo seed com valores fornecidos localmente. Não há conta ou senha padrão no código. O arquivo do SQLite local não deve ser versionado.

## Rotas

| Método e caminho | Acesso | Operação |
| --- | --- | --- |
| `POST /api/auth/login` | Público | Login com `identifier`, `password` e `audience` (`STAFF` ou `STUDENT`); os portais não aceitam o outro perfil |
| `POST /api/auth/logout` | Sessão atual | Encerra a sessão no navegador |
| `GET /api/auth/session` | Sessão atual | Retorna perfil sem dados de senha |
| `GET /api/students` | Direção/professor | Lista e busca alunos |
| `POST /api/students` | Direção/professor | Cadastra aluno com senha inicial e troca obrigatória |
| `GET /api/students/:id` | Direção/professor | Consulta cadastro |
| `PATCH` ou `PUT /api/students/:id` | Direção/professor | Atualiza campos enviados |
| `DELETE /api/students/:id` | Direção/professor | Arquiva matrícula como inativa, preservando histórico |
| `POST /api/students/:id/reset-password` | Direção | Gera ou define senha temporária, exibida somente na resposta |
| `POST /api/students/me/password` | Aluno autenticado | Troca a senha atual e atualiza a sessão |
| `GET /api/students/:id/status` | Equipe ou o próprio aluno | Consulta presença, suspensão, pagamentos vencidos e liberação |
| `POST /api/entry/check` | Direção/professor | Consulta de entrada pela matrícula |
| `GET` e `POST /api/attendance` | Equipe; aluno só lê os próprios dados | Lista e registra presença |
| `PATCH /api/attendance/:id` | Equipe | Corrige registro de presença |
| `GET` e `POST /api/sanctions` | Equipe | Consulta e registra advertência/suspensão e contato familiar |
| `PATCH /api/sanctions/:id` | Equipe | Atualiza medida ou situação do contato |
| `GET` e `POST /api/payments` | Equipe; aluno só lê os próprios dados | Consulta ou registra mensalidade. `amount` é informado em centavos |
| `PATCH /api/payments?id=:id` | Direção | Marca mensalidade pendente, paga ou dispensada |
| `GET` e `POST /api/grades` | Equipe; aluno só lê as próprias notas | Lista e lança notas no banco |
| `GET` e `POST /api/lessons` | Equipe; aluno só lê as próprias aulas | Consulta e programa aulas |
| `GET /api/staff` | Equipe escolar | Lista contas reais da equipe |
| `GET /api/admin/overview` | Equipe escolar | Calcula indicadores e agenda a partir do banco |

As respostas de listagem usam `{ data, total }`. As rotas administrativas retornam `401` sem sessão e `403` quando o perfil autenticado não tem permissão. O campo `canEnter` é falso se a matrícula estiver inativa, existir suspensão vigente ou houver mensalidade vencida pendente.

## Segurança e limites atuais

- Senhas são armazenadas com bcrypt; nunca são incluídas em respostas de cadastro/listagem.
- A sessão é um JWT assinado em cookie `HttpOnly`, `SameSite=Lax`, com validade de 8 horas. O segredo `AUTH_SECRET` é obrigatório e não pode ser compartilhado.
- `/admin` permite apenas equipe escolar e `/dashboard` apenas alunos; perfis incompatíveis recebem a tela de acesso não autorizado.
- Alunos que receberam senha temporária são direcionados para `/login/change-password` antes de acessar o dashboard. A nova senha exige pelo menos 12 caracteres.
- A suspensão só bloqueia durante o intervalo de datas. Advertências não bloqueiam a entrada.
- A exclusão de aluno é lógica para manter vínculos de frequência, pagamentos e ocorrências.
- O reset administrativo retorna a senha temporária uma vez para entrega por canal seguro. A opção “Esqueci minha senha” orienta o aluno a procurar a secretaria; envio automatizado por e-mail/SMS ainda exige configurar um provedor.
- As listas do React-Admin e as páginas do aluno consultam as rotas Prisma. Registros ainda não cadastrados aparecem como listas/gráficos vazios, sem valores demonstrativos. A equipe está em modo somente leitura até existir uma API própria de criação/edição de usuários.
- Para produção, troque SQLite por PostgreSQL, configure envio de e-mail e limite tentativas de login/reset com rate limiting e monitoramento.
