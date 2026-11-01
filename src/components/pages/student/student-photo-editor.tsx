"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitialsFromName } from "@/utils/utils";
import { Pencil } from "lucide-react";
import { useRef, useState, type ChangeEvent } from "react";

type Props = {
  name: string;
  photoUrl: string | null;
};

export function StudentPhotoEditor({ name, photoUrl: initialPhotoUrl }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [photoUrl, setPhotoUrl] = useState(initialPhotoUrl);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function savePhoto(nextPhoto: string) {
    setBusy(true);
    setError("");

    try {
      const response = await fetch("/api/students/me/photo", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ photoUrl: nextPhoto }),
      });
      const payload = (await response.json()) as {
        error?: string;
        photoUrl?: string | null;
      };
      if (!response.ok)
        throw new Error(
          payload.error ??
            "O servidor recusou a atualização da foto. Verifique o arquivo e tente novamente.",
        );

      const updatedPhotoUrl = payload.photoUrl ?? null;
      setPhotoUrl(updatedPhotoUrl);
      window.dispatchEvent(
        new CustomEvent("student-photo-updated", {
          detail: updatedPhotoUrl,
        }),
      );
    } catch (reason) {
      setError(
        reason instanceof Error &&
          !(reason instanceof TypeError || reason instanceof SyntaxError)
          ? reason.message
          : "Não foi possível enviar a foto do perfil. Tente selecionar o arquivo novamente.",
      );
    } finally {
      setBusy(false);
    }
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setError("Selecione uma imagem PNG, JPG ou WebP.");
      return;
    }
    if (file.size > 1_000_000) {
      setError("A foto deve ter no máximo 1 MB.");
      return;
    }

    setBusy(true);
    setError("");
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result !== "string") {
        setError("O navegador não conseguiu processar este arquivo de imagem.");
        setBusy(false);
        return;
      }
      void savePhoto(reader.result);
    };
    reader.onerror = () => {
      setError("O arquivo de imagem não pôde ser lido. Selecione-o novamente.");
      setBusy(false);
    };
    reader.readAsDataURL(file);
  }

  return (
    <div
      role="group"
      aria-label="Foto do perfil"
      className="flex min-w-0 flex-col items-center gap-2"
    >
      <button
        type="button"
        className="group/photo relative rounded-full outline-none focus-visible:ring-2 focus-visible:ring-[#39a0ed] focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-wait"
        aria-label={photoUrl ? "Alterar foto do perfil" : "Adicionar foto do perfil"}
        title="Clique para escolher uma foto"
        disabled={busy}
        onClick={() => inputRef.current?.click()}
      >
        <Avatar className="size-16 border-2 border-[#293830] shadow-sm">
          {photoUrl ? (
            <AvatarImage src={photoUrl} alt={`Foto de ${name}`} />
          ) : null}
          <AvatarFallback className="bg-[#22372c] text-base text-[#b7ddc6]">
            {getInitialsFromName(name)}
          </AvatarFallback>
        </Avatar>
        <span className="absolute inset-0 flex items-center justify-center rounded-full bg-[#071521]/55 text-white opacity-0 transition-opacity group-hover/photo:opacity-100 group-focus-visible/photo:opacity-100 [@media(hover:none)]:opacity-100">
          <Pencil aria-hidden="true" className="size-5" />
        </span>
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        hidden
        onChange={handleFileChange}
      />
      {error ? (
        <p
          role="alert"
          aria-live="assertive"
          className="w-full max-w-56 rounded-md border border-red-300 bg-red-50 px-3 py-2 text-center text-xs text-red-700"
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}
