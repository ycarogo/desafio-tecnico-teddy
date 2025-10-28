import PageContainer from "@/components/layout/page-container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Login() {
  return (
    <PageContainer>
      <div className="flex flex-col my-auto mx-auto max-w-[512px] w-full gap-4">
        <div className="text-2xl text-center">Olá, seja bem-vindo(a)!</div>
        <div className="flex flex-col gap-3 w-full">
          <Input type="text" placeholder="Digite seu nome" />
          <Button className="w-full text-lg">Entrar</Button>
        </div>
      </div>
    </PageContainer>
  );
}
