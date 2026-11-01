"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const loginFields = z.object({
  identifier: z.string().trim().min(1, "Informe sua matrícula ou e-mail."),
  password: z.string().min(1, "Informe sua senha."),
});

const loginFormSchema = loginFields.extend({
  audience: z.enum(["STUDENT", "STAFF"]),
});
const passwordChangeSchema = z
  .object({
    currentPassword: z.string().min(1, "Informe sua senha atual."),
    newPassword: z.string().min(12, "Use pelo menos 12 caracteres.").max(128),
    confirmation: z.string().min(1, "Confirme a nova senha."),
  })
  .refine((values) => values.newPassword === values.confirmation, {
    message: "As senhas não coincidem.",
    path: ["confirmation"],
  });

type LoginFields = z.infer<typeof loginFormSchema>;
type ChangePasswordFields = z.infer<typeof passwordChangeSchema>;

function FormError({ children, id }: { children?: string; id?: string }) {
  if (!children) return null;
  return (
    <p id={id} role="alert" className="text-sm text-[#f28b82]">
      {children}
    </p>
  );
}

function useLogin(audience: "STUDENT" | "STAFF") {
  const router = useRouter();
  const [requestError, setRequestError] = useState("");
  const form = useForm<LoginFields>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: { identifier: "", password: "", audience },
  });

  const submit = form.handleSubmit(async (values) => {
    setRequestError("");
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, audience }),
      });
      const result = await response.json();
      if (!response.ok) {
        setRequestError(
          result.error ??
            (audience === "STUDENT"
              ? "Não foi possível validar seu acesso de aluno. Confira sua matrícula, e-mail e senha."
              : "Não foi possível validar seu acesso à equipe. Confira seu e-mail institucional e senha."),
        );
        return;
      }
      if (audience === "STAFF") router.replace("/admin");
      else
        router.replace(
          result.mustChangePassword ? "/login/change-password" : "/dashboard",
        );
      router.refresh();
    } catch {
      setRequestError(
        "Não foi possível conectar ao serviço de autenticação. Verifique sua conexão e tente entrar novamente.",
      );
    }
  });

  return { form, submit, requestError };
}

export function StudentLoginForm() {
  const { form, submit, requestError } = useLogin("STUDENT");
  const {
    register,
    formState: { errors, isSubmitting },
  } = form;

  return (
    <form onSubmit={submit} noValidate className="auth-form mt-8">
      <div className="space-y-2">
        <label
          htmlFor="student-id"
          className="text-sm font-medium text-[#dce8f1]"
        >
          Matrícula ou e-mail
        </label>
        <Input
          id="student-id"
          autoComplete="username"
          placeholder="Digite sua matrícula"
          aria-invalid={Boolean(errors.identifier)}
          aria-describedby={errors.identifier ? "student-id-error" : undefined}
          className="h-12 rounded-md text-sm"
          {...register("identifier")}
        />
        <FormError id="student-id-error">{errors.identifier?.message}</FormError>
      </div>
      <div className="space-y-2">
        <label
          htmlFor="student-password"
          className="text-sm font-medium text-[#dce8f1]"
        >
          Senha
        </label>
        <Input
          id="student-password"
          type="password"
          autoComplete="current-password"
          placeholder="Digite sua senha"
          aria-invalid={Boolean(errors.password)}
          aria-describedby={errors.password ? "student-password-error" : undefined}
          className="h-12 rounded-md text-sm"
          {...register("password")}
        />
        <FormError id="student-password-error">{errors.password?.message}</FormError>
      </div>
      <div className="flex justify-end">
        <a
          href="/login/forgot-password"
          className="text-sm font-medium text-[#75baf2] underline-offset-4 hover:text-[#a7d5f7] hover:underline"
        >
          Esqueci minha senha
        </a>
      </div>
      <FormError>{requestError}</FormError>
      <Button
        type="submit"
        disabled={isSubmitting}
        className="h-12 w-full rounded-md bg-[#39a0ed] text-sm font-semibold text-[#071521] hover:bg-[#75baf2]"
      >
        {isSubmitting ? "Entrando..." : "Entrar"}
      </Button>
    </form>
  );
}

