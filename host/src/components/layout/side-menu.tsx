import React from "react";
import { cn } from "@/lib/utils";
import { ArrowLeftIcon, Home, LogOut, User, UserCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { logoutService } from "@/service/login.service";

interface SideMenuProps {
  className?: string;
  onClose?: () => void;
  currentPath?: string;
}

export const SideMenu: React.FC<SideMenuProps> = ({
  className,
  onClose,
  currentPath = "/",
}) => {
  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    navigate(path);
    if (onClose) onClose();
  };

  const clickLogout = () => {
    logoutService();
    navigate("/");
  };

  const isActive = (path: string) => currentPath === path;
  return (
    <div className={cn("flex flex-col h-full bg-white", className)}>
      {/* Header Section */}
      <div className="bg-black/80 px-6 py-8 relative">
        {/* Logo */}
        <div className="text-center">
          <div className="flex items-center justify-center mb-2">
            <img
              src={import.meta.env.VITE_LOGO_BLACK}
              alt="Logo Teddy"
              className="h-12 w-auto"
            />
          </div>
        </div>

        {/* Close Button */}
        {onClose && (
          <button
            onClick={onClose}
            className="absolute -bottom-4 right-[-14px] w-12 h-12 bg-gray-900 rounded-full flex items-center justify-center hover:bg-gray-600 cursor-pointer transition-colors z-10"
          >
            <span className="bg-white rounded-full p-1">
              <ArrowLeftIcon className="w-3 h-3 text-black" />
            </span>
          </button>
        )}
      </div>
      <div className="flex-1 bg-white pl-6 py-6">
        <nav className="space-y-4">
          <div className="flex items-center space-x-4 py-3 cursor-pointer px-3 transition-colors">
            <Home className="w-6 h-6" />
            <span className="font-medium">Home</span>
          </div>
          <div
            onClick={() => handleNavigation("/dashboard")}
            className={cn(
              "flex items-center space-x-4 py-3 cursor-pointer px-3 transition-colors",
              isActive("/dashboard")
                ? "border-r-4 border-orange-400"
                : "hover:bg-gray-50 rounded-lg"
            )}
          >
            <User
              className={cn(
                "w-6 h-6",
                isActive("/dashboard") ? "text-orange-400" : "text-black"
              )}
            />
            <span
              className={cn(
                "font-medium",
                isActive("/dashboard") ? "text-orange-500" : "text-black"
              )}
            >
              Clientes
            </span>
          </div>

          <div
            onClick={() => handleNavigation("/clientes-selecionados")}
            className={cn(
              "flex items-center space-x-4 py-3 cursor-pointer px-3 transition-colors",
              isActive("/clientes-selecionados")
                ? "border-r-4 border-orange-400"
                : "hover:bg-gray-50 rounded-lg"
            )}
          >
            <UserCheck
              className={cn(
                "w-6 h-6",
                isActive("/clientes-selecionados")
                  ? "text-orange-400"
                  : "text-black"
              )}
            />
            <span
              className={cn(
                "font-medium",
                isActive("/clientes-selecionados")
                  ? "text-orange-500"
                  : "text-black"
              )}
            >
              Clientes selecionados
            </span>
          </div>
          <div
            onClick={clickLogout}
            className="flex items-center space-x-4 py-3 cursor-pointer px-3 transition-colors"
          >
            <LogOut className="w-6 h-6" />
            <span className="font-medium">Sair</span>
          </div>
        </nav>
      </div>
      <div className="h-2 bg-linear-to-t from-gray-100 to-transparent"></div>
    </div>
  );
};
