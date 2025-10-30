import { describe, test, expect } from "vitest";
import { removeFormatCurrency } from "./removeFormatCurrency";

describe("removeFormatCurrency", () => {
  test("deve remover R$, pontos e vírgula e retornar número inteiro", () => {
    const result = removeFormatCurrency("R$ 1.234,56");
    expect(result).toBe(123456);
  });

  test("deve lidar com valores sem espaço após R$", () => {
    const result = removeFormatCurrency("R$1.000,00");
    expect(result).toBe(100000);
  });

  test("deve lidar com valor zero", () => {
    const result = removeFormatCurrency("R$ 0,00");
    expect(result).toBe(0);
  });

  test("deve lidar com valor sem separadores", () => {
    const result = removeFormatCurrency("R$ 1234");
    expect(result).toBe(1234);
  });

  test("deve remover espaços extras nas extremidades", () => {
    const result = removeFormatCurrency("  R$  12.345,00   ");
    expect(result).toBe(1234500);
  });

  test("deve retornar NaN para strings sem dígitos após limpeza", () => {
    const result = removeFormatCurrency("R$ abc");
    expect(Number.isNaN(result)).toBe(true);
  });

  test("não deve quebrar ao receber apenas vírgula e ponto", () => {
    const result = removeFormatCurrency(".,,");
    expect(Number.isNaN(result)).toBe(true);
  });
});
