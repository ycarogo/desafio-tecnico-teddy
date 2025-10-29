import { useState } from "react";
import FormClient from "./FormClient";
import type { InputUser, User } from "@/types/inputUser";
import type { User as UserType } from "@/types/users";

// Exemplo de uso do FormClient
export default function FormClientExample() {
  const [users, setUsers] = useState<UserType[]>([]);
  const [editingUser, setEditingUser] = useState<UserType | null>(null);
  const [showForm, setShowForm] = useState(false);

  // Função para criar um novo usuário
  const handleCreateUser = (userData: InputUser) => {
    const newUser: UserType = {
      ...userData,
      id: Date.now(), // ID temporário para exemplo
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    setUsers(prev => [...prev, newUser]);
    setShowForm(false);
    console.log("Novo usuário criado:", newUser);
  };

  // Função para editar um usuário existente
  const handleEditUser = (userData: InputUser) => {
    if (!editingUser) return;

    const updatedUser: UserType = {
      ...editingUser,
      ...userData,
      updatedAt: new Date().toISOString(),
    };

    setUsers(prev => 
      prev.map(user => 
        user.id === editingUser.id ? updatedUser : user
      )
    );
    
    setEditingUser(null);
    setShowForm(false);
    console.log("Usuário editado:", updatedUser);
  };

  // Função para iniciar edição
  const startEdit = (user: UserType) => {
    setEditingUser(user);
    setShowForm(true);
  };

  // Função para cancelar
  const handleCancel = () => {
    setEditingUser(null);
    setShowForm(false);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Exemplo de Uso do FormClient</h1>
      
      {/* Botão para criar novo usuário */}
      <div className="mb-6">
        <button
          onClick={() => {
            setEditingUser(null);
            setShowForm(true);
          }}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Criar Novo Usuário
        </button>
      </div>

      {/* Formulário */}
      {showForm && (
        <div className="mb-8">
          <FormClient
            onSubmit={editingUser ? handleEditUser : handleCreateUser}
            user={editingUser || undefined}
            title={editingUser ? "Editar Cliente" : "Novo Cliente"}
            submitButtonText={editingUser ? "Atualizar" : "Criar"}
            onCancel={handleCancel}
          />
        </div>
      )}

      {/* Lista de usuários */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Usuários Cadastrados:</h2>
        {users.length === 0 ? (
          <p className="text-gray-500">Nenhum usuário cadastrado ainda.</p>
        ) : (
          users.map(user => (
            <div key={user.id} className="border p-4 rounded-lg bg-gray-50">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">{user.name}</h3>
                  <p className="text-sm text-gray-600">
                    Salário: R$ {user.salary.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                  <p className="text-sm text-gray-600">
                    Valor da Empresa: R$ {user.companyValuation.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                  <p className="text-xs text-gray-500">
                    Criado em: {new Date(user.createdAt).toLocaleString('pt-BR')}
                  </p>
                </div>
                <button
                  onClick={() => startEdit(user)}
                  className="bg-orange-500 text-white px-3 py-1 rounded text-sm hover:bg-orange-600"
                >
                  Editar
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
