import { Controller, useForm } from "react-hook-form";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import type { InputUser } from "@/types/inputUser";
import type { User } from "@/types/users";
import { useCurrencyMask } from "@/hooks/useCurrencyMask";
import { removeFormatCurrency } from "@/lib/removeFormatCurrency";

interface FormClientProps {
  onSubmit: (user: InputUser) => void;
  user?: User | null;
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
    displayValue: salary,
    handleChange: handleChangeSalary,
    setValue: setSalary,
  } = useCurrencyMask(0, "R$", "", false);
  const {
    displayValue: companyValuation,
    handleChange: handleChangeCompanyValuation,
    setValue: setCompanyValuation,
  } = useCurrencyMask(0, "R$", "", false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    control,
  } = useForm<InputUser>({
    defaultValues: async () => {
      setSalary(user?.salary || 0);
      setCompanyValuation(user?.companyValuation || 0);
      return {
        name: user?.name || "",
        salary: user?.salary || 0,
        companyValuation: user?.companyValuation || 0,
      };
    },
  });

  const handleFormSubmit = (data: InputUser) => {
    data.salary = removeFormatCurrency(data.salary.toString());
    data.companyValuation = removeFormatCurrency(
      data.companyValuation.toString()
    );
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
        {...register("name", { required: true })}
        label="Nome"
        placeholder="Digite o nome do cliente"
        error={errors.name?.message}
      />

      <Controller
        name="salary"
        control={control}
        rules={{ required: true }}
        render={({ field }) => (
          <Input
            label="Salário"
            type="text"
            value={salary}
            onChange={(e) => {
              handleChangeSalary(e);
              field.onChange(e.target.value);
            }}
            error={errors.salary?.message}
            placeholder="Digite o salário"
          />
        )}
      />

      <Controller
        name="companyValuation"
        control={control}
        rules={{ required: true }}
        render={({ field }) => (
          <Input
            label="Salário"
            type="text"
            value={companyValuation}
            onChange={(e) => {
              handleChangeCompanyValuation(e);
              field.onChange(e.target.value);
            }}
            error={errors.companyValuation?.message}
            placeholder="Digite o valor da empresa"
          />
        )}
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
