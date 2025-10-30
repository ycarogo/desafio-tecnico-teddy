import { render, screen, fireEvent } from "@testing-library/react";
import { describe, test, expect, vi } from "vitest";
import Modal from "./modal";

describe("Teste do Modal", () => {
  test("Deve renderizar o modal quando isOpen for true", () => {
    const onClose = vi.fn();
    render(
      <Modal isOpen={true} title="Teste Modal" onClose={onClose}>
        <p>Conteúdo do modal</p>
      </Modal>
    );

    expect(screen.getByText("Teste Modal")).toBeDefined();
    expect(screen.getByText("Conteúdo do modal")).toBeDefined();
  });

  test("Não deve renderizar o modal quando isOpen for false", () => {
    const onClose = vi.fn();
    render(
      <Modal isOpen={false} title="Teste Modal" onClose={onClose}>
        <p>Conteúdo do modal</p>
      </Modal>
    );

    expect(screen.queryByText("Teste Modal")).toBeNull();
    expect(screen.queryByText("Conteúdo do modal")).toBeNull();
  });

  test("Deve renderizar o título corretamente", () => {
    const onClose = vi.fn();
    render(
      <Modal isOpen={true} title="Modal de Confirmação" onClose={onClose}>
        <p>Conteúdo</p>
      </Modal>
    );

    const title = screen.getByText("Modal de Confirmação");
    expect(title).toBeDefined();
    expect(title.tagName).toBe("H2");
  });

  test("Deve chamar onClose quando o botão de fechar for clicado", () => {
    const onClose = vi.fn();

    render(
      <Modal isOpen={true} title="Teste Modal" onClose={onClose}>
        <p>Conteúdo</p>
      </Modal>
    );

    const closeButton = screen.getByRole("button");
    fireEvent.click(closeButton);

    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
