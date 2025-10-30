import { useEffect, useState } from "react";
import type { IAuthProvider, IUser } from "./types";
import { setLogoutFunction } from "./types";
import { getNameUser, login, logoutService } from "@/service/login.service";
import { AuthContext } from "./AuthContext";

export const AuthProvider = ({ children }: IAuthProvider) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const logout = () => {
    setUser(null);
    logoutService();
  };

  useEffect(() => {
    const initializeAuth = () => {
      const storedUser = getNameUser();
      if (storedUser) {
        setUser({ name: storedUser });
      } else {
        setUser(null);
      }
      setIsLoading(false);
    };

    initializeAuth();
    setLogoutFunction(logout);
  }, []);

  const authenticate = (dataUser: IUser) => {
    setUser(dataUser);
    login(dataUser.name ?? "");
  };

  if (isLoading) {
    return null;
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, authenticate, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
