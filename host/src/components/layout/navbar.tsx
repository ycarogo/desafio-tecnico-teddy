import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { SideMenu } from "./side-menu";
import { cn } from "@/lib/utils";
import { getNameUser, logoutService } from "@/service/login.service";

export default function Navbar() {
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
  const location = useLocation();
  const currentPath = location.pathname;
  const [nameUser, setNameUser] = useState<string | null>("");
  const navigate = useNavigate();

  const toggleSideMenu = () => {
    setIsSideMenuOpen(!isSideMenuOpen);
  };

  const closeSideMenu = () => {
    setIsSideMenuOpen(false);
  };

  const clickLogout = () => {
    logoutService();
    navigate("/");
  };
  useEffect(() => {
    const nameUser = getNameUser();
    if (nameUser) {
      setNameUser(nameUser);
    }
  }, []);
  return (
    <>
      <div className="w-full">
        <nav className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
            <div className="flex justify-between items-center h-25">
              {/* Lado esquerdo - Menu hamburger e Logo */}
              <div className="flex items-center space-x-4">
                {/* Menu hamburger */}
                <button
                  onClick={toggleSideMenu}
                  className="p-2 rounded-md text-gray-600 hover:text-gray-900 cursor-pointer hover:bg-gray-100"
                >
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                </button>
                <div className="flex items-center space-x-2">
                  <img
                    src={import.meta.env.VITE_LOGO_BLACK}
                    alt="Logo Teddy"
                    className="h-12 w-auto"
                  />
                </div>
              </div>

              {/* Centro - Links de navegação */}
              <div className="flex items-center space-x-8">
                <a
                  href="#"
                  className={cn(
                    "text-orange-500 font-medium border-b-2 border-orange-500 pb-1",
                    currentPath === "/clientes"
                      ? "text-orange-500"
                      : "text-gray-700 hover:text-gray-900"
                  )}
                >
                  Clientes
                </a>
                <a
                  href="#"
                  className={cn(
                    "text-gray-700 hover:text-gray-900 font-medium",
                    currentPath === "/clientes-selecionados"
                      ? "text-orange-500"
                      : "text-gray-700 hover:text-gray-900"
                  )}
                >
                  Clientes selecionados
                </a>
                <a
                  href="#"
                  onClick={clickLogout}
                  className="text-gray-700 hover:text-gray-900 font-medium"
                >
                  Sair
                </a>
              </div>

              {/* Lado direito - Cumprimento */}
              <div className="text-gray-700 font-medium">
                Olá, <b>{nameUser}</b>!
              </div>
            </div>
          </div>
        </nav>
      </div>

      {/* Overlay */}
      {isSideMenuOpen && (
        <div
          className="fixed inset-0 bg-gray-200/50 z-40"
          onClick={closeSideMenu}
        />
      )}

      {/* Side Menu */}
      <div
        className={`fixed top-0 left-0 h-full w-80 z-50 transform transition-transform duration-300 ease-in-out ${
          isSideMenuOpen ? "translate-x-0" : "-translate-x-full overflow-hidden"
        }`}
      >
        <SideMenu onClose={closeSideMenu} currentPath={currentPath} />
      </div>
    </>
  );
}
