/// <reference types="@testing-library/jest-dom" />
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import Login from "./Login";

// Mock do useNavigate
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

// Mock do useAuth - usando getter para ler valor atual
const mockAuthenticate = vi.fn();
let mockUserValue: { name?: string } | null = null;

vi.mock("@/context/AuthProvider/useAuth", () => ({
  useAuth: () => {
    // Retorna um novo objeto toda vez que useAuth é chamado
    // lendo o valor atual de mockUserValue
    return {
      user: mockUserValue,
      isLoading: false,
      authenticate: mockAuthenticate,
      logout: vi.fn(),
    };
  },
}));

function renderLogin(user: { name?: string } | null = null) {
  mockUserValue = user;
  return render(
    <MemoryRouter>
      <Login />
    </MemoryRouter>
  );
}

describe("Login", () => {
  beforeEach(() => {
    mockNavigate.mockReset();
    mockAuthenticate.mockReset();
    mockUserValue = null;
  });

  it("deve renderizar corretamente com input e botão", () => {
    renderLogin();

    expect(screen.getByText("Olá, seja bem-vindo(a)!")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Digite seu nome")).toBeInTheDocument();
    expect(screen.getByText("Entrar")).toBeInTheDocument();
  });

  it("deve navegar para /dashboard quando usuário já está autenticado", async () => {
    mockUserValue = { name: "Usuário Teste" };
    renderLogin({ name: "Usuário Teste" });

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
    });
  });

  it("deve autenticar e navegar quando nome válido for inserido e botão clicado", () => {
    renderLogin();

    const input = screen.getByPlaceholderText("Digite seu nome");
    const button = screen.getByText("Entrar");

    fireEvent.change(input, { target: { value: "João Silva" } });
    fireEvent.click(button);

    expect(mockAuthenticate).toHaveBeenCalledWith({ name: "João Silva" });
    expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
  });
});
