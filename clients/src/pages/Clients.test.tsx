import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { describe, test, expect, vi, beforeEach, type Mock } from "vitest";
import Clients from "./Clients";
import * as userService from "@/services/user.service";
import * as toastify from "@/components/ui/Toastify";
import type { InputUser } from "@/types/inputUser";

// Mocks de serviços externos
vi.mock("@/services/user.service", () => ({
  getUsers: vi.fn(),
  createUser: vi.fn(),
  updateUser: vi.fn(),
  deleteUser: vi.fn(),
}));

vi.mock("@/services/listUsers.service", () => ({
  listUsers: vi.fn(() => []),
  addUser: vi.fn(),
  removeUserById: vi.fn(),
}));

// Mocks de componentes filhos para simplificar a renderização
vi.mock("@/components/LayoutPage", () => ({
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="layout">{children}</div>
  ),
}));

vi.mock("@/components/ui/loading-page", () => ({
  default: ({ message }: { message: string }) => <div>{message}</div>,
}));

vi.mock("@/components/ui/pagination", () => ({
  default: ({
    currentPage,
    totalPages,
  }: {
    currentPage: number;
    totalPages: number;
  }) => <div data-testid="pagination">{`${currentPage}/${totalPages}`}</div>,
}));

vi.mock("@/components/ui/modal", () => ({
  default: ({
    title,
    isOpen,
    children,
  }: {
    title: string;
    isOpen: boolean;
    children: React.ReactNode;
  }) =>
    isOpen ? (
      <div data-testid="modal">
        <h2>{title}</h2>
        {children}
      </div>
    ) : null,
}));

vi.mock("@/components/FormClient", () => ({
  default: ({ onSubmit }: { onSubmit: (data: InputUser) => void }) => (
    <button
      type="button"
      onClick={() =>
        onSubmit({ name: "Novo", salary: 123, companyValuation: 456 })
      }
    >
      submeter-form
    </button>
  ),
}));

vi.mock("@/components/ConfirmToDeleteClient", () => ({
  default: ({ onConfirm }: { onConfirm: () => void }) => (
    <button type="button" onClick={onConfirm}>
      confirmar-excluir
    </button>
  ),
}));

vi.mock("@/components/ui/Toastify", () => ({
  toastSuccess: vi.fn(),
  toastError: vi.fn(),
}));

vi.mock("@/components/CardClient", () => ({
  default: ({ user }: { user: { name: string } }) => (
    <div data-testid="card-client">{user.name}</div>
  ),
}));

describe("Clients page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("deve exibir carregamento e depois renderizar a lista de clientes", async () => {
    (userService.getUsers as unknown as Mock).mockResolvedValue({
      clients: [
        { id: 1, name: "Ana", salary: 1000, companyValuation: 10000 },
        { id: 2, name: "Bruno", salary: 2000, companyValuation: 20000 },
      ],
      currentPage: 1,
      totalPages: 3,
    });

    render(<Clients />);

    // estado de carregamento
    expect(screen.getByText("Carregando clientes...")).toBeDefined();

    // aguarda dados carregarem
    await waitFor(() => expect(userService.getUsers).toHaveBeenCalled());

    // título da página
    expect(screen.getByText("Clientes")).toBeDefined();

    // cards renderizados via mock
    expect(screen.getAllByTestId("card-client").length).toBe(2);

    // paginação com 1/3
    expect(screen.getByTestId("pagination").textContent).toBe("1/3");
  });

  test("deve abrir modal de criação e chamar createUser ao submeter", async () => {
    (userService.getUsers as unknown as Mock).mockResolvedValue({
      clients: [],
      currentPage: 1,
      totalPages: 1,
    });
    (userService.createUser as unknown as Mock).mockResolvedValue({});

    render(<Clients />);

    // aguarda carregamento inicial
    await waitFor(() => expect(userService.getUsers).toHaveBeenCalled());

    // abre modal de criação (evita ambiguidade quando existir mais de um elemento com o texto)
    const criarButtons = screen.getAllByText("Criar cliente");
    fireEvent.click(criarButtons[0]);

    // modal aberto com título correspondente (checa heading para evitar conflito com botão)
    expect(
      screen.getByRole("heading", { name: "Criar cliente" })
    ).toBeDefined();

    // submete formulário através do mock
    fireEvent.click(screen.getByText("submeter-form"));

    await waitFor(() =>
      expect(userService.createUser).toHaveBeenCalledWith({
        name: "Novo",
        salary: 123,
        companyValuation: 456,
      })
    );

    expect(toastify.toastSuccess).toHaveBeenCalledWith(
      "Cliente criado com sucesso"
    );
  });
});
