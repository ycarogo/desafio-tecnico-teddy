import { render, screen } from "@testing-library/react";
import { describe, test, expect, vi } from "vitest";
import userEvent from "@testing-library/user-event";
import CardClient from "./CardClient";
import type { User } from "@/types/users";

describe("Teste do CardClient", () => {
  const mockUser: User = {
    id: 1,
    name: "João Silva",
    salary: 5000,
    companyValuation: 1000000,
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z",
  };

  test("Deve renderizar o componente com as informações do usuário formatadas", () => {
    render(<CardClient user={mockUser} />);

    expect(screen.getByText("João Silva")).toBeDefined();

    // Formata os valores esperados da mesma forma que o componente
    const formatCurrency = (value: number) => {
      return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(value);
    };

    const expectedSalary = formatCurrency(5000);
    const expectedCompany = formatCurrency(1000000);

    // Verifica se os textos com valores monetários estão presentes
    const salaryText = screen.getByText(/Salário:/);
    expect(salaryText).toBeDefined();
    expect(salaryText.textContent).toContain("Salário:");
    expect(salaryText.textContent).toContain(expectedSalary);

    const companyText = screen.getByText(/Empresa:/);
    expect(companyText).toBeDefined();
    expect(companyText.textContent).toContain("Empresa:");
    expect(companyText.textContent).toContain(expectedCompany);
  });

  test("Deve mostrar botão de adicionar quando não está selecionado e botão de remover quando está selecionado", () => {
    const { rerender } = render(
      <CardClient user={mockUser} isSelected={false} />
    );

    const addButton = screen.getByRole("button", { name: "Adicionar" });
    expect(addButton).toBeDefined();

    rerender(<CardClient user={mockUser} isSelected={true} />);

    expect(screen.queryByRole("button", { name: "Adicionar" })).toBeNull();
    const removeButton = screen.getByRole("button", { name: "Remover" });
    expect(removeButton).toBeDefined();
  });

  test("Deve chamar as funções de callback quando os botões forem clicados", async () => {
    const onAdd = vi.fn();
    const onEdit = vi.fn();
    const onDelete = vi.fn();
    const onRemove = vi.fn();
    const user = userEvent.setup();

    const { rerender } = render(
      <CardClient
        user={mockUser}
        onAdd={onAdd}
        onEdit={onEdit}
        onDelete={onDelete}
        isSelected={false}
        isListClients={false}
      />
    );

    const addButton = screen.getByRole("button", { name: "Adicionar" });
    await user.click(addButton);
    expect(onAdd).toHaveBeenCalledTimes(1);

    const editButton = screen.getByRole("button", { name: "Editar" });
    await user.click(editButton);
    expect(onEdit).toHaveBeenCalledTimes(1);

    const deleteButton = screen.getByRole("button", { name: "Excluir" });
    await user.click(deleteButton);
    expect(onDelete).toHaveBeenCalledTimes(1);

    rerender(
      <CardClient
        user={mockUser}
        onRemove={onRemove}
        isSelected={true}
        isListClients={false}
      />
    );

    const removeButton = screen.getByRole("button", { name: "Remover" });
    await user.click(removeButton);
    expect(onRemove).toHaveBeenCalledTimes(1);
  });

  test("Deve aplicar estilo quando está selecionado e não ocultar botões de editar/excluir quando isListClients for false", () => {
    const { rerender, container } = render(
      <CardClient user={mockUser} isSelected={true} isListClients={false} />
    );

    const card = container.firstChild as HTMLElement;
    expect(card.className).toContain("border-orange-500");
    expect(card.className).toContain("bg-orange-50");

    expect(screen.getByRole("button", { name: "Editar" })).toBeDefined();
    expect(screen.getByRole("button", { name: "Excluir" })).toBeDefined();

    rerender(
      <CardClient user={mockUser} isSelected={true} isListClients={true} />
    );

    expect(screen.queryByRole("button", { name: "Editar" })).toBeNull();
    expect(screen.queryByRole("button", { name: "Excluir" })).toBeNull();
  });
});