export function StaffLoginForm() {
  const { form, submit, requestError } = useLogin("STAFF");
  const {
    register,
    formState: { errors, isSubmitting },
  } = form;

  return (
    <form onSubmit={submit} noValidate className="auth-form mt-8">
      <div className="space-y-2">
        <label
          htmlFor="staff-email"
          className="text-sm font-medium text-[#dce8f1]"
        >
          E-mail institucional
        </label>
        <Input
          id="staff-email"
          type="email"
          autoComplete="username"
          placeholder="nome@escola.edu.br"
          aria-invalid={Boolean(errors.identifier)}
          aria-describedby={errors.identifier ? "staff-email-error" : undefined}
          className="h-12 rounded-md text-sm"
          {...register("identifier")}
        />
        <FormError id="staff-email-error">{errors.identifier?.message}</FormError>
      </div>
      <div className="space-y-2">
        <label
          htmlFor="staff-password"
          className="text-sm font-medium text-[#dce8f1]"
        >
          Senha
        </label>
        <Input
          id="staff-password"
          type="password"
          autoComplete="current-password"
          placeholder="Digite sua senha"
          aria-invalid={Boolean(errors.password)}
          aria-describedby={errors.password ? "staff-password-error" : undefined}
          className="h-12 rounded-md text-sm"
          {...register("password")}
        />
        <FormError id="staff-password-error">{errors.password?.message}</FormError>
      </div>
      <FormError>{requestError}</FormError>
      <Button
        type="submit"
        disabled={isSubmitting}
        className="h-12 w-full rounded-md bg-[#39a0ed] text-sm font-semibold text-[#071521] hover:bg-[#75baf2]"
      >
        {isSubmitting ? "Entrando..." : "Entrar no painel"}
      </Button>
    </form>
  );
}

export function StudentChangePasswordForm() {
  const router = useRouter();
  const [requestError, setRequestError] = useState("");
  const form = useForm<ChangePasswordFields>({
    resolver: zodResolver(passwordChangeSchema),
    defaultValues: { currentPassword: "", newPassword: "", confirmation: "" },
  });
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = form;

  const submit = handleSubmit(async ({ currentPassword, newPassword }) => {
    setRequestError("");
    try {
      const response = await fetch("/api/students/me/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const result = await response.json();
      if (!response.ok) {
        setRequestError(
          result.error ??
            "Não foi possível atualizar sua senha. Confira a senha atual e os requisitos da nova senha.",
        );
        return;
      }
      router.replace("/dashboard");
      router.refresh();
    } catch {
      setRequestError(
        "Não foi possível conectar ao serviço de alteração de senha. Verifique sua conexão e tente novamente.",
      );
    }
  });

  return (
    <form onSubmit={submit} noValidate className="auth-form mt-7">
      <div className="space-y-2">
        <label
          htmlFor="current-password"
          className="text-sm font-medium text-[#dce8f1]"
        >
          Senha temporária atual
        </label>
        <Input
          id="current-password"
          type="password"
          autoComplete="current-password"
          aria-invalid={Boolean(errors.currentPassword)}
          aria-describedby={errors.currentPassword ? "current-password-error" : undefined}
          className="h-12 rounded-md"
          {...register("currentPassword")}
        />
        <FormError id="current-password-error">{errors.currentPassword?.message}</FormError>
      </div>
      <div className="space-y-2">
        <label
          htmlFor="new-password"
          className="text-sm font-medium text-[#dce8f1]"
        >
          Nova senha
        </label>
        <Input
          id="new-password"
          type="password"
          autoComplete="new-password"
          aria-invalid={Boolean(errors.newPassword)}
          aria-describedby={errors.newPassword ? "new-password-error" : undefined}
          className="h-12 rounded-md"
          {...register("newPassword")}
        />
        <p className="text-xs leading-relaxed text-[#9fb3c3]">
          Use pelo menos 12 caracteres.
        </p>
        <FormError id="new-password-error">{errors.newPassword?.message}</FormError>
      </div>
      <div className="space-y-2">
        <label
          htmlFor="confirm-password"
          className="text-sm font-medium text-[#dce8f1]"
        >
          Confirme a nova senha
        </label>
        <Input
          id="confirm-password"
          type="password"
          autoComplete="new-password"
          aria-invalid={Boolean(errors.confirmation)}
          aria-describedby={errors.confirmation ? "confirm-password-error" : undefined}
          className="h-12 rounded-md"
          {...register("confirmation")}
        />
        <FormError id="confirm-password-error">{errors.confirmation?.message}</FormError>
      </div>
      <FormError>{requestError}</FormError>
      <Button
        type="submit"
        disabled={isSubmitting}
        className="h-12 w-full rounded-md bg-[#39a0ed] text-sm font-semibold text-[#071521] hover:bg-[#75baf2]"
      >
        {isSubmitting ? "Salvando..." : "Salvar nova senha"}
      </Button>
    </form>
  );
}

export function LogoutButton() {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  async function logout() {
    setIsPending(true);
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/login");
    router.refresh();
  }

  return (
    <Button
      type="button"
      variant="outline"
      onClick={logout}
      disabled={isPending}
      className="h-10"
    >
      {isPending ? "Saindo..." : "Sair da conta"}
    </Button>
  );
}
