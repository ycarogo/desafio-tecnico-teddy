import type { User } from "./users";

export type OutputUsers = {
  clients: User[];
  currentPage: number;
  totalPages: number;
};
