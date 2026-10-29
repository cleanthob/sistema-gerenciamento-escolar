export function getInitialsFromName(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toLocaleUpperCase("pt-BR") ?? "")
    .join("");
}

export function formatCurrencyBRL(amountInCents: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(amountInCents / 100);
}

export function formatGrade(score: number, maxScore: number) {
  return `${score.toLocaleString("pt-BR", {
    maximumFractionDigits: 1,
  })} / ${maxScore.toLocaleString("pt-BR", {
    maximumFractionDigits: 1,
  })}`;
}
