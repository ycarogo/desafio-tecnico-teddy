import { createContext } from "react";
import type { IContext } from "./types";

export const AuthContext = createContext<IContext | undefined>(undefined);
