import { describe, it, expect, beforeEach, vi } from "vitest";
import { login, logoutService, isLogged } from "./login.service";

// Mock do localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  clear: vi.fn(),
};

// Substitui o localStorage global pelo mock
Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});

describe("Login Service", () => {
  beforeEach(() => {
    // Limpa todos os mocks antes de cada teste
    vi.clearAllMocks();
  });

  describe("login", () => {
    it("deve salvar o nome no localStorage e retornar true", async () => {
      const name = "João Silva";

      const result = await login(name);

      expect(localStorageMock.setItem).toHaveBeenCalledWith("name", name);
      expect(result).toBe(true);
    });

    it("deve funcionar com nome vazio", async () => {
      const name = "";

      const result = await login(name);

      expect(localStorageMock.setItem).toHaveBeenCalledWith("name", name);
      expect(result).toBe(true);
    });

    it("deve funcionar com nome contendo espaços", async () => {
      const name = "  João Silva  ";

      const result = await login(name);

      expect(localStorageMock.setItem).toHaveBeenCalledWith("name", name);
      expect(result).toBe(true);
    });
  });

  describe("logoutService", () => {
    it("deve limpar o localStorage e retornar true", async () => {
      const result = await logoutService();

      expect(localStorageMock.clear).toHaveBeenCalled();
      expect(result).toBe(true);
    });

    it("deve funcionar mesmo quando localStorage está vazio", async () => {
      localStorageMock.clear.mockClear();

      const result = await logoutService();

      expect(localStorageMock.clear).toHaveBeenCalled();
      expect(result).toBe(true);
    });
  });

  describe("isLogged", () => {
    it("deve retornar true quando há um nome salvo no localStorage", async () => {
      localStorageMock.getItem.mockReturnValue("João Silva");

      const result = await isLogged();

      expect(localStorageMock.getItem).toHaveBeenCalledWith("name");
      expect(result).toBe(true);
    });

    it("deve retornar false quando localStorage.getItem retorna null", async () => {
      localStorageMock.getItem.mockReturnValue(null);

      const result = await isLogged();

      expect(localStorageMock.getItem).toHaveBeenCalledWith("name");
      expect(result).toBe(false);
    });

    it("deve retornar false quando localStorage.getItem retorna undefined", async () => {
      localStorageMock.getItem.mockReturnValue(undefined);

      const result = await isLogged();

      expect(localStorageMock.getItem).toHaveBeenCalledWith("name");
      expect(result).toBe(false);
    });

    it("deve retornar true mesmo com nome vazio", async () => {
      localStorageMock.getItem.mockReturnValue("");

      const result = await isLogged();

      expect(localStorageMock.getItem).toHaveBeenCalledWith("name");
      expect(result).toBe(true);
    });

    it("deve retornar true com nome contendo apenas espaços", async () => {
      localStorageMock.getItem.mockReturnValue("   ");

      const result = await isLogged();

      expect(localStorageMock.getItem).toHaveBeenCalledWith("name");
      expect(result).toBe(true);
    });
  });

  describe("Integração entre funções", () => {
    it("deve permitir login, verificar se está logado e fazer logout", async () => {
      const name = "Maria Santos";

      // Login
      const loginResult = await login(name);
      expect(loginResult).toBe(true);
      expect(localStorageMock.setItem).toHaveBeenCalledWith("name", name);

      // Simula que o nome foi salvo
      localStorageMock.getItem.mockReturnValue(name);

      // Verifica se está logado
      const isLoggedResult = await isLogged();
      expect(isLoggedResult).toBe(true);

      // Logout
      const logoutResult = await logoutService();
      expect(logoutResult).toBe(true);
      expect(localStorageMock.clear).toHaveBeenCalled();

      // Simula que o localStorage foi limpo
      localStorageMock.getItem.mockReturnValue(null);

      // Verifica se não está mais logado
      const isLoggedAfterLogout = await isLogged();
      expect(isLoggedAfterLogout).toBe(false);
    });
  });
});
