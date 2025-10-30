import { describe, test, expect, beforeEach, vi } from "vitest";
import {
  listUsers,
  addUser,
  removeUserById,
  clearUsers,
  hasUser,
} from "./listUsers.service";
import type { User } from "@/types/users";

const STORAGE_KEY = "teddy_users_list";

function getStoredJson() {
  return window.localStorage.getItem(STORAGE_KEY);
}

function setStoredJson(value: unknown) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
}

describe("listUsers.service", () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.restoreAllMocks();
  });

  test("listUsers deve retornar lista vazia quando não houver dados no storage", () => {
    expect(listUsers()).toEqual([]);
  });

  test("addUser deve adicionar um novo usuário quando id não existir", () => {
    const user = { id: 1, name: "Ana", salary: 1000, companyValuation: 10000 };
    addUser(user as User);

    const stored = JSON.parse(getStoredJson() || "[]");
    expect(stored).toHaveLength(1);
    expect(stored[0]).toMatchObject(user);
    expect(listUsers()).toHaveLength(1);
  });

  test("addUser deve atualizar usuário existente quando id já existir", () => {
    const user = {
      id: 1,
      name: "Ana",
      salary: 1000,
      companyValuation: 10000,
    } as User;
    const updated = {
      id: 1,
      name: "Ana Maria",
      salary: 1200,
      companyValuation: 11000,
    } as User;

    addUser(user);
    addUser(updated);

    const stored = JSON.parse(getStoredJson() || "[]");
    expect(stored).toHaveLength(1);
    expect(stored[0]).toMatchObject(updated);
  });

  test("removeUserById deve remover o usuário correto e manter os demais", () => {
    setStoredJson([
      { id: 1, name: "Ana", salary: 1000, companyValuation: 10000 },
      { id: 2, name: "Bruno", salary: 2000, companyValuation: 20000 },
    ]);

    removeUserById(1);

    const stored = JSON.parse(getStoredJson() || "[]");
    expect(stored).toHaveLength(1);
    expect(stored[0].id).toBe(2);
  });

  test("hasUser deve refletir corretamente a presença do usuário", () => {
    setStoredJson([
      { id: 1, name: "Ana", salary: 1000, companyValuation: 10000 },
    ]);

    expect(hasUser(1)).toBe(true);
    expect(hasUser(2)).toBe(false);

    clearUsers();
    expect(hasUser(1)).toBe(false);
  });
});
