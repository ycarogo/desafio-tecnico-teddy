import type { User } from "@/types/users";
import { PencilIcon, PlusIcon, Trash2Icon } from "lucide-react";

type CardClientProps = {
  user: User;
  onAdd?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
};

export default function CardClient({
  user,
  onAdd,
  onEdit,
  onDelete,
}: CardClientProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  return (
    <div className="bg-white rounded-sm p-4 shadow-sm border border-gray-200 text-center">
      {/* Nome do usuário */}
      <h3 className="font-bold text-black text-lg mb-2">{user.name}</h3>

      {/* Salário */}
      <p className="text-black mb-1">Salário: {formatCurrency(user.salary)}</p>

      {/* Valor da empresa */}
      <p className="text-black mb-4">
        Empresa: {formatCurrency(user.companyValuation)}
      </p>

      {/* Ícones de ação */}
      <div className="flex justify-between items-center">
        <button
          onClick={onAdd}
          className="text-black hover:text-gray-600 transition-colors cursor-pointer"
          aria-label="Adicionar"
        >
          <PlusIcon className="size-4" />
        </button>

        <button
          onClick={onEdit}
          className="text-black hover:text-gray-600 transition-colors cursor-pointer"
          aria-label="Editar"
        >
          <PencilIcon className="size-4" />
        </button>

        <button
          onClick={onDelete}
          className="text-red-500 hover:text-red-700 transition-colors cursor-pointer"
          aria-label="Excluir"
        >
          <Trash2Icon className="size-4" />
        </button>
      </div>
    </div>
  );
}
