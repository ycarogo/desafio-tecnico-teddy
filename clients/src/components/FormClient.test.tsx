import { render, screen, waitFor } from "@testing-library/react";
import { describe, test, expect, vi, beforeEach } from "vitest";
import userEvent from "@testing-library/user-event";
import FormClient from "./FormClient";
import type { User } from "@/types/users";

describe("Teste do FormClient", () => {
  const mockOnSubmit = vi.fn();
  const mockOnCancel = vi.fn();

  const mockUser: User = {
    id: 1,
    name: "João Silva",
    salary: 5000,
    companyValuation: 1000000,
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z",
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("Deve renderizar todos os campos do formulário corretamente", async () => {
    render(<FormClient onSubmit={mockOnSubmit} />);

    await waitFor(() => {
      expect(screen.getByText("Nome")).toBeDefined();
      expect(
        screen.getByPlaceholderText("Digite o nome do cliente")
      ).toBeDefined();
    });

    // Usa getAllByText pois há dois campos com label "Salário" no componente
    const salaryLabels = screen.getAllByText("Salário");
    expect(salaryLabels.length).toBeGreaterThan(0);

    expect(screen.getByPlaceholderText("Digite o salário")).toBeDefined();
    expect(
      screen.getByPlaceholderText("Digite o valor da empresa")
    ).toBeDefined();

    const submitButton = screen.getByRole("button", { name: /Salvar/i });
    expect(submitButton).toBeDefined();
    expect(submitButton).toHaveProperty("type", "submit");
  });

  test("Deve submeter o formulário com dados válidos e chamar onSubmit", async () => {
    const user = userEvent.setup();
    render(<FormClient onSubmit={mockOnSubmit} />);

    await waitFor(() => {
      expect(
        screen.getByPlaceholderText("Digite o nome do cliente")
      ).toBeDefined();
    });

    const nameInput = screen.getByPlaceholderText("Digite o nome do cliente");
    const salaryInput = screen.getByPlaceholderText("Digite o salário");
    const companyInput = screen.getByPlaceholderText(
      "Digite o valor da empresa"
    );
    const submitButton = screen.getByRole("button", { name: /Salvar/i });

    await user.type(nameInput, "Maria Santos");
    await user.clear(salaryInput);
    await user.type(salaryInput, "10000");
    await user.clear(companyInput);
    await user.type(companyInput, "5000000");

    await user.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledTimes(1);
    });

    const submitCall = mockOnSubmit.mock.calls[0][0];
    expect(submitCall.name).toBe("Maria Santos");
    // Os valores de salary e companyValuation são processados pelo removeFormatCurrency
    expect(typeof submitCall.salary).toBe("number");
    expect(typeof submitCall.companyValuation).toBe("number");
  });

  test("Não deve submeter o formulário quando campos obrigatórios estão vazios", async () => {
    const user = userEvent.setup();
    render(<FormClient onSubmit={mockOnSubmit} />);

    await waitFor(() => {
      expect(
        screen.getByPlaceholderText("Digite o nome do cliente")
      ).toBeDefined();
    });

    const submitButton = screen.getByRole("button", { name: /Salvar/i });

    // Tenta submeter sem preencher os campos
    await user.click(submitButton);

    // Aguarda um pouco para garantir que o onSubmit não foi chamado
    await waitFor(
      () => {
        expect(mockOnSubmit).not.toHaveBeenCalled();
      },
      { timeout: 1000 }
    );
  });

  test("Deve chamar onCancel quando o botão de cancelar é clicado", async () => {
    const user = userEvent.setup();
    render(<FormClient onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    await waitFor(() => {
      expect(
        screen.getByPlaceholderText("Digite o nome do cliente")
      ).toBeDefined();
    });

    const cancelButton = screen.getByRole("button", { name: /Cancelar/i });
    expect(cancelButton).toBeDefined();

    await user.click(cancelButton);
    expect(mockOnCancel).toHaveBeenCalledTimes(1);
  });

  test("Deve preencher campos no modo de edição quando user é fornecido", async () => {
    render(<FormClient onSubmit={mockOnSubmit} user={mockUser} />);

    // Aguarda o formulário ser inicializado com os valores do usuário
    // O defaultValues do react-hook-form é assíncrono
    await waitFor(
      () => {
        const nameInput = screen.getByPlaceholderText(
          "Digite o nome do cliente"
        ) as HTMLInputElement;
        expect(nameInput.value).toBe("João Silva");
      },
      { timeout: 3000 }
    );

    const salaryInput = screen.getByPlaceholderText(
      "Digite o salário"
    ) as HTMLInputElement;
    const companyInput = screen.getByPlaceholderText(
      "Digite o valor da empresa"
    ) as HTMLInputElement;

    // Os campos de moeda são formatados, então verificamos se contêm valores
    expect(salaryInput.value).toBeTruthy();
    expect(companyInput.value).toBeTruthy();
  });
});
