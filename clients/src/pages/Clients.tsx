import {
  createUser,
  deleteUser,
  getUsers,
  updateUser,
} from "@/services/user.service";
import type { OutputUsers } from "@/types/outputUsers";
import type { InputUser } from "@/types/inputUser";
import { useEffect, useState, useCallback } from "react";
import CardClient from "../components/CardClient";
import Modal from "@/components/ui/modal";
import FormClient from "@/components/FormClient";
import type { User } from "@/types/users";
import ConfirmToDeleteClient from "@/components/ConfirmToDeleteClient";
import { toastError, toastSuccess } from "@/components/ui/Toastify";
import Pagination from "@/components/ui/pagination";
import {
  addUser,
  listUsers,
  removeUserById,
} from "@/services/listUsers.service";
import LayoutPage from "@/components/LayoutPage";
import LoadingPage from "@/components/ui/loading-page";

export default function Clients() {
  const [outputUsers, setOutputUsers] = useState<OutputUsers>({
    clients: [],
    currentPage: 1,
    totalPages: 0,
  });
  const [clientsPerPage, setClientsPerPage] = useState(16);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState<User | null>(null);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [isModalDeleteOpen, setIsModalDeleteOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(
    () => new Set(listUsers().map((u: User) => u.id))
  );
  const [isLoading, setIsLoading] = useState(false);
  const fetchUsers = useCallback(async () => {
    const response = await getUsers(currentPage, clientsPerPage);
    setOutputUsers(response);
    setIsLoading(false);
  }, [currentPage, clientsPerPage]);

  useEffect(() => {
    setIsLoading(true);
    fetchUsers();
  }, [fetchUsers]);

  // Sincroniza seleções entre abas e ao alterar localStorage
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === "teddy_users_list") {
        setSelectedIds(new Set(listUsers().map((u: User) => u.id)));
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchUsers();
  };

  const handleClientsPerPageChange = (value: number) => {
    setClientsPerPage(value);
    setCurrentPage(1);
    fetchUsers();
  };

  const handleCreateClient = () => {
    setUserToEdit(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleCloseModalDeleteOpen = () => {
    setIsModalDeleteOpen(false);
  };

  const handleSubmitClient = async (userData: InputUser) => {
    if (userToEdit) {
      await updateUser(userToEdit.id, userData as User)
        .then(() => {
          toastSuccess("Cliente atualizado com sucesso");
          handleCloseModal();
          fetchUsers();
        })
        .catch(() => {
          toastError("Erro ao atualizar cliente");
        });
    } else {
      const inputUser: InputUser = {
        name: userData.name,
        salary: userData.salary,
        companyValuation: userData.companyValuation,
      };
      await createUser(inputUser)
        .then(() => {
          handleCloseModal();
          fetchUsers();
          toastSuccess("Cliente criado com sucesso");
        })
        .catch(() => {
          toastError("Erro ao criar cliente");
        });
    }
  };

  const handleRemoveClient = (user: User) => {
    removeUserById(user.id);
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.delete(user.id);
      return next;
    });
    toastSuccess("Cliente removido da lista com sucesso");
  };
  const handleAddClient = (user: User) => {
    addUser(user);
    setSelectedIds((prev) => new Set(prev).add(user.id));
    toastSuccess("Cliente selecionado com sucesso");
  };

  const handleEditClient = (user: User) => {
    setIsModalOpen(true);
    setUserToEdit(user);
  };

  const handleDeleteClient = (user: User) => {
    setUserToDelete(user);
    setIsModalDeleteOpen(true);
  };

  const confirmDeleteClient = async () => {
    if (userToDelete) {
      await deleteUser(userToDelete.id)
        .then(() => {
          toastSuccess("Cliente excluído com sucesso");
        })
        .catch(() => {
          toastError("Erro ao excluir cliente");
        });
      handleCloseModalDeleteOpen();
      fetchUsers();
    }
  };
  return isLoading ? (
    <LoadingPage message="Carregando clientes..." />
  ) : (
    <LayoutPage>
      <div className="min-h-screen bg-gray-100 p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-semibold text-gray-800">Clientes</h1>
          <div className="flex items-center gap-2">
            <span className="text-gray-700">Clientes por página:</span>
            <select
              value={clientsPerPage}
              onChange={(e) =>
                handleClientsPerPageChange(Number(e.target.value))
              }
              className="border border-gray-300 rounded px-3 py-1 bg-white"
            >
              <option value={8}>8</option>
              <option value={12}>12</option>
              <option value={16}>16</option>
              <option value={20}>20</option>
            </select>
          </div>
        </div>

        {/* Grid de Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
          {outputUsers.clients.map((user) => (
            <CardClient
              key={user.id}
              user={user}
              onAdd={() => handleAddClient(user)}
              onEdit={() => handleEditClient(user)}
              onDelete={() => handleDeleteClient(user)}
              onRemove={() => handleRemoveClient(user)}
              isSelected={selectedIds.has(user.id)}
            />
          ))}
        </div>

        {/* Botão Criar Cliente */}
        <div className="mb-6">
          <button
            onClick={handleCreateClient}
            className="w-full bg-gray-100 border-2 border-orange-500 text-black py-2 px-6 rounded-sm font-medium cursor-pointer hover:bg-orange-50 transition-colors"
          >
            Criar cliente
          </button>
        </div>

        {/* Paginação */}
        <div className="flex justify-center">
          <div className="flex items-center gap-2">
            <Pagination
              currentPage={outputUsers.currentPage}
              totalPages={outputUsers.totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </div>

        {/* Modal */}
        <Modal
          title={userToEdit ? "Editar cliente" : "Criar cliente"}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          children={
            <FormClient
              onSubmit={handleSubmitClient}
              user={userToEdit}
              submitButtonText={userToEdit ? "Editar cliente" : "Criar cliente"}
              onCancel={undefined}
            />
          }
        />
        <Modal
          title="Excluir cliente"
          isOpen={isModalDeleteOpen}
          onClose={handleCloseModalDeleteOpen}
          children={
            <ConfirmToDeleteClient
              onConfirm={confirmDeleteClient}
              user={userToDelete}
            />
          }
        />
      </div>
    </LayoutPage>
  );
}
