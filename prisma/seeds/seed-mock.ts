import {
  PrismaClient,
  UserRole,
  StudentStatus,
  PaymentStatus,
  AttendanceStatus,
  SanctionType,
  GuardianContactStatus,
} from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await hash("Mock@Escola123", 12);

  // =====================================================
  // 1. USUÁRIOS
  // =====================================================

  const users = [
    {
      email: "diretor@escola.test",
      name: "Mariana Oliveira",
      role: UserRole.DIRECTOR,
      department: "Direção",
      phone: "(83) 99999-0002",
    },
    {
      email: "professor@escola.test",
      name: "Carlos Henrique",
      role: UserRole.TEACHER,
      department: "Matemática",
      phone: "(83) 99999-0003",
    },
    {
      email: "professora@escola.test",
      name: "Ana Beatriz",
      role: UserRole.TEACHER,
      department: "Português",
      phone: "(83) 99999-0004",
    },
  ];

  for (const user of users) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: {
        name: user.name,
        role: user.role,
        department: user.department,
        phone: user.phone,
        active: true,
      },
      create: {
        ...user,
        passwordHash,
      },
    });
  }

  // =====================================================
  // 2. ALUNOS
  // =====================================================

  const studentsData = [
    {
      registration: "2026001",
      name: "Lucas Ferreira",
      email: "lucas@aluno.test",
      grade: "6º Ano",
      className: "A",
      guardianName: "Roberto Ferreira",
      guardianPhone: "(83) 98888-0001",
      guardianEmail: "roberto@example.test",
    },
    {
      registration: "2026002",
      name: "Sofia Almeida",
      email: "sofia@aluno.test",
      grade: "6º Ano",
      className: "A",
      guardianName: "Patrícia Almeida",
      guardianPhone: "(83) 98888-0002",
      guardianEmail: "patricia@example.test",
    },
    {
      registration: "2026003",
      name: "Gabriel Santos",
      email: "gabriel@aluno.test",
      grade: "6º Ano",
      className: "B",
      guardianName: "Marcos Santos",
      guardianPhone: "(83) 98888-0003",
      guardianEmail: "marcos@example.test",
    },
    {
      registration: "2026004",
      name: "Isabella Costa",
      email: "isabella@aluno.test",
      grade: "7º Ano",
      className: "A",
      guardianName: "Juliana Costa",
      guardianPhone: "(83) 98888-0004",
      guardianEmail: "juliana@example.test",
    },
    {
      registration: "2026005",
      name: "Pedro Rodrigues",
      email: "pedro@aluno.test",
      grade: "7º Ano",
      className: "A",
      guardianName: "André Rodrigues",
      guardianPhone: "(83) 98888-0005",
      guardianEmail: "andre@example.test",
    },
    {
      registration: "2026006",
      name: "Manuela Lima",
      email: "manuela@aluno.test",
      grade: "8º Ano",
      className: "B",
      guardianName: "Fernanda Lima",
      guardianPhone: "(83) 98888-0006",
      guardianEmail: "fernanda@example.test",
    },
    {
      registration: "2026007",
      name: "Arthur Souza",
      email: "arthur@aluno.test",
      grade: "9º Ano",
      className: "A",
      guardianName: "Ricardo Souza",
      guardianPhone: "(83) 98888-0007",
      guardianEmail: "ricardo@example.test",
    },
    {
      registration: "2026008",
      name: "Valentina Martins",
      email: "valentina@aluno.test",
      grade: "9º Ano",
      className: "A",
      guardianName: "Camila Martins",
      guardianPhone: "(83) 98888-0008",
      guardianEmail: "camila@example.test",
    },
  ];

  // 32 alunos adicionais para testar listagens, filtros e paginação.
  studentsData.push(
    {
      registration: "2026009",
      name: "Beatriz Carvalho",
      email: "aluno09@aluno.test",
      grade: "6º Ano",
      className: "B",
      guardianName: "Responsável de Beatriz",
      guardianPhone: "(83) 98888-0009",
      guardianEmail: "responsavel09@example.test",
    },
    {
      registration: "2026010",
      name: "Miguel Ribeiro",
      email: "aluno10@aluno.test",
      grade: "6º Ano",
      className: "B",
      guardianName: "Responsável de Miguel",
      guardianPhone: "(83) 98888-0010",
      guardianEmail: "responsavel10@example.test",
    },
    {
      registration: "2026011",
      name: "Helena Gomes",
      email: "aluno11@aluno.test",
      grade: "6º Ano",
      className: "C",
      guardianName: "Responsável de Helena",
      guardianPhone: "(83) 98888-0011",
      guardianEmail: "responsavel11@example.test",
    },
    {
      registration: "2026012",
      name: "Bernardo Alves",
      email: "aluno12@aluno.test",
      grade: "6º Ano",
      className: "C",
      guardianName: "Responsável de Bernardo",
      guardianPhone: "(83) 98888-0012",
      guardianEmail: "responsavel12@example.test",
    },
    {
      registration: "2026013",
      name: "Laura Nascimento",
      email: "aluno13@aluno.test",
      grade: "7º Ano",
      className: "A",
      guardianName: "Responsável de Laura",
      guardianPhone: "(83) 98888-0013",
      guardianEmail: "responsavel13@example.test",
    },
    {
      registration: "2026014",
      name: "Heitor Barbosa",
      email: "aluno14@aluno.test",
      grade: "7º Ano",
      className: "A",
      guardianName: "Responsável de Heitor",
      guardianPhone: "(83) 98888-0014",
      guardianEmail: "responsavel14@example.test",
    },
    {
      registration: "2026015",
      name: "Alice Moreira",
      email: "aluno15@aluno.test",
      grade: "7º Ano",
      className: "B",
      guardianName: "Responsável de Alice",
      guardianPhone: "(83) 98888-0015",
      guardianEmail: "responsavel15@example.test",
    },
    {
      registration: "2026016",
      name: "Davi Cardoso",
      email: "aluno16@aluno.test",
      grade: "7º Ano",
      className: "B",
      guardianName: "Responsável de Davi",
      guardianPhone: "(83) 98888-0016",
      guardianEmail: "responsavel16@example.test",
    },
    {
      registration: "2026017",
      name: "Lívia Teixeira",
      email: "aluno17@aluno.test",
      grade: "7º Ano",
      className: "C",
      guardianName: "Responsável de Lívia",
      guardianPhone: "(83) 98888-0017",
      guardianEmail: "responsavel17@example.test",
    },
    {
      registration: "2026018",
      name: "Samuel Correia",
      email: "aluno18@aluno.test",
      grade: "7º Ano",
      className: "C",
      guardianName: "Responsável de Samuel",
      guardianPhone: "(83) 98888-0018",
      guardianEmail: "responsavel18@example.test",
    },
    {
      registration: "2026019",
      name: "Cecília Mendes",
      email: "aluno19@aluno.test",
      grade: "8º Ano",
      className: "A",
      guardianName: "Responsável de Cecília",
      guardianPhone: "(83) 98888-0019",
      guardianEmail: "responsavel19@example.test",
    },
    {
      registration: "2026020",
      name: "Theo Fernandes",
      email: "aluno20@aluno.test",
      grade: "8º Ano",
      className: "A",
      guardianName: "Responsável de Theo",
      guardianPhone: "(83) 98888-0020",
      guardianEmail: "responsavel20@example.test",
    },
    {
      registration: "2026021",
      name: "Maria Eduarda Rocha",
      email: "aluno21@aluno.test",
      grade: "8º Ano",
      className: "B",
      guardianName: "Responsável de Maria",
      guardianPhone: "(83) 98888-0021",
      guardianEmail: "responsavel21@example.test",
    },
    {
      registration: "2026022",
      name: "Enzo Dias",
      email: "aluno22@aluno.test",
      grade: "8º Ano",
      className: "B",
      guardianName: "Responsável de Enzo",
      guardianPhone: "(83) 98888-0022",
      guardianEmail: "responsavel22@example.test",
    },
    {
      registration: "2026023",
      name: "Lara Monteiro",
      email: "aluno23@aluno.test",
      grade: "8º Ano",
      className: "C",
      guardianName: "Responsável de Lara",
      guardianPhone: "(83) 98888-0023",
      guardianEmail: "responsavel23@example.test",
    },
    {
      registration: "2026024",
      name: "Guilherme Castro",
      email: "aluno24@aluno.test",
      grade: "8º Ano",
      className: "C",
      guardianName: "Responsável de Guilherme",
      guardianPhone: "(83) 98888-0024",
      guardianEmail: "responsavel24@example.test",
    },
    {
      registration: "2026025",
      name: "Isadora Freitas",
      email: "aluno25@aluno.test",
      grade: "9º Ano",
      className: "A",
      guardianName: "Responsável de Isadora",
      guardianPhone: "(83) 98888-0025",
      guardianEmail: "responsavel25@example.test",
    },
    {
      registration: "2026026",
      name: "Benjamin Lopes",
      email: "aluno26@aluno.test",
      grade: "9º Ano",
      className: "A",
      guardianName: "Responsável de Benjamin",
      guardianPhone: "(83) 98888-0026",
      guardianEmail: "responsavel26@example.test",
    },
    {
      registration: "2026027",
      name: "Melissa Vieira",
      email: "aluno27@aluno.test",
      grade: "9º Ano",
      className: "B",
      guardianName: "Responsável de Melissa",
      guardianPhone: "(83) 98888-0027",
      guardianEmail: "responsavel27@example.test",
    },
    {
      registration: "2026028",
      name: "Joaquim Batista",
      email: "aluno28@aluno.test",
      grade: "9º Ano",
      className: "B",
      guardianName: "Responsável de Joaquim",
      guardianPhone: "(83) 98888-0028",
      guardianEmail: "responsavel28@example.test",
    },
    {
      registration: "2026029",
      name: "Eloá Pinto",
      email: "aluno29@aluno.test",
      grade: "6º Ano",
      className: "A",
      guardianName: "Responsável de Eloá",
      guardianPhone: "(83) 98888-0029",
      guardianEmail: "responsavel29@example.test",
    },
    {
      registration: "2026030",
      name: "Matheus Azevedo",
      email: "aluno30@aluno.test",
      grade: "6º Ano",
      className: "A",
      guardianName: "Responsável de Matheus",
      guardianPhone: "(83) 98888-0030",
      guardianEmail: "responsavel30@example.test",
    },
    {
      registration: "2026031",
      name: "Yasmin Campos",
      email: "aluno31@aluno.test",
      grade: "6º Ano",
      className: "B",
      guardianName: "Responsável de Yasmin",
      guardianPhone: "(83) 98888-0031",
      guardianEmail: "responsavel31@example.test",
    },
    {
      registration: "2026032",
      name: "Lorenzo Andrade",
      email: "aluno32@aluno.test",
      grade: "6º Ano",
      className: "B",
      guardianName: "Responsável de Lorenzo",
      guardianPhone: "(83) 98888-0032",
      guardianEmail: "responsavel32@example.test",
    },
    {
      registration: "2026033",
      name: "Nicole Melo",
      email: "aluno33@aluno.test",
      grade: "7º Ano",
      className: "A",
      guardianName: "Responsável de Nicole",
      guardianPhone: "(83) 98888-0033",
      guardianEmail: "responsavel33@example.test",
    },
    {
      registration: "2026034",
      name: "Ryan Moura",
      email: "aluno34@aluno.test",
      grade: "7º Ano",
      className: "A",
      guardianName: "Responsável de Ryan",
      guardianPhone: "(83) 98888-0034",
      guardianEmail: "responsavel34@example.test",
    },
    {
      registration: "2026035",
      name: "Agatha Cunha",
      email: "aluno35@aluno.test",
      grade: "8º Ano",
      className: "B",
      guardianName: "Responsável de Agatha",
      guardianPhone: "(83) 98888-0035",
      guardianEmail: "responsavel35@example.test",
    },
    {
      registration: "2026036",
      name: "Otávio Pires",
      email: "aluno36@aluno.test",
      grade: "8º Ano",
      className: "B",
      guardianName: "Responsável de Otávio",
      guardianPhone: "(83) 98888-0036",
      guardianEmail: "responsavel36@example.test",
    },
    {
      registration: "2026037",
      name: "Esther Reis",
      email: "aluno37@aluno.test",
      grade: "9º Ano",
      className: "A",
      guardianName: "Responsável de Esther",
      guardianPhone: "(83) 98888-0037",
      guardianEmail: "responsavel37@example.test",
    },
    {
      registration: "2026038",
      name: "Vinícius Duarte",
      email: "aluno38@aluno.test",
      grade: "9º Ano",
      className: "A",
      guardianName: "Responsável de Vinícius",
      guardianPhone: "(83) 98888-0038",
      guardianEmail: "responsavel38@example.test",
    },
    {
      registration: "2026039",
      name: "Maitê Peixoto",
      email: "aluno39@aluno.test",
      grade: "7º Ano",
      className: "C",
      guardianName: "Responsável de Maitê",
      guardianPhone: "(83) 98888-0039",
      guardianEmail: "responsavel39@example.test",
    },
    {
      registration: "2026040",
      name: "Antônio Farias",
      email: "aluno40@aluno.test",
      grade: "8º Ano",
      className: "C",
      guardianName: "Responsável de Antônio",
      guardianPhone: "(83) 98888-0040",
      guardianEmail: "responsavel40@example.test",
    },
  );

  const students = [];

  for (const student of studentsData) {
    const savedStudent = await prisma.student.upsert({
      where: {
        registration: student.registration,
      },
      update: {
        ...student,
        status: StudentStatus.ACTIVE,
      },
      create: {
        ...student,
        passwordHash,
        mustChangePassword: true,
        status: StudentStatus.ACTIVE,
      },
    });

    students.push(savedStudent);
  }

  // =====================================================
  // 3. PAGAMENTOS
  // =====================================================

  for (let i = 0; i < students.length; i++) {
    const student = students[i];

    const payments = [
      {
        reference: `MOCK-${student.registration}-2026-09`,
        amount: 35000,
        dueDate: new Date("2026-09-10T12:00:00.000Z"),
        paidAt: new Date("2026-09-08T12:00:00.000Z"),
        status: PaymentStatus.PAID,
      },
      {
        reference: `MOCK-${student.registration}-2026-10`,
        amount: 35000,
        dueDate: new Date("2026-10-10T12:00:00.000Z"),
        paidAt: null,
        status: PaymentStatus.PENDING,
      },
      {
        reference: `MOCK-${student.registration}-2026-11`,
        amount: 35000,
        dueDate: new Date("2026-11-10T12:00:00.000Z"),
        paidAt: null,
        status: i === 7 ? PaymentStatus.WAIVED : PaymentStatus.PENDING,
      },
    ];

    for (const payment of payments) {
      const existing = await prisma.payment.findFirst({
        where: {
          studentId: student.id,
          reference: payment.reference,
        },
      });

      if (existing) {
        await prisma.payment.update({
          where: { id: existing.id },
          data: payment,
        });
      } else {
        await prisma.payment.create({
          data: {
            ...payment,
            studentId: student.id,
          },
        });
      }
    }
  }

  // =====================================================
  // 4. FREQUÊNCIA
  // =====================================================

  const attendanceStatuses = [
    AttendanceStatus.PRESENT,
    AttendanceStatus.PRESENT,
    AttendanceStatus.ABSENT,
    AttendanceStatus.LATE,
    AttendanceStatus.EXCUSED,
  ];

  for (let i = 0; i < students.length; i++) {
    const student = students[i];

    for (let day = 1; day <= 20; day++) {
      const date = new Date(Date.UTC(2026, 9, day, 12, 0, 0));

      const subject = day % 2 === 0 ? "Matemática" : "Português";

      const status = attendanceStatuses[(i + day) % attendanceStatuses.length];

      await prisma.attendance.upsert({
        where: {
          studentId_date_subject: {
            studentId: student.id,
            date,
            subject,
          },
        },
        update: {
          status,
          note:
            status === AttendanceStatus.ABSENT
              ? "Falta registrada para demonstração."
              : status === AttendanceStatus.LATE
                ? "Atraso registrado para demonstração."
                : null,
          recordedBy: "Professor",
        },
        create: {
          studentId: student.id,
          date,
          subject,
          status,
          note:
            status === AttendanceStatus.ABSENT
              ? "Falta registrada para demonstração."
              : status === AttendanceStatus.LATE
                ? "Atraso registrado para demonstração."
                : null,
          recordedBy: "Professor",
        },
      });
    }
  }

  // =====================================================
  // 5. AULAS
  // =====================================================

  for (const student of students) {
    const existingLessons = await prisma.lesson.count({
      where: { studentId: student.id },
    });

    if (existingLessons > 0) continue;

    const startsAt = new Date("2026-11-02T11:00:00.000Z");

    await prisma.lesson.createMany({
      data: [
        {
          studentId: student.id,
          subject: "Matemática",
          teacher: "Carlos Henrique",
          room: `Sala ${student.className}`,
          startsAt,
          endsAt: new Date(startsAt.getTime() + 50 * 60 * 1000),
        },
        {
          studentId: student.id,
          subject: "Português",
          teacher: "Ana Beatriz",
          room: `Sala ${student.className}`,
          startsAt: new Date(startsAt.getTime() + 60 * 60 * 1000),
          endsAt: new Date(startsAt.getTime() + 110 * 60 * 1000),
        },
      ],
    });
  }

  // =====================================================
  // 6. NOTAS
  // =====================================================

  for (let i = 0; i < students.length; i++) {
    const student = students[i];

    const existingGrades = await prisma.grade.count({
      where: { studentId: student.id },
    });

    if (existingGrades > 0) continue;

    await prisma.grade.createMany({
      data: [
        {
          studentId: student.id,
          subject: "Matemática",
          activity: "Avaliação bimestral",
          score: 6 + (i % 5),
          maxScore: 10,
          term: "2026 - 2º Bimestre",
        },
        {
          studentId: student.id,
          subject: "Português",
          activity: "Trabalho escrito",
          score: 7 + (i % 4),
          maxScore: 10,
          term: "2026 - 2º Bimestre",
        },
        {
          studentId: student.id,
          subject: "Ciências",
          activity: "Atividade prática",
          score: 5.5 + (i % 5),
          maxScore: 10,
          term: "2026 - 2º Bimestre",
        },
      ],
    });
  }

  // =====================================================
  // 7. SANÇÕES DISCIPLINARES
  // =====================================================

  const sanctions = [
    {
      registration: "2026003",
      type: SanctionType.WARNING,
      reason: "Conversa excessiva durante a aula.",
      startsAt: new Date("2026-10-20T12:00:00.000Z"),
      endsAt: null,
    },
    {
      registration: "2026007",
      type: SanctionType.SUSPENSION,
      reason: "Descumprimento recorrente das regras escolares.",
      startsAt: new Date("2026-10-26T12:00:00.000Z"),
      endsAt: new Date("2026-10-28T12:00:00.000Z"),
    },
  ];

  // Sanções adicionais distribuídas entre os alunos para cenários de teste.
  sanctions.push(
    ...studentsData.slice(8, 28).map((student, index) => ({
      registration: student.registration,
      type: index % 4 === 0 ? SanctionType.SUSPENSION : SanctionType.WARNING,
      reason: [
        "Uso de celular durante a aula.",
        "Atrasos recorrentes.",
        "Descumprimento das orientações do professor.",
        "Conversa excessiva durante atividade.",
        "Comportamento inadequado no intervalo.",
      ][index % 5],
      startsAt: new Date(Date.UTC(2026, 9, 10 + (index % 15), 12, 0, 0)),
      endsAt:
        index % 4 === 0
          ? new Date(Date.UTC(2026, 9, 11 + (index % 15), 12, 0, 0))
          : null,
    })),
  );

  for (const sanction of sanctions) {
    const student = students.find(
      (item) => item.registration === sanction.registration,
    );

    if (!student) continue;

    const existing = await prisma.sanction.findFirst({
      where: {
        studentId: student.id,
        reason: sanction.reason,
      },
    });

    if (existing) continue;

    await prisma.sanction.create({
      data: {
        studentId: student.id,
        type: sanction.type,
        reason: sanction.reason,
        startsAt: sanction.startsAt,
        endsAt: sanction.endsAt,
        guardianContactRequired: true,
        guardianContactStatus: GuardianContactStatus.PENDING,
        notes: "Registro fictício para testes.",
        createdBy: "Administrador do Sistema",
      },
    });
  }

  console.log("==================================");
  console.log("Seed mock executado com sucesso!");
  console.log(`Usuários: ${users.length}`);
  console.log(`Alunos: ${students.length}`);
  console.log(`Pagamentos: ${students.length * 3}`);
  console.log(`Frequências previstas: ${students.length * 20}`);
  console.log(`Aulas previstas: ${students.length * 2}`);
  console.log(`Notas previstas: ${students.length * 3}`);
  console.log(`Sanções processadas: ${sanctions.length}`);
  console.log("==================================");
}

main()
  .catch((error: unknown) => {
    console.error("Erro ao executar o seed mock:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
