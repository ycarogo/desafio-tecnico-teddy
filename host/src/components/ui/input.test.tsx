import { render, screen } from "@testing-library/react";
import { describe, test, expect } from "vitest";
import { Input } from "./input";

describe("Teste do Input", () => {
  test("Deve renderizar corretamente", () => {
    render(<Input placeholder="Digite seu nome" />);
    const input = screen.getByPlaceholderText("Digite seu nome");
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute("data-slot", "input");
  });

  test("Deve aplicar className customizada corretamente", () => {
    render(<Input className="custom-class" placeholder="Input customizado" />);
    const input = screen.getByPlaceholderText("Input customizado");
    expect(input).toHaveClass("custom-class");
  });

  test("Deve estar desabilitado quando disabled for true", () => {
    render(<Input disabled placeholder="Input desabilitado" />);
    const input = screen.getByPlaceholderText("Input desabilitado");
    expect(input).toBeDisabled();
  });

  test("Deve aplicar type corretamente", () => {
    render(<Input type="password" placeholder="Senha" />);
    const input = screen.getByPlaceholderText("Senha");
    expect(input).toHaveAttribute("type", "password");
  });
});
