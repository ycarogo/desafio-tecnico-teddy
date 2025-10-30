import { render, screen } from "@testing-library/react";
import { describe, test } from "vitest";
import { Button } from "./button";

describe("Teste do Button", () => {
  test("Deve renderizar corretamente", () => {
    render(<Button>Entrar</Button>);
    screen.getByText("Entrar");
  });

  test("Deve aplicar variante destructive corretamente", () => {
    render(<Button variant="destructive">Excluir</Button>);
    const button = screen.getByText("Excluir");
    expect(button).toHaveClass("bg-destructive");
  });

  test("Deve aplicar tamanho small corretamente", () => {
    render(<Button size="sm">Pequeno</Button>);
    const button = screen.getByText("Pequeno");
    expect(button).toHaveClass("h-8");
  });

  test("Deve estar desabilitado quando disabled for true", () => {
    render(<Button disabled>Desabilitado</Button>);
    const button = screen.getByText("Desabilitado");
    expect(button).toBeDisabled();
  });
});
