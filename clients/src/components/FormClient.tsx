import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import type { InputUser } from "@/types/inputUser";
import type { User } from "@/types/users";

// Schema de validação com Zod
const userSchema = z.object({
  name: z
    .string()
    .min(1, "Nome é obrigatório")
    .min(2, "Nome deve ter pelo menos 2 caracteres")
    .max(100, "Nome deve ter no máximo 100 caracteres"),
  salary: z
    .number()
    .min(0, "Salário deve ser maior ou igual a 0")
    .max(999999999, "Salário deve ser menor que 1 bilhão"),
  companyValuation: z
    .number()
    .min(0, "Valor da empresa deve ser maior ou igual a 0")
    .max(999999999999, "Valor da empresa deve ser menor que 1 trilhão"),
});

type UserFormData = z.infer<typeof userSchema>;

interface FormClientProps {
  onSubmit: (user: InputUser) => void;
  user?: User;
  submitButtonText?: string;
  onCancel?: () => void;
}

export default function FormClient({
  onSubmit,
  user,
  submitButtonText = "Salvar",
  onCancel,
}: FormClientProps) {
  const isEditMode = !!user;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: user?.name || "",
      salary: user?.salary || 0,
      companyValuation: user?.companyValuation || 0,
    },
  });

  const handleFormSubmit = (data: UserFormData) => {
    onSubmit(data);
    if (!isEditMode) {
      reset();
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      reset();
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-1">
      {/* Campo Nome */}
      <Input
        {...register("name")}
        label="Nome"
        placeholder="Digite o nome do cliente"
        error={errors.name?.message}
      />

      {/* Campo Salário */}
      <Input
        {...register("salary", { valueAsNumber: true })}
        type="number"
        label="Salário"
        placeholder="Digite o salário"
        error={errors.salary?.message}
        step="0.01"
        min="0"
      />

      {/* Campo Valor da Empresa */}
      <Input
        {...register("companyValuation", { valueAsNumber: true })}
        type="number"
        label="Valor da Empresa"
        placeholder="Digite o valor da empresa"
        error={errors.companyValuation?.message}
        step="0.01"
        min="0"
      />

      {/* Botões */}
      <div className="flex gap-3 pt-4">
        <Button
          type="submit"
          variant="submit-form"
          size="submit-form"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Salvando..." : submitButtonText}
        </Button>

        {onCancel && (
          <Button
            type="button"
            variant="outline"
            size="submit-form"
            onClick={handleCancel}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
        )}
      </div>
    </form>
  );
}
