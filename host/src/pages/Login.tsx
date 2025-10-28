import PageContainer from "@/components/layout/page-container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { isLogged, login } from "@/service/login.service";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Login() {
  useEffect(() => {
    const checkLogged = async () => {
      const logged = await isLogged();
      if (logged) {
        navigate("/dashboard");
      }
    };
    checkLogged();
  }, []);

  const [name, setName] = useState("");
  const navigate = useNavigate();
  const clickLogin = () => {
    login(name).then(() => {
      navigate("/dashboard");
    });
  };

  return (
    <PageContainer>
      <div className="flex flex-col my-auto mx-auto max-w-[512px] w-full gap-4">
        <div className="text-2xl text-center">Olá, seja bem-vindo(a)!</div>
        <div className="flex flex-col gap-3 w-full">
          <Input
            type="text"
            placeholder="Digite seu nome"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Button className="w-full text-lg" onClick={clickLogin}>
            Entrar
          </Button>
        </div>
      </div>
    </PageContainer>
  );
}
