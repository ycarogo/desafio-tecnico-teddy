import { render, screen, fireEvent } from "@testing-library/react";
import { describe, test, expect, vi } from "vitest";
import Pagination from "./pagination";

describe("Teste do Pagination", () => {
  test("Deve renderizar o componente de paginação com os botões corretos", () => {
    const onPageChange = vi.fn();
    render(
      <Pagination currentPage={1} totalPages={10} onPageChange={onPageChange} />
    );

    expect(screen.getByText("Primeira")).toBeDefined();
    expect(screen.getByText("Ultima")).toBeDefined();
    expect(screen.getByText("‹")).toBeDefined();
    expect(screen.getByText("›")).toBeDefined();
    expect(screen.getByText("1")).toBeDefined();
  });

  test("Deve chamar onPageChange quando um botão de página for clicado", () => {
    const onPageChange = vi.fn();
    render(
      <Pagination currentPage={1} totalPages={10} onPageChange={onPageChange} />
    );

    const pageButton = screen.getByText("2");
    fireEvent.click(pageButton);

    expect(onPageChange).toHaveBeenCalledTimes(1);
    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  test("Deve desabilitar os botões Primeira e anterior quando estiver na primeira página", () => {
    const onPageChange = vi.fn();
    render(
      <Pagination currentPage={1} totalPages={10} onPageChange={onPageChange} />
    );

    const primeiraButton = screen.getByText("Primeira");
    const anteriorButton = screen.getByText("‹");

    expect(primeiraButton.getAttribute("disabled")).not.toBeNull();
    expect(anteriorButton.getAttribute("disabled")).not.toBeNull();
  });

  test("Deve desabilitar os botões Última e próximo quando estiver na última página", () => {
    const onPageChange = vi.fn();
    render(
      <Pagination
        currentPage={10}
        totalPages={10}
        onPageChange={onPageChange}
      />
    );

    const ultimaButton = screen.getByText("Ultima");
    const proximoButton = screen.getByText("›");

    expect(ultimaButton.getAttribute("disabled")).not.toBeNull();
    expect(proximoButton.getAttribute("disabled")).not.toBeNull();
  });
});
