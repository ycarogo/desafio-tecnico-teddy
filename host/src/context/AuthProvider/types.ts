import type { JSX } from "react";

export interface IUser {
  name?: string;
}

export interface IContext {
  user: IUser | null | undefined;
  isLoading: boolean;
  authenticate: (dataUser: IUser) => void;
  logout: () => void;
}

export interface IAuthProvider {
  children: JSX.Element;
}

let logoutFn: () => void;

export const setLogoutFunction = (fn: () => void) => {
  logoutFn = fn;
};

export const getLogoutFunction = () => logoutFn;
