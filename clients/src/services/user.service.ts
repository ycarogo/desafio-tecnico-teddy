import type { OutputUsers } from "@/types/outputUsers";
import { Api } from "./api";
import type { User } from "@/types/users";

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
