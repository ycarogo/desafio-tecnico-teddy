import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./global.css";
import Login from "./pages/Login";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import SelectedList from "./pages/SelectedList";
import { ProtectedLayout } from "./components/layout/protected-layout";
import { AuthProvider } from "./context/AuthProvider";

const router = createBrowserRouter([
  {
    path: "/",
    Component: Login,
  },
  {
    path: "/",
    Component: ProtectedLayout,
    children: [
      {
        path: "/dashboard",
        Component: Dashboard,
      },
      {
        path: "/clientes-selecionados",
        Component: SelectedList,
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>
);
