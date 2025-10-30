/// <reference types="@testing-library/jest-dom" />
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import Navbar from "./navbar";

// Mock SideMenu para evitar dependências externas no teste
vi.mock("./side-menu", () => ({
  SideMenu: ({
    onClose,
    currentPath,
  }: {
    onClose: () => void;
    currentPath: string;
  }) => (
    <div
      data-testid="side-menu"
      data-current-path={currentPath}
      onClick={onClose}
    >
      SideMenu
    </div>
  ),
}));

// Spy do useNavigate e passthrough do restante de react-router-dom
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>(
    "react-router-dom"
  );
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock do useAuth
const mockLogout = vi.fn();
const mockUser = { name: "User" };
vi.mock("@/context/AuthProvider/useAuth", () => ({
  useAuth: () => ({
    user: mockUser,
    isLoading: false,
    authenticate: vi.fn(),
    logout: mockLogout,
  }),
}));

function renderNavbar(initialPath: string = "/dashboard") {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <Navbar />
    </MemoryRouter>
  );
}

describe("Navbar", () => {
  beforeEach(() => {
    mockNavigate.mockReset();
    mockLogout.mockReset();
  });

  it("deve renderizar saudação com o nome do usuário", () => {
    renderNavbar("/dashboard");
    expect(screen.getByText(/Olá,/i)).toBeInTheDocument();
    expect(screen.getByText(/User/i)).toBeInTheDocument();
  });

  it("deve navegar para /dashboard ao clicar em 'Clientes'", () => {
    renderNavbar("/clientes-selecionados");
    fireEvent.click(screen.getByText("Clientes"));
    expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
  });

  it("deve navegar para /clientes-selecionados ao clicar em 'Clientes selecionados'", () => {
    renderNavbar("/dashboard");
    fireEvent.click(screen.getByText("Clientes selecionados"));
    expect(mockNavigate).toHaveBeenCalledWith("/clientes-selecionados");
  });

  it("deve executar logout e navegar para / ao clicar em 'Sair'", () => {
    renderNavbar("/dashboard");
    fireEvent.click(screen.getByText("Sair"));
    expect(mockLogout).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith("/");
  });
});
