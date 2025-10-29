import type { User } from "../types/users";

const STORAGE_KEY = "teddy_users_list";

function safeParse(json: string | null): User[] {
  if (!json) return [];
  try {
    const parsed = JSON.parse(json);
    if (Array.isArray(parsed)) {
      return parsed as User[];
    }
    return [];
  } catch {
    return [];
  }
}

function readAll(): User[] {
  if (typeof window === "undefined") return [];
  return safeParse(window.localStorage.getItem(STORAGE_KEY));
}

function writeAll(users: User[]): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
}

export function listUsers(): User[] {
  return readAll();
}

export function addUser(user: User): void {
  const users = readAll();
  const exists = users.some((u) => u.id === user.id);
  const next = exists
    ? users.map((u) => (u.id === user.id ? user : u))
    : [...users, user];
  writeAll(next);
}

export function removeUserById(userId: number): void {
  const users = readAll();
  const next = users.filter((u) => u.id !== userId);
  writeAll(next);
}

export function clearUsers(): void {
  writeAll([]);
}

export function hasUser(userId: number): boolean {
  const users = readAll();
  return users.some((u) => u.id === userId);
}

export const usersStorageService = {
  list: listUsers,
  add: addUser,
  removeById: removeUserById,
  clear: clearUsers,
  has: hasUser,
};
