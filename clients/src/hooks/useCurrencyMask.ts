import type { ChangeEvent } from "react";
import { useState } from "react";

export function useCurrencyMask(
  initialValue: number = 0,
  initialPrefix: string = "R$",
  initialSuffix: string = ""
) {
  const [prefix, setPrefix] = useState(initialPrefix);
  const [suffix, setSuffix] = useState(initialSuffix);
  const [displayValue, setDisplayValue] = useState(
    initialValue > 0
      ? formatCurrency((initialValue * 100).toString(), prefix, suffix)
      : ""
  );
  const [numericValue, setNumericValue] = useState(initialValue);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const formatted = formatCurrency(inputValue, prefix, suffix);
    const numeric = parseCurrency(inputValue);

    setDisplayValue(formatted);
    setNumericValue(numeric);
  };

  const setValue = (value: number) => {
    const formatted = formatCurrency((value * 100).toString(), prefix, suffix);
    setDisplayValue(formatted);
    setNumericValue(value);
  };

  return {
    displayValue,
    numericValue,
    handleChange,
    setValue,
    setPrefix,
    setSuffix,
  };
}

export const formatCurrency = (
  value: string,
  prefix: string = "R$",
  suffix: string = ""
): string => {
  // Remove tudo que não é dígito
  const numericValue = value.replace(/\D/g, "");

  if (!numericValue) return "";

  // Converte para número e divide por 100 para ter os centavos
  const numberValue = Number.parseInt(numericValue) / 100;

  // Se não há prefix nem suffix, retorna apenas o número formatado
  if (!prefix && !suffix) {
    return numberValue.toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  // Formata com prefix e suffix
  const formattedNumber = numberValue.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return `${prefix}${prefix ? " " : ""}${formattedNumber}${
    suffix ? " " + suffix : ""
  }`.trim();
};

export const parseCurrency = (formattedValue: string): number => {
  const numericValue = formattedValue.replace(/[^\d,]/g, "").replace(",", ".");
  return numericValue ? parseFloat(numericValue) : 0;
};
