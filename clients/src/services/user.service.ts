import type { OutputUsers } from "@/types/outputUsers";
import { Api } from "./api";
import type { User } from "@/types/users";
import type { InputUser } from "@/types/inputUser";

export const getUsers = async (
  page: number,
  limit: number
): Promise<OutputUsers> => {
  const response = await Api.get<OutputUsers>(
    `/users?page=${page}&limit=${limit}`
  );
  return response.data;
};

export const getUser = async (id: number): Promise<User> => {
  const response = await Api.get<User>(`/users/${id}`);
  return response.data;
};

export const createUser = async (user: InputUser): Promise<User> => {
  const response = await Api.post<User>("/users", user);
  return response.data;
};

export const updateUser = async (id: number, user: User): Promise<User> => {
  const response = await Api.patch<User>(`/users/${id}`, user);
  return response.data;
};

export const deleteUser = async (id: number): Promise<void> => {
  await Api.delete(`/users/${id}`);
};
