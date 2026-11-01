"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { getInitialsFromName } from "@/utils/utils";
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
        throw new Error(payload.error ?? "Não foi possível atualizar a foto.");

      const updatedPhotoUrl = payload.photoUrl ?? null;
      setPhotoUrl(updatedPhotoUrl);
      window.dispatchEvent(
        new CustomEvent("student-photo-updated", {
          detail: updatedPhotoUrl,
        }),
      );
    } catch (reason) {
      setError(
        reason instanceof Error
          ? reason.message
          : "Não foi possível atualizar a foto.",
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
        setError("Não foi possível carregar a foto.");
        setBusy(false);
        return;
      }
      void savePhoto(reader.result);
    };
    reader.onerror = () => {
      setError("Não foi possível carregar a foto.");
      setBusy(false);
    };
    reader.readAsDataURL(file);
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <Avatar className="size-16 border-2 border-[#293830] shadow-sm">
        {photoUrl ? <AvatarImage src={photoUrl} alt={`Foto de ${name}`} /> : null}
        <AvatarFallback className="bg-[#22372c] text-base text-[#b7ddc6]">
          {getInitialsFromName(name)}
        </AvatarFallback>
      </Avatar>
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        hidden
        onChange={handleFileChange}
      />
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={busy}
        onClick={() => inputRef.current?.click()}
      >
        {busy ? "Salvando..." : photoUrl ? "Alterar foto" : "Adicionar foto"}
      </Button>
      {photoUrl ? (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          disabled={busy}
          onClick={() => void savePhoto("")}
        >
          Remover
        </Button>
      ) : null}
      <p className="text-center text-xs text-[#a0b2a7]">
        PNG, JPG ou WebP · máximo de 1 MB
      </p>
      {error ? (
        <p role="alert" className="max-w-48 text-center text-xs text-red-700">
          {error}
        </p>
      ) : null}
    </div>
  );
}
