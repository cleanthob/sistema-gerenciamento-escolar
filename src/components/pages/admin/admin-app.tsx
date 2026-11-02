"use client";

import { adminDataProvider } from "@/components/school-admin-data-provider";

import {
  AttendanceCreate,
  AttendanceEdit,
  AttendanceList,
  GradeCreate,
  GradeList,
  IncidentCreate,
  IncidentEdit,
  IncidentList,
  LessonCreate,
  LessonList,
  PaymentCreate,
  PaymentEdit,
  PaymentList,
  StaffList,
  StudentCreate,
  StudentEdit,
  StudentList,
} from "@/components/school-admin-resources";
import { i18nProvider } from "@/constants/admin";
import { Admin, CustomRoutes, Resource } from "react-admin";
import { Route } from "react-router-dom";
import AdminDashboard from "./admin-dashboard";
import AdminLayout from "./admin-layout";
import EntryCheckPage from "./entry-check-page";
import { adminTheme } from "./admin-theme";

export default function AdminApp() {
  return (
    <Admin
      i18nProvider={i18nProvider}
      dataProvider={adminDataProvider}
      theme={adminTheme}
      title="Sistema Escolar"
      dashboard={AdminDashboard}
      layout={AdminLayout}
    >
      <Resource
        name="users"
        list={StaffList}
        recordRepresentation="name"
        options={{ label: "Equipe escolar" }}
      />
      <Resource
        name="students"
        list={StudentList}
        create={StudentCreate}
        edit={StudentEdit}
        recordRepresentation="name"
        options={{ label: "Alunos(as)" }}
      />
      <Resource
        name="attendance"
        list={AttendanceList}
        create={AttendanceCreate}
        edit={AttendanceEdit}
        options={{ label: "Presença" }}
      />
      <Resource
        name="grades"
        list={GradeList}
        create={GradeCreate}
        options={{ label: "Notas" }}
      />
      <Resource
        name="lessons"
        list={LessonList}
        create={LessonCreate}
        options={{ label: "Aulas" }}
      />
      <Resource
        name="payments"
        list={PaymentList}
        create={PaymentCreate}
        edit={PaymentEdit}
        options={{ label: "Pagamentos" }}
      />
      <Resource
        name="incidents"
        list={IncidentList}
        create={IncidentCreate}
        edit={IncidentEdit}
        options={{ label: "Punições e responsáveis" }}
      />
      <CustomRoutes>
        <Route path="/entry-check" element={<EntryCheckPage />} />
      </CustomRoutes>
    </Admin>
  );
}
