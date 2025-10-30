/// <reference types="@testing-library/jest-dom" />
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { SideMenu } from "./side-menu";

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

// Mock do useAuth
const mockLogout = vi.fn();
vi.mock("@/context/AuthProvider/useAuth", () => ({
  useAuth: () => ({
    user: null,
    isLoading: false,
    authenticate: vi.fn(),
    logout: mockLogout,
  }),
}));

// Mock do import.meta.env
Object.defineProperty(import.meta, "env", {
  value: {
    VITE_LOGO_BLACK: "/logo-black.png",
  },
  writable: true,
});

// Mock do cn utility
vi.mock("@/lib/utils", () => ({
  cn: (...classes: (string | undefined)[]) => classes.filter(Boolean).join(" "),
}));

function renderSideMenu(
  props: {
    className?: string;
    onClose?: () => void;
    currentPath?: string;
  } = {}
) {
  return render(
    <MemoryRouter>
      <SideMenu {...props} />
    </MemoryRouter>
  );
}

describe("SideMenu", () => {
  beforeEach(() => {
    mockNavigate.mockReset();
    mockLogout.mockReset();
  });

  describe("Renderização", () => {
    it("deve renderizar o componente com estrutura básica", () => {
      renderSideMenu();

      expect(screen.getByAltText("Logo Teddy")).toBeInTheDocument();
      expect(screen.getByText("Home")).toBeInTheDocument();
      expect(screen.getByText("Clientes")).toBeInTheDocument();
      expect(screen.getByText("Clientes selecionados")).toBeInTheDocument();
      expect(screen.getByText("Sair")).toBeInTheDocument();
    });

    it("deve renderizar logo com src correto", () => {
      renderSideMenu();

      const logo = screen.getByAltText("Logo Teddy");
      expect(logo).toHaveAttribute("src", import.meta.env.VITE_LOGO_BLACK);
      expect(logo).toHaveClass("h-12", "w-auto");
    });
  });

  describe("Navegação", () => {
    it("deve navegar para /dashboard ao clicar em 'Clientes'", () => {
      renderSideMenu();

      fireEvent.click(screen.getByText("Clientes"));

      expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
    });

    it("deve navegar para /clientes-selecionados ao clicar em 'Clientes selecionados'", () => {
      renderSideMenu();

      fireEvent.click(screen.getByText("Clientes selecionados"));

      expect(mockNavigate).toHaveBeenCalledWith("/clientes-selecionados");
    });

    it("deve chamar onClose após navegação quando fornecido", () => {
      const mockOnClose = vi.fn();
      renderSideMenu({ onClose: mockOnClose });

      fireEvent.click(screen.getByText("Clientes"));

      expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it("não deve chamar onClose quando não fornecido", () => {
      renderSideMenu();

      fireEvent.click(screen.getByText("Clientes"));

      expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
    });
  });

  describe("Logout", () => {
    it("deve executar logout e navegar para / ao clicar em 'Sair'", () => {
      renderSideMenu();

      fireEvent.click(screen.getByText("Sair"));

      expect(mockLogout).toHaveBeenCalledTimes(1);
      expect(mockNavigate).toHaveBeenCalledWith("/");
    });
  });

  describe("Estados ativos", () => {
    it("deve destacar item 'Clientes' quando currentPath é /dashboard", () => {
      renderSideMenu({ currentPath: "/dashboard" });

      const clientesItem = screen.getByText("Clientes").closest("div");
      const clientesIcon = screen.getByText("Clientes").previousElementSibling;

      expect(clientesItem).toHaveClass("border-r-4", "border-orange-400");
      expect(clientesIcon).toHaveClass("text-orange-400");
      expect(screen.getByText("Clientes")).toHaveClass("text-orange-500");
    });

    it("deve destacar item 'Clientes selecionados' quando currentPath é /clientes-selecionados", () => {
      renderSideMenu({ currentPath: "/clientes-selecionados" });

      const clientesSelecionadosItem = screen
        .getByText("Clientes selecionados")
        .closest("div");
      const clientesSelecionadosIcon = screen.getByText(
        "Clientes selecionados"
      ).previousElementSibling;

      expect(clientesSelecionadosItem).toHaveClass(
        "border-r-4",
        "border-orange-400"
      );
      expect(clientesSelecionadosIcon).toHaveClass("text-orange-400");
      expect(screen.getByText("Clientes selecionados")).toHaveClass(
        "text-orange-500"
      );
    });

    it("não deve destacar nenhum item quando currentPath não corresponde", () => {
      renderSideMenu({ currentPath: "/outra-rota" });

      const clientesItem = screen.getByText("Clientes").closest("div");
      const clientesSelecionadosItem = screen
        .getByText("Clientes selecionados")
        .closest("div");

      expect(clientesItem).not.toHaveClass("border-r-4", "border-orange-400");
      expect(clientesSelecionadosItem).not.toHaveClass(
        "border-r-4",
        "border-orange-400"
      );
    });

    it("deve usar / como currentPath padrão", () => {
      renderSideMenu();

      const clientesItem = screen.getByText("Clientes").closest("div");
      const clientesSelecionadosItem = screen
        .getByText("Clientes selecionados")
        .closest("div");

      expect(clientesItem).not.toHaveClass("border-r-4", "border-orange-400");
      expect(clientesSelecionadosItem).not.toHaveClass(
        "border-r-4",
        "border-orange-400"
      );
    });
  });

  describe("Botão de fechar", () => {
    it("deve renderizar botão de fechar quando onClose é fornecido", () => {
      const mockOnClose = vi.fn();
      renderSideMenu({ onClose: mockOnClose });

      const closeButton = screen.getByRole("button");
      expect(closeButton).toBeInTheDocument();
      expect(closeButton).toHaveClass("absolute", "-bottom-4", "right-[-14px]");
    });

    it("não deve renderizar botão de fechar quando onClose não é fornecido", () => {
      renderSideMenu();

      const closeButton = screen.queryByRole("button");
      expect(closeButton).not.toBeInTheDocument();
    });

    it("deve chamar onClose ao clicar no botão de fechar", () => {
      const mockOnClose = vi.fn();
      renderSideMenu({ onClose: mockOnClose });

      const closeButton = screen.getByRole("button");
      fireEvent.click(closeButton);

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
  });

  describe("Ícones", () => {
    it("deve renderizar todos os ícones corretamente", () => {
      renderSideMenu();

      // Verifica se os ícones estão presentes (lucide-react renderiza como SVG)
      const homeIcon = screen.getByText("Home").previousElementSibling;
      const clientesIcon = screen.getByText("Clientes").previousElementSibling;
      const clientesSelecionadosIcon = screen.getByText(
        "Clientes selecionados"
      ).previousElementSibling;
      const sairIcon = screen.getByText("Sair").previousElementSibling;

      expect(homeIcon).toBeInTheDocument();
      expect(clientesIcon).toBeInTheDocument();
      expect(clientesSelecionadosIcon).toBeInTheDocument();
      expect(sairIcon).toBeInTheDocument();
    });
  });

  describe("Estrutura e estilos", () => {
    it("deve aplicar estilos de hover nos itens não ativos", () => {
      renderSideMenu({ currentPath: "/outra-rota" });

      const clientesItem = screen.getByText("Clientes").closest("div");
      const clientesSelecionadosItem = screen
        .getByText("Clientes selecionados")
        .closest("div");

      expect(clientesItem).toHaveClass("hover:bg-gray-50", "rounded-lg");
      expect(clientesSelecionadosItem).toHaveClass(
        "hover:bg-gray-50",
        "rounded-lg"
      );
    });
  });
});
