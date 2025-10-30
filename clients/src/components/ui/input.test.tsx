import { render, screen } from "@testing-library/react";
import { describe, test, expect } from "vitest";
import { Input } from "./input";

describe("Teste do Input", () => {
  test("Deve renderizar o input com label e placeholder", () => {
    render(<Input label="Nome completo" placeholder="Digite seu nome" />);

    const label = screen.getByText("Nome completo");
    const input = screen.getByLabelText("Nome completo") as HTMLInputElement;

    expect(label).toBeDefined();
    expect(input).toBeDefined();
    expect(input.placeholder).toBe("Digite seu nome");
    expect(input.tagName).toBe("INPUT");
  });

  test("Deve exibir mensagem de erro quando error for fornecido", () => {
    render(<Input label="Email" error="Email inválido" />);

    const errorMessage = screen.getByText("Email inválido");
    const input = screen.getByLabelText("Email") as HTMLInputElement;

    expect(errorMessage).toBeDefined();
    expect(errorMessage.className).toContain("text-red-600");
    expect(input.getAttribute("aria-invalid")).toBe("true");
    expect(input.getAttribute("aria-describedby")).not.toBeNull();
  });

  test("Deve exibir helperText quando fornecido e não tiver erro", () => {
    render(<Input label="Senha" helperText="Mínimo de 8 caracteres" />);

    const helperText = screen.getByText("Mínimo de 8 caracteres");
    const input = screen.getByLabelText("Senha") as HTMLInputElement;

    expect(helperText).toBeDefined();
    expect(helperText.className).toContain("text-gray-500");
    expect(input.getAttribute("aria-describedby")).not.toBeNull();
  });

  test("Deve renderizar ícones esquerdo e direito quando fornecidos", () => {
    const LeftIcon = () => <span data-testid="left-icon">🔍</span>;
    const RightIcon = () => <span data-testid="right-icon">✓</span>;

    render(
      <Input label="Buscar" leftIcon={<LeftIcon />} rightIcon={<RightIcon />} />
    );

    const leftIcon = screen.getByTestId("left-icon");
    const rightIcon = screen.getByTestId("right-icon");
    const input = screen.getByLabelText("Buscar");

    expect(leftIcon).toBeDefined();
    expect(rightIcon).toBeDefined();
    expect(input.className).toContain("pl-10");
    expect(input.className).toContain("pr-10");
  });
});
