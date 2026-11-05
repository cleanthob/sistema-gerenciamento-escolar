"use client";

import heroImage from "@/assets/images/hero.jpg";
import Image from "next/image";
import { useState } from "react";

export function HomeHeroImage() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="home-entry-image">
      {isLoading && (
        <div
          className="absolute inset-0 z-10 animate-pulse bg-gradient-to-r from-[#1c3040] via-[#2a4050] to-[#1c3040]"
          aria-hidden="true"
        />
      )}

      <Image
        src={heroImage}
        alt="Livros e materiais preparados para um dia de estudos"
        fill
        priority
        sizes="(max-width: 760px) 100vw, 55vw"
        onLoad={() => setIsLoading(false)}
        className={`object-cover transition-opacity duration-500 ${
          isLoading ? "opacity-0" : "opacity-100"
        }`}
      />
    </div>
  );
}
