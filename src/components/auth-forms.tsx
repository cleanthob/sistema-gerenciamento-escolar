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

function FormError({ children }: { children?: string }) {
  if (!children) return null;
  return (
    <p role="alert" className="text-sm text-[#a23e30]">
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
        setRequestError(result.error ?? "Não foi possível entrar.");
        return;
      }
      if (audience === "STAFF") router.replace("/admin");
      else
        router.replace(
          result.mustChangePassword ? "/login/change-password" : "/dashboard",
        );
      router.refresh();
    } catch {
      setRequestError("Falha de conexão. Tente novamente.");
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
    <form onSubmit={submit} noValidate className="mt-8 space-y-5">
      <div className="space-y-2">
        <label
          htmlFor="student-id"
          className="text-sm font-medium text-[#294b42]"
        >
          Matrícula ou e-mail
        </label>
        <Input
          id="student-id"
          autoComplete="username"
          placeholder="Digite sua matrícula"
          aria-invalid={Boolean(errors.identifier)}
          className="h-12 rounded-md border-[#d6e1d8] bg-[#fbfcf9] px-4 text-sm"
          {...register("identifier")}
        />
        <FormError>{errors.identifier?.message}</FormError>
      </div>
      <div className="space-y-2">
        <label
          htmlFor="student-password"
          className="text-sm font-medium text-[#294b42]"
        >
          Senha
        </label>
        <Input
          id="student-password"
          type="password"
          autoComplete="current-password"
          placeholder="Digite sua senha"
          aria-invalid={Boolean(errors.password)}
          className="h-12 rounded-md border-[#d6e1d8] bg-[#fbfcf9] px-4 text-sm"
          {...register("password")}
        />
        <FormError>{errors.password?.message}</FormError>
      </div>
      <div className="flex justify-end">
        <a
          href="/login/forgot-password"
          className="text-sm font-medium text-[#28705b] underline-offset-4 hover:text-[#174f43] hover:underline"
        >
          Esqueci minha senha
        </a>
      </div>
      <FormError>{requestError}</FormError>
      <Button
        type="submit"
        disabled={isSubmitting}
        className="h-12 w-full rounded-md bg-[#174f43] text-sm font-semibold text-white hover:bg-[#103d34]"
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
    <form onSubmit={submit} noValidate className="mt-8 space-y-5">
      <div className="space-y-2">
        <label
          htmlFor="staff-email"
          className="text-sm font-medium text-[#394e45]"
        >
          E-mail institucional
        </label>
        <Input
          id="staff-email"
          type="email"
          autoComplete="username"
          placeholder="nome@escola.edu.br"
          aria-invalid={Boolean(errors.identifier)}
          className="h-12 rounded-md border-[#e5ddd4] bg-[#fcfaf7] px-4 text-sm"
          {...register("identifier")}
        />
        <FormError>{errors.identifier?.message}</FormError>
      </div>
      <div className="space-y-2">
        <label
          htmlFor="staff-password"
          className="text-sm font-medium text-[#394e45]"
        >
          Senha
        </label>
        <Input
          id="staff-password"
          type="password"
          autoComplete="current-password"
          placeholder="Digite sua senha"
          aria-invalid={Boolean(errors.password)}
          className="h-12 rounded-md border-[#e5ddd4] bg-[#fcfaf7] px-4 text-sm"
          {...register("password")}
        />
        <FormError>{errors.password?.message}</FormError>
      </div>
      <FormError>{requestError}</FormError>
      <Button
        type="submit"
        disabled={isSubmitting}
        className="h-12 w-full rounded-md bg-[#a45137] text-sm font-semibold text-white hover:bg-[#873f2c]"
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
        setRequestError(result.error ?? "Não foi possível alterar a senha.");
        return;
      }
      router.replace("/dashboard");
      router.refresh();
    } catch {
      setRequestError("Falha de conexão. Tente novamente.");
    }
  });

  return (
    <form onSubmit={submit} noValidate className="mt-7 space-y-5">
      <div className="space-y-2">
        <label
          htmlFor="current-password"
          className="text-sm font-medium text-[#294b42]"
        >
          Senha temporária atual
        </label>
        <Input
          id="current-password"
          type="password"
          autoComplete="current-password"
          className="h-12 rounded-md border-[#d6e1d8] bg-[#fbfcf9] px-4"
          {...register("currentPassword")}
        />
        <FormError>{errors.currentPassword?.message}</FormError>
      </div>
      <div className="space-y-2">
        <label
          htmlFor="new-password"
          className="text-sm font-medium text-[#294b42]"
        >
          Nova senha
        </label>
        <Input
          id="new-password"
          type="password"
          autoComplete="new-password"
          className="h-12 rounded-md border-[#d6e1d8] bg-[#fbfcf9] px-4"
          {...register("newPassword")}
        />
        <FormError>{errors.newPassword?.message}</FormError>
      </div>
      <div className="space-y-2">
        <label
          htmlFor="confirm-password"
          className="text-sm font-medium text-[#294b42]"
        >
          Confirme a nova senha
        </label>
        <Input
          id="confirm-password"
          type="password"
          autoComplete="new-password"
          className="h-12 rounded-md border-[#d6e1d8] bg-[#fbfcf9] px-4"
          {...register("confirmation")}
        />
        <FormError>{errors.confirmation?.message}</FormError>
      </div>
      <FormError>{requestError}</FormError>
      <Button
        type="submit"
        disabled={isSubmitting}
        className="h-12 w-full rounded-md bg-[#174f43] text-sm font-semibold text-white hover:bg-[#103d34]"
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
