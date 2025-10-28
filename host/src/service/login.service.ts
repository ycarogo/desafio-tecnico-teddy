export const login = async (name: string) => {
  localStorage.setItem("name", name);
  return true;
};

export const getNameUser = (): string | null => {
  return localStorage.getItem("name") ?? null;
};

export const logoutService = async () => {
  localStorage.clear();
  return true;
};

export const isLogged = async () => {
  return (
    localStorage.getItem("name") !== null &&
    localStorage.getItem("name") !== undefined
  );
};
