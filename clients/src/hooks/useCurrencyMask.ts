import type { ChangeEvent } from "react";
import { useState } from "react";

export function useCurrencyMask(
  initialValue: number = 0,
  initialPrefix: string = "R$",
  initialSuffix: string = "",
  withDecimals: boolean = true
) {
  const [prefix, setPrefix] = useState(initialPrefix);
  const [suffix, setSuffix] = useState(initialSuffix);
  const [displayValue, setDisplayValue] = useState(
    initialValue > 0
      ? formatCurrency(
          (initialValue * (withDecimals ? 100 : 1)).toString(),
          prefix,
          suffix,
          withDecimals
        )
      : ""
  );
  const [numericValue, setNumericValue] = useState(initialValue);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const formatted = formatCurrency(inputValue, prefix, suffix, withDecimals);
    const numeric = parseCurrency(inputValue, withDecimals);

    setDisplayValue(formatted);
    setNumericValue(numeric);
  };

  const setValue = (value: number) => {
    const formatted = formatCurrency(
      (value * (withDecimals ? 100 : 1)).toString(),
      prefix,
      suffix,
      withDecimals
    );
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
  suffix: string = "",
  withDecimals: boolean = true
): string => {
  // Remove tudo que não é dígito
  const numericValue = value.replace(/\D/g, "");

  if (!numericValue) return "";

  // Converte para número e divide por 100 para ter os centavos (se withDecimals for true)
  const numberValue = withDecimals
    ? Number.parseInt(numericValue) / 100
    : Number.parseInt(numericValue);

  // Configuração de casas decimais
  const fractionDigits = withDecimals
    ? { minimumFractionDigits: 2, maximumFractionDigits: 2 }
    : { minimumFractionDigits: 0, maximumFractionDigits: 0 };

  // Se não há prefix nem suffix, retorna apenas o número formatado
  if (!prefix && !suffix) {
    return numberValue.toLocaleString("pt-BR", fractionDigits);
  }

  // Formata com prefix e suffix
  const formattedNumber = numberValue.toLocaleString("pt-BR", fractionDigits);

  return `${prefix}${prefix ? " " : ""}${formattedNumber}${
    suffix ? " " + suffix : ""
  }`.trim();
};

export const parseCurrency = (
  formattedValue: string,
  withDecimals: boolean = true
): number => {
  const numericValue = formattedValue.replace(/[^\d,]/g, "").replace(",", ".");
  if (!numericValue) return 0;
  return withDecimals ? parseFloat(numericValue) : parseInt(numericValue);
};
