import LayoutPage from "@/components/LayoutPage";
import CardClient from "@/components/CardClient";
import { toastSuccess } from "@/components/ui/Toastify";
import type { User } from "@/types/users";
import {
  clearUsers,
  listUsers,
  removeUserById,
} from "@/services/listUsers.service";
import { useEffect, useState } from "react";

export default function ListClients() {
  const [users, setUsers] = useState<User[]>(() => listUsers());

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === "teddy_users_list") {
        setUsers(listUsers());
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const handleRemove = (user: User) => {
    removeUserById(user.id);
    setUsers(listUsers());
    toastSuccess("Cliente removido da lista com sucesso");
  };

  const handleClear = () => {
    clearUsers();
    setUsers([]);
    toastSuccess("Clientes selecionados limpos com sucesso");
  };

  return (
    <LayoutPage>
      <div className="min-h-screen bg-gray-100 p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Clientes selecionados
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
          {users.map((user) => (
            <CardClient
              key={user.id}
              user={user}
              onRemove={() => handleRemove(user)}
              isSelected
              isListClients={true}
            />
          ))}
        </div>

        <button
          onClick={handleClear}
          disabled={users.length === 0}
          className="w-full bg-gray-100 border-2 border-orange-500 text-black py-2 px-6 rounded-sm font-medium cursor-pointer hover:bg-orange-50 transition-colors disabled:opacity-50"
        >
          Limpar clientes selecionados
        </button>
      </div>
    </LayoutPage>
  );
}
