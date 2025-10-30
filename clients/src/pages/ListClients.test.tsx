import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, test, expect, vi, beforeEach, type Mock } from "vitest";
import ListClients from "./ListClients";
import * as service from "@/services/listUsers.service";
import * as toast from "@/components/ui/Toastify";

// Mocks dos serviços de storage dos clientes selecionados
vi.mock("@/services/listUsers.service", () => ({
  listUsers: vi.fn(),
  clearUsers: vi.fn(),
  removeUserById: vi.fn(),
}));

// Mock de layout para simplificar
vi.mock("@/components/LayoutPage", () => ({
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="layout">{children}</div>
  ),
}));

// Mock de toast
vi.mock("@/components/ui/Toastify", () => ({
  toastSuccess: vi.fn(),
}));

// Mock do CardClient para poder disparar onRemove facilmente e contar itens renderizados
vi.mock("@/components/CardClient", () => ({
  default: ({
    user,
    onRemove,
  }: {
    user: { id: number; name: string };
    onRemove?: () => void;
  }) => (
    <div data-testid="card-client">
      <span>{user.name}</span>
      {onRemove ? (
        <button type="button" onClick={onRemove}>
          remover-item
        </button>
      ) : null}
    </div>
  ),
}));

describe("ListClients page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("deve listar clientes e habilitar o botão de limpar quando houver itens", () => {
    (service.listUsers as unknown as Mock).mockReturnValueOnce([
      { id: 1, name: "Ana", salary: 1000, companyValuation: 10000 },
      { id: 2, name: "Bruno", salary: 2000, companyValuation: 20000 },
    ]);

    render(<ListClients />);

    // Renderiza 2 cartões
    expect(screen.getAllByTestId("card-client").length).toBe(2);

    // Botão limpar habilitado
    const clearButton = screen.getByRole("button", {
      name: "Limpar clientes selecionados",
    });
    expect(clearButton.getAttribute("disabled")).toBeNull();
  });

  test("deve remover um cliente e depois limpar todos mostrando toasts", async () => {
    // Primeira chamada carrega 2 itens, segunda chamada retorna 1 após remoção, terceira retorna 0 após limpar
    (service.listUsers as unknown as Mock)
      .mockReturnValueOnce([
        { id: 1, name: "Ana", salary: 1000, companyValuation: 10000 },
        { id: 2, name: "Bruno", salary: 2000, companyValuation: 20000 },
      ])
      .mockReturnValueOnce([
        { id: 2, name: "Bruno", salary: 2000, companyValuation: 20000 },
      ])
      .mockReturnValueOnce([]);

    render(<ListClients />);

    // Confirmar estado inicial
    expect(screen.getAllByTestId("card-client").length).toBe(2);

    // Remover o primeiro item via botão do CardClient (mock)
    const removeButtons = screen.getAllByRole("button", {
      name: "remover-item",
    });
    fireEvent.click(removeButtons[0]);

    await waitFor(() => {
      expect(service.removeUserById).toHaveBeenCalledWith(1);
      expect(toast.toastSuccess).toHaveBeenCalledWith(
        "Cliente removido da lista com sucesso"
      );
    });

    // Deve restar apenas 1 item
    expect(screen.getAllByTestId("card-client").length).toBe(1);

    // Limpar todos
    const clearButton = screen.getByRole("button", {
      name: "Limpar clientes selecionados",
    });
    fireEvent.click(clearButton);

    await waitFor(() => {
      expect(service.clearUsers).toHaveBeenCalled();
      expect(toast.toastSuccess).toHaveBeenCalledWith(
        "Clientes selecionados limpos com sucesso"
      );
    });

    // Lista vazia e botão desabilitado
    expect(screen.queryAllByTestId("card-client").length).toBe(0);
    expect(clearButton.getAttribute("disabled")).not.toBeNull();
  });
});
