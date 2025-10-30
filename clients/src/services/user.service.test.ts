import { describe, test, expect, vi, beforeEach } from "vitest";
import {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
} from "./user.service";
import type { OutputUsers } from "@/types/outputUsers";
import type { User } from "@/types/users";
import type { InputUser } from "@/types/inputUser";

vi.mock("./api", () => {
  return {
    Api: {
      get: vi.fn(),
      post: vi.fn(),
      patch: vi.fn(),
      delete: vi.fn(),
    },
  };
});

// Importa após o mock para receber a instância mockada
import { Api } from "./api";

describe("user.service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("getUsers deve chamar Api.get com query de paginação e retornar dados", async () => {
    const mockData: OutputUsers = {
      data: [
        { id: 1, name: "Ana", salary: 1000, companyValuation: 10000 } as User,
        { id: 2, name: "Bruno", salary: 2000, companyValuation: 20000 } as User,
      ],
      page: 1,
      limit: 10,
      total: 2,
    };

    (Api.get as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      data: mockData,
    });

    const result = await getUsers(1, 10);

    expect(Api.get).toHaveBeenCalledWith("/users?page=1&limit=10");
    expect(result).toEqual(mockData);
  });

  test("getUser deve buscar usuário por id e retornar dados", async () => {
    const mockUser = {
      id: 5,
      name: "Carla",
      salary: 3000,
      companyValuation: 30000,
    } as User;
    (Api.get as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      data: mockUser,
    });

    const result = await getUser(5);

    expect(Api.get).toHaveBeenCalledWith("/users/5");
    expect(result).toEqual(mockUser);
  });

  test("createUser deve enviar POST e retornar usuário criado", async () => {
    const payload = {
      name: "Diego",
      salary: 1500,
      companyValuation: 12000,
    } as InputUser;
    const created = { id: 10, ...payload } as User;
    (Api.post as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      data: created,
    });

    const result = await createUser(payload);

    expect(Api.post).toHaveBeenCalledWith("/users", payload);
    expect(result).toEqual(created);
  });

  test("updateUser deve enviar PATCH e retornar usuário atualizado", async () => {
    const updated = {
      id: 7,
      name: "Eva",
      salary: 2200,
      companyValuation: 18000,
    } as User;
    (Api.patch as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      data: updated,
    });

    const result = await updateUser(7, updated);

    expect(Api.patch).toHaveBeenCalledWith("/users/7", updated);
    expect(result).toEqual(updated);
  });

  test("deleteUser deve chamar DELETE com o id correto", async () => {
    (Api.delete as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce(
      {}
    );

    await expect(deleteUser(3)).resolves.toBeUndefined();

    expect(Api.delete).toHaveBeenCalledWith("/users/3");
  });
});
