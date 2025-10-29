import type { User } from "@/types/users";
import { Button } from "./ui/button";

type ConfirmToDeleteClientProps = {
  onConfirm: () => void;
  user: User | null;
};
export default function ConfirmToDeleteClient({
  onConfirm,
  user = null,
}: ConfirmToDeleteClientProps) {
  return (
    <div>
      <h2 className="text-lg mb-4">
        Você está prestes a excluir o cliente: <b>{user?.name}</b>
      </h2>
      <Button type="button" size="submit-form" onClick={onConfirm}>
        Excluir cliente
      </Button>
    </div>
  );
}
