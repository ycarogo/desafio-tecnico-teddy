import { render, screen } from "@testing-library/react";
import { describe, test, expect, vi } from "vitest";
import userEvent from "@testing-library/user-event";
import { Button } from "./button";

describe("Teste do Button", () => {
  test("Deve renderizar o botão com texto", () => {
    render(<Button>Clique aqui</Button>);

    const button = screen.getByRole("button", { name: "Clique aqui" });

    expect(button).toBeDefined();
    expect(button.tagName).toBe("BUTTON");
    expect(button.textContent).toBe("Clique aqui");
  });

  test("Deve aplicar variantes corretas quando especificadas", () => {
    const { rerender } = render(<Button variant="destructive">Excluir</Button>);

    let button = screen.getByRole("button", { name: "Excluir" });
    expect(button.className).toContain("bg-destructive");

    rerender(<Button variant="outline">Cancelar</Button>);
    button = screen.getByRole("button", { name: "Cancelar" });
    expect(button.className).toContain("border");

    rerender(<Button variant="submit-form">Enviar</Button>);
    button = screen.getByRole("button", { name: "Enviar" });
    expect(button.className).toContain("bg-orange-500");
  });

  test("Deve chamar onClick quando o botão for clicado e não deve chamar quando disabled", async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();

    const { rerender } = render(<Button onClick={handleClick}>Clique</Button>);

    const button = screen.getByRole("button", { name: "Clique" });
    await user.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);

    rerender(
      <Button onClick={handleClick} disabled>
        Clique
      </Button>
    );

    const disabledButton = screen.getByRole("button", { name: "Clique" });
    await user.click(disabledButton);

    expect(handleClick).toHaveBeenCalledTimes(1); // Não deve ter incrementado
    expect(disabledButton).toHaveProperty("disabled", true);
  });
});
