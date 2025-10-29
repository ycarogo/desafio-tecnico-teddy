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

export default function Clients() {
  const [outputUsers, setOutputUsers] = useState<OutputUsers>({
    clients: [],
    currentPage: 1,
    totalPages: 0,
  });
  const [clientsPerPage, setClientsPerPage] = useState(16);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalClients, setTotalClients] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState<User | null>(null);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [isModalDeleteOpen, setIsModalDeleteOpen] = useState(false);
  const fetchUsers = useCallback(async () => {
    const response = await getUsers(currentPage, clientsPerPage);
    setOutputUsers(response);
    setTotalClients(
      response.totalPages > 1
        ? response.totalPages * clientsPerPage
        : response.clients.length
    );
  }, [currentPage, clientsPerPage]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

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
          console.log("Cliente atualizado com sucesso");
          handleCloseModal();
          fetchUsers();
        })
        .catch(() => {
          console.error("Erro ao atualizar cliente");
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
          console.log("Cliente criado com sucesso");
        })
        .catch(() => {
          console.error("Erro ao criar cliente");
        });
    }
  };

  const handleAddClient = (userId: number) => {
    // Implementar adição de cliente
    console.log("Adicionar cliente:", userId);
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
          console.log("Cliente excluído com sucesso");
        })
        .catch(() => {
          console.error("Erro ao excluir cliente");
        });
      handleCloseModalDeleteOpen();
      fetchUsers();
    }
  };

  const generatePageNumbers = () => {
    const pages = [];
    const totalPages = outputUsers.totalPages;
    const currentPage = outputUsers.currentPage;

    // Sempre mostrar primeira página
    pages.push(1);

    // Adicionar reticências se necessário
    if (currentPage > 3) {
      pages.push("...");
    }

    // Adicionar páginas ao redor da página atual
    for (
      let i = Math.max(2, currentPage - 1);
      i <= Math.min(totalPages - 1, currentPage + 1);
      i++
    ) {
      if (!pages.includes(i)) {
        pages.push(i);
      }
    }

    // Adicionar reticências se necessário
    if (currentPage < totalPages - 2) {
      pages.push("...");
    }

    // Sempre mostrar última página
    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-semibold text-gray-800">
          {totalClients} clientes encontrados:
        </h1>
        <div className="flex items-center gap-2">
          <span className="text-gray-700">Clientes por página:</span>
          <select
            value={clientsPerPage}
            onChange={(e) => handleClientsPerPageChange(Number(e.target.value))}
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
      <div className="grid grid-cols-4 gap-4 mb-6">
        {outputUsers.clients.map((user) => (
          <CardClient
            key={user.id}
            user={user}
            onAdd={() => handleAddClient(user.id)}
            onEdit={() => handleEditClient(user)}
            onDelete={() => handleDeleteClient(user)}
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
          {generatePageNumbers().map((page, index) => (
            <button
              key={index}
              onClick={() => typeof page === "number" && handlePageChange(page)}
              disabled={page === "..."}
              className={`px-3 py-2 rounded text-sm font-medium transition-colors cursor-pointer ${
                page === outputUsers.currentPage
                  ? "bg-orange-500 text-white"
                  : page === "..."
                  ? "text-gray-500 cursor-default"
                  : "text-black hover:bg-gray-200"
              }`}
            >
              {page}
            </button>
          ))}
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
  );
}
