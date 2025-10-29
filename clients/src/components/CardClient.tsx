import { cn } from "@/lib/utils";
import type { User } from "@/types/users";
import { PencilIcon, PlusIcon, Trash2Icon, X } from "lucide-react";

type CardClientProps = {
  user: User;
  onAdd?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onRemove?: () => void;
  isSelected?: boolean;
  isListClients?: boolean;
};

export default function CardClient({
  user,
  onAdd,
  onEdit,
  onDelete,
  onRemove,
  isSelected,
  isListClients,
}: CardClientProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  return (
    <div
      className={cn(
        "bg-white rounded-sm p-4 shadow-sm border border-gray-200 text-center",
        isSelected && !isListClients ? "border-orange-500 bg-orange-50" : ""
      )}
    >
      <h3 className="font-bold text-black text-lg mb-2">{user.name}</h3>
      <p className="text-black mb-1">Salário: {formatCurrency(user.salary)}</p>
      <p className="text-black mb-4">
        Empresa: {formatCurrency(user.companyValuation)}
      </p>
      <div className="flex justify-between items-center">
        {!isSelected ? (
          <button
            onClick={onAdd}
            className="text-black hover:text-gray-600 transition-colors cursor-pointer"
            aria-label="Adicionar"
          >
            <PlusIcon className="size-4" />
          </button>
        ) : (
          <button
            onClick={onRemove}
            className="text-red-500 hover:text-red-700 transition-colors cursor-pointer"
            aria-label="Remover"
          >
            <X className="size-4 text-red-500" />
          </button>
        )}

        {!isListClients ? (
          <>
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
          </>
        ) : null}
      </div>
    </div>
  );
}
